import '../../styles/login/loginoption.css'
import logoImage from '../../../images/Web_Logo.png'

export default function LoginOption({ onLoginClick, onCreateAccountClick }) {
  return (
    <main className="login-screen">
      <section className="login-card">
        <img className="login-logo-icon" src={logoImage} alt="PawEver logo" />
        <p className="login-greeting">Hey! Welcome</p>
        <p className="login-subtitle">Create your account and start caring for your pets.</p>
        <button
          className="register-btn"
          type="button"
          aria-label="Create a new account"
          onClick={onCreateAccountClick}
        >
          <span className="register-btn-label">Create Account</span>
          <span className="register-btn-arrow" aria-hidden="true">
            ›
          </span>
        </button>
        <p className="login-question">Already have an account?</p>
        <button
          className="login-link-btn"
          type="button"
          aria-label="Log in to your account"
          onClick={onLoginClick}
        >
          Log In
        </button>
      </section>
    </main>
  )
}
