import React, { useRef, useEffect } from 'react'

import { useSnapSlider } from '../../lib/use-snap-slider'
import { makeArray } from '../helpers/utils'
import { SnapSlider, paginaBtnClass } from '../shared/SnapSlider'

export const SnapSliderReact: React.FC<{
  children: React.ReactNode
  count: number
  index?: number
  className?: string
  onChangeIndex?: (index: number) => void
  countHash?: string
  debug?: boolean
  circular?: boolean
}> = ({
  children,
  className,
  count: _count,
  index: _index,
  onChangeIndex,
  countHash,
  circular,
  debug,
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const {
    goNext,
    goPrev,
    index,
    indexDelta,
    prevEnabled,
    nextEnabled,
    jumpTo,
    count,
    countDelta,
  } = useSnapSlider(ref, _count, _index, circular, countHash)
  const refInputIndex = useRef(_index)
  const refIndex = useRef(index)
  useEffect(() => {
    if (index !== undefined && _index !== index && onChangeIndex) {
      const inputIndexChange = _index !== refInputIndex.current
      const indexChange = index !== refIndex.current

      if (indexChange) {
        onChangeIndex(index)
      }
      if (!indexChange && inputIndexChange) {
        jumpTo(index)
      }
    }
    refInputIndex.current = _index
    refIndex.current = index
  }, [index, _index, jumpTo, onChangeIndex])
  const pages = makeArray(count)
  debug && console.log('render', { index, indexDelta, count, countDelta })
  return (
    <SnapSlider
      className={className}
      prevButtonProps={{
        onClick: goPrev,
        disabled: !prevEnabled,
      }}
      nextButtonProps={{
        onClick: goNext,
        disabled: !nextEnabled,
      }}
      sliderProps={{
        ref,
      }}
      dotNavChildren={
        <>
          {pages.map((page) => (
            <button
              key={page}
              className={paginaBtnClass}
              disabled={index === page}
              onClick={() => jumpTo(page)}
            />
          ))}
        </>
      }
    >
      {children}
    </SnapSlider>
  )
}
