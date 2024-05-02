import { screen, waitFor, fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { createSnapSlider, type TSnapSliderStateFull } from '../snap-slider'
import { makeSlides, mockHelper, resizeWindow } from '../../src/helpers/utils'

const TEST_ID = 'slider'

describe('snap-slider', () => {
  it('Get correct count and countDelta from 1/1 width slides', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200)
    const { subscribe } = createSnapSlider({
      element,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].count).toEqual(2)
    expect(states[0].countDelta).toEqual(2)
    unmock()
    unsubscribe()
  })
  it('Get correct count and countDelta from 1/2 width slides', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(400, 200)
    const { subscribe } = createSnapSlider({
      element,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].count).toEqual(1)
    expect(states[0].countDelta).toEqual(2)
    unmock()
    unsubscribe()
  })
  it('Can set inital index', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200, element)
    const { subscribe } = createSnapSlider({
      element,
      index: 1,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(1)
    unmock()
    unsubscribe()
  })
  it('Can pass element at later stage', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200)
    const { subscribe, setElement } = createSnapSlider({ element: null })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    setElement(element)
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].count).toEqual(2)
    document.body.innerHTML = makeSlides(TEST_ID, 3)
    const element2: HTMLElement = screen.getByTestId(TEST_ID)
    setElement(element2)
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].count).toEqual(3)
    unmock()
    unsubscribe()
  })
  it('Can jumpTo', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 6)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200)
    const { subscribe, jumpTo } = createSnapSlider({
      element,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(0)
    jumpTo(4)
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].index).toEqual(4)
    unmock()
    unsubscribe()
  })
  it('Can goNext', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200)
    const { subscribe, goNext } = createSnapSlider({
      element,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(0)
    goNext()
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].index).toEqual(1)
    unmock()
    unsubscribe()
  })
  it('goNext will not go outside bounds', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200, element)
    const { subscribe, goNext, getState } = createSnapSlider({
      element,
      index: 1,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(1)
    goNext()
    expect(getState().index).toEqual(1)
    unmock()
    unsubscribe()
  })
  it('Can goNext with circular', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200)
    const { subscribe, goNext } = createSnapSlider({
      element,
      circular: true,
      index: 1,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(1)
    goNext()
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].index).toEqual(0)
    unmock()
    unsubscribe()
  })
  it('Can goPrev', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200, element)
    const { subscribe, goPrev } = createSnapSlider({
      element,
      index: 1,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(1)
    goPrev()
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].index).toEqual(0)
    unmock()
    unsubscribe()
  })
  it('goPrev will not go outside bounds', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200, element)
    const { subscribe, goPrev, getState } = createSnapSlider({
      element,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(0)
    goPrev()
    expect(getState().index).toEqual(0)
    unmock()
    unsubscribe()
  })
  it('Can goPrev with circular', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200, element)
    const { subscribe, goPrev } = createSnapSlider({
      element,
      circular: true,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(0)
    goPrev()
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].index).toEqual(1)
    unmock()
    unsubscribe()
  })
  it('Count is rounded up on last item', async () => {
    const slideCount = 8
    const perPage = 3
    const width = 600
    document.body.innerHTML = makeSlides(TEST_ID, slideCount)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(width, width / perPage, element)
    const { subscribe, jumpTo, goNext } = createSnapSlider({
      element,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(0)
    jumpTo(undefined, slideCount - perPage - 1)
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].index).toEqual(1)
    goNext()
    await waitFor(() => {
      expect(states.length).toEqual(3)
    })
    expect(states[2].index).toEqual(2)
    unmock()
    unsubscribe()
  })
  it('Run calculate on window resize and set correct count', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 6)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(600, 300)
    const { subscribe } = createSnapSlider({
      element,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].count).toEqual(3)
    const unmock2 = mockHelper(600, 200)
    resizeWindow()
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].count).toEqual(2)
    unmock()
    unmock2()
    unsubscribe()
  })
  it('Run calculate on window resize is throttled', async () => {
    jest.useFakeTimers()
    document.body.innerHTML = makeSlides(TEST_ID, 6)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(600, 300)
    const { subscribe } = createSnapSlider({
      element,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].count).toEqual(3)
    const unmock2 = mockHelper(600, 200)
    resizeWindow()
    resizeWindow()
    // Move time to trigger timeout throttle
    jest.advanceTimersByTime(1000)
    resizeWindow()
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].count).toEqual(2)
    unmock()
    unmock2()
    unsubscribe()
    jest.useRealTimers()
  })
  it('Reset index if new count is lower that current index', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 6)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200)
    const { subscribe, calculate, setElement } = createSnapSlider({
      element,
      index: 4,
    })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(4)
    element.innerHTML = makeSlides(TEST_ID, 2, true)
    calculate()
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].index).toEqual(0)
    unmock()
    unsubscribe()
  })
  it('Can trigger a scroll', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 4)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200)
    const { subscribe } = createSnapSlider({ element })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(0)
    element.scrollLeft = 200
    fireEvent.scroll(element, { target: { scrollX: 200 } })
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].index).toEqual(1)
    unmock()
    unsubscribe()
  })
  it('Can trigger a scroll after a click (reset muteScrollListner)', async () => {
    document.body.innerHTML = makeSlides(TEST_ID, 2)
    const element: HTMLElement = screen.getByTestId(TEST_ID)
    const unmock = mockHelper(200, 200, element)
    const { subscribe, goNext } = createSnapSlider({ element })
    let states: TSnapSliderStateFull[] = []
    const unsubscribe = subscribe((state) => {
      states.push(state)
    })
    await waitFor(() => {
      expect(states.length).toEqual(1)
    })
    expect(states[0].index).toEqual(0)
    goNext()
    await waitFor(() => {
      expect(states.length).toEqual(2)
    })
    expect(states[1].index).toEqual(1)
    /* Not needed because we trigger update after
    await waitFor(async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve))
    })
    */
    element.scrollLeft = 0
    fireEvent.scroll(element, { target: { scrollX: 0 } })
    await waitFor(() => {
      expect(states.length).toEqual(3)
    })
    expect(states[2].index).toEqual(0)
    unmock()
    unsubscribe()
  })
})
