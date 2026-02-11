import '../../styles/login/register.css'
import logoImage from '../../../images/Web_Logo.png'

export default function Register({ onBack }) {
  return (
    <main className="register-screen">
      <section className="register-card">
        <img className="register-logo" src={logoImage} alt="PawEver logo" />
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">Set up your profile to get started with PawEver.</p>

        <form className="register-form" onSubmit={(event) => event.preventDefault()}>
          <label className="register-label" htmlFor="name">
            Full Name
          </label>
          <input className="register-input" id="name" type="text" placeholder="Enter your full name" />

          <label className="register-label" htmlFor="register-email">
            Email
          </label>
          <input
            className="register-input"
            id="register-email"
            type="email"
            placeholder="you@example.com"
          />

          <label className="register-label" htmlFor="register-password">
            Password
          </label>
          <input
            className="register-input"
            id="register-password"
            type="password"
            placeholder="Create a password"
          />

          <label className="register-label" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            className="register-input"
            id="confirm-password"
            type="password"
            placeholder="Repeat your password"
          />

          <button className="register-submit-btn" type="submit">
            Create Account
          </button>
        </form>

        <button className="register-back-btn" type="button" onClick={onBack}>
          Back to options
        </button>
      </section>
    </main>
  )
}
