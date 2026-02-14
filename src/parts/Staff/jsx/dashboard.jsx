import { useState } from 'react'
import '../css/dashboard.css'

const STAFF_PAGES = [
  'Dashboard',
  'Appointment Management',
  'Pet Owner Management',
  'Pet Records',
  'Doctor Schedule Management',
  'Reports & Analytics',
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
  'Pet Records': {
    subtitle: 'View and manage registered pet information and records.',
    cards: [
      { title: 'All Pets', text: 'Browse all registered pets and owner mapping.' },
      { title: 'Pet Profile Updates', text: 'Edit breed, age, weight, and vaccine details.' },
      { title: 'Record Validation', text: 'Resolve duplicate pet records and missing fields.' },
      { title: 'Medical Snapshot', text: 'Quick view of recent diagnosis and vaccine status.' },
    ],
  },
  'Doctor Schedule Management': {
    subtitle: 'Manage doctor shifts, leave blocks, and availability.',
    cards: [
      { title: 'Shift Planner', text: 'Assign doctors to clinic shift slots.' },
      { title: 'Leave Requests', text: 'Review and approve leave submissions.' },
      { title: 'Availability Calendar', text: 'Monitor available and blocked consultation hours.' },
      { title: 'Coverage Alerts', text: 'Identify overlapping or uncovered shifts.' },
    ],
  },
  'Reports & Analytics': {
    subtitle: 'Track operational metrics and clinic performance reports.',
    cards: [
      { title: 'Daily Summary', text: 'Appointments, walk-ins, and completed visits.' },
      { title: 'Revenue Trends', text: 'Daily and weekly billing and collection insights.' },
      { title: 'Doctor Performance', text: 'Consultation load and completion metrics.' },
      { title: 'Export Reports', text: 'Download analytics in CSV/PDF format.' },
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

const STAFF_PET_RECORDS = [
  {
    id: 'PET-1001',
    name: 'Bella',
    weight: '24 kg',
    vaccinationDate: '2026-03-18',
    history: 'Regular wellness check completed. Vaccination up to date.',
  },
  {
    id: 'PET-1002',
    name: 'Max',
    weight: '7 kg',
    vaccinationDate: '2026-03-22',
    history: 'Follow-up visit done. Weight and vaccine schedule reviewed.',
  },
]

const DOCTOR_AVAILABILITY = [
  { doctor: 'Dr. Sarah Khan', slot: '09:00 AM - 05:00 PM', status: 'Available' },
  { doctor: 'Dr. Michael Reed', slot: '10:00 AM - 06:00 PM', status: 'Available' },
  { doctor: 'Dr. Olivia Grant', slot: '09:30 AM - 03:30 PM', status: 'Partially Available' },
]

const EMERGENCY_SLOTS = ['11:30 AM - 12:00 PM (Dr. Sarah Khan)', '04:30 PM - 05:00 PM (Dr. Michael Reed)']

const STAFF_REPORT_METRICS = [
  { title: 'Daily Income', value: '$2,450', note: 'Today collected amount' },
  { title: 'Monthly Income', value: '$58,920', note: 'Current month total' },
  { title: 'Most Visited Doctor', value: 'Dr. Sarah Khan', note: 'Highest appointment count' },
  { title: 'Most Common Pet Illness', value: 'Skin Allergy', note: 'Top diagnosis trend' },
  { title: 'Total Appointments Per Month', value: '512', note: 'Appointments this month' },
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
          ) : activePage === 'Pet Records' ? (
            <div className="st-appointments">
              <article className="st-card">
                <h3>Add Pet Basic Information</h3>
                <div className="st-filters">
                  <label>
                    Pet ID
                    <input type="text" placeholder="Enter pet ID" />
                  </label>
                  <label>
                    Pet Name
                    <input type="text" placeholder="Enter pet name" />
                  </label>
                  <label>
                    Breed
                    <input type="text" placeholder="Enter breed" />
                  </label>
                </div>
                <button type="button" className="st-plain-btn">
                  Add Pet Basic Information
                </button>
              </article>

              <article className="st-card">
                <h3>Pet Records</h3>
                <ul className="st-appointment-list">
                  {STAFF_PET_RECORDS.map((pet) => (
                    <li key={pet.id}>
                      <div>
                        <strong>
                          {pet.id} - {pet.name}
                        </strong>
                        <p>Weight: {pet.weight}</p>
                        <p>Vaccination Date: {pet.vaccinationDate}</p>
                        <p>History (Read-only): {pet.history}</p>
                      </div>
                      <div className="st-appointment-actions">
                        <button type="button">Update Weight</button>
                        <button type="button">Update Vaccination Date</button>
                        <button type="button">Upload Documents</button>
                        <button type="button">View Pet History</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="st-card st-restriction-card">
                <h3>Access Restriction</h3>
                <p>Staff cannot add diagnosis or prescription. These actions are doctor-only permissions.</p>
              </article>
            </div>
          ) : activePage === 'Doctor Schedule Management' ? (
            <div className="st-appointments">
              <article className="st-card">
                <h3>View Doctor Availability</h3>
                <ul className="st-appointment-list">
                  {DOCTOR_AVAILABILITY.map((entry) => (
                    <li key={`${entry.doctor}-${entry.slot}`}>
                      <div>
                        <strong>{entry.doctor}</strong>
                        <p>{entry.slot}</p>
                        <p>Status: {entry.status}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="st-card">
                <h3>Block Unavailable Time</h3>
                <div className="st-filters">
                  <label>
                    Doctor
                    <select>
                      <option>Dr. Sarah Khan</option>
                      <option>Dr. Michael Reed</option>
                      <option>Dr. Olivia Grant</option>
                    </select>
                  </label>
                  <label>
                    Date
                    <input type="date" />
                  </label>
                  <label>
                    Time Range
                    <input type="text" placeholder="e.g. 01:00 PM - 02:00 PM" />
                  </label>
                </div>
                <button type="button" className="st-plain-btn">
                  Block Time
                </button>
              </article>

              <article className="st-card">
                <h3>Adjust Clinic Hours</h3>
                <div className="st-filters">
                  <label>
                    Monday - Friday
                    <input type="text" defaultValue="09:00 AM - 06:00 PM" />
                  </label>
                  <label>
                    Saturday
                    <input type="text" defaultValue="10:00 AM - 03:00 PM" />
                  </label>
                  <label>
                    Sunday
                    <input type="text" defaultValue="Closed" />
                  </label>
                </div>
                <button type="button" className="st-plain-btn">
                  Save Clinic Hours
                </button>
              </article>

              <article className="st-card">
                <h3>Assign Emergency Slots</h3>
                <div className="st-filters">
                  <label>
                    Doctor
                    <select>
                      <option>Dr. Sarah Khan</option>
                      <option>Dr. Michael Reed</option>
                      <option>Dr. Olivia Grant</option>
                    </select>
                  </label>
                  <label>
                    Date
                    <input type="date" />
                  </label>
                  <label>
                    Slot Time
                    <input type="text" placeholder="e.g. 05:30 PM - 06:00 PM" />
                  </label>
                </div>
                <button type="button" className="st-plain-btn">
                  Assign Emergency Slot
                </button>
                <ul className="st-appointment-list">
                  {EMERGENCY_SLOTS.map((slot) => (
                    <li key={slot}>
                      <div>
                        <strong>{slot}</strong>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ) : activePage === 'Reports & Analytics' ? (
            <div className="st-grid">
              {STAFF_REPORT_METRICS.map((item) => (
                <article key={item.title} className="st-card st-metric-card">
                  <h3>{item.title}</h3>
                  <p className="st-metric-value">{item.value}</p>
                  <p>{item.note}</p>
                </article>
              ))}
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
