import React from 'react'
import classnames from 'classnames'

export const Slide: React.FC<{
  children?: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div
    className={classnames(
      'w-full h-[200px] rounded-md flex items-center justify-center bg-red-500 text-white text-2xl font-bold',
      className
    )}
  >
    {children}
  </div>
)

export default Slide
