import { createBrowserRouter } from 'react-router'
import { RouterProvider, Link, NavLink, Outlet } from 'react-router'

import ReactExample from './react-example/ReactExample'
import VanillaExample from './vanilla-example/VanillaExample'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: '',
        Component: ReactExample,
      },
      {
        path: 'vanilla',
        Component: VanillaExample,
      },
    ],
  },
])

function Layout() {
  const link = [
    ['/', 'React'],
    ['vanilla', 'Vanilla'],
  ]
  return (
    <div className="p-4 bg-gray-100 min-h-screen grid grid-cols-1 gap-4 content-start">
      <div className="contents md:flex justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-0">use-snap-slider</h1>
          <p className="text-lg mb-4">
            <strong>use-snap-slider</strong> - react hook to manage css snap
            sliders
          </p>
        </div>
        <nav className="flex items-center gap-4 justify-center">
          {link.map(([path, name], i) => (
            <NavLink
              key={i}
              to={path}
              className="px-4 py-2 font-bold rounded-full text-lg hover:underline bg-gray-200 aria-[current]:bg-black aria-[current]:text-white"
            >
              {name}
            </NavLink>
          ))}
        </nav>
      </div>

      <main className="py-4">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return <RouterProvider router={router} />
}

export default App
