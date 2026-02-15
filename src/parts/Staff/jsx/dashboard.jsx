import { useEffect, useState } from 'react'
import '../css/dashboard.css'
import {
  addDoctorAvailableSlot,
  addDoctorBlockedSlot,
  changeUserPassword,
  createBillingRecord,
  createAppointment,
  createReportSnapshot,
  createPet,
  deleteDoctorScheduleSlot,
  deletePetById,
  getBillingReceiptById,
  getDoctorSchedule,
  getUserProfile,
  listBillingRecords,
  listReportSnapshots,
  listAppointments,
  listPets,
  getReportsAnalytics,
  listUsers,
  recordBillingPaymentById,
  registerUser,
  updateBillingChargesById,
  updateDoctorClinicHours,
  updateAppointmentById,
  updatePetById,
  updateUserProfile,
} from '../../../lib/api'

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
  { title: 'Payment Summary (Today)', value: '฿2,450', note: 'Collected payments' },
]

const STAFF_QUICK_ACTIONS = [
  { title: 'Add Appointment', text: 'Create a new scheduled appointment.' },
  { title: 'Register Pet Owner', text: 'Add a new owner account with contact details.' },
  { title: 'Add Walk-in', text: 'Register walk-in patient quickly at front desk.' },
  { title: 'Generate Invoice', text: 'Create bill and move to payment flow.' },
]

function isPetOwnerRole(role) {
  const normalized = String(role || '')
    .trim()
    .toLowerCase()
  return normalized === 'pet-owner' || normalized === 'petowner' || normalized === 'pet owner'
}

function isDoctorRole(role) {
  return String(role || '').trim().toLowerCase() === 'doctor'
}

function formatBaht(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return '฿0.00'
  }
  return `฿${numeric.toFixed(2)}`
}

export default function StaffDashboard({ currentUser, onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard')
  const [filterDate, setFilterDate] = useState('')
  const [filterDoctor, setFilterDoctor] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [appointments, setAppointments] = useState([])
  const [appointmentError, setAppointmentError] = useState('')
  const [appointmentStatusMessage, setAppointmentStatusMessage] = useState('')
  const [owners, setOwners] = useState([])
  const [ownerPetCounts, setOwnerPetCounts] = useState({})
  const [isLoadingOwners, setIsLoadingOwners] = useState(false)
  const [ownerError, setOwnerError] = useState('')
  const [ownerStatusMessage, setOwnerStatusMessage] = useState('')
  const [ownerSearch, setOwnerSearch] = useState('')
  const [pets, setPets] = useState([])
  const [isLoadingPets, setIsLoadingPets] = useState(false)
  const [petRecordError, setPetRecordError] = useState('')
  const [petRecordStatusMessage, setPetRecordStatusMessage] = useState('')
  const [petSearch, setPetSearch] = useState('')
  const [doctors, setDoctors] = useState([])
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [doctorSchedule, setDoctorSchedule] = useState(null)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [isSavingSchedule, setIsSavingSchedule] = useState(false)
  const [scheduleError, setScheduleError] = useState('')
  const [scheduleStatusMessage, setScheduleStatusMessage] = useState('')
  const [clinicHours, setClinicHours] = useState({
    mondayFriday: '09:00 AM - 05:00 PM',
    saturday: '10:00 AM - 02:00 PM',
    sunday: 'Closed',
  })
  const [billingRecords, setBillingRecords] = useState([])
  const [isLoadingBilling, setIsLoadingBilling] = useState(false)
  const [isSavingBilling, setIsSavingBilling] = useState(false)
  const [billingError, setBillingError] = useState('')
  const [billingStatusMessage, setBillingStatusMessage] = useState('')
  const [selectedBillingId, setSelectedBillingId] = useState('')
  const [reportRange, setReportRange] = useState('this-month')
  const [reportDoctor, setReportDoctor] = useState('All')
  const [reportType, setReportType] = useState('Financial + Operational')
  const [reportFromDate, setReportFromDate] = useState('')
  const [reportToDate, setReportToDate] = useState('')
  const [reportMetrics, setReportMetrics] = useState([])
  const [reportTrendRows, setReportTrendRows] = useState([])
  const [reportInsights, setReportInsights] = useState([])
  const [reportSnapshots, setReportSnapshots] = useState([])
  const [isLoadingReports, setIsLoadingReports] = useState(false)
  const [reportError, setReportError] = useState('')
  const [reportStatusMessage, setReportStatusMessage] = useState('')
  const [profile, setProfile] = useState(currentUser || null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileStatus, setProfileStatus] = useState('')
  const [profileError, setProfileError] = useState('')
  const [isSavingStaffNotifications, setIsSavingStaffNotifications] = useState(false)
  const [staffNotificationStatus, setStaffNotificationStatus] = useState('')
  const [staffNotificationError, setStaffNotificationError] = useState('')
  const [isChangingStaffPassword, setIsChangingStaffPassword] = useState(false)
  const [staffPasswordStatus, setStaffPasswordStatus] = useState('')
  const [staffPasswordError, setStaffPasswordError] = useState('')
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
  const filteredOwners = owners.filter((owner) => {
    const query = ownerSearch.trim().toLowerCase()
    if (!query) {
      return true
    }
    return (
      owner.name.toLowerCase().includes(query) ||
      owner.email.toLowerCase().includes(query) ||
      owner.id.toLowerCase().includes(query)
    )
  })
  const filteredPets = pets.filter((pet) => {
    const query = petSearch.trim().toLowerCase()
    if (!query) {
      return true
    }
    return (
      String(pet.name || '').toLowerCase().includes(query) ||
      String(pet.breed || '').toLowerCase().includes(query) ||
      String(pet.ownerName || '').toLowerCase().includes(query) ||
      String(pet.id || '').toLowerCase().includes(query)
    )
  })
  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) || null
  const availableSlots = Array.isArray(doctorSchedule?.availableSlots) ? doctorSchedule.availableSlots : []
  const blockedSlots = Array.isArray(doctorSchedule?.blockedSlots) ? doctorSchedule.blockedSlots : []
  const emergencySlots = availableSlots.filter((slot) => slot.slotType === 'emergency')
  const selectedBillingRecord = billingRecords.find((item) => item.id === selectedBillingId) || null
  const totalCollected = billingRecords
    .filter((item) => item.paymentStatus === 'Paid')
    .reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)
  const totalPending = billingRecords
    .filter((item) => item.paymentStatus === 'Pending')
    .reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)
  const billingSummary = [
    { title: 'Invoices Total', value: String(billingRecords.length) },
    { title: 'Collected', value: formatBaht(totalCollected) },
    { title: 'Pending', value: formatBaht(totalPending) },
  ]

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

  const loadBillingData = async () => {
    const response = await listBillingRecords()
    const records = Array.isArray(response?.records) ? response.records : []
    return records
  }

  const loadReportsData = async (overrides = {}) => {
    const query = {
      range: overrides.range ?? reportRange,
      doctorName: overrides.doctorName ?? reportDoctor,
      reportType: overrides.reportType ?? reportType,
      fromDate: overrides.fromDate ?? reportFromDate,
      toDate: overrides.toDate ?? reportToDate,
    }
    const response = await getReportsAnalytics(query)
    return response?.report || null
  }

  const loadReportSnapshotsData = async () => {
    const response = await listReportSnapshots()
    return Array.isArray(response?.snapshots) ? response.snapshots : []
  }

  useEffect(() => {
    let cancelled = false

    const loadBilling = async () => {
      try {
        setIsLoadingBilling(true)
        setBillingError('')
        const records = await loadBillingData()
        if (!cancelled) {
          setBillingRecords(records)
          setSelectedBillingId((current) => (current && records.some((item) => item.id === current) ? current : records[0]?.id || ''))
        }
      } catch (requestError) {
        if (!cancelled) {
          setBillingRecords([])
          setSelectedBillingId('')
          setBillingError(requestError.message)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingBilling(false)
        }
      }
    }

    loadBilling()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadReports = async () => {
      try {
        setIsLoadingReports(true)
        setReportError('')
        const [report, snapshots] = await Promise.all([loadReportsData(), loadReportSnapshotsData()])
        if (!cancelled) {
          setReportMetrics(Array.isArray(report?.metrics) ? report.metrics : [])
          setReportTrendRows(Array.isArray(report?.trendRows) ? report.trendRows : [])
          setReportInsights(Array.isArray(report?.insights) ? report.insights : [])
          setReportSnapshots(snapshots)
        }
      } catch (requestError) {
        if (!cancelled) {
          setReportMetrics([])
          setReportTrendRows([])
          setReportInsights([])
          setReportSnapshots([])
          setReportError(requestError.message)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingReports(false)
        }
      }
    }

    loadReports()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadDoctors = async () => {
      try {
        setScheduleError('')
        const doctorList = await loadDoctorDirectory()
        if (!cancelled) {
          setDoctors(doctorList)
          setSelectedDoctorId((current) => (current && doctorList.some((item) => item.id === current) ? current : doctorList[0]?.id || ''))
        }
      } catch (requestError) {
        if (!cancelled) {
          setDoctors([])
          setSelectedDoctorId('')
          setScheduleError(requestError.message)
        }
      }
    }

    loadDoctors()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadSchedule = async () => {
      if (!selectedDoctor) {
        setDoctorSchedule(null)
        return
      }
      try {
        setIsLoadingSchedule(true)
        setScheduleError('')
        const schedule = await loadDoctorScheduleData(selectedDoctor)
        if (!cancelled) {
          setDoctorSchedule(schedule)
          setClinicHours({
            mondayFriday: schedule?.clinicHours?.mondayFriday || '09:00 AM - 05:00 PM',
            saturday: schedule?.clinicHours?.saturday || '10:00 AM - 02:00 PM',
            sunday: schedule?.clinicHours?.sunday || 'Closed',
          })
        }
      } catch (requestError) {
        if (!cancelled) {
          setDoctorSchedule(null)
          setScheduleError(requestError.message)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSchedule(false)
        }
      }
    }

    loadSchedule()
    return () => {
      cancelled = true
    }
  }, [selectedDoctorId, selectedDoctor?.id, selectedDoctor?.name])

  const loadPetRecordsData = async () => {
    const response = await listPets()
    const allPets = Array.isArray(response?.pets) ? response.pets : []
    return allPets.map((pet) => ({
      id: pet.id,
      ownerId: String(pet.ownerId || ''),
      ownerName: String(pet.ownerName || ''),
      name: String(pet.name || ''),
      breed: String(pet.breed || ''),
      age: String(pet.age || ''),
      weight: String(pet.weight || ''),
      vaccinationStatus: String(pet.vaccinationStatus || ''),
    }))
  }

  useEffect(() => {
    let cancelled = false

    const loadPetsData = async () => {
      try {
        setIsLoadingPets(true)
        setPetRecordError('')
        const items = await loadPetRecordsData()
        if (!cancelled) {
          setPets(items)
        }
      } catch (requestError) {
        if (!cancelled) {
          setPets([])
          setPetRecordError(requestError.message)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPets(false)
        }
      }
    }

    loadPetsData()
    return () => {
      cancelled = true
    }
  }, [])

  const loadOwnerManagementData = async () => {
    const [userResponse, petResponse] = await Promise.all([listUsers(), listPets()])
    const allUsers = Array.isArray(userResponse?.users) ? userResponse.users : []
    const ownerUsers = allUsers.filter((user) => isPetOwnerRole(user.role))
    const pets = Array.isArray(petResponse?.pets) ? petResponse.pets : []
    const petCounts = {}
    pets.forEach((pet) => {
      const key = String(pet.ownerId || '').trim()
      if (!key) {
        return
      }
      petCounts[key] = (petCounts[key] || 0) + 1
    })

    return {
      owners: ownerUsers.map((owner) => ({
        id: owner.id,
        name: String(owner.name || ''),
        email: String(owner.email || ''),
        role: String(owner.role || ''),
        phone: String(owner.phone || ''),
        address: String(owner.address || ''),
        preferredContact: String(owner.preferredContact || 'Email'),
      })),
      petCounts,
    }
  }

  const loadDoctorDirectory = async () => {
    const response = await listUsers({ role: 'doctor' })
    const users = Array.isArray(response?.users) ? response.users : []
    return users
      .filter((user) => isDoctorRole(user.role))
      .map((user) => ({
        id: String(user.id || ''),
        name: String(user.name || ''),
        email: String(user.email || ''),
      }))
  }

  const loadDoctorScheduleData = async (doctor) => {
    if (!doctor?.id) {
      return null
    }
    const response = await getDoctorSchedule(doctor.id, doctor.name ? { doctorName: doctor.name } : {})
    return response?.schedule || null
  }

  useEffect(() => {
    let cancelled = false

    const loadOwners = async () => {
      try {
        setIsLoadingOwners(true)
        setOwnerError('')
        const data = await loadOwnerManagementData()
        if (!cancelled) {
          setOwners(data.owners)
          setOwnerPetCounts(data.petCounts)
        }
      } catch (requestError) {
        if (!cancelled) {
          setOwners([])
          setOwnerPetCounts({})
          setOwnerError(requestError.message)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingOwners(false)
        }
      }
    }

    loadOwners()
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
    let profilePhoto = String(profile?.profilePhoto || '')
    const photoFile = formData.get('profilePhoto')
    if (photoFile instanceof File && photoFile.size > 0) {
      profilePhoto = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(new Error('Unable to read image file.'))
        reader.readAsDataURL(photoFile)
      })
    }
    const updates = {
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      preferredContact: String(formData.get('preferredContact') || 'Email'),
      profilePhoto,
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

  const handleRegisterOwner = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '').trim()
    const phone = String(formData.get('phone') || '').trim()
    const address = String(formData.get('address') || '').trim()
    const preferredContact = String(formData.get('preferredContact') || 'Email')

    try {
      setOwnerError('')
      setOwnerStatusMessage('')
      const registerResponse = await registerUser({
        name,
        email,
        password,
        role: 'pet-owner',
      })
      const createdUser = registerResponse?.user
      if (createdUser?.id) {
        await updateUserProfile(createdUser.id, {
          name,
          phone,
          address,
          preferredContact,
        })
      }
      const data = await loadOwnerManagementData()
      setOwners(data.owners)
      setOwnerPetCounts(data.petCounts)
      setOwnerStatusMessage('Pet owner registered successfully.')
      event.currentTarget.reset()
    } catch (requestError) {
      setOwnerError(requestError.message)
    }
  }

  const handleEditOwner = async (owner) => {
    const nextName = window.prompt('Owner name:', owner.name || '')
    if (nextName === null) {
      return
    }
    const nextPhone = window.prompt('Phone number:', owner.phone || '')
    if (nextPhone === null) {
      return
    }
    const nextAddress = window.prompt('Address:', owner.address || '')
    if (nextAddress === null) {
      return
    }
    const nextPreferred = window.prompt('Preferred contact (Email / Phone / SMS):', owner.preferredContact || 'Email')
    if (nextPreferred === null) {
      return
    }

    try {
      setOwnerError('')
      setOwnerStatusMessage('')
      const response = await updateUserProfile(owner.id, {
        name: String(nextName).trim(),
        phone: String(nextPhone).trim(),
        address: String(nextAddress).trim(),
        preferredContact: String(nextPreferred).trim() || 'Email',
      })
      const updated = response?.user
      if (updated) {
        setOwners((current) =>
          current.map((item) =>
            item.id === updated.id
              ? {
                  ...item,
                  name: updated.name || '',
                  phone: updated.phone || '',
                  address: updated.address || '',
                  preferredContact: updated.preferredContact || 'Email',
                }
              : item
          )
        )
      }
      setOwnerStatusMessage('Owner details updated.')
    } catch (requestError) {
      setOwnerError(requestError.message)
    }
  }

  const handleViewOwnerProfile = (owner) => {
    window.alert(
      `Owner: ${owner.name}\nEmail: ${owner.email}\nPhone: ${owner.phone || '-'}\nPreferred Contact: ${owner.preferredContact || '-'}\nAddress: ${owner.address || '-'}`
    )
  }

  const handleViewOwnerPets = async (owner) => {
    try {
      setOwnerError('')
      const response = await listPets({ userId: owner.id })
      const ownerPets = Array.isArray(response?.pets) ? response.pets : []
      if (!ownerPets.length) {
        window.alert(`${owner.name} has no pets registered.`)
        return
      }
      const lines = ownerPets.map((pet) => `- ${pet.name} (${pet.breed || 'Unknown breed'})`)
      window.alert(`${owner.name}'s pets:\n${lines.join('\n')}`)
    } catch (requestError) {
      setOwnerError(requestError.message)
    }
  }

  const refreshOwnersAndPets = async () => {
    const [ownerData, petData] = await Promise.all([loadOwnerManagementData(), loadPetRecordsData()])
    setOwners(ownerData.owners)
    setOwnerPetCounts(ownerData.petCounts)
    setPets(petData)
  }

  const handleCreatePetRecord = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const ownerId = String(formData.get('ownerId') || '').trim()
    const selectedOwner = owners.find((owner) => owner.id === ownerId)
    const payload = {
      ownerId,
      ownerName: selectedOwner?.name || '',
      name: String(formData.get('name') || '').trim(),
      breed: String(formData.get('breed') || '').trim(),
      age: String(formData.get('age') || '').trim(),
      weight: String(formData.get('weight') || '').trim(),
      vaccinationStatus: String(formData.get('vaccinationStatus') || '').trim(),
    }

    try {
      setPetRecordError('')
      setPetRecordStatusMessage('')
      await createPet(payload)
      await refreshOwnersAndPets()
      setPetRecordStatusMessage('Pet added to pet_data successfully.')
      event.currentTarget.reset()
    } catch (requestError) {
      setPetRecordError(requestError.message)
    }
  }

  const handleUpdatePetWeight = async (pet) => {
    const newWeight = window.prompt('Enter new weight:', pet.weight || '')
    if (newWeight === null) {
      return
    }
    try {
      setPetRecordError('')
      setPetRecordStatusMessage('')
      const response = await updatePetById(pet.id, { weight: String(newWeight).trim() })
      const updated = response?.pet
      if (updated) {
        setPets((current) => current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)))
      }
      setPetRecordStatusMessage('Pet weight updated.')
    } catch (requestError) {
      setPetRecordError(requestError.message)
    }
  }

  const handleUpdateVaccinationStatus = async (pet) => {
    const newVaccination = window.prompt(
      'Enter vaccination date/status (e.g. 2026-03-22 or Up to date):',
      pet.vaccinationStatus || ''
    )
    if (newVaccination === null) {
      return
    }
    try {
      setPetRecordError('')
      setPetRecordStatusMessage('')
      const response = await updatePetById(pet.id, { vaccinationStatus: String(newVaccination).trim() })
      const updated = response?.pet
      if (updated) {
        setPets((current) => current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)))
      }
      setPetRecordStatusMessage('Vaccination status updated.')
    } catch (requestError) {
      setPetRecordError(requestError.message)
    }
  }

  const handleDeletePetRecord = async (pet) => {
    const confirmed = window.confirm(`Delete ${pet.name}? This will remove the pet from pet_data.`)
    if (!confirmed) {
      return
    }
    try {
      setPetRecordError('')
      setPetRecordStatusMessage('')
      await deletePetById(pet.id)
      await refreshOwnersAndPets()
      setPetRecordStatusMessage('Pet deleted from pet_data.')
    } catch (requestError) {
      setPetRecordError(requestError.message)
    }
  }

  const handleViewPetHistory = (pet) => {
    window.alert(
      `Pet: ${pet.name}\nOwner: ${pet.ownerName || '-'}\nBreed: ${pet.breed}\nAge: ${pet.age}\nWeight: ${pet.weight}\nVaccination: ${
        pet.vaccinationStatus || '-'
      }\n\nHistory is read-only for staff.`
    )
  }

  const handleUploadPetDocument = (pet) => {
    window.alert(`Document upload for ${pet.name} is UI-only right now. Backend storage is not configured yet.`)
  }

  const handleStaffNotificationSubmit = async (event) => {
    event.preventDefault()
    if (!profile?.id) {
      setStaffNotificationError('Please log in again to update notification settings.')
      return
    }
    const formData = new FormData(event.currentTarget)
    const notificationPreferences = {
      appointmentRequestAlerts: formData.get('appointmentRequestAlerts') === 'on',
      paymentConfirmationAlerts: formData.get('paymentConfirmationAlerts') === 'on',
      doctorScheduleChanges: formData.get('doctorScheduleChanges') === 'on',
      weeklyPerformanceSummary: formData.get('weeklyPerformanceSummary') === 'on',
      appointmentReminders: Boolean(profile?.notificationPreferences?.appointmentReminders),
      vaccinationReminders: Boolean(profile?.notificationPreferences?.vaccinationReminders),
      medicalRecordUpdates: Boolean(profile?.notificationPreferences?.medicalRecordUpdates),
      promotionalUpdates: Boolean(profile?.notificationPreferences?.promotionalUpdates),
    }

    try {
      setIsSavingStaffNotifications(true)
      setStaffNotificationError('')
      setStaffNotificationStatus('')
      const response = await updateUserProfile(profile.id, { notificationPreferences })
      setProfile(response?.user || profile)
      setStaffNotificationStatus('Notification preferences updated.')
    } catch (requestError) {
      setStaffNotificationError(requestError.message)
    } finally {
      setIsSavingStaffNotifications(false)
    }
  }

  const handleStaffPasswordSubmit = async (event) => {
    event.preventDefault()
    if (!profile?.id) {
      setStaffPasswordError('Please log in again to change password.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const currentPassword = String(formData.get('currentPassword') || '')
    const newPassword = String(formData.get('newPassword') || '')

    try {
      setIsChangingStaffPassword(true)
      setStaffPasswordError('')
      setStaffPasswordStatus('')
      await changeUserPassword(profile.id, { currentPassword, newPassword })
      setStaffPasswordStatus('Password updated successfully.')
      event.currentTarget.reset()
    } catch (requestError) {
      setStaffPasswordError(requestError.message)
    } finally {
      setIsChangingStaffPassword(false)
    }
  }

  const handleStaffTwoFactorToggle = async (enabled) => {
    if (!profile?.id) {
      setProfileError('Please log in again to update 2FA.')
      return
    }
    try {
      const response = await updateUserProfile(profile.id, { twoFactorEnabled: enabled })
      setProfile(response?.user || profile)
      setProfileStatus(enabled ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.')
    } catch (requestError) {
      setProfileError(requestError.message)
    }
  }

  const refreshSelectedDoctorSchedule = async () => {
    if (!selectedDoctor) {
      setDoctorSchedule(null)
      return
    }
    const schedule = await loadDoctorScheduleData(selectedDoctor)
    setDoctorSchedule(schedule)
    setClinicHours({
      mondayFriday: schedule?.clinicHours?.mondayFriday || '09:00 AM - 05:00 PM',
      saturday: schedule?.clinicHours?.saturday || '10:00 AM - 02:00 PM',
      sunday: schedule?.clinicHours?.sunday || 'Closed',
    })
  }

  const handleBlockUnavailableTime = async (event) => {
    event.preventDefault()
    if (!selectedDoctor) {
      setScheduleError('Select a doctor first.')
      return
    }
    const formData = new FormData(event.currentTarget)
    const body = {
      doctorName: selectedDoctor.name,
      date: String(formData.get('date') || '').trim(),
      startTime: String(formData.get('startTime') || '').trim(),
      endTime: String(formData.get('endTime') || '').trim(),
      reason: String(formData.get('reason') || '').trim() || 'Busy',
    }
    try {
      setIsSavingSchedule(true)
      setScheduleError('')
      setScheduleStatusMessage('')
      const response = await addDoctorBlockedSlot(selectedDoctor.id, body)
      const schedule = response?.schedule || null
      setDoctorSchedule(schedule)
      setScheduleStatusMessage('Unavailable time blocked.')
      event.currentTarget.reset()
    } catch (requestError) {
      setScheduleError(requestError.message)
    } finally {
      setIsSavingSchedule(false)
    }
  }

  const handleAssignEmergencySlot = async (event) => {
    event.preventDefault()
    if (!selectedDoctor) {
      setScheduleError('Select a doctor first.')
      return
    }
    const formData = new FormData(event.currentTarget)
    const body = {
      doctorName: selectedDoctor.name,
      date: String(formData.get('date') || '').trim(),
      startTime: String(formData.get('startTime') || '').trim(),
      endTime: String(formData.get('endTime') || '').trim(),
      slotType: 'emergency',
    }
    try {
      setIsSavingSchedule(true)
      setScheduleError('')
      setScheduleStatusMessage('')
      const response = await addDoctorAvailableSlot(selectedDoctor.id, body)
      setDoctorSchedule(response?.schedule || null)
      setScheduleStatusMessage('Emergency slot assigned.')
      event.currentTarget.reset()
    } catch (requestError) {
      setScheduleError(requestError.message)
    } finally {
      setIsSavingSchedule(false)
    }
  }

  const handleSaveClinicHours = async (event) => {
    event.preventDefault()
    if (!selectedDoctor) {
      setScheduleError('Select a doctor first.')
      return
    }
    try {
      setIsSavingSchedule(true)
      setScheduleError('')
      setScheduleStatusMessage('')
      const response = await updateDoctorClinicHours(selectedDoctor.id, {
        doctorName: selectedDoctor.name,
        mondayFriday: clinicHours.mondayFriday,
        saturday: clinicHours.saturday,
        sunday: clinicHours.sunday,
      })
      setDoctorSchedule(response?.schedule || null)
      setScheduleStatusMessage('Clinic hours updated.')
    } catch (requestError) {
      setScheduleError(requestError.message)
    } finally {
      setIsSavingSchedule(false)
    }
  }

  const handleRemoveScheduleSlot = async (slotType, slotId) => {
    if (!selectedDoctor) {
      return
    }
    try {
      setIsSavingSchedule(true)
      setScheduleError('')
      setScheduleStatusMessage('')
      const response = await deleteDoctorScheduleSlot(selectedDoctor.id, slotType, slotId)
      setDoctorSchedule(response?.schedule || null)
      setScheduleStatusMessage('Slot removed.')
    } catch (requestError) {
      setScheduleError(requestError.message)
    } finally {
      setIsSavingSchedule(false)
    }
  }

  const handleGenerateInvoice = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload = {
      invoiceId: String(formData.get('invoiceId') || '').trim(),
      appointmentId: String(formData.get('appointmentId') || '').trim(),
      ownerName: String(formData.get('ownerName') || '').trim(),
      petName: String(formData.get('petName') || '').trim(),
      doctorName: String(formData.get('doctorName') || '').trim(),
    }

    try {
      setIsSavingBilling(true)
      setBillingError('')
      setBillingStatusMessage('')
      const response = await createBillingRecord(payload)
      const created = response?.record
      if (created) {
        setBillingRecords((current) => [created, ...current])
        setSelectedBillingId(created.id)
      }
      setBillingStatusMessage('Invoice generated successfully.')
      event.currentTarget.reset()
    } catch (requestError) {
      setBillingError(requestError.message)
    } finally {
      setIsSavingBilling(false)
    }
  }

  const handleSaveCharges = async (event) => {
    event.preventDefault()
    if (!selectedBillingRecord?.id) {
      setBillingError('Select an invoice first.')
      return
    }
    const formData = new FormData(event.currentTarget)
    const payload = {
      consultationFee: Number(formData.get('consultationFee') || 0),
      serviceCharges: Number(formData.get('serviceCharges') || 0),
      medicineCharges: Number(formData.get('medicineCharges') || 0),
      labCharges: Number(formData.get('labCharges') || 0),
    }

    try {
      setIsSavingBilling(true)
      setBillingError('')
      setBillingStatusMessage('')
      const response = await updateBillingChargesById(selectedBillingRecord.id, payload)
      const updated = response?.record
      if (updated) {
        setBillingRecords((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      }
      setBillingStatusMessage('Charges saved.')
    } catch (requestError) {
      setBillingError(requestError.message)
    } finally {
      setIsSavingBilling(false)
    }
  }

  const handleRecordPayment = async (event) => {
    event.preventDefault()
    if (!selectedBillingRecord?.id) {
      setBillingError('Select an invoice first.')
      return
    }
    const formData = new FormData(event.currentTarget)
    const payload = {
      paymentMethod: String(formData.get('paymentMethod') || '').trim(),
      paymentDate: String(formData.get('paymentDate') || '').trim(),
      referenceNumber: String(formData.get('referenceNumber') || '').trim(),
      paymentStatus: String(formData.get('paymentStatus') || 'Pending').trim(),
    }

    try {
      setIsSavingBilling(true)
      setBillingError('')
      setBillingStatusMessage('')
      const response = await recordBillingPaymentById(selectedBillingRecord.id, payload)
      const updated = response?.record
      if (updated) {
        setBillingRecords((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      }
      setBillingStatusMessage('Payment recorded.')
    } catch (requestError) {
      setBillingError(requestError.message)
    } finally {
      setIsSavingBilling(false)
    }
  }

  const handleViewReceipt = async (billingId) => {
    try {
      setBillingError('')
      const response = await getBillingReceiptById(billingId)
      const receipt = response?.receipt
      if (!receipt) {
        return
      }
      window.alert(
        `Invoice: ${receipt.invoiceId}\nOwner: ${receipt.ownerName}\nPet: ${receipt.petName}\nDoctor: ${
          receipt.doctorName || '-'
        }\nAppointment: ${
          receipt.appointmentId || '-'
        }\nConsultation: ${receipt.consultationFee}\nService: ${receipt.serviceCharges}\nMedicine: ${receipt.medicineCharges}\nLab: ${
          receipt.labCharges
        }\nTotal: ${receipt.totalAmount}\nStatus: ${receipt.paymentStatus}\nMethod: ${receipt.paymentMethod}\nDate: ${
          receipt.paymentDate
        }\nReference: ${receipt.referenceNumber}`
      )
    } catch (requestError) {
      setBillingError(requestError.message)
    }
  }

  const handlePrintReceipt = async () => {
    if (!selectedBillingRecord?.id) {
      setBillingError('Select an invoice first.')
      return
    }
    await handleViewReceipt(selectedBillingRecord.id)
    window.print()
  }

  const handleApplyReportFilters = async () => {
    try {
      setIsLoadingReports(true)
      setReportError('')
      setReportStatusMessage('')
      const report = await loadReportsData()
      setReportMetrics(Array.isArray(report?.metrics) ? report.metrics : [])
      setReportTrendRows(Array.isArray(report?.trendRows) ? report.trendRows : [])
      setReportInsights(Array.isArray(report?.insights) ? report.insights : [])
      setReportStatusMessage('Report refreshed.')
    } catch (requestError) {
      setReportError(requestError.message)
    } finally {
      setIsLoadingReports(false)
    }
  }

  const handleSaveReportSnapshot = async () => {
    try {
      setReportError('')
      setReportStatusMessage('')
      await createReportSnapshot({
        range: reportRange,
        doctorName: reportDoctor,
        reportType,
        fromDate: reportFromDate,
        toDate: reportToDate,
      })
      const snapshots = await loadReportSnapshotsData()
      setReportSnapshots(snapshots)
      setReportStatusMessage('Report snapshot saved to database.')
    } catch (requestError) {
      setReportError(requestError.message)
    }
  }

  const handleExportReportCsv = () => {
    const rows = ['Period,Income,Appointments,Top Doctor']
    reportTrendRows.forEach((row) => {
      rows.push(`${row.period},${row.income},${row.appointments},${row.topDoctor}`)
    })
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', `staff-report-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportReportPdf = () => {
    window.print()
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
                <form className="st-filters" onSubmit={handleRegisterOwner}>
                  <label>
                    Full Name
                    <input name="name" type="text" placeholder="Enter owner name" required />
                  </label>
                  <label>
                    Email
                    <input name="email" type="email" placeholder="Enter email address" required />
                  </label>
                  <label>
                    Password
                    <input name="password" type="password" placeholder="Minimum 8 characters" minLength={8} required />
                  </label>
                  <label>
                    Phone Number
                    <input name="phone" type="tel" placeholder="Enter phone number" />
                  </label>
                  <label>
                    Preferred Contact
                    <select name="preferredContact" defaultValue="Email">
                      <option>Email</option>
                      <option>Phone</option>
                      <option>SMS</option>
                    </select>
                  </label>
                  <label>
                    Address
                    <input name="address" type="text" placeholder="Enter address" />
                  </label>
                  <button type="submit" className="st-plain-btn">
                    Register New Pet Owner
                  </button>
                </form>
                {ownerStatusMessage ? <p className="st-form-success">{ownerStatusMessage}</p> : null}
                {ownerError ? <p className="st-form-error">{ownerError}</p> : null}
              </article>

              <article className="st-card">
                <h3>Pet Owner Management</h3>
                <div className="st-filters">
                  <label>
                    Search Owner
                    <input
                      type="text"
                      value={ownerSearch}
                      placeholder="Search by name, email, or ID"
                      onChange={(event) => setOwnerSearch(event.target.value)}
                    />
                  </label>
                </div>
                <ul className="st-appointment-list">
                  {isLoadingOwners ? (
                    <li>
                      <div>
                        <strong>Loading owners...</strong>
                      </div>
                    </li>
                  ) : filteredOwners.length ? (
                    filteredOwners.map((owner) => (
                    <li key={owner.id}>
                      <div>
                        <strong>
                          {owner.id} - {owner.name}
                        </strong>
                        <p>
                          {owner.email}
                        </p>
                        <p>
                          {owner.phone || '-'} | Pets: {ownerPetCounts[owner.id] || 0}
                        </p>
                        <p>Preferred Contact: {owner.preferredContact || 'Email'}</p>
                      </div>
                      <div className="st-appointment-actions">
                        <button type="button" onClick={() => handleEditOwner(owner)}>
                          Edit Owner Details
                        </button>
                        <button type="button" onClick={() => handleViewOwnerProfile(owner)}>
                          View Profile
                        </button>
                        <button type="button" onClick={() => handleViewOwnerPets(owner)}>
                          View Owner’s Pets
                        </button>
                        <button type="button" disabled title="Deactivate flow is not configured yet.">
                          Deactivate (Soon)
                        </button>
                      </div>
                    </li>
                    ))
                  ) : (
                    <li>
                      <div>
                        <strong>No pet owners found.</strong>
                      </div>
                    </li>
                  )}
                </ul>
              </article>
            </div>
          ) : activePage === 'Pet Records' ? (
            <div className="st-appointments">
              <article className="st-card">
                <h3>Add Pet Basic Information</h3>
                <form className="st-filters" onSubmit={handleCreatePetRecord}>
                  <label>
                    Pet Owner
                    <select name="ownerId" required defaultValue="">
                      <option value="" disabled>
                        Select owner
                      </option>
                      {owners.map((owner) => (
                        <option key={owner.id} value={owner.id}>
                          {owner.name} ({owner.email})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Pet Name
                    <input name="name" type="text" placeholder="Enter pet name" required />
                  </label>
                  <label>
                    Breed
                    <input name="breed" type="text" placeholder="Enter breed" required />
                  </label>
                  <label>
                    Age
                    <input name="age" type="text" placeholder="Enter age" required />
                  </label>
                  <label>
                    Weight
                    <input name="weight" type="text" placeholder="Enter weight" required />
                  </label>
                  <label>
                    Vaccination Date / Status
                    <input name="vaccinationStatus" type="text" placeholder="e.g. 2026-03-22 / Up to date" required />
                  </label>
                  <button type="submit" className="st-plain-btn">
                    Add Pet Basic Information
                  </button>
                </form>
                {petRecordStatusMessage ? <p className="st-form-success">{petRecordStatusMessage}</p> : null}
                {petRecordError ? <p className="st-form-error">{petRecordError}</p> : null}
              </article>

              <article className="st-card">
                <h3>Pet Records</h3>
                <div className="st-filters">
                  <label>
                    Search Pet
                    <input
                      type="text"
                      value={petSearch}
                      placeholder="Search by pet, breed, owner, or ID"
                      onChange={(event) => setPetSearch(event.target.value)}
                    />
                  </label>
                </div>
                <ul className="st-appointment-list">
                  {isLoadingPets ? (
                    <li>
                      <div>
                        <strong>Loading pet records...</strong>
                      </div>
                    </li>
                  ) : filteredPets.length ? (
                    filteredPets.map((pet) => (
                    <li key={pet.id}>
                      <div>
                        <strong>
                          {pet.id} - {pet.name}
                        </strong>
                        <p>Owner: {pet.ownerName || pet.ownerId || '-'}</p>
                        <p>Breed: {pet.breed}</p>
                        <p>Age: {pet.age}</p>
                        <p>Weight: {pet.weight}</p>
                        <p>Vaccination Date/Status: {pet.vaccinationStatus}</p>
                        <p>History (Read-only): Basic info only for staff.</p>
                      </div>
                      <div className="st-appointment-actions">
                        <button type="button" onClick={() => handleUpdatePetWeight(pet)}>
                          Update Weight
                        </button>
                        <button type="button" onClick={() => handleUpdateVaccinationStatus(pet)}>
                          Update Vaccination Date
                        </button>
                        <button type="button" onClick={() => handleUploadPetDocument(pet)}>
                          Upload Documents
                        </button>
                        <button type="button" onClick={() => handleViewPetHistory(pet)}>
                          View Pet History
                        </button>
                        <button type="button" onClick={() => handleDeletePetRecord(pet)}>
                          Delete Pet
                        </button>
                      </div>
                    </li>
                    ))
                  ) : (
                    <li>
                      <div>
                        <strong>No pet records found in pet_data.</strong>
                      </div>
                    </li>
                  )}
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
                <div className="st-filters">
                  <label>
                    Doctor
                    <select value={selectedDoctorId} onChange={(event) => setSelectedDoctorId(event.target.value)}>
                      {doctors.length ? (
                        doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </option>
                        ))
                      ) : (
                        <option value="">No doctors found</option>
                      )}
                    </select>
                  </label>
                </div>
                <button type="button" className="st-plain-btn" onClick={refreshSelectedDoctorSchedule} disabled={isLoadingSchedule || !selectedDoctor}>
                  {isLoadingSchedule ? 'Loading...' : 'Refresh Availability'}
                </button>
                <ul className="st-appointment-list">
                  {isLoadingSchedule ? (
                    <li>
                      <div>
                        <strong>Loading schedule...</strong>
                      </div>
                    </li>
                  ) : availableSlots.length ? (
                    availableSlots.map((slot) => (
                    <li key={slot.id}>
                      <div>
                        <strong>{selectedDoctor?.name || 'Doctor'}</strong>
                        <p>
                          {slot.date} | {slot.startTime} - {slot.endTime}
                        </p>
                        <p>Status: {slot.slotType === 'emergency' ? 'Emergency Slot' : 'Available'}</p>
                      </div>
                      <div className="st-appointment-actions">
                        <button type="button" onClick={() => handleRemoveScheduleSlot('available', slot.id)}>
                          Remove
                        </button>
                      </div>
                    </li>
                    ))
                  ) : (
                    <li>
                      <div>
                        <strong>No availability slots set.</strong>
                      </div>
                    </li>
                  )}
                </ul>
                {scheduleStatusMessage ? <p className="st-form-success">{scheduleStatusMessage}</p> : null}
                {scheduleError ? <p className="st-form-error">{scheduleError}</p> : null}
              </article>

              <form className="st-card" onSubmit={handleBlockUnavailableTime}>
                <h3>Block Unavailable Time</h3>
                <div className="st-filters">
                  <label>
                    Date
                    <input name="date" type="date" required />
                  </label>
                  <label>
                    Start Time
                    <input name="startTime" type="time" required />
                  </label>
                  <label>
                    End Time
                    <input name="endTime" type="time" required />
                  </label>
                  <label>
                    Reason
                    <input name="reason" type="text" placeholder="Busy / Meeting / Leave" />
                  </label>
                </div>
                <button type="submit" className="st-plain-btn" disabled={isSavingSchedule || !selectedDoctor}>
                  {isSavingSchedule ? 'Saving...' : 'Block Time'}
                </button>
                <ul className="st-appointment-list">
                  {blockedSlots.map((slot) => (
                    <li key={slot.id}>
                      <div>
                        <strong>{selectedDoctor?.name || 'Doctor'}</strong>
                        <p>
                          {slot.date} | {slot.startTime} - {slot.endTime}
                        </p>
                        <p>{slot.reason || 'Busy'}</p>
                      </div>
                      <div className="st-appointment-actions">
                        <button type="button" onClick={() => handleRemoveScheduleSlot('blocked', slot.id)}>
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </form>

              <form className="st-card" onSubmit={handleSaveClinicHours}>
                <h3>Adjust Clinic Hours</h3>
                <div className="st-filters">
                  <label>
                    Monday - Friday
                    <input
                      type="text"
                      value={clinicHours.mondayFriday}
                      onChange={(event) => setClinicHours((current) => ({ ...current, mondayFriday: event.target.value }))}
                    />
                  </label>
                  <label>
                    Saturday
                    <input
                      type="text"
                      value={clinicHours.saturday}
                      onChange={(event) => setClinicHours((current) => ({ ...current, saturday: event.target.value }))}
                    />
                  </label>
                  <label>
                    Sunday
                    <input
                      type="text"
                      value={clinicHours.sunday}
                      onChange={(event) => setClinicHours((current) => ({ ...current, sunday: event.target.value }))}
                    />
                  </label>
                </div>
                <button type="submit" className="st-plain-btn" disabled={isSavingSchedule || !selectedDoctor}>
                  {isSavingSchedule ? 'Saving...' : 'Save Clinic Hours'}
                </button>
              </form>

              <form className="st-card" onSubmit={handleAssignEmergencySlot}>
                <h3>Assign Emergency Slots</h3>
                <div className="st-filters">
                  <label>
                    Date
                    <input name="date" type="date" required />
                  </label>
                  <label>
                    Start Time
                    <input name="startTime" type="time" required />
                  </label>
                  <label>
                    End Time
                    <input name="endTime" type="time" required />
                  </label>
                </div>
                <button type="submit" className="st-plain-btn" disabled={isSavingSchedule || !selectedDoctor}>
                  {isSavingSchedule ? 'Saving...' : 'Assign Emergency Slot'}
                </button>
                <ul className="st-appointment-list">
                  {emergencySlots.length ? (
                    emergencySlots.map((slot) => (
                    <li key={slot.id}>
                      <div>
                        <strong>
                          {slot.date} | {slot.startTime} - {slot.endTime}
                        </strong>
                      </div>
                      <div className="st-appointment-actions">
                        <button type="button" onClick={() => handleRemoveScheduleSlot('available', slot.id)}>
                          Remove
                        </button>
                      </div>
                    </li>
                    ))
                  ) : (
                    <li>
                      <div>
                        <strong>No emergency slots assigned.</strong>
                      </div>
                    </li>
                  )}
                </ul>
              </form>
            </div>
          ) : activePage === 'Profile' ? (
            <div className="st-profile-layout">
              <article className="st-card st-profile-summary">
                <div className="st-profile-avatar" aria-hidden="true">
                  {profile?.profilePhoto ? <img src={profile.profilePhoto} alt="Profile" /> : profile?.name?.slice(0, 2).toUpperCase() || 'ST'}
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
                    Profile Photo
                    <input name="profilePhoto" type="file" accept="image/*" />
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
                <form className="st-toggle-list" onSubmit={handleStaffNotificationSubmit}>
                  <label>
                    <input
                      name="appointmentRequestAlerts"
                      type="checkbox"
                      defaultChecked={Boolean(profile?.notificationPreferences?.appointmentRequestAlerts)}
                    />
                    Appointment request alerts
                  </label>
                  <label>
                    <input
                      name="paymentConfirmationAlerts"
                      type="checkbox"
                      defaultChecked={Boolean(profile?.notificationPreferences?.paymentConfirmationAlerts)}
                    />
                    Payment confirmation alerts
                  </label>
                  <label>
                    <input
                      name="doctorScheduleChanges"
                      type="checkbox"
                      defaultChecked={Boolean(profile?.notificationPreferences?.doctorScheduleChanges)}
                    />
                    Doctor schedule changes
                  </label>
                  <label>
                    <input
                      name="weeklyPerformanceSummary"
                      type="checkbox"
                      defaultChecked={Boolean(profile?.notificationPreferences?.weeklyPerformanceSummary)}
                    />
                    Weekly performance summary
                  </label>
                  <button type="submit" className="st-plain-btn" disabled={isSavingStaffNotifications}>
                    {isSavingStaffNotifications ? 'Saving...' : 'Save Notification Preferences'}
                  </button>
                </form>
                {staffNotificationStatus ? <p className="st-form-success">{staffNotificationStatus}</p> : null}
                {staffNotificationError ? <p className="st-form-error">{staffNotificationError}</p> : null}
              </article>

              <article className="st-card">
                <h3>Security & Account</h3>
                <form className="st-profile-form" onSubmit={handleStaffPasswordSubmit}>
                  <label>
                    Current Password
                    <input name="currentPassword" type="password" required />
                  </label>
                  <label>
                    New Password
                    <input name="newPassword" type="password" minLength={8} required />
                  </label>
                  <button type="submit" className="st-plain-btn" disabled={isChangingStaffPassword}>
                    {isChangingStaffPassword ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
                {staffPasswordStatus ? <p className="st-form-success">{staffPasswordStatus}</p> : null}
                {staffPasswordError ? <p className="st-form-error">{staffPasswordError}</p> : null}
                <div className="st-toggle-list">
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(profile?.twoFactorEnabled)}
                      onChange={(event) => handleStaffTwoFactorToggle(event.target.checked)}
                    />
                    Enable Two-Factor Authentication
                  </label>
                </div>
              </article>
            </div>
          ) : activePage === 'Billing & Payments' ? (
            <div className="st-billing-layout">
              <article className="st-card st-billing-summary">
                {billingSummary.map((item) => (
                  <div key={item.title} className="st-billing-metric">
                    <p>{item.title}</p>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </article>

              <form className="st-card" onSubmit={handleGenerateInvoice}>
                <h3>Generate Invoice</h3>
                <div className="st-profile-form">
                  <label>
                    Invoice ID
                    <input name="invoiceId" type="text" placeholder="Leave empty to auto-generate" />
                  </label>
                  <label>
                    Appointment ID
                    <input name="appointmentId" type="text" placeholder="Enter appointment ID" />
                  </label>
                  <label>
                    Pet Owner Name
                    <input name="ownerName" type="text" placeholder="Enter owner name" required />
                  </label>
                  <label>
                    Pet Name
                    <input name="petName" type="text" placeholder="Enter pet name" required />
                  </label>
                  <label>
                    Doctor
                    <select name="doctorName" defaultValue="" required>
                      <option value="" disabled>
                        Select doctor
                      </option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.name}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button type="submit" className="st-plain-btn" disabled={isSavingBilling}>
                  {isSavingBilling ? 'Saving...' : 'Generate Invoice'}
                </button>
              </form>

              <form className="st-card" onSubmit={handleSaveCharges} key={`charges-${selectedBillingId || 'none'}`}>
                <h3>Charges</h3>
                <div className="st-filters">
                  <label>
                    Select Invoice
                    <select value={selectedBillingId} onChange={(event) => setSelectedBillingId(event.target.value)}>
                      {billingRecords.length ? (
                        billingRecords.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.invoiceId} | {item.ownerName} | {item.petName}
                          </option>
                        ))
                      ) : (
                        <option value="">No invoices</option>
                      )}
                    </select>
                  </label>
                </div>
                <div className="st-charge-grid">
                  <label>
                    Consultation Fee
                    <input name="consultationFee" type="number" step="0.01" min="0" defaultValue={selectedBillingRecord?.consultationFee || 0} />
                  </label>
                  <label>
                    Service Charges
                    <input name="serviceCharges" type="number" step="0.01" min="0" defaultValue={selectedBillingRecord?.serviceCharges || 0} />
                  </label>
                  <label>
                    Medicine Charges
                    <input name="medicineCharges" type="number" step="0.01" min="0" defaultValue={selectedBillingRecord?.medicineCharges || 0} />
                  </label>
                  <label>
                    Lab Charges
                    <input name="labCharges" type="number" step="0.01" min="0" defaultValue={selectedBillingRecord?.labCharges || 0} />
                  </label>
                </div>
                <div className="st-billing-total">
                  <span>Total Amount</span>
                  <strong>{selectedBillingRecord?.totalAmountDisplay || '฿0.00'}</strong>
                </div>
                <button type="submit" className="st-plain-btn" disabled={isSavingBilling || !selectedBillingRecord}>
                  {isSavingBilling ? 'Saving...' : 'Save Charges'}
                </button>
              </form>

              <form className="st-card" onSubmit={handleRecordPayment} key={`payment-${selectedBillingId || 'none'}`}>
                <h3>Record Payment</h3>
                <div className="st-profile-form">
                  <label>
                    Payment Method
                    <select name="paymentMethod" defaultValue={selectedBillingRecord?.paymentMethod || 'Card'}>
                      <option>Card</option>
                      <option>Cash</option>
                      <option>UPI</option>
                      <option>Bank Transfer</option>
                    </select>
                  </label>
                  <label>
                    Payment Date
                    <input name="paymentDate" type="date" defaultValue={selectedBillingRecord?.paymentDate || ''} />
                  </label>
                  <label>
                    Reference Number
                    <input name="referenceNumber" type="text" placeholder="Optional reference ID" defaultValue={selectedBillingRecord?.referenceNumber || ''} />
                  </label>
                  <label>
                    Payment Status
                    <select name="paymentStatus" defaultValue={selectedBillingRecord?.paymentStatus || 'Paid'}>
                      <option>Paid</option>
                      <option>Pending</option>
                      <option>Failed</option>
                    </select>
                  </label>
                </div>
                <div className="st-billing-actions">
                  <button type="submit" disabled={isSavingBilling || !selectedBillingRecord}>
                    {isSavingBilling ? 'Saving...' : 'Record Payment'}
                  </button>
                  <button type="button" onClick={handlePrintReceipt} disabled={!selectedBillingRecord}>
                    Print Receipt
                  </button>
                </div>
                {billingStatusMessage ? <p className="st-form-success">{billingStatusMessage}</p> : null}
                {billingError ? <p className="st-form-error">{billingError}</p> : null}
              </form>

              <article className="st-card st-history-card">
                <h3>Payment History</h3>
                <ul className="st-history-list">
                  {isLoadingBilling ? (
                    <li>
                      <div>
                        <strong>Loading payment history...</strong>
                      </div>
                    </li>
                  ) : billingRecords.length ? (
                    billingRecords.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.invoiceId}</strong>
                        <p>
                          {item.ownerName} | {item.petName}
                        </p>
                        <p>Doctor: {item.doctorName || '-'}</p>
                      </div>
                      <span>{item.totalAmountDisplay || formatBaht(item.totalAmount)}</span>
                      <span>{item.paymentMethod || '-'}</span>
                      <span className={`st-history-status st-history-${item.paymentStatus.toLowerCase()}`}>{item.paymentStatus}</span>
                      <button type="button" onClick={() => handleViewReceipt(item.id)}>
                        View
                      </button>
                    </li>
                    ))
                  ) : (
                    <li>
                      <div>
                        <strong>No billing records found.</strong>
                      </div>
                    </li>
                  )}
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
                    <select value={reportRange} onChange={(event) => setReportRange(event.target.value)}>
                      <option value="this-week">This Week</option>
                      <option value="this-month">This Month</option>
                      <option value="last-month">Last Month</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </label>
                  {reportRange === 'custom' ? (
                    <>
                      <label>
                        From
                        <input type="date" value={reportFromDate} onChange={(event) => setReportFromDate(event.target.value)} />
                      </label>
                      <label>
                        To
                        <input type="date" value={reportToDate} onChange={(event) => setReportToDate(event.target.value)} />
                      </label>
                    </>
                  ) : null}
                  <label>
                    Doctor
                    <select value={reportDoctor} onChange={(event) => setReportDoctor(event.target.value)}>
                      <option value="All">All Doctors</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.name}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Report Type
                    <select value={reportType} onChange={(event) => setReportType(event.target.value)}>
                      <option value="Financial + Operational">Financial + Operational</option>
                      <option value="Financial Only">Financial Only</option>
                      <option value="Appointments Only">Appointments Only</option>
                    </select>
                  </label>
                </div>
                <div className="st-billing-actions">
                  <button type="button" onClick={handleApplyReportFilters} disabled={isLoadingReports}>
                    {isLoadingReports ? 'Loading...' : 'Apply Filters'}
                  </button>
                  <button type="button" onClick={handleExportReportCsv}>
                    Export CSV
                  </button>
                  <button type="button" onClick={handleExportReportPdf}>
                    Export PDF
                  </button>
                  <button type="button" onClick={handleSaveReportSnapshot}>
                    Save Snapshot
                  </button>
                </div>
                {reportStatusMessage ? <p className="st-form-success">{reportStatusMessage}</p> : null}
                {reportError ? <p className="st-form-error">{reportError}</p> : null}
              </article>

              <article className="st-card st-reports-kpis">
                {reportMetrics.map((item) => (
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
                  {reportTrendRows.map((row) => (
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
                  {reportInsights.map((item) => (
                    <li key={item.title}>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="st-card">
                <h3>Saved Snapshots</h3>
                <ul className="st-report-trend-list">
                  {reportSnapshots.map((snapshot) => (
                    <li key={snapshot.id}>
                      <strong>
                        {snapshot.fromDate} to {snapshot.toDate}
                      </strong>
                      <span>
                        {snapshot.doctorName} | {snapshot.reportType}
                      </span>
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
