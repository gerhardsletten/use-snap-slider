import React, { useState } from 'react'
import classNames from 'classnames'

import { SnapSliderReact } from './SnapSliderReact'
import { SnapSliderItem } from '../shared/SnapSlider'
import { Slide } from '../shared/Slide'
import { makeArray } from '../helpers/utils'

interface TSnapSliderSlides {
  count: number
  countHash?: string
}

interface TSnapSliderExample {
  name: string
  description?: string
  cssClass: string
  circular: boolean
  slides: TSnapSliderSlides[]
}

const examples: TSnapSliderExample[] = [
  {
    name: 'Example 1 - responsive width for slides',
    description:
      'Dot navigation should updated when the with of the screen changes',
    cssClass: 'w-1/2 md:w-1/3 lg:w-1/4',
    circular: false,
    slides: [
      {
        count: 12,
      },
    ],
  },
  {
    name: 'Example 2 - rounded up index for dot navigation',
    description:
      'Showing 8 slides with 1/3 width will not fill 3 full pages, so when scrolled to the end of slides, index will be rounded up to last page',
    cssClass: 'w-1/3',
    circular: false,
    slides: [
      {
        count: 8,
      },
    ],
  },
  {
    name: 'Example 3 - handling of external filter / change of slide-count',
    description:
      "Change in filter moves index to 0 since 'use-snap-slider' does this when count changes. But for if 2 filters have the same count, you will need to add your own logic in your component (see next example)",
    cssClass: 'w-1/3',
    circular: false,
    slides: [
      {
        count: 8,
      },
      {
        count: 10,
      },
      {
        count: 7,
      },
      {
        count: 7,
      },
    ],
  },
  {
    name: 'Example 4 - handling of external filter / change of slide-count (counthash)',
    description:
      'A custom counthash is used to distinguish filter with same count.',
    cssClass: 'w-1/3',
    circular: false,
    slides: [
      {
        count: 7,
        countHash: 'category-1',
      },
      {
        count: 7,
        countHash: 'category-2',
      },
    ],
  },
  {
    name: 'Example 5 - circular',
    description: 'Prev / next button with slide to the start / end.',
    cssClass: 'w-1/3',
    circular: true,
    slides: [
      {
        count: 7,
        countHash: 'category-1',
      },
      {
        count: 7,
        countHash: 'category-2',
      },
    ],
  },
  {
    name: 'Example 6 - full width',
    cssClass: 'w-full',
    circular: false,
    slides: [
      {
        count: 4,
      },
      {
        count: 2,
        countHash: 'category-1',
      },
      {
        count: 2,
        countHash: 'category-2',
      },
    ],
  },
]

function ReactExample() {
  const list = examples.filter((item, i) => i < 10)
  return (
    <div>
      {list.map((data, i) => (
        <Slider key={i} data={data} />
      ))}
    </div>
  )
}

const Slider: React.FC<{
  data: TSnapSliderExample
}> = ({ data }) => {
  const { name, cssClass, slides, circular, description } = data
  const [slideNum, setSlideNum] = useState<number>(0)
  const slide = slides[slideNum]
  const slideItems = makeArray(slide.count)
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-2xl font-bold">{name}</h2>
        {slides.length > 1 && (
          <select
            value={slideNum}
            onChange={(event) => {
              setSlideNum(Number(event.target.value))
            }}
          >
            {slides.map((number, i) => (
              <option key={i} value={i}>
                Slides {slides[i].count}
              </option>
            ))}
          </select>
        )}
      </div>
      {description && <p className="mb-4 -mt-4">{description}</p>}
      <SnapSliderReact
        count={slideItems.length}
        circular={circular}
        countHash={slide.countHash}
        className="-mx-2"
      >
        {slideItems.map((slide, j) => (
          <SnapSliderItem className={classNames('px-2', cssClass)} key={j}>
            <Slide>{slide + 1}</Slide>
          </SnapSliderItem>
        ))}
      </SnapSliderReact>
    </div>
  )
}

export default ReactExample
