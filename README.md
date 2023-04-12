# use-snap-slider

React hook / Vanilla JS to manage scroll-state for [CSS Scroll Snap](https://caniuse.com/?search=scroll-snap)

Gives you states and actions for CSS Scroll Snap sliders:

* `count:number` - total pages
* `countDelta:number` - total slides, for 1/1 width slides the same as count
* `index:number` - current page index
* `indexDelto:number` - current slide index, for 1/1 width slides the same as index
* `prevEnabled:boolean` - can go to previous slide
* `nextEnabled:boolean` - can go to next slide
* `goPrev()` - scroll to previous slide
* `goNext()` - scroll to next slide
* `jumpTo(index:number)` - go to a spesified slide

## Usage

`npm i use-snap-slider`

### Basic usage (react)

In your react component:

See a [more complete react-example here](https://github.com/gerhardsletten/use-snap-slider/blob/main/src/react-example/SnapSliderReact.tsx)

```tsx
import React, { useRef } from 'react'
import { useSnapSlider } from 'use-snap-slider'

export function MySlider () {
  const ref = useRef<HTMLDivElement | null>(null)
  const slides = [1,2]
  // Passing inital count avoid extra render, for best lighthouse score, pass the same count as you show on mobile
  const state = useSnapSlider(ref, slides.count)
  const pages = Array.from(Array(state.count).keys())
  return (
    <div>
      <div className="flex scroll-smooth snap-x snap-mandatory overflow-x-auto w-full" ref={ref}>
        {slides.map((slide) => (
          <div key={slide} className="flex snap-start shrink-0 w-full md:w-1/2">
            Slide {slide}
          </div>
        ))}
      </div>
      <nav aria-label="Pages navigation">
        {pages.map((page) => (
          <button onClick={() => state.jumpTo(page)} disabled={page === state.index}>{page + 1}</button>
        ))}
      </nav>
      <nav aria-label="Prev / Next navigation">
        <button onClick={state.goPrev} disabled={!state.prevEnabled}>Prev</button>
        <button onClick={state.goNext} disabled={!state.nextEnabled}>Next</button>
      </nav>
    </div>
  )
}
```

### Basic usage (vanilla javascript)

See a [more complete vanilla javascript example here](https://github.com/gerhardsletten/use-snap-slider/blob/main/src/vanilla-example/create-snap-slider.ts)

```ts
import { createSnapSlider } from 'use-snap-slider/dist/snap-slider'

function createSnapSliderVanilla(element: HTMLElement) {
  const { jumpTo, goNext, goPrev, subscribe } = createSnapSlider({
    element,
    count: count,
    index: 0,
  })
  subscribe((state) => {
    // Update UI with sate
  })
  document.querySelector('.prev-btn')?.addEventListener('click', goPrev)
  document.querySelector('.next-btn')?.addEventListener('click', goNext)
}
// Expose globally
window.createSnapSliderVanilla = createSnapSliderVanilla
```

## API

### useSnapSlider react hook

```ts
import { useSnapSlider } from 'use-snap-slider'

const {
  index: number,
  // If displaying multiple slides on the same page, this will be slide at left position
  indexDelta: number,
  // Count of pages
  count: number,
  countDelta: number,
  prevEnabled: boolean,
  nextEnabled: boolean,
  jumpTo: (index: number) => void,
  goNext: () => void,
  goPrev: () => void,
} = useSnapSlider(
  ref: MutableRefObject<HTMLDivElement | null>,
  // Pass inital count
  count?: number = 1,
  // Pass inital index
  index?: number = 0,
  // onPrev / next buttons go to end / start 
  circular = false,
  // Will reset index on change of count, but pass something here to force a reset even if count dont change
  countHash?: string | number
)
```

### useSnapSlider react hook

```ts
import { createSnapSlider } from 'use-snap-slider/dist/snap-slider'

const {
  // Removes event listner for window.resize and element.scroll
  destroy: () => void,
  // Get current state
  getState: () => TSnapSliderStateFull,
  // Go to slide index
  jumpTo: (index?: number, indexDelta?: number) => void,
  goNext: () => void,
  goPrev: () => void,
  // Subscribe to updates
  subscribe: (fn: TSnapListner) => () => void,
  // Set element at later stage
  setElement: (el: HTMLElement) => void,
  // Updates count and countDelta, call if you change inner slides
  calculate: () => void,
} = createSnapSlider({
  element: HTMLDivElement | null,
  count?:number = 1,
  countDelta?:number,
  index?:number = 0,
  circular?:boolean,
  indexDelta?:number,
  itemSelector?:string = ':scope > *',
})
```

## Adding nessesary styles

This library only delivers javascript for handle the state, you will need to make your own component for complete solution. See examples in this repo: 

* [React component](https://github.com/gerhardsletten/use-snap-slider/blob/main/src/react-example/SnapSliderReact.tsx)
* [Vanilla JS function](https://github.com/gerhardsletten/use-snap-slider/blob/main/src/vanilla-example/create-snap-slider.ts)

### TailwindCSS

See also tailwinds own documentation for [scroll snap](https://tailwindcss.com/docs/scroll-snap-type)

```html
<div class="flex scroll-smooth snap-x snap-mandatory overflow-x-auto">
  <div class="flex snap-start shrink-0">
    Slide 1
  </div>
  <div class="flex snap-start shrink-0">
    Slide 2
  </div>
</div>
```

### Basic css

```html
<style>
.css-slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
.css-slider::-webkit-scrollbar {
  @apply hidden;
}
.css-slider-item {
  display: flex;
  scroll-snap-align: start;
  flex-shrink: 0;
}
.css-slider-item-half {
  width: 50%;
}
</style>
<!-- Markup -->
<div class="css-slider">
  <div class="css-slider-item css-slider-item-half">
    Slide 1
  </div>
  <div class="css-slider-item css-slider-item-half">
    Slide 2
  </div>
</div>
```
