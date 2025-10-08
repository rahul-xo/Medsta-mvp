import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Pages/Login.jsx'
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx'
import BookAppointment from './Pages/BookAppointment.jsx'
import MedicineOrdering from './Pages/MedicineOrdering.jsx'
import DiagnosticTests from './Pages/DiagnosticTests.jsx'

import MultivendorWorkplace from './Pages/MultivendorWorkplace.jsx'

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
        path:'/multivendor-workplace',
        element:<MultivendorWorkplace/>
      },
    
      {
        path:'/medicine-ordering',
        element:<MedicineOrdering/>
      },
      {
        path:'/diagnostic-tests',
        element:<DiagnosticTests/>
      },
      {
        path:'/multivendor-workplace',
        element:<MultivendorWorkplace/>
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
