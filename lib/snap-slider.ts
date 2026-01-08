import { throttle } from './throttle'

export type TSnapListnerEvent = 'scroll' | 'click' | 'inital' | 'goto'

export interface TSnapListnerStateIndex {
  index: number
  indexDelta: number
}

export interface TSnapSliderState extends TSnapListnerStateIndex {
  count: number
  countDelta: number
  event: TSnapListnerEvent
}

interface TSnapSliderStateUpdate {
  index?: number
  indexDelta?: number
  count?: number
  countDelta?: number
  event: TSnapListnerEvent
}

export interface TSnapSliderStateFull extends TSnapSliderState {
  prevEnabled: boolean
  nextEnabled: boolean
}

export type TSnapListner = (params: TSnapSliderStateFull) => void

export type TSnapSliderOptions = {
  circular?: boolean
  debug?: boolean
  scrollTimeThrottle?: number
  resizeTimeThrottle?: number
  scrollListenerThreshold?: number
}

export type TSnapSliderParams = Omit<TSnapSliderStateUpdate, 'event'> &
  TSnapSliderOptions & {
    element: HTMLElement | null
    itemSelector?: string
    initalSubscriptionPublish?: boolean
  }

export type TSnapSliderJumpToFn = (
  index?: number,
  indexDelta?: number,
  event?: TSnapListnerEvent
) => void

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
  debug,
  scrollTimeThrottle = 500,
  resizeTimeThrottle = 500,
  scrollListenerThreshold = 2,
}: TSnapSliderParams): TSnapSlider {
  let initalIndex: number | undefined = index
  let state: TSnapSliderState = {
    index,
    indexDelta: indexDelta || index,
    event: 'inital',
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
      const { indexDelta, event } = state
      left = indexDelta * (element.offsetWidth / slidesPerPage)
      if (prevIndexDelta !== indexDelta) {
        const distance = Math.abs(prev - left)
        const limitInstantScroll = element.offsetWidth * 2
        prevIndexDelta = indexDelta
        muteScrollListner = true
        const behavior: ScrollBehavior =
          distance > limitInstantScroll || event === 'click'
            ? 'instant'
            : 'smooth'
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
    state['event'] = params['event']
    keys.forEach((key) => {
      if (key !== 'event' && state[key] !== params[key]) {
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
      const slides = element.querySelectorAll<HTMLDivElement>(itemSelector)
      slides.forEach((slide) => {
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

      if (!isNaN(count)) {
        // if element not mounted / hidden not update
        update({
          event: 'inital',
          count,
          countDelta,
          ...resetIndexMayby,
        })
        debug &&
          console.log('update count', {
            count,
            countDelta,
            itemPositions,
            slidesPerPage,
            clientWidth: element.clientWidth,
            offsetWidth: element.offsetWidth,
            itemSelector,
            slides,
          })
      }
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
          const pxLeftScrolling = Math.abs(scrollLeft - positionItem)
          prevIndexDelta = indexDelta
          debug &&
            console.log('onScroll', {
              pxLeftScrolling,
              indexDelta,
              scrollLeft,
              positionItem,
              itemPositions,
            })
          if (pxLeftScrolling < scrollListenerThreshold) {
            update({
              event: 'scroll',
              ...fixIndex({
                index: Math.floor(indexDelta / slidesPerPage),
                indexDelta,
              }),
            })
          }
        }
        ticking = false
      })
      ticking = true
    }
  }
  const onScrollFn = throttle(onScroll, scrollTimeThrottle)
  const onResizeFn = throttle(calculate, resizeTimeThrottle)
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
  const jumpTo: TSnapSliderJumpToFn = function (
    index,
    indexDelta,
    event = 'goto'
  ) {
    if (indexDelta !== undefined) {
      update({
        event,
        ...fixIndex({
          index: Math.floor(indexDelta / slidesPerPage),
          indexDelta,
        }),
      })
    }
    if (index !== undefined) {
      update({
        event,
        ...fixIndex({
          index,
          indexDelta: index * slidesPerPage,
        }),
      })
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
