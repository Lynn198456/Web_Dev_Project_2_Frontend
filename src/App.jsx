import './App.css'
import { useState } from 'react'
import Login from './components/Login/login'
import LoginOption from './components/Login/loginoption'
import Register from './components/Login/register'

export default function App() {
  const [screen, setScreen] = useState('options')

  if (screen === 'login') {
    return <Login onBack={() => setScreen('options')} />
  }

  if (screen === 'register') {
    return <Register onBack={() => setScreen('options')} />
  }

  return (
    <LoginOption
      onLoginClick={() => setScreen('login')}
      onCreateAccountClick={() => setScreen('register')}
    />
  )
}
