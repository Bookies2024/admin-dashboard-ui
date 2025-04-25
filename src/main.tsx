// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import RootLayout from './layout/RootLayout.tsx'
import Mail from './pages/Mail.tsx'
import Home from './pages/Home.tsx'


const router = createBrowserRouter(
  createRoutesFromElements(
  <Route path='/' element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path='mail' element={<Mail />} />
      {/* <Route path='*' element={<PageNotFound />} /> */}
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <RouterProvider router={router}/>
  // </StrictMode>,
)
