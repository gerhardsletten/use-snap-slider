import { createSnapSlider } from '../lib/snap-slider'

export function createSnapSliderVanilla(element: HTMLElement) {
  const container = element.closest('[data-slider-container]')
  const count = Number(element.getAttribute('data-slider'))
  const nextBtn = container?.querySelector('[data-next]')
  const prevBtn = container?.querySelector('[data-prev]')
  const pagina = container?.querySelector('[data-pagina]')
  const btnClass = pagina?.getAttribute('data-btn-class')
  const btnClassActive = pagina?.getAttribute('data-btn-class-active')
  const { jumpTo, goNext, goPrev, subscribe } = createSnapSlider({
    element,
    count: count,
    index: 0,
  })
  subscribe((obj) => {
    if (obj.nextEnabled) {
      nextBtn?.removeAttribute('disabled')
    } else {
      nextBtn?.setAttribute('disabled', 'true')
    }
    if (obj.prevEnabled) {
      prevBtn?.removeAttribute('disabled')
    } else {
      prevBtn?.setAttribute('disabled', 'true')
    }
    if (pagina) {
      pagina.innerHTML = ''
      for (let i = 0; i < obj.count; i++) {
        const classes = `${btnClass} ${i === obj.index ? btnClassActive : ''}`
        const button = document.createElement('button')
        button.addEventListener('click', () => jumpTo(i))
        button.className = classes
        pagina.append(button)
      }
    }
  })
  prevBtn?.addEventListener('click', goPrev)
  nextBtn?.addEventListener('click', goNext)
}
