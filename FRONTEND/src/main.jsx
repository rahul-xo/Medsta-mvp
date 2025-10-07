import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Pages/Login.jsx'
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx'
import BookAppointment from './Pages/BookAppointment.jsx'

const router=createBrowserRouter([
  {
    path:'/',
    element: <App/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/book',
        element:<BookAppointment/>
      },
      {
        path:'/about',
        element:<About/>
      },
      {
        path:'/login',
        element:<Login/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router}/>
  </StrictMode>,
)
