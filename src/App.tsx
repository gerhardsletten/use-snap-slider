import React, { useState } from 'react'
import classNames from 'classnames'

import ReactExample from './react-example/ReactExample'
import VanillaExample from './vanilla-example/VanillaExample'

const VARIANTS = {
  react: 'react',
  vanilla: 'vanilla',
}

function App() {
  const [variant, setVariant] = useState(VARIANTS.react)
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-0">use-snap-slider</h1>
      <p className="text-lg mb-4">
        <strong>use-snap-slider</strong> - react hook to manage css snap sliders
      </p>
      <nav className="flex items-center gap-4 justify-center ">
        {[VARIANTS.react, VARIANTS.vanilla].map((name) => (
          <button
            key={name}
            onClick={() => setVariant(name)}
            className={classNames(
              'px-4 py-2 font-bold rounded-full text-lg hover:underline',
              {
                'text-white bg-black': name === variant,
                'bg-gray-200': name !== variant,
              }
            )}
          >
            {name}
          </button>
        ))}
      </nav>
      <hr className="border-b border-black my-8" />
      {variant === VARIANTS.react && <ReactExample />}
      {variant === VARIANTS.vanilla && <VanillaExample />}
    </div>
  )
}

export default App
