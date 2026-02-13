import './App.css'
import { useState } from 'react'
import Login from './components/Login/login'
import LoginOption from './components/Login/loginoption'
import Register from './components/Login/register'
import PetOwnerDashboard from './components/PetOwner/dashboard'

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
          goToScreen(nextRole === 'pet-owner' ? 'dashboard' : 'options')
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
          goToScreen(nextRole === 'pet-owner' ? 'dashboard' : 'options')
        }}
      />
    )
  }

  if (screen === 'dashboard') {
    currentPage = <PetOwnerDashboard role={role} onLogout={() => goToScreen('options')} />
  }

  return currentPage
}
