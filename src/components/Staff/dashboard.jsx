import { useState } from 'react'
import '../../styles/staff/dashboard.css'

const STAFF_PAGES = [
  'Dashboard',
  'Appointment Management',
  'Pet Owner Management',
  'Billing & Payments',
  'Profile',
]

const STAFF_CONTENT = {
  Dashboard: {
    subtitle: 'Track appointments, owner requests, and payment updates in one place.',
    cards: [],
  },
  'Appointment Management': {
    subtitle: 'Manage booking queue, reschedules, and cancellations.',
    cards: [
      { title: 'Upcoming Bookings', text: 'Review and confirm next appointment slots.' },
      { title: 'Reschedule Requests', text: 'Handle owner-requested schedule changes.' },
      { title: 'Cancelled Visits', text: 'Monitor cancelled records and reasons.' },
      { title: 'Doctor Assignment', text: 'Assign available doctor to open slots.' },
    ],
  },
  'Pet Owner Management': {
    subtitle: 'Manage owner accounts and pet registration records.',
    cards: [
      { title: 'New Owners', text: 'Approve new owner account registrations.' },
      { title: 'Owner Profiles', text: 'Update contact details and account status.' },
      { title: 'Pet Records', text: 'Review linked pet details per owner.' },
      { title: 'Verification', text: 'Resolve duplicate or incomplete records.' },
    ],
  },
  'Billing & Payments': {
    subtitle: 'Handle invoices, payments, and billing history.',
    cards: [
      { title: 'Generate Invoice', text: 'Create invoice after consultation completion.' },
      { title: 'Payment Status', text: 'Track paid, pending, and overdue payments.' },
      { title: 'Refund Requests', text: 'Review and process refund tickets.' },
      { title: 'Reports', text: 'Export daily and weekly payment reports.' },
    ],
  },
  Profile: {
    subtitle: 'Manage staff profile and security settings.',
    cards: [
      { title: 'Edit Profile', text: 'Update name, phone, and email information.' },
      { title: 'Change Password', text: 'Rotate password for account safety.' },
      { title: 'Notification Settings', text: 'Choose alerts for appointments and payments.' },
      { title: 'Access Logs', text: 'Review account activity history.' },
    ],
  },
}

const STAFF_DASHBOARD_METRICS = [
  { title: 'Today’s Total Appointments', value: '18', note: 'Scheduled today' },
  { title: 'Pending Appointment Requests', value: '6', note: 'Awaiting confirmation' },
  { title: 'Total Doctors Available', value: '9', note: 'On active shift' },
  { title: 'Walk-in Patients', value: '5', note: 'Checked in today' },
  { title: 'Payment Summary (Today)', value: '$2,450', note: 'Collected payments' },
]

const STAFF_APPOINTMENTS = [
  { id: 'AP-1001', date: '2026-03-18', doctor: 'Dr. Sarah Khan', status: 'Pending', petOwner: 'Jonathan Smith' },
  { id: 'AP-1002', date: '2026-03-18', doctor: 'Dr. Michael Reed', status: 'Confirmed', petOwner: 'Emma Davis' },
  { id: 'AP-1003', date: '2026-03-19', doctor: 'Dr. Sarah Khan', status: 'Completed', petOwner: 'Noah Patel' },
  { id: 'AP-1004', date: '2026-03-20', doctor: 'Dr. Olivia Grant', status: 'Cancelled', petOwner: 'Sophia Lee' },
]

const PET_OWNERS = [
  { id: 'OWN-1001', name: 'Jonathan Smith', phone: '+1 (555) 222-9011', pets: 2, status: 'Active' },
  { id: 'OWN-1002', name: 'Emma Davis', phone: '+1 (555) 103-7724', pets: 1, status: 'Active' },
  { id: 'OWN-1003', name: 'Noah Patel', phone: '+1 (555) 804-6652', pets: 3, status: 'Active' },
]

export default function StaffDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard')
  const [filterDate, setFilterDate] = useState('')
  const [filterDoctor, setFilterDoctor] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const activeContent = STAFF_CONTENT[activePage] || STAFF_CONTENT.Dashboard
  const filteredAppointments = STAFF_APPOINTMENTS.filter((item) => {
    const dateMatch = !filterDate || item.date === filterDate
    const doctorMatch = filterDoctor === 'All' || item.doctor === filterDoctor
    const statusMatch = filterStatus === 'All' || item.status === filterStatus
    return dateMatch && doctorMatch && statusMatch
  })

  return (
    <main className="st-screen">
      <section className="st-shell">
        <aside className="st-sidebar">
          <h1>PawEver Staff</h1>
          <nav aria-label="Staff navigation">
            {STAFF_PAGES.map((page) => (
              <button
                key={page}
                className={`st-nav-btn${activePage === page ? ' is-active' : ''}`}
                type="button"
                onClick={() => setActivePage(page)}
              >
                {page}
              </button>
            ))}
          </nav>
          <button className="st-logout" type="button" onClick={onLogout}>
            Logout
          </button>
        </aside>

        <section className="st-main">
          <header className="st-header">
            <h2>{activePage}</h2>
            <p>{activeContent.subtitle}</p>
          </header>

          {activePage === 'Dashboard' ? (
            <div className="st-grid">
              {STAFF_DASHBOARD_METRICS.map((item) => (
                <article key={item.title} className="st-card st-metric-card">
                  <h3>{item.title}</h3>
                  <p className="st-metric-value">{item.value}</p>
                  <p>{item.note}</p>
                </article>
              ))}

              <article className="st-card st-quick-card">
                <h3>Quick Buttons</h3>
                <div className="st-quick-actions">
                  <button type="button">Add Appointment</button>
                  <button type="button">Register Pet Owner</button>
                </div>
              </article>
            </div>
          ) : activePage === 'Appointment Management' ? (
            <div className="st-appointments">
              <article className="st-card st-quick-card">
                <h3>Add Walk-in Appointment</h3>
                <button type="button" className="st-plain-btn">
                  Add Walk-in Appointment
                </button>
              </article>

              <article className="st-card">
                <h3>Filters</h3>
                <div className="st-filters">
                  <label>
                    Date
                    <input type="date" value={filterDate} onChange={(event) => setFilterDate(event.target.value)} />
                  </label>
                  <label>
                    Doctor
                    <select value={filterDoctor} onChange={(event) => setFilterDoctor(event.target.value)}>
                      <option value="All">All</option>
                      <option value="Dr. Sarah Khan">Dr. Sarah Khan</option>
                      <option value="Dr. Michael Reed">Dr. Michael Reed</option>
                      <option value="Dr. Olivia Grant">Dr. Olivia Grant</option>
                    </select>
                  </label>
                  <label>
                    Status
                    <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                      <option value="All">All</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </label>
                </div>
              </article>

              <article className="st-card">
                <h3>View All Appointments</h3>
                <ul className="st-appointment-list">
                  {filteredAppointments.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.id}</strong>
                        <p>
                          {item.date} | {item.petOwner}
                        </p>
                        <p>
                          {item.doctor} | {item.status}
                        </p>
                      </div>
                      <div className="st-appointment-actions">
                        <button type="button">Confirm</button>
                        <button type="button">Cancel</button>
                        <button type="button">Reschedule</button>
                        <button type="button">Assign Doctor</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ) : activePage === 'Pet Owner Management' ? (
            <div className="st-appointments">
              <article className="st-card">
                <h3>Register New Pet Owner</h3>
                <div className="st-filters">
                  <label>
                    Full Name
                    <input type="text" placeholder="Enter owner name" />
                  </label>
                  <label>
                    Phone Number
                    <input type="tel" placeholder="Enter phone number" />
                  </label>
                  <label>
                    Email
                    <input type="email" placeholder="Enter email address" />
                  </label>
                </div>
                <button type="button" className="st-plain-btn">
                  Register New Pet Owner
                </button>
              </article>

              <article className="st-card">
                <h3>Pet Owner Management</h3>
                <ul className="st-appointment-list">
                  {PET_OWNERS.map((owner) => (
                    <li key={owner.id}>
                      <div>
                        <strong>
                          {owner.id} - {owner.name}
                        </strong>
                        <p>
                          {owner.phone} | Pets: {owner.pets}
                        </p>
                        <p>Status: {owner.status}</p>
                      </div>
                      <div className="st-appointment-actions">
                        <button type="button">Edit Owner Details</button>
                        <button type="button">View Profile</button>
                        <button type="button">View Owner’s Pets</button>
                        <button type="button">Deactivate Account</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ) : (
            <div className="st-grid">
              {activeContent.cards.map((card) => (
                <article key={card.title} className="st-card">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
