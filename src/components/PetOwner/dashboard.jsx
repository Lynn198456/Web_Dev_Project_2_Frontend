import { useMemo, useState } from 'react'
import '../../styles/petowner/dashboard.css'

const PAGES = [
  'Dashboard',
  'My Pets',
  'Book Appointment',
  'Appointment History',
  'Medical Records',
  'Profile',
]

const PAGE_CONTENT = {
  Dashboard: {
    title: 'Dashboard Overview',
    subtitle: 'Track appointments, reminders, and recent updates at a glance.',
    cards: [
      { title: 'Upcoming Appointment', text: 'Dr. Sarah Khan - Mar 18, 10:30 AM', action: 'View details' },
      { title: 'Vaccination Reminder', text: 'Bella: Rabies booster due in 5 days', action: 'Open reminders' },
      { title: 'Recent Medical Record', text: 'Max: Skin allergy treatment updated', action: 'Read record' },
      { title: 'Quick Actions', text: 'Book appointment or add a new pet profile', action: 'Start now' },
    ],
  },
  'My Pets': {
    title: 'My Pets',
    subtitle: 'Manage pet profiles with complete health basics and photos.',
    cards: [
      { title: 'Add New Pet', text: 'Create a profile with breed, age, weight, and status.', action: 'Add pet' },
      { title: 'Edit Pet Information', text: 'Update existing pet details any time.', action: 'Edit profile' },
      { title: 'Upload Pet Photo', text: 'Keep clear identification photos for records.', action: 'Upload photo' },
      { title: 'Vaccination Status', text: 'Review completed and pending vaccines.', action: 'Check status' },
    ],
  },
  'Book Appointment': {
    title: 'Book Appointment',
    subtitle: 'Schedule a clinic visit quickly using available time slots.',
    cards: [
      { title: 'Select Pet', text: 'Choose which pet needs consultation.', action: 'Choose pet' },
      { title: 'Select Doctor', text: 'Pick your preferred doctor or specialty.', action: 'Choose doctor' },
      { title: 'Choose Date & Time', text: 'View open slots and confirm instantly.', action: 'Pick slot' },
      { title: 'Reason for Visit', text: 'Add symptoms or notes before booking.', action: 'Add reason' },
    ],
  },
  'Appointment History': {
    title: 'Appointment History',
    subtitle: 'Review all past and upcoming visits by date and status.',
    cards: [
      { title: 'Completed Visits', text: 'Access treatment summaries and notes.', action: 'View completed' },
      { title: 'Pending Visits', text: 'Check upcoming appointments and details.', action: 'View pending' },
      { title: 'Cancelled Visits', text: 'Track cancelled sessions and reasons.', action: 'View cancelled' },
      { title: 'Doctor Details', text: 'See doctor name and consultation details.', action: 'Open details' },
    ],
  },
  'Medical Records': {
    title: 'Medical Records',
    subtitle: 'View diagnosis, prescriptions, lab reports, and vaccine files.',
    cards: [
      { title: 'Diagnosis History', text: 'Chronological record of all diagnoses.', action: 'View diagnosis' },
      { title: 'Prescriptions', text: 'Medicine list, dose, and instructions.', action: 'View prescriptions' },
      { title: 'Lab Results', text: 'Test reports and findings in one place.', action: 'Open reports' },
      { title: 'Download PDF', text: 'Export records for offline access.', action: 'Download file' },
    ],
  },
  Profile: {
    title: 'Profile',
    subtitle: 'Manage personal details, security, and account preferences.',
    cards: [
      { title: 'Edit Personal Info', text: 'Update your name, email, and contact.', action: 'Edit profile' },
      { title: 'Change Password', text: 'Keep your account secure regularly.', action: 'Update password' },
      { title: 'Notification Preferences', text: 'Control reminders and alerts.', action: 'Manage notifications' },
      { title: 'Logout', text: 'Sign out safely from your account.', action: 'Sign out' },
    ],
  },
}

export default function PetOwnerDashboard({ role, onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard')
  const isPetOwner = role === 'pet-owner' || !role
  const activeContent = useMemo(() => PAGE_CONTENT[activePage], [activePage])

  return (
    <main className="po-screen">
      <section className="po-shell">
        <header className="po-header">
          <div>
            <p className="po-kicker">Pet Owner Module</p>
            <h1 className="po-title">PawEver</h1>
          </div>
          <button className="po-logout" type="button" onClick={onLogout}>
            Back
          </button>
        </header>

        {isPetOwner ? (
          <>
            <nav className="po-nav" aria-label="Pet owner pages">
              {PAGES.map((page) => (
                <button
                  key={page}
                  className={`po-nav-btn${activePage === page ? ' is-active' : ''}`}
                  type="button"
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </button>
              ))}
            </nav>

            <section className="po-content">
              <h2 className="po-content-title">{activeContent.title}</h2>
              <p className="po-content-subtitle">{activeContent.subtitle}</p>
              <div className="po-grid">
                {activeContent.cards.map((card) => (
                  <article key={card.title} className="po-card">
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    <button type="button">{card.action}</button>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="po-empty">
            Pet Owner pages are available only for the Pet Owner role.
          </section>
        )}
      </section>
    </main>
  )
}
