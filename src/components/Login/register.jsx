import '../../styles/login/register.css'
import logoImage from '../../../images/Web_Logo.png'

export default function Register({ onBack, onCreate }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const role = formData.get('register-role')
    onCreate(role)
  }

  return (
    <main className="register-screen">
      <section className="register-card">
        <img className="register-logo" src={logoImage} alt="PawEver logo" />
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">Set up your profile to get started with PawEver.</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <fieldset className="register-role-group">
            <legend className="register-label">I am registering as</legend>
            <div className="register-role-options">
              <label className="register-role-option">
                <input defaultChecked name="register-role" type="radio" value="pet-owner" />
                <span>Pet Owner</span>
              </label>
              <label className="register-role-option">
                <input name="register-role" type="radio" value="doctor" />
                <span>Doctor</span>
              </label>
              <label className="register-role-option">
                <input name="register-role" type="radio" value="staff" />
                <span>Staff</span>
              </label>
            </div>
          </fieldset>

          <label className="register-label" htmlFor="name">
            Full Name
          </label>
          <input
            className="register-input"
            id="name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />

          <label className="register-label" htmlFor="register-email">
            Email
          </label>
          <input
            className="register-input"
            id="register-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label className="register-label" htmlFor="register-password">
            Password
          </label>
          <input
            className="register-input"
            id="register-password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            required
          />

          <label className="register-label" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            className="register-input"
            id="confirm-password"
            type="password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
          />

          <label className="terms-row">
            <input required type="checkbox" />
            <span>I agree to the terms and privacy policy.</span>
          </label>

          <button className="register-submit-btn" type="submit">
            Create Account
          </button>
          <p className="register-form-note">You can update your profile and pet details any time.</p>
        </form>

        <button className="register-back-btn" type="button" onClick={onBack}>
          Back to options
        </button>
      </section>
    </main>
  )
}
