// HR Module Types and Interfaces

export interface Document {
  id: string
  fileName: string
  fileType: string
  uploadDate: string
  expiryDate?: string
  documentType: 'passport' | 'visa' | 'emirates-id' | 'labor-card' | 'insurance' | 'certification' | 'license' | 'contract' | 'other'
  status: 'valid' | 'expiring-soon' | 'expired' | 'pending'
  fileUrl: string
  notes?: string
}

export interface Visa {
  id: string
  visaType: 'employee' | 'family' | 'investor' | 'tourist'
  visaNumber: string
  issueDate: string
  expiryDate: string
  sponsorName: string
  status: 'active' | 'expiring-soon' | 'expired'
  daysUntilExpiry: number
  documents: Document[]
}

export interface Salary {
  basic: number
  housing?: number
  transportation?: number
  food?: number
  telephone?: number
  otherAllowances?: number
  totalAllowances: number
  total: number
}

export interface Bonus {
  id: string
  title: string
  amount: number
  type: 'performance' | 'project' | 'annual' | 'special' | 'attendance'
  date: string
  month: string
  year: number
  description: string
  status: 'earned' | 'pending' | 'paid'
}

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email?: string
  country?: string
}

export interface Employee {
  id: string | number
  name: string
  email: string
  phone: string
  profileImage?: string
  role: string
  position?: string
  department: string
  status: 'Active' | 'On Leave' | 'Inactive'
  joinDate: string
  location: string
  rating: number
  salary: Salary
  bonus: Bonus[]
  visa?: Visa
  documents: Document[]
  emergencyContacts: EmergencyContact[]
  nationalityCountry?: string
  dateOfBirth?: string
  passportNumber?: string
  emiratesIdNumber?: string
  bankAccount?: string
  bankName?: string
  createdAt: string
  updatedAt: string
}

export interface VisaReminderAlert {
  employeeId: string
  employeeName: string
  visaExpiryDate: string
  daysRemaining: number
  notificationSent: boolean
  sentAt?: string
}
