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
        onContinue={(selectedRole) => {
          const nextRole = selectedRole || 'pet-owner'
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
        onCreate={(selectedRole) => {
          const nextRole = selectedRole || 'pet-owner'
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
    currentPage = <PetOwnerDashboard role={role} onLogout={() => goToScreen('options')} />
  }

  if (screen === 'doctor-dashboard') {
    currentPage = <DoctorDashboard onLogout={() => goToScreen('options')} />
  }

  if (screen === 'staff-dashboard') {
    currentPage = <StaffDashboard onLogout={() => goToScreen('options')} />
  }

  return currentPage
}
