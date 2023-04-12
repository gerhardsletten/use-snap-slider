import { useRef, useState } from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { useSnapSlider } from '../use-snap-slider'
import { mockHelper, makeArray } from '../../helpers/utils'

describe('use-snap-slider', () => {
  it('Passing count results in one render', async () => {
    const unmock = mockHelper(200, 200)
    let payload: any[] = []
    const Comp = () => {
      const ref = useRef<HTMLDivElement | null>(null)
      const { count, countDelta } = useSnapSlider(ref, 2)
      payload.push({ count, countDelta })
      return (
        <div>
          <p>view</p>
          <div ref={ref}>
            <div>1</div>
            <div>2</div>
          </div>
        </div>
      )
    }
    render(<Comp />)
    await waitFor(() => {
      expect(screen.getByText('view')).toBeInTheDocument()
    })
    expect(payload.length).toEqual(1)
    expect(payload[0].count).toEqual(2)
    unmock()
  })
  it('2 renders needed to calculate count', async () => {
    const unmock = mockHelper(200, 200)
    let payload: any[] = []
    const Comp = () => {
      const ref = useRef<HTMLDivElement | null>(null)
      const { count, countDelta } = useSnapSlider(ref)
      payload.push({ count, countDelta })
      return (
        <div>
          <p>view</p>
          <div ref={ref}>
            <div>1</div>
            <div>2</div>
          </div>
        </div>
      )
    }
    render(<Comp />)
    await waitFor(() => {
      expect(screen.getByText('view')).toBeInTheDocument()
    })
    expect(payload.length).toEqual(2)
    expect(payload[1].count).toEqual(2)
    unmock()
  })
  it('1/2 width slide items should report 1 count and 2 countDelta', async () => {
    const unmock = mockHelper(400, 200)
    let payload: any[] = []
    const Comp = () => {
      const ref = useRef<HTMLDivElement | null>(null)
      const { count, countDelta } = useSnapSlider(ref)
      payload.push({ count, countDelta })
      return (
        <div>
          <p>view</p>
          <div ref={ref}>
            <div>1</div>
            <div>2</div>
          </div>
        </div>
      )
    }
    render(<Comp />)
    await waitFor(() => {
      expect(screen.getByText('view')).toBeInTheDocument()
    })
    expect(payload.length).toEqual(2)
    expect(payload[1].count).toEqual(1)
    expect(payload[1].countDelta).toEqual(2)
    unmock()
  })
  it('Change of count sets index to 0', async () => {
    const unmock = mockHelper(200, 200)
    let payload: any[] = []
    const Comp = () => {
      const ref = useRef<HTMLDivElement | null>(null)
      const [_count, setCount] = useState(2)
      const { count, countDelta, index } = useSnapSlider(ref, _count, 1)
      payload.push({ count, countDelta, index })
      const slides = makeArray(_count)
      return (
        <div>
          <button onClick={() => setCount(3)}>update</button>
          <div ref={ref}>
            {slides.map((num) => (
              <div key={num}>{num}</div>
            ))}
          </div>
        </div>
      )
    }
    render(<Comp />)
    await waitFor(() => {
      expect(payload.length).toEqual(1)
    })
    expect(payload[0].count).toEqual(2)
    expect(payload[0].index).toEqual(1)
    fireEvent.click(screen.getByText('update'))
    await waitFor(() => {
      expect(payload.length).toEqual(3)
    })
    expect(payload[2].count).toEqual(3)
    expect(payload[2].index).toEqual(0)
    unmock()
  })
})
