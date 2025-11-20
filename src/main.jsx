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
import ProtectedRoute from '@/Components/router/ProtectedRoute.jsx';
import Cart from './Pages/Cart.jsx'

import "react-responsive-carousel/lib/styles/carousel.min.css";
import PatientSignup from './Pages/PatientSignup.jsx'
import ProviderHub from './Pages/Signup/Provider/ProviderHub.jsx'
import DoctorSignup from './Pages/Signup/Provider/DoctorSignup.jsx'
import DiagnosticCenterSignup from './Pages/Signup/Provider/DiagnosticCenterSignup.jsx'
import PharmacySignup from './Pages/Signup/Provider/PharmacySignup.jsx'
import DeliveryAgentSignup from './Pages/Signup/Provider/DeliveryAgentSignup.jsx'
import TherapySignup from './Pages/Signup/Provider/TherapySignup.jsx'
import OthersSignup from './Pages/Signup/Provider/OthersSignup.jsx'
import SeedClinic from './Pages/Dev/SeedClinic.jsx'
import SeedTherapy from './Pages/Dev/SeedTherapy.jsx'
import SeedOthers from './Pages/Dev/SeedOthers.jsx'
import Profile from './Pages/Profile.jsx'

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
  { path: '/signup/provider', element: <ProviderHub /> },
  { path: '/book-appointment', element: <BookAppointment /> },
  { path: '/cart', element: <Cart /> },
  { path: '/signup/provider/doctor', element: <DoctorSignup /> },
  { path: '/signup/provider/diagnostic-center', element: <DiagnosticCenterSignup /> },
  { path: '/signup/provider/pharmacy', element: <PharmacySignup /> },
  { path: '/signup/provider/delivery-agent', element: <DeliveryAgentSignup /> },
  { path: '/signup/provider/therapy', element: <TherapySignup /> },
  { path: '/signup/provider/others', element: <OthersSignup /> },
  { path: '/patient-dashboard', element: (
    <ProtectedRoute allowRoles={['patient']}>
      <PatientDashboard />
    </ProtectedRoute>
  ) },
  { path: '/profile', element: (
    <ProtectedRoute allowRoles={['patient','provider']}>
      <Profile />
    </ProtectedRoute>
  ) },
  { path: '/provider-dashboard', element: (
    <ProtectedRoute allowRoles={['provider']}>
      <ProviderDashboard />
    </ProtectedRoute>
  ) },
  { path: '/dev/seed-clinic', element: (
    <ProtectedRoute allowRoles={['provider']}>
      <SeedClinic />
    </ProtectedRoute>
  ) }
  ,{ path: '/dev/seed-therapy', element: (
    <ProtectedRoute allowRoles={['provider']}>
      <SeedTherapy />
    </ProtectedRoute>
  ) }
  ,{ path: '/dev/seed-others', element: (
    <ProtectedRoute allowRoles={['provider']}>
      <SeedOthers />
    </ProtectedRoute>
  ) }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
