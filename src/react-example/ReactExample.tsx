import React, { useState } from 'react'
import classNames from 'classnames'

import { SnapSliderReact } from './SnapSliderReact'
import { SnapSliderItem } from '../shared/SnapSlider'
import { Slide } from '../shared/Slide'
import { makeArray } from '../helpers/utils'
import { useSearchParams } from 'react-router'
import { TSnapSliderOptions } from '../../lib/snap-slider'

type TWidthOption = 'full' | 'half' | 'third'

const widthOptions: TWidthOption[] = ['full', 'half', 'third'] as const

function isWidthOption(x: string): x is TWidthOption {
  // widen formats to string[] so indexOf(x) works
  return (widthOptions as readonly string[]).indexOf(x) >= 0
}

function ReactExample() {
  const [searchParams, setSearchParams] = useSearchParams()
  let count = 10
  const countParam = searchParams.get('count')
  if (countParam && !isNaN(parseInt(countParam))) {
    count = parseInt(countParam)
  }
  let width: TWidthOption = 'full'
  const widthParam = searchParams.get('width')
  if (widthParam && isWidthOption(widthParam)) {
    width = widthParam
  }
  let scrollTimeThrottle = 500
  const scrollTimeThrottleParam = searchParams.get('scrollTimeThrottle')
  if (scrollTimeThrottleParam && !isNaN(parseInt(scrollTimeThrottleParam))) {
    scrollTimeThrottle = parseInt(scrollTimeThrottleParam)
  }
  let debug = false
  const debugParam = searchParams.get('debug')
  if (debugParam === '1') {
    debug = true
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:flex items-start">
      <nav className="grid grid-cols-1 gap-2 border-black border p-2 py-4 rounded">
        <fieldset className="input-group">
          <legend className="label">Width:</legend>
          {widthOptions.map((w) => (
            <label key={w} className="label">
              <input
                type="radio"
                value={w}
                className=""
                checked={w === width}
                onChange={() => {
                  setSearchParams({
                    width: w,
                    debugParam: `${debugParam}`,
                    scrollTimeThrottle: `${scrollTimeThrottleParam}`,
                    count: `${count}`,
                  })
                }}
              />
              {w}
            </label>
          ))}
        </fieldset>
        <div className="input-group">
          <label htmlFor="pages-input" className="label">
            Count pages
          </label>
          <input
            type="number"
            min={1}
            value={count}
            onChange={(event) => {
              setSearchParams({
                count: event.target.value,
                debugParam: `${debugParam}`,
                width,
                scrollTimeThrottle: `${scrollTimeThrottleParam}`,
              })
            }}
            id="pages-input"
            className="input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="scrolltime-input" className="label">
            Scroll time throttle
          </label>
          <input
            type="number"
            min={1}
            value={scrollTimeThrottle}
            onChange={(event) => {
              setSearchParams({
                scrollTimeThrottle: event.target.value,
                debugParam: `${debugParam}`,
                width,
                count: `${count}`,
              })
            }}
            id="scrolltime-input"
            className="input"
          />
        </div>
        <fieldset className="input-group">
          <legend className="label">Debug</legend>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={debug}
              onChange={(event) => {
                setSearchParams({
                  count: `${count}`,
                  width,
                  debug: event.target.checked ? '1' : '',
                  scrollTimeThrottle: `${scrollTimeThrottleParam}`,
                })
              }}
              id="pages-input"
              className="input"
            />
            Debug to console
          </label>
        </fieldset>
      </nav>
      <div className=" flex-1">
        <Slider
          count={count}
          width={width}
          options={{
            scrollTimeThrottle,
            debug,
            scrollListenerThreshold: 30,
          }}
        />
      </div>
    </div>
  )
}

const Slider = ({
  count,
  width,
  options,
}: {
  count: number
  width: TWidthOption
  options?: TSnapSliderOptions
}) => {
  const slideItems = makeArray(count)
  return (
    <SnapSliderReact
      count={slideItems.length}
      options={options}
      countHash={`${count}-${width}`}
      className="-mx-2"
    >
      {slideItems.map((slide, j) => (
        <SnapSliderItem
          className={classNames('px-2', {
            'w-full': width === 'full',
            'w-1/2': width === 'half',
            'w-1/3': width === 'third',
          })}
          key={j}
        >
          <Slide>{slide + 1}</Slide>
        </SnapSliderItem>
      ))}
    </SnapSliderReact>
  )
}

export default ReactExample
