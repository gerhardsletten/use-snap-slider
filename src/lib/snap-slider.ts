import { throttle } from './throttle'

export interface TSnapListnerStateIndex {
  index: number
  indexDelta: number
}

export interface TSnapSliderState extends TSnapListnerStateIndex {
  count: number
  countDelta: number
}

interface TSnapSliderStateUpdate {
  index?: number
  indexDelta?: number
  count?: number
  countDelta?: number
}

export interface TSnapSliderStateFull extends TSnapSliderState {
  prevEnabled: boolean
  nextEnabled: boolean
}

export type TSnapListner = (params: TSnapSliderStateFull) => void

export interface TSnapSliderParams extends TSnapSliderStateUpdate {
  element: HTMLElement | null
  itemSelector?: string
  initalSubscriptionPublish?: boolean
  circular?: boolean
}

export type TSnapSliderJumpToFn = (index?: number, indexDelta?: number) => void

export interface TSnapSlider {
  destroy: () => void
  getState: () => TSnapSliderStateFull
  jumpTo: TSnapSliderJumpToFn
  goNext: () => void
  goPrev: () => void
  subscribe: (fn: TSnapListner) => () => void
  setElement: (el: HTMLElement) => void
  calculate: () => void
}

export function createSnapSlider({
  element: _element,
  count = 1,
  countDelta,
  index = 0,
  circular,
  indexDelta,
  initalSubscriptionPublish = true,
  itemSelector = ':scope > *',
}: TSnapSliderParams): TSnapSlider {
  let initalIndex: number | undefined = index
  let state: TSnapSliderState = {
    index,
    indexDelta: indexDelta || index,
    count,
    countDelta: countDelta || count,
  }
  let prevIndexDelta: number = index
  let slidesPerPage: number = 1
  let itemPositions: number[] = []
  let muteScrollListner: boolean = false
  let left: number = 0
  let element: HTMLElement | null
  function updateIndexDelta() {
    if (element) {
      const prev = element.scrollLeft
      const { indexDelta } = state
      left = indexDelta * (element.offsetWidth / slidesPerPage)
      if (prevIndexDelta !== indexDelta) {
        const distance = Math.abs(prev - left)
        const limitInstantScroll = element.offsetWidth * 2
        prevIndexDelta = indexDelta
        muteScrollListner = true
        // @ts-expect-error [mildly irritated message]
        const behavior: ScrollBehavior =
          distance > limitInstantScroll ? 'instant' : 'smooth'
        element.scroll({
          left,
          top: 0,
          behavior,
        })
      } else {
        if (initalIndex) {
          muteScrollListner = true
          element.scroll({
            left,
            top: 0,
            // @ts-expect-error [mildly irritated message]
            behavior: 'instant',
          })
          initalIndex = undefined
        }
      }
    }
  }

  let publishDirty = false
  let listeners: TSnapListner[] = []
  const subscribe = (callback: TSnapListner) => {
    listeners.push(callback)
    if (element && (publishDirty || initalSubscriptionPublish)) {
      callback(getState())
    }
    return () => {
      listeners = listeners.filter((x) => x !== callback)
      if (listeners.length < 1) {
        destroy()
      }
    }
  }
  function notify() {
    listeners.forEach((callback) => {
      callback(getState())
    })
  }
  const getState = (): TSnapSliderStateFull => {
    const { indexDelta, countDelta } = state
    return {
      ...state,
      prevEnabled: circular || indexDelta > 0,
      nextEnabled: circular || countDelta - slidesPerPage > indexDelta,
    }
  }
  function update(params: TSnapSliderStateUpdate) {
    let dirty = false
    let indexDeltaDirty = false
    type TSnapSliderStateUpdateKey = keyof typeof params
    const keys: TSnapSliderStateUpdateKey[] = Object.keys(
      params
    ) as Array<TSnapSliderStateUpdateKey>
    keys.forEach((key) => {
      if (state[key] !== params[key]) {
        state[key] = Number(params[key])
        dirty = true
        if (key === 'indexDelta') {
          indexDeltaDirty = true
        }
      }
    })
    if (dirty) {
      publishDirty = listeners.length === 0
      notify()
      if (indexDeltaDirty) {
        updateIndexDelta()
      }
    }
  }
  function fixIndex(nextIndex: TSnapListnerStateIndex): TSnapListnerStateIndex {
    const { index, indexDelta } = nextIndex
    const { countDelta, count } = state
    const last = countDelta - slidesPerPage
    return {
      index: indexDelta < last ? index : count - 1,
      indexDelta,
    }
  }
  function calculate() {
    if (element) {
      let contentWidth = 0
      let itemWidth = 0
      itemPositions = []
      element.querySelectorAll(itemSelector).forEach((slide) => {
        itemPositions.push(contentWidth)
        contentWidth += slide.clientWidth
        itemWidth = slide.clientWidth
      })
      slidesPerPage = Math.round(element.offsetWidth / itemWidth)
      const countDelta = itemPositions.length
      const count = Math.ceil(countDelta / slidesPerPage)
      const { index } = state
      const resetIndexMayby =
        index + 1 > count
          ? {
              index: 0,
              indexDelta: 0,
            }
          : {}
      update({
        count,
        countDelta,
        ...resetIndexMayby,
      })
    }
  }

  let ticking = false
  function onScroll() {
    if (!ticking && element) {
      const scrollLeft = element.scrollLeft
      window.requestAnimationFrame(() => {
        if (muteScrollListner) {
          const leftToScroll = Math.abs(left - scrollLeft)
          if (leftToScroll < 2) {
            muteScrollListner = false
          }
        } else {
          const positionItem = itemPositions.reduce((prev, curr) => {
            return Math.abs(curr - scrollLeft) < Math.abs(prev - scrollLeft)
              ? curr
              : prev
          })
          const indexDelta = itemPositions.findIndex((x) => x === positionItem)
          prevIndexDelta = indexDelta
          update(
            fixIndex({
              index: Math.floor(indexDelta / slidesPerPage),
              indexDelta,
            })
          )
        }
        ticking = false
      })
      ticking = true
    }
  }
  const onScrollFn = throttle(onScroll, 200)
  const onResizeFn = throttle(calculate, 500)
  function setElement(_el: HTMLElement) {
    if (element) {
      destroy()
    }
    element = _el
    updateIndexDelta()
    calculate()
    element?.addEventListener('scroll', onScrollFn)
    window.addEventListener('resize', onResizeFn)
  }
  _element && setElement(_element)
  const jumpTo: TSnapSliderJumpToFn = function (index, indexDelta) {
    if (indexDelta !== undefined) {
      update(
        fixIndex({
          index: Math.floor(indexDelta / slidesPerPage),
          indexDelta,
        })
      )
    }
    if (index !== undefined) {
      update(
        fixIndex({
          index,
          indexDelta: index * slidesPerPage,
        })
      )
    }
  }
  const destroy = () => {
    element?.removeEventListener('scroll', onScrollFn)
    window.removeEventListener('resize', onResizeFn)
  }
  const goNext = () => {
    const { countDelta, indexDelta } = state
    const last = countDelta - slidesPerPage
    const next =
      indexDelta + slidesPerPage <= last
        ? indexDelta + slidesPerPage
        : circular && indexDelta === last
        ? 0
        : last
    jumpTo(undefined, next)
  }
  const goPrev = () => {
    const { indexDelta, countDelta } = state
    const last = countDelta - slidesPerPage
    const next =
      indexDelta - slidesPerPage >= 0
        ? indexDelta - slidesPerPage
        : circular && indexDelta === 0
        ? last
        : 0
    jumpTo(undefined, next)
  }
  return {
    destroy,
    getState,
    subscribe,
    jumpTo,
    setElement,
    calculate,
    goNext,
    goPrev,
  }
}
