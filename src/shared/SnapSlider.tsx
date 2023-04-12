import React from 'react'
import classnames from 'classnames'

const Button: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className, ...props }) => (
  <button
    className={classnames(
      'h-10 w-10 flex items-center justify-center rounded-full bg-black text-white disabled:opacity-50 aspect-square',
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export const paginaBtnClass = 'h-4 w-4 border-2 border-black rounded-full'
export const paginaBtnClassActive = 'bg-black'

export const SnapSlider: React.FC<{
  children: React.ReactNode
  className?: string
  prevButtonProps?: object
  nextButtonProps?: object
  sliderProps?: object
  dotNavProps?: object
  dotNavChildren?: React.ReactNode
}> = ({
  children,
  className,
  nextButtonProps = {},
  prevButtonProps = {},
  sliderProps = {},
  dotNavProps = {},
  dotNavChildren,
  ...props
}) => {
  const btnClassNames = 'absolute top-1/2 -translate-y-1/2'
  return (
    <div className={classnames('grid grid-cols-1 gap-4', className)} {...props}>
      <div className="relative">
        <Button
          {...prevButtonProps}
          className={classnames('left-4', btnClassNames)}
          aria-label="Next"
        >
          <svg className="h-[1em] w-[1em]" aria-hidden="true" role="img">
            <use xlinkHref="#arrow-prev"></use>
          </svg>
        </Button>
        <div
          {...sliderProps}
          className={classnames(
            'flex scroll-smooth snap-x snap-mandatory overflow-x-auto w-full'
          )}
        >
          {children}
        </div>
        <Button
          {...nextButtonProps}
          className={classnames('right-4', btnClassNames)}
          aria-label="Next"
        >
          <svg className="h-[1em] w-[1em]" aria-hidden="true" role="img">
            <use xlinkHref="#arrow-next"></use>
          </svg>
        </Button>
      </div>
      <nav
        aria-label="Pages"
        {...dotNavProps}
        className="flex justify-center items-center gap-2"
      >
        {dotNavChildren}
      </nav>
    </div>
  )
}

export const SnapSliderItem: React.FC<{
  children?: React.ReactNode
  className: string
}> = ({ children, className }) => (
  <div className={classnames('flex snap-start shrink-0', className)}>
    {children}
  </div>
)

export default SnapSlider
