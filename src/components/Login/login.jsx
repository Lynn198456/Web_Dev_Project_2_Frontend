import '../../styles/login/login.css'
import logoImage from '../../../images/Web_Logo.png'

export default function Login({ onBack }) {
  return (
    <main className="login-form-screen">
      <section className="login-form-card">
        <img className="login-form-logo" src={logoImage} alt="PawEver logo" />
        <h1 className="login-form-title">Log In</h1>
        <p className="login-form-subtitle">Welcome back. Enter your account details.</p>

        <form className="login-form" onSubmit={(event) => event.preventDefault()}>
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
          <input className="login-form-input" id="email" type="email" placeholder="you@example.com" />

          <label className="login-form-label" htmlFor="password">
            Password
          </label>
          <input className="login-form-input" id="password" type="password" placeholder="Enter your password" />

          <button className="login-submit-btn" type="submit">
            Continue
          </button>
        </form>

        <button className="login-back-btn" type="button" onClick={onBack}>
          Back to options
        </button>
      </section>
    </main>
  )
}
