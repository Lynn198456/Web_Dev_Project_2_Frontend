import { useEffect, useState } from 'react'
import '../css/dashboard.css'
import { createAppointment, getUserProfile, listAppointments, updateAppointmentById, updateUserProfile } from '../../../lib/api'

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

const STAFF_QUICK_ACTIONS = [
  { title: 'Add Appointment', text: 'Create a new scheduled appointment.' },
  { title: 'Register Pet Owner', text: 'Add a new owner account with contact details.' },
  { title: 'Add Walk-in', text: 'Register walk-in patient quickly at front desk.' },
  { title: 'Generate Invoice', text: 'Create bill and move to payment flow.' },
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

const REPORT_TREND_ROWS = [
  { period: 'Week 1', income: '$13,200', appointments: 118, topDoctor: 'Dr. Sarah Khan' },
  { period: 'Week 2', income: '$14,680', appointments: 124, topDoctor: 'Dr. Michael Reed' },
  { period: 'Week 3', income: '$15,140', appointments: 131, topDoctor: 'Dr. Sarah Khan' },
  { period: 'Week 4', income: '$15,900', appointments: 139, topDoctor: 'Dr. Sarah Khan' },
]

const BILLING_SUMMARY = [
  { title: 'Invoices Today', value: '14' },
  { title: 'Collected Today', value: '$2,450' },
  { title: 'Pending Payments', value: '$620' },
]

const PAYMENT_HISTORY = [
  { invoice: 'INV-3001', owner: 'Jonathan Smith', pet: 'Bella', amount: '$180', method: 'Card', status: 'Paid' },
  { invoice: 'INV-3002', owner: 'Emma Davis', pet: 'Max', amount: '$95', method: 'Cash', status: 'Paid' },
  { invoice: 'INV-3003', owner: 'Noah Patel', pet: 'Luna', amount: '$140', method: 'UPI', status: 'Pending' },
  { invoice: 'INV-3004', owner: 'Sophia Lee', pet: 'Rocky', amount: '$220', method: 'Card', status: 'Paid' },
]

export default function StaffDashboard({ currentUser, onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard')
  const [filterDate, setFilterDate] = useState('')
  const [filterDoctor, setFilterDoctor] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [appointments, setAppointments] = useState([])
  const [appointmentError, setAppointmentError] = useState('')
  const [appointmentStatusMessage, setAppointmentStatusMessage] = useState('')
  const [profile, setProfile] = useState(currentUser || null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileStatus, setProfileStatus] = useState('')
  const [profileError, setProfileError] = useState('')
  const activeContent = STAFF_CONTENT[activePage] || STAFF_CONTENT.Dashboard
  const todayDashboardDate = new Date().toISOString().slice(0, 10)
  const todayAppointments = appointments.filter((item) => item.appointmentDate === todayDashboardDate)
  const pendingDashboardAppointments = todayAppointments.filter((item) => item.status === 'Pending')
  const filteredAppointments = appointments.filter((item) => {
    const dateMatch = !filterDate || item.appointmentDate === filterDate
    const doctorMatch = filterDoctor === 'All' || item.doctorName === filterDoctor
    const statusMatch = filterStatus === 'All' || item.status === filterStatus
    return dateMatch && doctorMatch && statusMatch
  })

  useEffect(() => {
    let cancelled = false

    const loadAppointments = async () => {
      try {
        const response = await listAppointments()
        if (!cancelled) {
          setAppointments(Array.isArray(response?.appointments) ? response.appointments : [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setAppointments([])
          setAppointmentError(requestError.message)
        }
      }
    }

    loadAppointments()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      if (!currentUser?.id) {
        setProfile(currentUser || null)
        return
      }

      try {
        const response = await getUserProfile(currentUser.id)
        if (!cancelled) {
          setProfile(response?.user || currentUser)
        }
      } catch (_error) {
        if (!cancelled) {
          setProfile(currentUser || null)
        }
      }
    }

    loadProfile()
    return () => {
      cancelled = true
    }
  }, [currentUser])

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    if (!profile?.id) {
      setProfileError('Please log in again to update profile.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const updates = {
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      preferredContact: String(formData.get('preferredContact') || 'Email'),
    }

    try {
      setIsSavingProfile(true)
      setProfileError('')
      setProfileStatus('')
      const response = await updateUserProfile(profile.id, updates)
      setProfile(response?.user || profile)
      setProfileStatus('Profile updated successfully.')
    } catch (requestError) {
      setProfileError(requestError.message)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleAppointmentUpdate = async (appointmentId, updates) => {
    try {
      setAppointmentError('')
      setAppointmentStatusMessage('')
      const response = await updateAppointmentById(appointmentId, updates)
      const updated = response?.appointment
      if (updated) {
        setAppointments((currentItems) => currentItems.map((item) => (item.id === updated.id ? updated : item)))
      }
      setAppointmentStatusMessage('Appointment updated successfully.')
    } catch (requestError) {
      setAppointmentError(requestError.message)
    }
  }

  const handleRescheduleAppointment = async (appointment) => {
    const newDate = window.prompt('Enter new date (YYYY-MM-DD):', appointment.appointmentDate || '')
    if (!newDate) {
      return
    }
    const newTime = window.prompt('Enter new time (HH:MM):', appointment.appointmentTime || '')
    if (!newTime) {
      return
    }
    await handleAppointmentUpdate(appointment.id, {
      appointmentDate: newDate,
      appointmentTime: newTime,
      status: 'Pending',
    })
  }

  const handleAssignDoctor = async (appointment) => {
    const newDoctor = window.prompt('Enter doctor name:', appointment.doctorName || 'Dr. Sarah Khan')
    if (!newDoctor) {
      return
    }
    await handleAppointmentUpdate(appointment.id, { doctorName: newDoctor })
  }

  const handleAddWalkIn = async () => {
    const petName = window.prompt('Pet name:')
    if (!petName) {
      return
    }
    const ownerName = window.prompt('Owner name (optional):') || ''
    const doctorName = window.prompt('Doctor name:', 'Dr. Sarah Khan')
    if (!doctorName) {
      return
    }
    const appointmentDate = window.prompt('Date (YYYY-MM-DD):', new Date().toISOString().slice(0, 10))
    if (!appointmentDate) {
      return
    }
    const appointmentTime = window.prompt('Time (HH:MM):', '10:00')
    if (!appointmentTime) {
      return
    }
    const reason = window.prompt('Reason for visit:', 'Walk-in consultation')
    if (!reason) {
      return
    }

    try {
      setAppointmentError('')
      setAppointmentStatusMessage('')
      const response = await createAppointment({
        ownerName,
        petName,
        doctorName,
        appointmentDate,
        appointmentTime,
        reason,
      })
      const created = response?.appointment
      if (created) {
        setAppointments((currentItems) => [created, ...currentItems])
      }
      setAppointmentStatusMessage('Walk-in appointment added.')
    } catch (requestError) {
      setAppointmentError(requestError.message)
    }
  }

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
            <div className="st-dashboard-layout">
              <article className="st-card st-quick-overview">
                <h3>At a Glance</h3>
                <div className="st-dashboard-metrics">
                  {STAFF_DASHBOARD_METRICS.map((item) => (
                    <div key={item.title} className="st-dashboard-metric">
                      <p>{item.title}</p>
                      <strong>{item.value}</strong>
                      <span>{item.note}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="st-card">
                <h3>Quick Actions</h3>
                <div className="st-dashboard-actions">
                  {STAFF_QUICK_ACTIONS.map((item) => (
                    <button key={item.title} type="button" className="st-action-card">
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="st-card">
                <h3>Today’s Appointments</h3>
                <ul className="st-dashboard-list">
                  {todayAppointments.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.id}</strong>
                        <p>
                          {item.ownerName || item.petName} | {item.doctorName}
                        </p>
                      </div>
                      <span className={`st-history-status st-history-${item.status.toLowerCase()}`}>{item.status}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="st-card">
                <h3>Pending Requests</h3>
                <p>{pendingDashboardAppointments.length} request(s) need attention.</p>
                <ul className="st-dashboard-list">
                  {pendingDashboardAppointments.map((item) => (
                    <li key={`${item.id}-pending`}>
                      <div>
                        <strong>{item.id}</strong>
                        <p>
                          {item.ownerName || item.petName} requested confirmation
                        </p>
                      </div>
                      <button type="button" onClick={() => handleAppointmentUpdate(item.id, { status: 'Confirmed' })}>
                        Review
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ) : activePage === 'Appointment Management' ? (
            <div className="st-appointments">
              <article className="st-card st-quick-card">
                <h3>Add Walk-in Appointment</h3>
                <button type="button" className="st-plain-btn" onClick={handleAddWalkIn}>
                  Add Walk-in Appointment
                </button>
                {appointmentStatusMessage ? <p className="st-form-success">{appointmentStatusMessage}</p> : null}
                {appointmentError ? <p className="st-form-error">{appointmentError}</p> : null}
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
                          {item.appointmentDate} | {item.ownerName || item.petName}
                        </p>
                        <p>
                          {item.doctorName} | {item.status}
                        </p>
                      </div>
                      <div className="st-appointment-actions">
                        <button type="button" onClick={() => handleAppointmentUpdate(item.id, { status: 'Confirmed' })}>
                          Confirm
                        </button>
                        <button type="button" onClick={() => handleAppointmentUpdate(item.id, { status: 'Cancelled' })}>
                          Cancel
                        </button>
                        <button type="button" onClick={() => handleRescheduleAppointment(item)}>
                          Reschedule
                        </button>
                        <button type="button" onClick={() => handleAssignDoctor(item)}>
                          Assign Doctor
                        </button>
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
          ) : activePage === 'Profile' ? (
            <div className="st-profile-layout">
              <article className="st-card st-profile-summary">
                <div className="st-profile-avatar" aria-hidden="true">
                  {profile?.name?.slice(0, 2).toUpperCase() || 'ST'}
                </div>
                <div className="st-profile-meta">
                  <h3>{profile?.name || 'Staff User'}</h3>
                  <p>{profile?.role || 'staff'}</p>
                  <p>Employee ID: {profile?.id || '-'}</p>
                </div>
                <div className="st-profile-badges">
                  <span>On Duty</span>
                  <span>Morning Shift</span>
                </div>
              </article>

              <article className="st-card">
                <h3>Personal Information</h3>
                <form className="st-profile-form" onSubmit={handleProfileSubmit} key={`${profile?.id || 'no-id'}-${profile?.name || ''}`}>
                  <label>
                    Full Name
                    <input name="name" type="text" defaultValue={profile?.name || ''} required />
                  </label>
                  <label>
                    Phone Number
                    <input name="phone" type="tel" defaultValue={profile?.phone || ''} />
                  </label>
                  <label>
                    Email Address
                    <input type="email" value={profile?.email || ''} readOnly />
                  </label>
                  <label>
                    Role
                    <input type="text" value={profile?.role || 'staff'} readOnly />
                  </label>
                  <label>
                    Preferred Contact
                    <select name="preferredContact" defaultValue={profile?.preferredContact || 'Email'}>
                      <option>Email</option>
                      <option>Phone</option>
                      <option>SMS</option>
                    </select>
                  </label>
                  <label className="st-profile-full">
                    Address
                    <input name="address" type="text" defaultValue={profile?.address || ''} />
                  </label>
                  <button type="submit" className="st-plain-btn" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
                {profileStatus ? <p className="st-form-success">{profileStatus}</p> : null}
                {profileError ? <p className="st-form-error">{profileError}</p> : null}
              </article>

              <article className="st-card">
                <h3>Notification Preferences</h3>
                <p>Choose which updates you want to receive.</p>
                <div className="st-toggle-list">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Appointment request alerts
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked />
                    Payment confirmation alerts
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked />
                    Doctor schedule changes
                  </label>
                  <label>
                    <input type="checkbox" />
                    Weekly performance summary
                  </label>
                </div>
              </article>

              <article className="st-card">
                <h3>Security & Account</h3>
                <div className="st-profile-actions">
                  <button type="button">Change Password</button>
                  <button type="button">Enable Two-Factor Authentication</button>
                  <button type="button">View Login Activity</button>
                </div>
                <button type="button" className="st-danger-btn">
                  Deactivate Account
                </button>
              </article>
            </div>
          ) : activePage === 'Billing & Payments' ? (
            <div className="st-billing-layout">
              <article className="st-card st-billing-summary">
                {BILLING_SUMMARY.map((item) => (
                  <div key={item.title} className="st-billing-metric">
                    <p>{item.title}</p>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </article>

              <article className="st-card">
                <h3>Generate Invoice</h3>
                <div className="st-profile-form">
                  <label>
                    Invoice ID
                    <input type="text" defaultValue="INV-3010" />
                  </label>
                  <label>
                    Appointment ID
                    <input type="text" placeholder="Enter appointment ID" />
                  </label>
                  <label>
                    Pet Owner Name
                    <input type="text" placeholder="Enter owner name" />
                  </label>
                  <label>
                    Pet Name
                    <input type="text" placeholder="Enter pet name" />
                  </label>
                </div>
              </article>

              <article className="st-card">
                <h3>Charges</h3>
                <div className="st-charge-grid">
                  <label>
                    Consultation Fee
                    <input type="number" placeholder="0.00" />
                  </label>
                  <label>
                    Service Charges
                    <input type="number" placeholder="0.00" />
                  </label>
                  <label>
                    Medicine Charges
                    <input type="number" placeholder="0.00" />
                  </label>
                  <label>
                    Lab Charges
                    <input type="number" placeholder="0.00" />
                  </label>
                </div>
                <div className="st-billing-total">
                  <span>Total Amount</span>
                  <strong>$0.00</strong>
                </div>
              </article>

              <article className="st-card">
                <h3>Record Payment</h3>
                <div className="st-profile-form">
                  <label>
                    Payment Method
                    <select>
                      <option>Card</option>
                      <option>Cash</option>
                      <option>UPI</option>
                      <option>Bank Transfer</option>
                    </select>
                  </label>
                  <label>
                    Payment Date
                    <input type="date" />
                  </label>
                  <label>
                    Reference Number
                    <input type="text" placeholder="Optional reference ID" />
                  </label>
                  <label>
                    Payment Status
                    <select>
                      <option>Paid</option>
                      <option>Pending</option>
                      <option>Failed</option>
                    </select>
                  </label>
                </div>
                <div className="st-billing-actions">
                  <button type="button">Generate Invoice</button>
                  <button type="button">Record Payment</button>
                  <button type="button">Print Receipt</button>
                </div>
              </article>

              <article className="st-card st-history-card">
                <h3>Payment History</h3>
                <ul className="st-history-list">
                  {PAYMENT_HISTORY.map((item) => (
                    <li key={item.invoice}>
                      <div>
                        <strong>{item.invoice}</strong>
                        <p>
                          {item.owner} | {item.pet}
                        </p>
                      </div>
                      <span>{item.amount}</span>
                      <span>{item.method}</span>
                      <span className={`st-history-status st-history-${item.status.toLowerCase()}`}>{item.status}</span>
                      <button type="button">View</button>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ) : activePage === 'Reports & Analytics' ? (
            <div className="st-reports-layout">
              <article className="st-card st-reports-filters">
                <h3>Report Filters</h3>
                <div className="st-filters">
                  <label>
                    Date Range
                    <select>
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>Last Month</option>
                      <option>Custom Range</option>
                    </select>
                  </label>
                  <label>
                    Doctor
                    <select>
                      <option>All Doctors</option>
                      <option>Dr. Sarah Khan</option>
                      <option>Dr. Michael Reed</option>
                      <option>Dr. Olivia Grant</option>
                    </select>
                  </label>
                  <label>
                    Report Type
                    <select>
                      <option>Financial + Operational</option>
                      <option>Financial Only</option>
                      <option>Appointments Only</option>
                    </select>
                  </label>
                </div>
                <div className="st-billing-actions">
                  <button type="button">Apply Filters</button>
                  <button type="button">Export CSV</button>
                  <button type="button">Export PDF</button>
                </div>
              </article>

              <article className="st-card st-reports-kpis">
                {STAFF_REPORT_METRICS.map((item) => (
                  <div key={item.title} className="st-report-kpi">
                    <p>{item.title}</p>
                    <strong>{item.value}</strong>
                    <span>{item.note}</span>
                  </div>
                ))}
              </article>

              <article className="st-card">
                <h3>Income & Appointment Trend</h3>
                <ul className="st-report-trend-list">
                  {REPORT_TREND_ROWS.map((row) => (
                    <li key={row.period}>
                      <span>{row.period}</span>
                      <strong>{row.income}</strong>
                      <strong>{row.appointments} appts</strong>
                      <span>{row.topDoctor}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="st-card">
                <h3>Top Insights</h3>
                <ul className="st-dashboard-list">
                  <li>
                    <div>
                      <strong>Most Visited Doctor</strong>
                      <p>Dr. Sarah Khan handled 34% of visits this month.</p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Most Common Pet Illness</strong>
                      <p>Skin Allergy is the highest reported diagnosis this month.</p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Monthly Volume</strong>
                      <p>512 appointments logged with 8.7% growth vs last month.</p>
                    </div>
                  </li>
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
