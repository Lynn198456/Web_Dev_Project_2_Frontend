import { useEffect, useState } from 'react'
import '../css/dashboard.css'
import { createConsultation, getUserProfile, listAppointments, updateAppointmentById, updateUserProfile } from '../../../lib/api'

const DOCTOR_PAGES = [
  'Doctor Dashboard',
  'Appointments Page',
  'Pet Medical Records Page',
  'Prescriptions Page',
  'Lab Results / Attachments Page',
  'Doctor Schedule / Availability Page',
  'Profile',
]

const PENDING_REQUESTS = [
  'Prescription refill request for Bella',
  'Lab report review request for Max',
  'Follow-up consultation request for Luna',
]

const CONSULTATION_CASE = {
  petName: 'Bella',
  breed: 'Golden Retriever',
  age: '3 years',
  ownerName: 'Jonathan Smith',
  ownerContact: '+1 (555) 102-3344',
  symptoms: 'Loss of appetite for 2 days, mild fever, and reduced activity level.',
  reason: 'General health check and appetite concern.',
}

const MEDICAL_RECORDS = [
  {
    id: 'PET-1001',
    petName: 'Bella',
    ownerName: 'Jonathan Smith',
    diagnosis: 'Mild gastric irritation',
    prescription: 'Probiotic syrup twice daily for 5 days',
    vaccine: 'Rabies booster completed (Mar 2026)',
    labResult: 'CBC normal, stool test negative',
  },
  {
    id: 'PET-1002',
    petName: 'Max',
    ownerName: 'Emma Davis',
    diagnosis: 'Skin allergy follow-up',
    prescription: 'Cetirizine 5mg for 7 days',
    vaccine: 'DHPP booster due (Mar 22, 2026)',
    labResult: 'Mild eosinophilia, no infection markers',
  },
  {
    id: 'PET-1003',
    petName: 'Luna',
    ownerName: 'Noah Patel',
    diagnosis: 'Ear infection resolved',
    prescription: 'Topical ear drops completed',
    vaccine: 'Core vaccines up to date',
    labResult: 'Culture clear post-treatment',
  },
]

const PRESCRIPTION_HISTORY = [
  {
    id: 'RX-1001',
    date: '2026-03-18',
    pet: 'Bella',
    medicine: 'Probiotic Syrup',
    dosage: '5ml twice daily',
    duration: '5 days',
  },
  {
    id: 'RX-1002',
    date: '2026-03-17',
    pet: 'Max',
    medicine: 'Cetirizine 5mg',
    dosage: '1 tablet daily',
    duration: '7 days',
  },
  {
    id: 'RX-1003',
    date: '2026-03-15',
    pet: 'Luna',
    medicine: 'Ear Drops',
    dosage: '2 drops twice daily',
    duration: '6 days',
  },
]

const LAB_ATTACHMENTS = [
  { visitId: 'V-1001', pet: 'Bella', fileName: 'cbc_report_march18.pdf' },
  { visitId: 'V-1002', pet: 'Max', fileName: 'skin_test_photo.png' },
  { visitId: 'V-1003', pet: 'Luna', fileName: 'ear_swab_result.pdf' },
]

const AVAILABLE_SLOTS = ['09:00 - 09:30', '09:30 - 10:00', '10:30 - 11:00', '11:00 - 11:30', '02:00 - 02:30']
const BUSY_BLOCKS = ['12:00 - 01:00 (Lunch Break)', '03:30 - 04:00 (Emergency Case)']

const PAGE_CONTENT = {
  'Doctor Dashboard': {
    title: 'Doctor Dashboard',
    subtitle: 'Quick summary of today’s schedule and pending tasks.',
    cards: [],
  },
  'Appointments Page': {
    title: 'Appointments Page',
    subtitle: 'Review all booked appointments with patient and pet details.',
    cards: [
      { title: 'Upcoming', detail: 'Morning and evening bookings', action: 'Open upcoming' },
      { title: 'Completed', detail: 'Past consultations log', action: 'Open completed' },
      { title: 'Cancelled', detail: 'Cancelled and rescheduled visits', action: 'Open cancelled' },
      { title: 'Search', detail: 'Find by date, pet, or owner', action: 'Search now' },
    ],
  },
  'Consultation Details': {
    title: 'Consultation Details',
    subtitle: 'Capture symptoms, diagnosis notes, and next treatment steps.',
    cards: [
      { title: 'Current Case', detail: 'Patient intake and symptoms', action: 'Start note' },
      { title: 'Diagnosis Notes', detail: 'Clinical findings and observations', action: 'Add diagnosis' },
      { title: 'Treatment Plan', detail: 'Medication and follow-up plan', action: 'Add plan' },
      { title: 'Follow-up', detail: 'Set reminder for revisit', action: 'Schedule follow-up' },
    ],
  },
  'Pet Medical Records Page': {
    title: 'Pet Medical Records Page',
    subtitle: 'Access complete health history, vaccinations, and reports.',
    cards: [
      { title: 'History', detail: 'Past diagnoses and visits', action: 'View history' },
      { title: 'Vaccinations', detail: 'Track vaccine records', action: 'View vaccines' },
      { title: 'Allergies', detail: 'Known allergy and sensitivity list', action: 'Open allergies' },
      { title: 'Attachments', detail: 'Reports and imaging files', action: 'Open files' },
    ],
  },
  'Prescriptions Page': {
    title: 'Prescriptions Page',
    subtitle: 'Create, update, and review active prescriptions.',
    cards: [
      { title: 'New Prescription', detail: 'Add medicines and dosage', action: 'Create prescription' },
      { title: 'Active Prescriptions', detail: 'Currently prescribed medications', action: 'View active' },
      { title: 'Refills', detail: 'Pending refill requests', action: 'Manage refills' },
      { title: 'History', detail: 'Past prescription logs', action: 'View history' },
    ],
  },
  'Lab Results / Attachments Page': {
    title: 'Lab Results / Attachments Page',
    subtitle: 'Review uploaded test results and supporting documents.',
    cards: [
      { title: 'Recent Uploads', detail: 'Latest submitted files', action: 'Open uploads' },
      { title: 'Abnormal Results', detail: 'Flagged reports needing review', action: 'Review flagged' },
      { title: 'Attachments', detail: 'Scans, PDFs, and prescriptions', action: 'Open attachments' },
      { title: 'Export', detail: 'Download selected files', action: 'Export files' },
    ],
  },
  'Doctor Schedule / Availability Page': {
    title: 'Doctor Schedule / Availability Page',
    subtitle: 'Manage working hours and available consultation slots.',
    cards: [
      { title: 'Weekly Schedule', detail: 'Set clinic days and timings', action: 'Edit schedule' },
      { title: 'Slot Availability', detail: 'Adjust available slots', action: 'Manage slots' },
      { title: 'Leave Blocks', detail: 'Mark unavailable dates', action: 'Set leave' },
      { title: 'Calendar Sync', detail: 'Keep schedule up to date', action: 'Sync calendar' },
    ],
  },
  Profile: {
    title: 'Profile & Settings',
    subtitle: 'Manage your account information and security settings.',
    cards: [
      { title: 'Edit Profile Info', detail: 'Update name, contact details, and specialization.', action: 'Edit Profile' },
      { title: 'Change Password', detail: 'Update your password for better account security.', action: 'Change Password' },
    ],
  },
}

export default function DoctorDashboard({ currentUser, onLogout }) {
  const [activePage, setActivePage] = useState('Doctor Dashboard')
  const [appointmentView, setAppointmentView] = useState('Today')
  const [appointmentStatus, setAppointmentStatus] = useState('All')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [recordSearch, setRecordSearch] = useState('')
  const [doctorPhotoPreview, setDoctorPhotoPreview] = useState('')
  const [profile, setProfile] = useState(currentUser || null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileStatus, setProfileStatus] = useState('')
  const [profileError, setProfileError] = useState('')
  const [appointments, setAppointments] = useState([])
  const [consultAppointmentId, setConsultAppointmentId] = useState('')
  const [isSavingConsultation, setIsSavingConsultation] = useState(false)
  const [consultStatusMessage, setConsultStatusMessage] = useState('')
  const [consultErrorMessage, setConsultErrorMessage] = useState('')
  const content = PAGE_CONTENT[activePage] || PAGE_CONTENT['Doctor Dashboard']
  const todayIso = new Date().toISOString().slice(0, 10)
  const getBucket = (dateValue) => {
    if (!dateValue) {
      return 'Upcoming'
    }
    if (dateValue === todayIso) {
      return 'Today'
    }
    return dateValue > todayIso ? 'Upcoming' : 'Past'
  }
  const appointmentRows = appointments.map((item) => ({
    id: item.id,
    bucket: getBucket(item.appointmentDate),
    date: item.appointmentDate,
    status: item.status || 'Pending',
    pet: item.petName || '-',
    owner: item.ownerName || '-',
    doctor: item.doctorName || '',
    time: item.appointmentTime || '',
    reason: item.reason || '',
  }))
  const todayAppointments = appointmentRows.filter((item) => item.bucket === 'Today')
  const filteredAppointments = appointmentRows.filter((item) => {
    const inView = item.bucket === appointmentView
    const inStatus = appointmentStatus === 'All' || item.status === appointmentStatus
    const inDate = !appointmentDate || item.date === appointmentDate
    return inView && inStatus && inDate
  })
  const consultationAppointments = appointmentRows.filter((item) => item.status !== 'Cancelled')
  const selectedConsultation =
    consultationAppointments.find((item) => item.id === consultAppointmentId) || consultationAppointments[0] || null
  const formatConsultDate = (value) => {
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
  const filteredRecords = MEDICAL_RECORDS.filter((item) => {
    const query = recordSearch.trim().toLowerCase()
    if (!query) {
      return true
    }
    return (
      item.petName.toLowerCase().includes(query) ||
      item.ownerName.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    )
  })

  useEffect(() => {
    return () => {
      if (doctorPhotoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(doctorPhotoPreview)
      }
    }
  }, [doctorPhotoPreview])

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

  useEffect(() => {
    let cancelled = false

    const loadAppointments = async () => {
      const doctorName = String(profile?.name || currentUser?.name || '').trim()
      if (!doctorName) {
        if (!cancelled) {
          setAppointments([])
        }
        return
      }

      try {
        const response = await listAppointments({ doctorName })
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
  }, [profile?.name, currentUser?.name])

  useEffect(() => {
    setConsultAppointmentId((currentId) => {
      if (!consultationAppointments.length) {
        return ''
      }
      if (consultationAppointments.some((item) => item.id === currentId)) {
        return currentId
      }
      return consultationAppointments[0].id
    })
  }, [consultationAppointments])

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    if (doctorPhotoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(doctorPhotoPreview)
    }
    setDoctorPhotoPreview(URL.createObjectURL(file))
  }

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

  const handleConsultationSubmit = async (event) => {
    event.preventDefault()
    if (!selectedConsultation?.id) {
      setConsultErrorMessage('No appointment selected for consultation.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const consultOutcome = String(formData.get('consultOutcome') || 'Completed')
    const mappedStatus = consultOutcome === 'Follow-up needed' ? 'Confirmed' : consultOutcome
    const consultationPayload = {
      appointmentId: selectedConsultation.id,
      doctorId: profile?.id || '',
      doctorName: profile?.name || selectedConsultation.doctor || 'Doctor',
      ownerName: selectedConsultation.owner || '',
      petName: selectedConsultation.pet || '',
      appointmentDate: selectedConsultation.date || '',
      appointmentTime: selectedConsultation.time || '',
      symptoms: String(formData.get('symptoms') || '').trim(),
      temperature: String(formData.get('temperature') || '').trim(),
      weight: String(formData.get('weight') || '').trim(),
      heartRate: String(formData.get('heartRate') || '').trim(),
      respiratoryRate: String(formData.get('respiratoryRate') || '').trim(),
      clinicalFindings: String(formData.get('clinicalFindings') || '').trim(),
      diagnosis: String(formData.get('diagnosis') || '').trim(),
      treatmentPlan: String(formData.get('treatmentPlan') || '').trim(),
      prescription: String(formData.get('prescription') || '').trim(),
      followUpDate: String(formData.get('followUpDate') || '').trim(),
      outcome: consultOutcome,
    }

    try {
      setIsSavingConsultation(true)
      setConsultErrorMessage('')
      setConsultStatusMessage('')
      await createConsultation(consultationPayload)
      const response = await updateAppointmentById(selectedConsultation.id, { status: mappedStatus })
      const updated = response?.appointment
      if (updated) {
        setAppointments((currentItems) => currentItems.map((item) => (item.id === updated.id ? updated : item)))
      }
      setConsultStatusMessage('Consultation notes saved and appointment updated.')
    } catch (requestError) {
      setConsultErrorMessage(requestError.message)
    } finally {
      setIsSavingConsultation(false)
    }
  }

  const openConsultationForAppointment = (appointmentId) => {
    setConsultAppointmentId(appointmentId)
    setActivePage('Consultation Details')
  }

  return (
    <main className="dr-screen">
      <section className="dr-shell">
        <aside className="dr-sidebar">
          <h1>PawEver Doctor</h1>
          <nav aria-label="Doctor navigation">
            {DOCTOR_PAGES.map((page) => (
              <button
                key={page}
                className={`dr-nav-btn${activePage === page ? ' is-active' : ''}`}
                type="button"
                onClick={() => setActivePage(page)}
              >
                {page}
              </button>
            ))}
          </nav>
          <button className="dr-logout" type="button" onClick={onLogout}>
            Logout
          </button>
        </aside>

        <section className="dr-main">
          <header className="dr-header">
            <h2>{content.title}</h2>
            <p>{content.subtitle}</p>
          </header>

          {activePage === 'Doctor Dashboard' ? (
            <div className="dr-grid">
              <article className="dr-card">
                <h3>Today’s Appointments</h3>
                <p className="dr-count">{todayAppointments.length} appointments scheduled</p>
                <ul className="dr-list">
                  {todayAppointments.map((item) => (
                    <li key={item.id}>
                      <strong>{item.time || '--:--'}</strong>
                      <span>
                        {item.pet} - {item.owner}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="dr-card">
                <h3>Pending Requests</h3>
                <ul className="dr-list">
                  {PENDING_REQUESTS.map((request) => (
                    <li key={request}>
                      <span>{request}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="dr-card dr-quick-card">
                <h3>Quick Actions</h3>
                <div className="dr-quick-actions">
                  <button
                    type="button"
                    onClick={() => openConsultationForAppointment(todayAppointments[0]?.id || consultationAppointments[0]?.id)}
                  >
                    Start Consultation
                  </button>
                  <button type="button">View Records</button>
                </div>
              </article>
            </div>
          ) : activePage === 'Appointments Page' ? (
            <div className="dr-appointments">
              <div className="dr-appointment-tabs">
                {['Today', 'Upcoming', 'Past'].map((tab) => (
                  <button
                    key={tab}
                    className={`dr-tab-btn${appointmentView === tab ? ' is-active' : ''}`}
                    type="button"
                    onClick={() => setAppointmentView(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="dr-filters">
                <label>
                  Date
                  <input type="date" value={appointmentDate} onChange={(event) => setAppointmentDate(event.target.value)} />
                </label>
                <label>
                  Status
                  <select value={appointmentStatus} onChange={(event) => setAppointmentStatus(event.target.value)}>
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </label>
              </div>

              <ul className="dr-appointment-list">
                {filteredAppointments.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.date}</strong>
                      <p>
                        {item.pet} - {item.owner}
                      </p>
                    </div>
                    <span className={`dr-status dr-status-${item.status.toLowerCase()}`}>{item.status}</span>
                    <button type="button" onClick={() => openConsultationForAppointment(item.id)}>
                      Open Details
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : activePage === 'Consultation Details' ? (
            <div className="dr-consultation">
              <article className="dr-card">
                <h3>Appointment Details / Consultation</h3>
                {selectedConsultation ? (
                  <>
                    <label className="dr-consult-select">
                      Select Appointment
                      <select
                        value={selectedConsultation.id}
                        onChange={(event) => setConsultAppointmentId(event.target.value)}
                      >
                        {consultationAppointments.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.date} {item.time ? `- ${item.time}` : ''} | {item.pet} | {item.owner}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="dr-info-grid">
                      <p>
                        <strong>Appointment ID:</strong> {selectedConsultation.id}
                      </p>
                      <p>
                        <strong>Date:</strong> {formatConsultDate(selectedConsultation.date)}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedConsultation.time || '--:--'}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedConsultation.status}
                      </p>
                      <p>
                        <strong>Pet Name:</strong> {selectedConsultation.pet}
                      </p>
                      <p>
                        <strong>Owner Name:</strong> {selectedConsultation.owner}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="dr-form-error">No appointment available for consultation.</p>
                )}
              </article>

              <form
                className="dr-card dr-consult-form"
                onSubmit={handleConsultationSubmit}
                key={selectedConsultation?.id || 'consult-form'}
              >
                <label>
                  Symptoms / Reason for Visit
                  <textarea
                    name="symptoms"
                    defaultValue={selectedConsultation?.reason || `${CONSULTATION_CASE.symptoms}\n${CONSULTATION_CASE.reason}`}
                    rows="3"
                  />
                </label>
                <div className="dr-consult-grid">
                  <label>
                    Temperature
                    <input name="temperature" type="text" placeholder="e.g. 101.2 F" />
                  </label>
                  <label>
                    Weight
                    <input name="weight" type="text" placeholder="e.g. 24 kg" />
                  </label>
                  <label>
                    Heart Rate
                    <input name="heartRate" type="text" placeholder="e.g. 88 bpm" />
                  </label>
                  <label>
                    Respiratory Rate
                    <input name="respiratoryRate" type="text" placeholder="e.g. 24 /min" />
                  </label>
                </div>
                <label>
                  Clinical Findings
                  <textarea name="clinicalFindings" placeholder="Enter examination findings..." rows="3" />
                </label>
                <label>
                  Diagnosis
                  <textarea name="diagnosis" placeholder="Enter diagnosis..." rows="3" required />
                </label>
                <label>
                  Treatment Plan / Notes
                  <textarea name="treatmentPlan" placeholder="Enter treatment plan..." rows="3" required />
                </label>
                <label>
                  Prescription
                  <textarea name="prescription" placeholder="Medicine, dosage, and duration..." rows="3" required />
                </label>
                <div className="dr-consult-grid">
                  <label>
                    Follow-up Date
                    <input name="followUpDate" type="date" />
                  </label>
                  <label>
                    Consultation Outcome
                    <select name="consultOutcome" defaultValue="Completed">
                      <option value="Completed">Completed</option>
                      <option value="Follow-up needed">Follow-up needed</option>
                      <option value="Confirmed">Keep Confirmed</option>
                    </select>
                  </label>
                </div>
                <div className="dr-consult-actions">
                  <button type="submit" disabled={isSavingConsultation || !selectedConsultation}>
                    {isSavingConsultation ? 'Saving...' : 'Save Consultation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePage('Appointments Page')}
                    disabled={isSavingConsultation}
                  >
                    Back to Appointments
                  </button>
                </div>
                {consultStatusMessage ? <p className="dr-form-success">{consultStatusMessage}</p> : null}
                {consultErrorMessage ? <p className="dr-form-error">{consultErrorMessage}</p> : null}
              </form>
            </div>
          ) : activePage === 'Pet Medical Records Page' ? (
            <div className="dr-records">
              <article className="dr-card">
                <h3>Search Records</h3>
                <p>Search by pet name / owner / ID</p>
                <input
                  className="dr-record-search"
                  type="text"
                  placeholder="Type pet name, owner, or record ID"
                  value={recordSearch}
                  onChange={(event) => setRecordSearch(event.target.value)}
                />
              </article>

              <article className="dr-card">
                <h3>History</h3>
                <ul className="dr-record-list">
                  {filteredRecords.map((record) => (
                    <li key={record.id}>
                      <p>
                        <strong>{record.petName}</strong> ({record.id}) - Owner: {record.ownerName}
                      </p>
                      <p>
                        <strong>Past Diagnoses:</strong> {record.diagnosis}
                      </p>
                      <p>
                        <strong>Prescriptions:</strong> {record.prescription}
                      </p>
                      <p>
                        <strong>Vaccines:</strong> {record.vaccine}
                      </p>
                      <p>
                        <strong>Lab Results:</strong> {record.labResult}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="dr-card dr-record-entry">
                <h3>Add New Record Entry (Doctor Only)</h3>
                <div className="dr-entry-fields">
                  <input type="text" placeholder="Pet ID" />
                  <input type="text" placeholder="Pet Name" />
                  <input type="text" placeholder="Owner Name" />
                  <textarea rows="2" placeholder="Diagnosis" />
                  <textarea rows="2" placeholder="Prescription" />
                  <textarea rows="2" placeholder="Vaccines / Lab Results" />
                </div>
                <button type="button">Add New Record Entry</button>
              </article>
            </div>
          ) : activePage === 'Prescriptions Page' ? (
            <div className="dr-prescriptions">
              <article className="dr-card dr-prescription-form">
                <h3>Create Prescription</h3>
                <div className="dr-entry-fields">
                  <input type="text" placeholder="Medicine" />
                  <input type="text" placeholder="Dosage" />
                  <input type="text" placeholder="Duration" />
                </div>
                <button type="button">Create Prescription</button>
              </article>

              <article className="dr-card">
                <h3>Prescription History</h3>
                <ul className="dr-prescription-list">
                  {PRESCRIPTION_HISTORY.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>
                          {item.id} - {item.pet}
                        </strong>
                        <p>
                          {item.date} | {item.medicine}
                        </p>
                        <p>
                          {item.dosage} | {item.duration}
                        </p>
                      </div>
                      <div className="dr-prescription-actions">
                        <button type="button">Download</button>
                        <button type="button">Print</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ) : activePage === 'Lab Results / Attachments Page' ? (
            <div className="dr-lab">
              <article className="dr-card dr-lab-upload">
                <h3>Upload Lab Result Files / Images</h3>
                <div className="dr-entry-fields">
                  <input type="text" placeholder="Visit ID" />
                  <input type="text" placeholder="Pet Name" />
                  <input type="file" />
                  <input type="file" accept="image/*" />
                </div>
                <button type="button">Upload Attachment</button>
              </article>

              <article className="dr-card">
                <h3>Attachments Per Visit</h3>
                <ul className="dr-attachment-list">
                  {LAB_ATTACHMENTS.map((item) => (
                    <li key={`${item.visitId}-${item.fileName}`}>
                      <div>
                        <strong>{item.visitId}</strong>
                        <p>
                          {item.pet} - {item.fileName}
                        </p>
                      </div>
                      <div className="dr-attachment-actions">
                        <button type="button">View</button>
                        <button type="button">Download</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ) : activePage === 'Doctor Schedule / Availability Page' ? (
            <div className="dr-schedule">
              <article className="dr-card">
                <h3>Set Available Time Slots</h3>
                <div className="dr-entry-fields">
                  <input type="date" />
                  <input type="time" />
                  <input type="time" />
                </div>
                <button type="button">Add Slot</button>
                <ul className="dr-simple-list">
                  {AVAILABLE_SLOTS.map((slot) => (
                    <li key={slot}>{slot}</li>
                  ))}
                </ul>
              </article>

              <article className="dr-card">
                <h3>Block Time (Busy)</h3>
                <div className="dr-entry-fields">
                  <input type="date" />
                  <input type="time" />
                  <input type="time" />
                </div>
                <button type="button">Block Time</button>
                <ul className="dr-simple-list">
                  {BUSY_BLOCKS.map((block) => (
                    <li key={block}>{block}</li>
                  ))}
                </ul>
              </article>

              <article className="dr-card dr-working-hours">
                <h3>Clinic Working Hours</h3>
                <div className="dr-hours-grid">
                  <label>
                    Monday - Friday
                    <input type="text" defaultValue="09:00 AM - 05:00 PM" />
                  </label>
                  <label>
                    Saturday
                    <input type="text" defaultValue="10:00 AM - 02:00 PM" />
                  </label>
                  <label>
                    Sunday
                    <input type="text" defaultValue="Closed" />
                  </label>
                </div>
                <button type="button">Save Working Hours</button>
              </article>
            </div>
          ) : activePage === 'Profile' ? (
            <div className="dr-profile-settings">
              <article className="dr-card">
                <h3>Edit Profile Info</h3>
                <div className="dr-photo-preview">
                  {doctorPhotoPreview ? (
                    <img src={doctorPhotoPreview} alt="Doctor profile preview" />
                  ) : (
                    <span>No photo selected</span>
                  )}
                </div>
                <form
                  className="dr-profile-grid"
                  onSubmit={handleProfileSubmit}
                  key={`${profile?.id || 'no-id'}-${profile?.name || ''}`}
                >
                  <label>
                    Full Name
                    <input name="name" type="text" defaultValue={profile?.name || ''} required />
                  </label>
                  <label>
                    Profile Photo
                    <input type="file" accept="image/*" onChange={handlePhotoChange} />
                  </label>
                  <label>
                    Phone Number
                    <input name="phone" type="tel" defaultValue={profile?.phone || ''} />
                  </label>
                  <label>
                    Email Address
                    <input type="email" value={profile?.email || ''} readOnly />
                  </label>
                  <label className="dr-full">
                    Address
                    <input name="address" type="text" defaultValue={profile?.address || ''} />
                  </label>
                  <label>
                    Preferred Contact
                    <select name="preferredContact" defaultValue={profile?.preferredContact || 'Email'}>
                      <option>Email</option>
                      <option>Phone</option>
                      <option>SMS</option>
                    </select>
                  </label>
                  <label>
                    Working Days
                    <input type="text" defaultValue="Monday - Saturday" />
                  </label>
                  <label>
                    Working Hours
                    <input type="text" defaultValue="09:00 AM - 05:00 PM" />
                  </label>
                  <label>
                    Break Time
                    <input type="text" defaultValue="12:00 PM - 01:00 PM" />
                  </label>
                  <button type="submit" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
                {profileStatus ? <p className="dr-form-success">{profileStatus}</p> : null}
                {profileError ? <p className="dr-form-error">{profileError}</p> : null}
              </article>

              <article className="dr-card">
                <h3>Security Settings</h3>
                <div className="dr-security-actions">
                  <button type="button">Change Password</button>
                  <button type="button" className="dr-danger-btn">
                    Delete Account
                  </button>
                </div>
                <label className="dr-2fa-toggle">
                  <input type="checkbox" />
                  <span>Enable Two-Factor Authentication (2FA)</span>
                </label>
              </article>
            </div>
          ) : (
            <div className="dr-grid">
              {content.cards.map((card) => (
                <article key={card.title} className="dr-card">
                  <h3>{card.title}</h3>
                  <p>{card.detail}</p>
                  <button type="button">{card.action}</button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
