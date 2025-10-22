import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PatientLogin from './Pages/Login/PatientLogin.jsx'
import ProviderLogin from './Pages/Login/ProviderLogin.jsx'
import SignUp from './Pages/Signup/SignUp.jsx';
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx'
import BookAppointment from './Pages/BookAppointment.jsx'
import MedicineOrdering from './Pages/MedicineOrdering.jsx'
import DiagnosticTests from './Pages/DiagnosticTests.jsx'
import Policies from './Pages/Policies.jsx'
import MultivendorWorkplace from './Pages/MultivendorWorkplace.jsx'
import PatientDashboard from './Pages/PatientDashboard.jsx';
import ProviderDashboard from './Pages/ProviderDashboard.jsx';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import PatientSignup from './Pages/Signup/PatientSignup.jsx'
import ProviderSignup from './Pages/Signup/ProviderSignup.jsx'
import DoctorSignup from './Pages/Signup/Provider/DoctorSignup.jsx'
import DiagnosticCenterSignup from './Pages/Signup/Provider/DiagnosticCenterSignup.jsx'
import PharmacySignup from './Pages/Signup/Provider/PharmacySignup.jsx'
import DeliveryAgentSignup from './Pages/Signup/Provider/DeliveryAgentSignup.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/book', element: <BookAppointment /> },
      { path: '/multivendor-workplace', element: <MultivendorWorkplace /> },
      { path: '/medicine-ordering', element: <MedicineOrdering /> },
      { path: '/diagnostic-tests', element: <DiagnosticTests /> },
      { path: '/about', element: <About /> },
      { path: '/policies', element: <Policies /> },
  { path: '/login', element: <PatientLogin /> },
  { path: '/login/provider', element: <ProviderLogin /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/signup/patient', element: <PatientSignup /> },
  { path: '/signup/provider', element: <ProviderSignup /> },
  { path: '/signup/provider/doctor', element: <DoctorSignup /> },
  { path: '/signup/provider/diagnostic-center', element: <DiagnosticCenterSignup /> },
  { path: '/signup/provider/pharmacy', element: <PharmacySignup /> },
  { path: '/signup/provider/delivery-agent', element: <DeliveryAgentSignup /> },
  { path: '/patient-dashboard', element: <PatientDashboard /> },
  { path: '/provider-dashboard', element: <ProviderDashboard /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
