import { useEffect, useState } from 'react'
import '../css/dashboard.css'
import {
  createAppointment,
  createPet,
  deletePetById,
  getUserProfile,
  listAppointments,
  listPets,
  updateUserProfile,
} from '../../../lib/api'

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

const MEDICAL_RECORD_SECTIONS = [
  { title: 'Diagnosis', text: 'Max: Skin allergy follow-up with anti-inflammatory treatment plan.' },
  { title: 'Prescriptions', text: 'Cetirizine 5mg daily for 7 days and medicated shampoo twice weekly.' },
  { title: 'Lab Results', text: 'CBC normal range, mild eosinophilia observed, stool test negative.' },
  { title: 'Vaccination Records', text: 'Rabies completed, DHPP booster due on Mar 22, 2026.' },
]

const MEDICAL_VISITS = [
  {
    id: 'MR-3021',
    date: 'Mar 10, 2026',
    pet: 'Max',
    doctor: 'Dr. Sarah Khan',
    note: 'Skin allergy follow-up with updated treatment plan.',
  },
  {
    id: 'MR-3018',
    date: 'Mar 03, 2026',
    pet: 'Bella',
    doctor: 'Dr. Michael Reed',
    note: 'Routine wellness exam and vaccination record update.',
  },
  {
    id: 'MR-3007',
    date: 'Feb 21, 2026',
    pet: 'Max',
    doctor: 'Dr. Olivia Grant',
    note: 'Lab work reviewed and diet changes suggested.',
  },
]

function DashboardCards({ onBookAppointment, onAddPet }) {
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
          <button type="button" onClick={onBookAppointment}>
            Book Appointment
          </button>
          <button type="button" onClick={onAddPet}>
            Add Pet
          </button>
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

function MyPetsPage({ pets, onAddNewPet, onDeletePet }) {
  return (
    <section className="po-mypets">
      <article className="po-card">
        <h3>My Pets</h3>
        <p className="po-mypets-subtitle">
          Add new pet, edit pet information, delete pet, upload pet photo, and review basic pet details.
        </p>
        <button type="button" className="po-mypets-add-btn" onClick={onAddNewPet}>
          Add New Pet
        </button>
      </article>

      {pets.length === 0 ? (
        <article className="po-card">
          <p className="po-mypets-subtitle">No pets added yet. Click "Add New Pet" to create your first pet profile.</p>
        </article>
      ) : (
        <div className="po-mypets-grid">
          {pets.map((pet) => (
            <article key={pet.id} className="po-card po-mypet-card">
              <h3>{pet.name}</h3>

              <div className="po-mypet-actions">
                <button type="button">Edit Pet Information</button>
                <button type="button" onClick={() => void onDeletePet(pet.id)}>
                  Delete Pet
                </button>
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
      )}
    </section>
  )
}

function AddPetPage({ onBackToPets, onSavePet }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }
    const formData = new FormData(event.currentTarget)
    const newPet = {
      name: String(formData.get('petName') || '').trim(),
      breed: String(formData.get('breed') || '').trim(),
      age: String(formData.get('age') || '').trim(),
      weight: String(formData.get('weight') || '').trim(),
      vaccinationStatus: String(formData.get('vaccinationStatus') || '').trim(),
    }

    if (!newPet.name || !newPet.breed || !newPet.age || !newPet.weight || !newPet.vaccinationStatus) {
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      await onSavePet(newPet)
      event.currentTarget.reset()
    } catch (requestError) {
      setErrorMessage(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="po-mypets">
      <article className="po-card">
        <h3>Add New Pet</h3>
        <p className="po-mypets-subtitle">Enter your pet details and save to your profile.</p>
      </article>

      <article className="po-card po-book-layout">
        <form className="po-book-grid" onSubmit={handleSubmit}>
          <label>
            Pet Name
            <input name="petName" type="text" placeholder="Enter pet name" required />
          </label>
          <label>
            Breed
            <input name="breed" type="text" placeholder="Enter breed" required />
          </label>
          <label>
            Age
            <input name="age" type="text" placeholder="e.g. 2 years" required />
          </label>
          <label>
            Weight
            <input name="weight" type="text" placeholder="e.g. 7 kg" required />
          </label>
          <label>
            Vaccination Status
            <select name="vaccinationStatus" defaultValue="Up to date" required>
              <option>Up to date</option>
              <option>Pending</option>
              <option>Booster due soon</option>
            </select>
          </label>
          <label>
            Upload Pet Photo
            <input type="file" accept="image/*" />
          </label>
          <div className="po-book-actions po-book-full">
            <button type="submit" className="po-record-download" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Pet'}
            </button>
            <button type="button" className="po-record-secondary" onClick={onBackToPets}>
              Back to My Pets
            </button>
          </div>
        </form>
        {errorMessage ? <p className="po-form-error">{errorMessage}</p> : null}
      </article>
    </section>
  )
}

function formatAppointmentDate(value) {
  if (!value) {
    return '-'
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function AppointmentHistoryPage({ appointments }) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(appointments[0]?.id || '')

  useEffect(() => {
    setSelectedAppointmentId((currentId) => {
      if (!appointments.length) {
        return ''
      }
      if (appointments.some((item) => item.id === currentId)) {
        return currentId
      }
      return appointments[0].id
    })
  }, [appointments])

  const selectedAppointment = appointments.find((item) => item.id === selectedAppointmentId) || null

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
          {appointments.map((item) => (
            <li key={item.id}>
              <span>{formatAppointmentDate(item.appointmentDate || item.date)}</span>
              <strong>{item.doctorName}</strong>
              <em className={`po-status po-status-${String(item.status || 'pending').toLowerCase()}`}>{item.status}</em>
              <button type="button" onClick={() => setSelectedAppointmentId(item.id)}>
                View Details
              </button>
            </li>
          ))}
        </ul>
      </article>

      {!appointments.length ? (
        <article className="po-card">
          <p className="po-mypets-subtitle">No appointments found yet.</p>
        </article>
      ) : null}

      {selectedAppointment ? (
        <article className="po-card po-appointment-details">
          <h3>Appointment Details</h3>
          <ul className="po-detail-list">
            <li>
              <span>Appointment ID</span>
              <strong>{selectedAppointment.id}</strong>
            </li>
            <li>
              <span>Date</span>
              <strong>{formatAppointmentDate(selectedAppointment.appointmentDate || selectedAppointment.date)}</strong>
            </li>
            <li>
              <span>Time</span>
              <strong>{selectedAppointment.appointmentTime}</strong>
            </li>
            <li>
              <span>Pet</span>
              <strong>{selectedAppointment.petName}</strong>
            </li>
            <li>
              <span>Doctor</span>
              <strong>{selectedAppointment.doctorName}</strong>
            </li>
            <li>
              <span>Status</span>
              <strong>{selectedAppointment.status}</strong>
            </li>
            <li>
              <span>Reason</span>
              <strong>{selectedAppointment.reason}</strong>
            </li>
          </ul>
        </article>
      ) : null}
    </section>
  )
}

function BookAppointmentPage({ pets, ownerName, onViewHistory, onAppointmentBooked }) {
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const formElement = event.currentTarget
    const formData = new FormData(formElement)
    if (!pets.length) {
      setErrorMessage('Add a pet first before booking an appointment.')
      return
    }

    const body = {
      ownerName: String(ownerName || '').trim(),
      petName: String(formData.get('petName') || '').trim(),
      doctorName: String(formData.get('doctorName') || '').trim(),
      appointmentDate: String(formData.get('appointmentDate') || '').trim(),
      appointmentTime: String(formData.get('appointmentTime') || '').trim(),
      reason: String(formData.get('reason') || '').trim(),
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      setStatusMessage('')
      const response = await createAppointment(body)
      if (response?.appointment) {
        onAppointmentBooked(response.appointment)
      }
      setStatusMessage('Appointment booked successfully.')
      formElement.reset()
    } catch (requestError) {
      setErrorMessage(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="po-mypets">
      <article className="po-card">
        <h3>Book Appointment</h3>
        <p className="po-mypets-subtitle">Select pet, doctor, date, and reason for visit to book an appointment.</p>
        {!pets.length ? (
          <p className="po-form-error">No pets found in your account. Please add a pet first.</p>
        ) : null}
      </article>

      <article className="po-card po-book-layout">
        <form className="po-book-grid" onSubmit={handleSubmit}>
          <label>
            Pet
            <select
              name="petName"
              defaultValue={pets[0]?.name || ''}
              required
              disabled={!pets.length || isSubmitting}
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.name}>
                  {pet.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Doctor
              <select name="doctorName" defaultValue="Dr. Sarah Khan" required disabled={isSubmitting}>
              <option>Dr. Sarah Khan</option>
              <option>Dr. Michael Reed</option>
              <option>Dr. Olivia Grant</option>
            </select>
          </label>
          <label>
            Date
            <input name="appointmentDate" type="date" required disabled={isSubmitting} />
          </label>
          <label>
            Time
            <input name="appointmentTime" type="time" required disabled={isSubmitting} />
          </label>
          <label className="po-book-full">
            Reason for Visit
            <textarea
              name="reason"
              rows="4"
              placeholder="Describe symptoms or reason for appointment"
              required
              disabled={isSubmitting}
            />
          </label>

          <div className="po-book-actions po-book-full">
            <button type="submit" className="po-record-download" disabled={isSubmitting || !pets.length}>
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
            <button type="button" className="po-record-secondary" onClick={onViewHistory}>
              View Appointment History
            </button>
          </div>
        </form>

        {statusMessage ? <p className="po-form-success">{statusMessage}</p> : null}
        {errorMessage ? <p className="po-form-error">{errorMessage}</p> : null}
      </article>
    </section>
  )
}

function MedicalRecordsPage() {
  return (
    <section className="po-mypets">
      <article className="po-card">
        <h3>Medical Records</h3>
        <p className="po-mypets-subtitle">View diagnosis, prescriptions, lab results, and vaccination history by visit.</p>
      </article>

      <section className="po-medical-layout">
        <article className="po-card po-medical-summary">
          <div className="po-medical-stat">
            <p>Total Records</p>
            <strong>18</strong>
          </div>
          <div className="po-medical-stat">
            <p>Last Updated</p>
            <strong>Mar 10, 2026</strong>
          </div>
          <div className="po-medical-stat">
            <p>Upcoming Vaccine</p>
            <strong>Mar 22, 2026</strong>
          </div>
        </article>

        <article className="po-card">
          <h3>Find Records</h3>
          <div className="po-medical-filters">
            <label>
              Pet
              <select defaultValue="All Pets">
                <option>All Pets</option>
                <option>Bella</option>
                <option>Max</option>
              </select>
            </label>
            <label>
              Record Type
              <select defaultValue="All Types">
                <option>All Types</option>
                <option>Diagnosis</option>
                <option>Prescription</option>
                <option>Lab Result</option>
                <option>Vaccination</option>
              </select>
            </label>
            <label>
              Search
              <input type="text" placeholder="Search by doctor, diagnosis, or ID" />
            </label>
          </div>
        </article>

        <article className="po-card">
          <h3>Recent Visits</h3>
          <ul className="po-medical-visit-list">
            {MEDICAL_VISITS.map((visit) => (
              <li key={visit.id}>
                <div>
                  <strong>{visit.id}</strong>
                  <p>
                    {visit.date} | {visit.pet} | {visit.doctor}
                  </p>
                  <p>{visit.note}</p>
                </div>
                <button type="button">View Details</button>
              </li>
            ))}
          </ul>
        </article>

        <article className="po-card">
          <h3>Record Details</h3>
          <ul className="po-record-list">
            {MEDICAL_RECORD_SECTIONS.map((item) => (
              <li key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <div className="po-record-actions">
            <button type="button" className="po-record-download">
              Download PDF
            </button>
            <button type="button" className="po-record-secondary">
              Share Record
            </button>
            <button type="button" className="po-record-secondary">
              Print
            </button>
          </div>
        </article>
      </section>
    </section>
  )
}

function ProfilePage({ profile, onSaveProfile, isSavingProfile, profileError, profileStatus }) {
  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    await onSaveProfile({
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      preferredContact: String(formData.get('preferredContact') || 'Email'),
    })
  }

  return (
    <section className="po-mypets">
      <article className="po-card">
        <h3>Profile</h3>
        <p className="po-mypets-subtitle">Manage your account settings and preferences.</p>
      </article>

      <section className="po-profile-layout">
        <article className="po-card po-profile-summary">
          <div className="po-profile-avatar" aria-hidden="true">
            {profile?.name?.slice(0, 2).toUpperCase() || 'PO'}
          </div>
          <div>
            <h4>{profile?.name || 'Pet Owner'}</h4>
            <p>Pet Owner ID: {profile?.id || '-'}</p>
            <p>Member since 2024</p>
          </div>
          <span className="po-profile-badge">Profile 90% complete</span>
        </article>

        <article className="po-card">
          <h3>Personal Information</h3>
          <form className="po-profile-form" onSubmit={handleSubmit} key={`${profile?.id || 'no-id'}-${profile?.name || ''}`}>
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
              Preferred Contact
              <select name="preferredContact" defaultValue={profile?.preferredContact || 'Email'}>
                <option>Email</option>
                <option>Phone</option>
                <option>SMS</option>
              </select>
            </label>
            <label className="po-profile-full">
              Address
              <input name="address" type="text" defaultValue={profile?.address || ''} />
            </label>
            <button type="submit" className="po-profile-save" disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
          {profileStatus ? <p className="po-form-success">{profileStatus}</p> : null}
          {profileError ? <p className="po-form-error">{profileError}</p> : null}
        </article>

        <article className="po-card">
          <h3>Notification Preferences</h3>
          <div className="po-pref-list">
            <label>
              <input type="checkbox" defaultChecked />
              Appointment reminders
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Vaccination reminders
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Medical record updates
            </label>
            <label>
              <input type="checkbox" />
              Promotional updates
            </label>
          </div>
        </article>

        <article className="po-card">
          <h3>Security</h3>
          <div className="po-security-actions">
            <button type="button">Change Password</button>
            <button type="button">Enable Two-Factor Authentication</button>
            <button type="button">Manage Linked Devices</button>
          </div>
        </article>
      </section>
    </section>
  )
}

export default function PetOwnerDashboard({ role, currentUser, onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard')
  const [pets, setPets] = useState([])
  const [appointments, setAppointments] = useState([])
  const [profile, setProfile] = useState(currentUser || null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileStatus, setProfileStatus] = useState('')
  const isPetOwner = role === 'pet-owner' || !role

  useEffect(() => {
    let cancelled = false

    const loadPets = async () => {
      try {
        const response = await listPets()
        if (!cancelled) {
          setPets(Array.isArray(response?.pets) ? response.pets : [])
        }
      } catch (_error) {
        if (!cancelled) {
          setPets([])
        }
      }
    }

    loadPets()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadAppointments = async () => {
      try {
        const response = await listAppointments()
        if (!cancelled) {
          setAppointments(Array.isArray(response?.appointments) ? response.appointments : [])
        }
      } catch (_error) {
        if (!cancelled) {
          setAppointments([])
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

  const handleSavePet = async (newPet) => {
    const response = await createPet(newPet)
    const createdPet = response?.pet
    if (createdPet) {
      setPets((currentPets) => [createdPet, ...currentPets])
    }
    setActivePage('My Pets')
  }

  const handleDeletePet = async (petId) => {
    await deletePetById(petId)
    setPets((currentPets) => currentPets.filter((pet) => pet.id !== petId))
  }

  const handleAppointmentBooked = (appointment) => {
    setAppointments((currentItems) => [appointment, ...currentItems])
  }

  const handleSaveProfile = async (updates) => {
    if (!profile?.id) {
      setProfileError('Please log in again to update profile.')
      return
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
              <button className="po-add-pet" type="button" onClick={() => setActivePage('Add Pet')}>
                Add A Pet
              </button>
              <button className="po-profile" type="button" onClick={onLogout}>
                <strong>Logout</strong>
              </button>
            </div>

            {isPetOwner ? (
              activePage === 'Dashboard' ? (
                <DashboardCards
                  onBookAppointment={() => setActivePage('Book Appointment')}
                  onAddPet={() => setActivePage('Add Pet')}
                />
              ) : activePage === 'Book Appointment' ? (
                <BookAppointmentPage
                  pets={pets}
                  ownerName={profile?.name || currentUser?.name || ''}
                  onViewHistory={() => setActivePage('Appointment History')}
                  onAppointmentBooked={handleAppointmentBooked}
                />
              ) : activePage === 'Add Pet' ? (
                <AddPetPage onBackToPets={() => setActivePage('My Pets')} onSavePet={handleSavePet} />
              ) : activePage === 'My Pets' ? (
                <MyPetsPage
                  pets={pets}
                  onAddNewPet={() => setActivePage('Add Pet')}
                  onDeletePet={handleDeletePet}
                />
              ) : activePage === 'Appointment History' ? (
                <AppointmentHistoryPage appointments={appointments} />
              ) : activePage === 'Medical Records' ? (
                <MedicalRecordsPage />
              ) : activePage === 'Profile' ? (
                <ProfilePage
                  profile={profile}
                  onSaveProfile={handleSaveProfile}
                  isSavingProfile={isSavingProfile}
                  profileError={profileError}
                  profileStatus={profileStatus}
                />
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
