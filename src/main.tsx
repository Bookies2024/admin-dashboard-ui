import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import RootLayout from './layout/RootLayout.tsx'
import Mail from './pages/Mail.tsx'
import { createTheme, ThemeProvider } from '@mui/material'
import Auth from './pages/Auth.tsx'
import Dashboard from './pages/Dashboard.tsx'
import { Provider } from 'react-redux'
import { persistor, store } from './store/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import Config from './pages/Config.tsx'
import GenerateQR from './pages/GenerateQR.tsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={<Auth />} />
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='mail' element={<Mail />} />
        <Route path='config' element={<Config />} />
        <Route path='generate-qr' element={<GenerateQR />} />
        {/* <Route path='*' element={<PageNotFound />} /> */}
      </Route>
    </>
  )
)

const theme = createTheme({
  palette: {
    primary: {
      main: '#58551E'
    },
    secondary: {
      main: '#FFE6D5'
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
