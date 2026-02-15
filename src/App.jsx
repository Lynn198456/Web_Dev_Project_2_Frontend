import './App.css'
import { useState } from 'react'
import Login from './parts/Login/jsx/login'
import LoginOption from './parts/Login/jsx/loginoption'
import Register from './parts/Login/jsx/register'
import PetOwnerDashboard from './parts/PetOwner/jsx/dashboard'
import DoctorDashboard from './parts/Doctor/jsx/dashboard'
import StaffDashboard from './parts/Staff/jsx/dashboard'

export default function App() {
  const [screen, setScreen] = useState('options')
  const [role, setRole] = useState('pet-owner')
  const [currentUser, setCurrentUser] = useState(null)

  const goToScreen = (nextScreen) => {
    setScreen(nextScreen)
  }

  let currentPage = (
    <LoginOption onLoginClick={() => goToScreen('login')} onCreateAccountClick={() => goToScreen('register')} />
  )

  if (screen === 'login') {
    currentPage = (
      <Login
        onBack={() => goToScreen('options')}
        onContinue={(user) => {
          const nextRole = user?.role || 'pet-owner'
          setCurrentUser(user || null)
          setRole(nextRole)
          goToScreen(
            nextRole === 'pet-owner'
              ? 'dashboard'
              : nextRole === 'doctor'
                ? 'doctor-dashboard'
                : nextRole === 'staff'
                  ? 'staff-dashboard'
                  : 'options'
          )
        }}
      />
    )
  }

  if (screen === 'register') {
    currentPage = (
      <Register
        onBack={() => goToScreen('options')}
        onCreate={(user) => {
          const nextRole = user?.role || 'pet-owner'
          setCurrentUser(user || null)
          setRole(nextRole)
          goToScreen(
            nextRole === 'pet-owner'
              ? 'dashboard'
              : nextRole === 'doctor'
                ? 'doctor-dashboard'
                : nextRole === 'staff'
                  ? 'staff-dashboard'
                  : 'options'
          )
        }}
      />
    )
  }

  if (screen === 'dashboard') {
    currentPage = (
      <PetOwnerDashboard
        role={role}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null)
          goToScreen('options')
        }}
      />
    )
  }

  if (screen === 'doctor-dashboard') {
    currentPage = (
      <DoctorDashboard
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null)
          goToScreen('options')
        }}
      />
    )
  }

  if (screen === 'staff-dashboard') {
    currentPage = (
      <StaffDashboard
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null)
          goToScreen('options')
        }}
      />
    )
  }

  return currentPage
}
