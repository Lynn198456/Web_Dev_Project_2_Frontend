import '../../styles/login/login.css'
import logoImage from '../../../images/Web_Logo.png'

export default function Login({ onBack, onContinue }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const role = formData.get('login-role')
    onContinue(role)
  }

  return (
    <main className="login-form-screen">
      <section className="login-form-card">
        <img className="login-form-logo" src={logoImage} alt="PawEver logo" />
        <h1 className="login-form-title">Log In</h1>
        <p className="login-form-subtitle">Welcome back. Enter your account details.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <fieldset className="login-role-group">
            <legend className="login-form-label">I am a</legend>
            <div className="login-role-options">
              <label className="login-role-option">
                <input defaultChecked name="login-role" type="radio" value="pet-owner" />
                <span>Pet Owner</span>
              </label>
              <label className="login-role-option">
                <input name="login-role" type="radio" value="doctor" />
                <span>Doctor</span>
              </label>
              <label className="login-role-option">
                <input name="login-role" type="radio" value="staff" />
                <span>Staff</span>
              </label>
            </div>
          </fieldset>

          <label className="login-form-label" htmlFor="email">
            Email
          </label>
          <input
            className="login-form-input"
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label className="login-form-label" htmlFor="password">
            Password
          </label>
          <input
            className="login-form-input"
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <div className="login-form-meta">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <button className="forgot-link-btn" type="button">
              Forgot password?
            </button>
          </div>

          <button className="login-submit-btn" type="submit">
            Continue
          </button>
          <p className="login-form-note">Secure login protected with encrypted sessions.</p>
        </form>

        <button className="login-back-btn" type="button" onClick={onBack}>
          Back to options
        </button>
      </section>
    </main>
  )
}
