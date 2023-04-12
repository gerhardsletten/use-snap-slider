export type TScrollParams = ScrollToOptions | undefined
export type TScrollFn = (options?: TScrollParams) => void

const originalProperty = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'offsetWidth'
) as PropertyDescriptor & ThisType<any>

export function resizeWindow() {
  const event = new Event('resize')
  window.dispatchEvent(event)
}

export function mockHelper(
  containerWidth: number,
  itemWidth: number,
  element?: HTMLElement
): () => void {
  function scroll(scrollLeft: number) {
    const event = new Event('scroll')
    element &&
      Object.defineProperty(element, 'scrollLeft', {
        writable: true,
        configurable: true,
        value: scrollLeft,
      })
    element?.dispatchEvent(event)
  }
  function unmock() {
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetWidth',
      originalProperty
    )
    Object.defineProperty(
      HTMLElement.prototype,
      'clientWidth',
      originalProperty
    )
    Object.defineProperty(HTMLElement.prototype, 'scroll', originalProperty)
  }
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: containerWidth,
  })
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    value: itemWidth,
  })
  Object.defineProperty(HTMLElement.prototype, 'scroll', {
    configurable: true,
    value: (options?: TScrollParams) => {
      options?.left && scroll(options?.left)
    },
  })
  return unmock
}

export const makeArray = (count: number) => Array.from(Array(count).keys())

export const makeSlides = (
  testId: string,
  numSlides: number,
  justContent?: boolean
) => {
  const slides = makeArray(numSlides)
    .map((slide) => `<article>${slide}</article>`)
    .join('')
  if (justContent) {
    return slides
  }
  return `<div data-testid="${testId}" class="test">${slides}</div>`
}
