import { useState } from 'react'
import '../css/dashboard.css'

const SIDEBAR_ITEMS = [
  { id: 'Dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'My Pets', label: 'My Pets', icon: '🐾' },
  { id: 'Appointment History', label: 'Appointment History', icon: '📅' },
  { id: 'Medical Records', label: 'Medical Records', icon: '📋' },
  { id: 'Profile', label: 'Profile', icon: '👤' },
]

const PAGE_DESCRIPTIONS = {
  'My Pets': 'Manage pet profiles, photos, vaccines, and basic health details.',
  'Appointment History': 'Review upcoming, completed, and cancelled appointments.',
  'Medical Records': 'Browse diagnosis, prescriptions, reports, and treatment updates.',
  Profile: 'Update owner details, preferences, and account settings.',
}

const PETS = [
  {
    name: 'Bella',
    breed: 'Golden Retriever',
    age: '3 years',
    weight: '24 kg',
    vaccinationStatus: 'Up to date',
  },
  {
    name: 'Max',
    breed: 'Pomeranian',
    age: '2 years',
    weight: '7 kg',
    vaccinationStatus: 'Booster due Mar 22',
  },
]

const APPOINTMENTS = [
  { id: 'A-1001', date: 'Mar 18, 2026', doctorName: 'Dr. Sarah Khan', status: 'Completed' },
  { id: 'A-1002', date: 'Mar 22, 2026', doctorName: 'Dr. Michael Reed', status: 'Pending' },
  { id: 'A-1003', date: 'Mar 25, 2026', doctorName: 'Dr. Olivia Grant', status: 'Cancelled' },
]

const MEDICAL_RECORD_SECTIONS = [
  { title: 'Diagnosis', text: 'Max: Skin allergy follow-up with anti-inflammatory treatment plan.' },
  { title: 'Prescriptions', text: 'Cetirizine 5mg daily for 7 days and medicated shampoo twice weekly.' },
  { title: 'Lab Results', text: 'CBC normal range, mild eosinophilia observed, stool test negative.' },
  { title: 'Vaccination Records', text: 'Rabies completed, DHPP booster due on Mar 22, 2026.' },
]

function DashboardCards() {
  return (
    <div className="po-card-grid">
      <article className="po-card">
        <h3>Upcoming Appointment</h3>
        <ul className="po-detail-list">
          <li>
            <span>Pet</span>
            <strong>Bella</strong>
          </li>
          <li>
            <span>Doctor</span>
            <strong>Dr. Sarah Khan</strong>
          </li>
          <li>
            <span>Date & Time</span>
            <strong>Mar 18, 10:30 AM</strong>
          </li>
        </ul>
      </article>

      <article className="po-card">
        <h3>Pet Vaccination Reminders</h3>
        <ul className="po-note-list">
          <li>Bella: Rabies booster due in 5 days.</li>
          <li>Max: DHPP shot due on Mar 22.</li>
          <li>Pluto: Annual check and vaccine renewal pending.</li>
        </ul>
      </article>

      <article className="po-card">
        <h3>Recent Medical Record</h3>
        <ul className="po-detail-list">
          <li>
            <span>Pet</span>
            <strong>Max</strong>
          </li>
          <li>
            <span>Diagnosis</span>
            <strong>Skin Allergy Follow-up</strong>
          </li>
          <li>
            <span>Updated</span>
            <strong>Mar 10, 2026</strong>
          </li>
        </ul>
      </article>

      <article className="po-card">
        <h3>Quick Buttons</h3>
        <div className="po-quick-actions">
          <button type="button">Book Appointment</button>
          <button type="button">Add Pet</button>
        </div>
      </article>

      <article className="po-card">
        <h3>Notifications</h3>
        <ul className="po-note-list">
          <li>Appointment confirmed for Bella with Dr. Sarah Khan.</li>
          <li>Medical report uploaded for Max.</li>
          <li>Reminder: Complete profile details for faster booking.</li>
        </ul>
      </article>
    </div>
  )
}

function MyPetsPage() {
  return (
    <section className="po-mypets">
      <article className="po-card">
        <h3>My Pets</h3>
        <p className="po-mypets-subtitle">
          Add new pet, edit pet information, delete pet, upload pet photo, and review basic pet details.
        </p>
        <button type="button" className="po-mypets-add-btn">
          Add New Pet
        </button>
      </article>

      <div className="po-mypets-grid">
        {PETS.map((pet) => (
          <article key={pet.name} className="po-card po-mypet-card">
            <h3>{pet.name}</h3>

            <div className="po-mypet-actions">
              <button type="button">Edit Pet Information</button>
              <button type="button">Delete Pet</button>
              <button type="button">Upload Pet Photo</button>
            </div>

            <ul className="po-detail-list">
              <li>
                <span>Name</span>
                <strong>{pet.name}</strong>
              </li>
              <li>
                <span>Breed</span>
                <strong>{pet.breed}</strong>
              </li>
              <li>
                <span>Age</span>
                <strong>{pet.age}</strong>
              </li>
              <li>
                <span>Weight</span>
                <strong>{pet.weight}</strong>
              </li>
              <li>
                <span>Vaccination Status</span>
                <strong>{pet.vaccinationStatus}</strong>
              </li>
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function AppointmentHistoryPage() {
  return (
    <section className="po-mypets">
      <article className="po-card">
        <h3>Appointment History</h3>
        <p className="po-mypets-subtitle">Track all appointments with doctor and status details.</p>
      </article>

      <article className="po-card">
        <div className="po-history-head">
          <span>Date</span>
          <span>Doctor Name</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <ul className="po-history-list">
          {APPOINTMENTS.map((item) => (
            <li key={item.id}>
              <span>{item.date}</span>
              <strong>{item.doctorName}</strong>
              <em className={`po-status po-status-${item.status.toLowerCase()}`}>{item.status}</em>
              <button type="button">View Details</button>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function MedicalRecordsPage() {
  return (
    <section className="po-mypets">
      <article className="po-card">
        <h3>Medical Records</h3>
        <p className="po-mypets-subtitle">View diagnosis, prescriptions, lab reports, and vaccination history.</p>
      </article>

      <article className="po-card">
        <ul className="po-record-list">
          {MEDICAL_RECORD_SECTIONS.map((item) => (
            <li key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
        <button type="button" className="po-record-download">
          Download PDF
        </button>
      </article>
    </section>
  )
}

function ProfilePage() {
  return (
    <section className="po-mypets">
      <article className="po-card">
        <h3>Profile</h3>
        <p className="po-mypets-subtitle">Manage your account settings and preferences.</p>
      </article>

      <article className="po-card">
        <ul className="po-profile-list">
          <li>
            <div>
              <h4>Edit Personal Info</h4>
              <p>Update name, phone number, email, and address details.</p>
            </div>
            <button type="button">Edit</button>
          </li>
          <li>
            <div>
              <h4>Change Password</h4>
              <p>Set a new password to keep your account secure.</p>
            </div>
            <button type="button">Change</button>
          </li>
          <li>
            <div>
              <h4>Notification Preferences</h4>
              <p>Choose reminders for appointments, vaccines, and updates.</p>
            </div>
            <button type="button">Manage</button>
          </li>
        </ul>
      </article>
    </section>
  )
}

export default function PetOwnerDashboard({ role, onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard')
  const isPetOwner = role === 'pet-owner' || !role

  return (
    <main className="po-screen">
      <section className="po-stage">
        <header className="po-hero">
          <div className="po-hero-dots" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="po-hero-title">🐶  🐕  🐾  🐩  🐕‍🦺  🐶</p>
          <p className="po-hero-subtitle">Pet Owner Dashboard</p>
        </header>

        <section className="po-panel">
          <aside className="po-sidebar">
            <p className="po-sidebar-brand">PawEver</p>
            <nav aria-label="Pet owner navigation">
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={`po-side-link${activePage === item.id ? ' is-active' : ''}`}
                  type="button"
                  onClick={() => setActivePage(item.id)}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="po-side-illustration" aria-hidden="true">
              <span>🐈</span>
            </div>
          </aside>

          <div className="po-main">
            <div className="po-main-top">
              <button className="po-add-pet" type="button">
                Add A Pet
              </button>
              <button className="po-profile" type="button" onClick={onLogout}>
                <strong>Logout</strong>
              </button>
            </div>

            {isPetOwner ? (
              activePage === 'Dashboard' ? (
                <DashboardCards />
              ) : activePage === 'My Pets' ? (
                <MyPetsPage />
              ) : activePage === 'Appointment History' ? (
                <AppointmentHistoryPage />
              ) : activePage === 'Medical Records' ? (
                <MedicalRecordsPage />
              ) : activePage === 'Profile' ? (
                <ProfilePage />
              ) : (
                <section className="po-placeholder">
                  <h2>{activePage}</h2>
                  <p>{PAGE_DESCRIPTIONS[activePage] || 'This section is ready for your next feature.'}</p>
                </section>
              )
            ) : (
              <section className="po-placeholder">
                <h2>Access Limited</h2>
                <p>Pet Owner pages are available only for the Pet Owner role.</p>
              </section>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}
