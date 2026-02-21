// HR System Utilities and Helpers

export const getVisaStatus = (expiryDate: string): 'active' | 'expiring-soon' | 'expired' => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'expiring-soon'
  return 'active'
}

export const getDaysUntilExpiry = (expiryDate: string): number => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export const calculateSalaryTotal = (salary: any) => {
  const basic = parseFloat(salary.basic) || 0
  const housing = parseFloat(salary.housing) || 0
  const food = parseFloat(salary.food) || 0
  const transportation = parseFloat(salary.transportation) || 0
  const telephone = parseFloat(salary.telephone) || 0
  const otherAllowances = parseFloat(salary.otherAllowances) || 0
  const totalAllowances = housing + food + transportation + telephone + otherAllowances
  return {
    ...salary,
    totalAllowances,
    total: basic + totalAllowances
  }
}

export const getDocumentStatus = (expiryDate?: string): 'valid' | 'expiring-soon' | 'expired' => {
  if (!expiryDate) return 'valid'
  
  const expiry = new Date(expiryDate)
  const today = new Date()
  const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'expiring-soon'
  return 'valid'
}

export const getDocumentTypeLabel = (type: string): string => {
  const labels: { [key: string]: string } = {
    'passport': 'Passport',
    'visa': 'Visa',
    'emirates-id': 'Emirates ID',
    'labor-card': 'Labor Card',
    'insurance': 'Insurance',
    'certification': 'Certification',
    'license': 'License',
    'contract': 'Contract',
    'other': 'Other'
  }
  return labels[type] || type
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700'
    case 'expiring-soon': return 'bg-yellow-100 text-yellow-700'
    case 'expired': return 'bg-red-100 text-red-700'
    case 'valid': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export const validateEmployeeData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!data.name?.trim()) errors.push('Full name is required')
  if (!data.email?.trim()) errors.push('Email is required')
  if (!data.phone?.trim()) errors.push('Phone is required')
  if (!data.role?.trim()) errors.push('Role is required')
  if (!data.salary?.basic) errors.push('Basic salary is required')
  
  return {
    valid: errors.length === 0,
    errors
  }
}
