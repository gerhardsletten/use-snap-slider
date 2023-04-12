import React, { useEffect } from 'react'
import classNames from 'classnames'
import { createSnapSliderVanilla } from './create-snap-slider'

import {
  SnapSlider,
  SnapSliderItem,
  paginaBtnClass,
  paginaBtnClassActive,
} from '../shared/SnapSlider'
import { Slide } from '../shared/Slide'
import { makeArray } from '../helpers/utils'

function VanillaExample() {
  const count = 8
  const index = 0
  const slideItems = makeArray(count)
  useEffect(() => {
    const sliders = document.querySelectorAll<HTMLElement>('[data-slider]')
    sliders.forEach((item) => {
      createSnapSliderVanilla(item)
    })
  }, [])
  return (
    <div className="grid grid-cols-1 gap-4">
      <p>
        ReactJS is used for rendering markup, but vanilla JS function is
        initalized in a 'useEffect' hook.
      </p>
      <SnapSlider
        data-slider-container
        className="-mx-2"
        prevButtonProps={{
          disabled: true,
          'data-prev': true,
        }}
        nextButtonProps={{
          disabled: false,
          'data-next': true,
        }}
        sliderProps={{
          'data-slider': count,
          'data-slider-index': index,
        }}
        dotNavProps={{
          'data-pagina': true,
          'data-btn-class': paginaBtnClass,
          'data-btn-class-active': paginaBtnClassActive,
        }}
      >
        {slideItems.map((slide, j) => (
          <SnapSliderItem className="w-1/2 md:w-1/3 lg:w-1/4 px-2" key={j}>
            <Slide>{slide + 1}</Slide>
          </SnapSliderItem>
        ))}
      </SnapSlider>
    </div>
  )
}

export default VanillaExample
