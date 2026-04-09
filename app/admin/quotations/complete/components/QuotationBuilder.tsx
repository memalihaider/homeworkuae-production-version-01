'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  Plus, Trash2, Save, Eye, Percent, Banknote, 
  User, Building2, MapPin, Mail, Phone, ShoppingCart, 
  Settings, FileText, ChevronDown, Check, X, CreditCard, FileCheck, UserPlus
} from 'lucide-react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDocs, getDoc, query, where } from 'firebase/firestore'
import SearchSuggestSelect from '@/components/ui/search-suggest-select'
import RichTextEditor from '@/components/ui/rich-text-editor'

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  status: string;
}

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  sku: string;
  type?: string;
  categoryName?: string;
  category?: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  status: string;
}

interface Props {
  initialData?: any;
  onSave?: (data: any) => void;
  onCancel: () => void;
}

const DEFAULT_BANK_DETAILS = {
  accountName: 'HOMEWORK CLEANING SERVICES LLC',
  accountNumber: '',
  bankName: 'Emirates NBD',
  swiftCode: '',
  iban: ''
}

export default function QuotationBuilder({ initialData, onSave, onCancel }: Props) {
  // 👇 NEW STATES FOR EDIT MODE
  const [isEditing, setIsEditing] = useState(false);
  const [quotationId, setQuotationId] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>(() => {
    let saved: any = {}
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('quotationDefaults')
        if (raw) saved = JSON.parse(raw)
      } catch {}
    }
    return {
      quoteNumber: `#QT-${Date.now().toString().slice(-4)}-${new Date().getFullYear()}`,
      clientId: '',
      client: '',
      company: '',
      email: '',
      phone: '',
      location: '',
      currentAddress: '',
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: 'AED',
      taxRate: 5,
      discount: 0,
      discountType: 'percentage',
      template: 'professional',
      status: 'Approved',
      selectedCategory: '',
      outcomeRemarks: '',
      upsales: [],
      services: [],
      option2Heading: 'Option 2 - Comparative Offer',
      showOption2InPdf: false,
      option2Services: [],
      products: [],
      quoteNote: saved.quoteNote ?? '',
      showQuoteNoteInPdf: saved.showQuoteNoteInPdf ?? true,
      notes: saved.notes ?? '',
      terms: saved.terms ?? '',
      createdBy: '', // Store employee ID for dropdown selection
      createdByName: '', // Store employee name for Firebase
      createdByPhone: '',
      assignedTo: '',
      assignedToName: '',
      showAssignedToInPdf: false,
      confirmationLetter: saved.confirmationLetter ?? '',
      companySealImage: saved.companySealImage ?? '',
      bankDetails: {
        ...DEFAULT_BANK_DETAILS,
        ...(saved.bankDetails ?? {})
      },
      paymentMethods: ['bank-transfer']
    }
  })

  const [saveSuccess, setSaveSuccess] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [showCustomClient, setShowCustomClient] = useState(false)
  const [customClient, setCustomClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    currentAddress: ''
  })

  // 👇 NEW EFFECT - Handle initialData for editing
  useEffect(() => {
    if (initialData && initialData.id) {
      setIsEditing(true)
      setQuotationId(initialData.id)

      setFormData((prev: any) => ({
        ...prev,
        quoteNumber: initialData.quoteNumber || prev.quoteNumber,
        clientId: initialData.clientId || prev.clientId || '',
        client: initialData.client || prev.client || '',
        company: initialData.company || prev.company || '',
        email: initialData.email || prev.email || '',
        phone: initialData.phone || prev.phone || '',
        location: initialData.location || prev.location || '',
        currentAddress: initialData.currentAddress || prev.currentAddress || '',
        date: initialData.date || prev.date || new Date().toISOString().split('T')[0],
        validUntil: initialData.validUntil || prev.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dueDate: initialData.dueDate || prev.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: initialData.currency || prev.currency || 'AED',
        taxRate: typeof initialData.taxRate === 'number' ? initialData.taxRate : prev.taxRate,
        discount: typeof initialData.discount === 'number' ? initialData.discount : prev.discount,
        discountType: initialData.discountType || prev.discountType || 'percentage',
        template: initialData.template || prev.template || 'professional',
        status: initialData.status || prev.status || 'Approved',
        selectedCategory: initialData.selectedCategory || prev.selectedCategory || '',
        outcomeRemarks: initialData.outcomeRemarks ?? prev.outcomeRemarks ?? '',
        upsales: initialData.upsales || prev.upsales || [],
        services: initialData.services || prev.services || [],
        option2Heading: initialData.option2Heading || prev.option2Heading || 'Option 2 - Comparative Offer',
        showOption2InPdf: Boolean(initialData.showOption2InPdf ?? prev.showOption2InPdf),
        option2Services: initialData.option2Services || prev.option2Services || [],
        products: initialData.products || prev.products || [],
        quoteNote: initialData.quoteNote ?? prev.quoteNote ?? '',
        showQuoteNoteInPdf: Boolean(initialData.showQuoteNoteInPdf ?? prev.showQuoteNoteInPdf ?? true),
        notes: initialData.notes ?? prev.notes ?? '',
        terms: initialData.terms ?? prev.terms ?? '',
        createdBy: initialData.createdById || prev.createdBy || '',
        createdByName: initialData.createdBy || prev.createdByName || '',
        createdByPhone: initialData.createdByPhone || prev.createdByPhone || '',
        assignedTo: initialData.assignedToId || prev.assignedTo || '',
        assignedToName: initialData.assignedTo || prev.assignedToName || '',
        showAssignedToInPdf: Boolean(initialData.showAssignedToInPdf ?? prev.showAssignedToInPdf ?? false),
        confirmationLetter: initialData.confirmationLetter ?? prev.confirmationLetter ?? '',
        companySealImage: initialData.companySealImage ?? prev.companySealImage ?? '',
        bankDetails: {
          ...DEFAULT_BANK_DETAILS,
          ...(prev.bankDetails || {}),
          ...(initialData.bankDetails || {})
        },
        paymentMethods: initialData.paymentMethods || prev.paymentMethods || ['bank-transfer']
      }))
    } else {
      setIsEditing(false)
      setQuotationId(null)
    }
  }, [initialData])

  useEffect(() => {
    if (!initialData?.id || employees.length === 0) {
      return
    }

    setFormData((prev: any) => {
      if (prev.createdBy && prev.createdByName && (!prev.assignedTo || prev.assignedToName)) {
        return prev
      }

      let createdByName = initialData.createdBy || prev.createdByName || ''
      let createdById = initialData.createdById || prev.createdBy || ''
      let createdByPhone = initialData.createdByPhone || prev.createdByPhone || ''

      if (createdById) {
        const employeeById = employees.find(e => e.id === createdById)
        if (employeeById) {
          createdByName = employeeById.name || createdByName
          createdByPhone = employeeById.phone || createdByPhone
        }
      } else if (createdByName) {
        const employeeByName = employees.find(e => e.name === createdByName)
        if (employeeByName) {
          createdById = employeeByName.id
          createdByPhone = employeeByName.phone || createdByPhone
        }
      }

      let assignedToName = initialData.assignedTo || prev.assignedToName || ''
      let assignedToId = initialData.assignedToId || prev.assignedTo || ''

      if (assignedToId) {
        const assignedEmployeeById = employees.find(e => e.id === assignedToId)
        if (assignedEmployeeById) {
          assignedToName = assignedEmployeeById.name || assignedToName
        }
      } else if (assignedToName) {
        const assignedEmployeeByName = employees.find(e => e.name === assignedToName)
        if (assignedEmployeeByName) {
          assignedToId = assignedEmployeeByName.id
        }
      }

      if (!createdById && !createdByName && !createdByPhone && !assignedToId && !assignedToName) {
        return prev
      }

      return {
        ...prev,
        createdBy: createdById || prev.createdBy,
        createdByName: createdByName || prev.createdByName,
        createdByPhone: createdByPhone || prev.createdByPhone,
        assignedTo: assignedToId || prev.assignedTo,
        assignedToName: assignedToName || prev.assignedToName
      }
    })
  }, [initialData, employees])

  // Fetch real data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) return
      fetchAllData()
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (initialData && initialData.id) return

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return

      try {
        const settingsRef = doc(db, 'profile-setting', 'admin-settings')
        const settingsSnap = await getDoc(settingsRef)

        if (!settingsSnap.exists()) return

        const settings = settingsSnap.data()
        const quotationDefaults = settings?.quotationDefaults || {}
        const bankDetailsFromSettings = quotationDefaults?.bankDetails || {}

        setFormData((prev: any) => ({
          ...prev,
          taxRate: typeof settings?.taxPercentage === 'number' ? settings.taxPercentage : prev.taxRate,
          quoteNote: quotationDefaults.quoteNote ?? prev.quoteNote,
          showQuoteNoteInPdf: Boolean(quotationDefaults.showQuoteNoteInPdf ?? prev.showQuoteNoteInPdf ?? true),
          notes: quotationDefaults.notes ?? prev.notes,
          terms: quotationDefaults.terms ?? prev.terms,
          confirmationLetter: quotationDefaults.confirmationLetter ?? prev.confirmationLetter,
          companySealImage: quotationDefaults.companySealImage ?? prev.companySealImage,
          bankDetails: {
            ...DEFAULT_BANK_DETAILS,
            ...bankDetailsFromSettings
          }
        }))
      } catch (error: any) {
        if (error?.code === 'permission-denied') {
          console.warn('Skipping quotation defaults load due to Firestore permissions for current user.')
          return
        }
        console.error('Error loading quotation defaults from settings:', error)
      }
    })

    return () => unsubscribe()
  }, [initialData])

  const fetchAllData = async () => {
    if (!auth.currentUser) {
      return
    }

    try {
      // Fetch clients from 'clients' collection
      const clientsSnapshot = await getDocs(collection(db, 'clients'))
      const clientsData = clientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[]
      setClients(clientsData)

      // Fetch ONLY Won and Qualified leads from 'leads' collection
      const leadsQuery = query(
        collection(db, 'leads'),
        where('status', 'in', ['Won', 'Qualified'])
      )
      const leadsSnapshot = await getDocs(leadsQuery)
      const leadsData = leadsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[]
      setLeads(leadsData)

      // Fetch services from 'services' collection where type is 'SERVICE'
      const servicesQuery = query(
        collection(db, 'services'),
        where('type', '==', 'SERVICE')
      )
      const servicesSnapshot = await getDocs(servicesQuery)
      const servicesData = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[]

      // Also read from local products/services storage used by admin products module.
      // This ensures quotation builder picks descriptions for newly added catalog items.
      let localCatalogServices: Service[] = []
      if (typeof window !== 'undefined') {
        try {
          const rawProducts = localStorage.getItem('homeware_products')
          if (rawProducts) {
            const parsed = JSON.parse(rawProducts) as any[]
            localCatalogServices = parsed
              .filter((item) => item?.type === 'SERVICE' || item?.type === 'PRODUCT')
              .map((item) => ({
                id: item.id || `local_${item.name}`,
                name: item.name || '',
                price: Number(item.price) || 0,
                description: item.description || '',
                sku: item.sku || '',
                type: item.type || 'SERVICE'
              }))
          }
        } catch (storageError) {
          console.warn('Could not read local product catalog for quotation builder:', storageError)
        }
      }

      const mergedServicesMap = new Map<string, Service>()
      ;[...servicesData, ...localCatalogServices].forEach((item) => {
        if (!item?.name) return
        const key = `${item.name.toLowerCase()}|${item.type || 'SERVICE'}`
        if (!mergedServicesMap.has(key)) {
          mergedServicesMap.set(key, item)
        }
      })

      setServices(Array.from(mergedServicesMap.values()))

      // Fetch employees for Created By dropdown
      const employeesQuery = query(collection(db, 'employees'), where('status', '==', 'Active'))
      const employeesSnapshot = await getDocs(employeesQuery)
      const employeesData = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[]
      setEmployees(employeesData)

    } catch (error) {
      if ((error as any)?.code === 'permission-denied') {
        console.warn('Quotation builder data load skipped due to Firestore permissions for current user.')
        return
      }
      console.error('Error fetching data:', error)
      alert('Error loading data')
    }
  }

  // Combine clients and filtered leads for dropdown
  const allContacts = [
    ...clients.map(client => ({
      id: `client_${client.id}`,
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      location: client.location,
      type: 'Client',
      status: client.status
    })),
    ...leads.map(lead => ({
      id: `lead_${lead.id}`,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      location: lead.address || '',
      type: 'Lead',
      status: lead.status
    }))
  ]

  const filteredEmployees = employees
  const filteredClients = clients
  const filteredLeads = leads

  const memberOptions = useMemo(() => {
    return filteredEmployees.map((employee) => ({
      value: employee.id,
      label: `${employee.name} - ${employee.position} (${employee.department})`,
      keywords: [employee.email || '', employee.department || '', employee.position || '']
    }))
  }, [filteredEmployees])

  const contactOptions = useMemo(() => {
    const clientOptions = filteredClients.map((client) => ({
      value: `client_${client.id}`,
      label: `${client.name} - ${client.company} (Client)`,
      keywords: [client.email || '', client.phone || '', client.location || '']
    }))

    const leadOptions = filteredLeads.map((lead) => ({
      value: `lead_${lead.id}`,
      label: `${lead.name} - ${lead.company} (${lead.status} Lead)`,
      keywords: [lead.email || '', lead.phone || '', lead.address || '', lead.status || '']
    }))

    return [...clientOptions, ...leadOptions]
  }, [filteredClients, filteredLeads])

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(
      services
        .map((svc) => svc.categoryName || svc.category || svc.type || '')
        .filter(Boolean)
        .map((value) => String(value).trim())
        .filter(Boolean)
    )).sort((a, b) => a.localeCompare(b))

    return categories.map((category) => ({
      value: category,
      label: category,
    }))
  }, [services])

  const serviceOptions = useMemo(() => {
    return services.map((svc) => ({
      value: svc.id,
      label: `${svc.name} (${svc.type || 'SERVICE'}) - ${Number(svc.price || 0).toLocaleString()}`,
      keywords: [svc.name, svc.description || '', svc.sku || '', svc.type || '']
    }))
  }, [services])

  // Fix the calculation error
  const calculations = useMemo(() => {
    const servicesTotal = (formData.services || []).reduce((sum: number, s: any) => {
      const total = s.total || 0;
      return sum + (typeof total === 'number' ? total : 0);
    }, 0);
    
    const productsTotal = (formData.products || []).reduce((sum: number, p: any) => {
      const total = p.total || 0;
      return sum + (typeof total === 'number' ? total : 0);
    }, 0);
    
    const subtotal = servicesTotal + productsTotal;
    
    let discountAmount = 0;
    if (formData.discountType === 'percentage') {
      discountAmount = (subtotal * (formData.discount || 0)) / 100;
    } else {
      discountAmount = formData.discount || 0;
    }

    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const taxAmount = (afterDiscount * (formData.taxRate || 0)) / 100;
    const total = afterDiscount + taxAmount;

    return { 
      subtotal: subtotal || 0, 
      discountAmount: discountAmount || 0, 
      taxAmount: taxAmount || 0, 
      total: total || 0 
    };
  }, [formData])

  // 👇 UPDATED saveToFirebase function with edit support
  const saveToFirebase = async (quotationData: any) => {
    if (!auth.currentUser) {
      alert('Please login again to continue.')
      return null
    }

    setSaveSuccess(false)
    
    try {
      // Recalculate totals before saving
      const servicesTotal = (quotationData.services || []).reduce((sum: number, s: any) => sum + (s.total || 0), 0)
      const productsTotal = (quotationData.products || []).reduce((sum: number, p: any) => sum + (p.total || 0), 0)
      const subtotal = servicesTotal + productsTotal
      
      let discountAmount = 0
      if (quotationData.discountType === 'percentage') {
        discountAmount = (subtotal * (quotationData.discount || 0)) / 100
      } else {
        discountAmount = quotationData.discount || 0
      }

      const afterDiscount = subtotal - discountAmount
      const taxAmount = (afterDiscount * (quotationData.taxRate || 0)) / 100
      const total = afterDiscount + taxAmount

      // Prepare data for Firebase
      const firebaseData = {
        // Basic info
        quoteNumber: quotationData.quoteNumber,
        clientId: quotationData.clientId,
        client: quotationData.client,
        company: quotationData.company,
        email: quotationData.email,
        phone: quotationData.phone,
        location: quotationData.location,
        currentAddress: quotationData.currentAddress,
        
        // Dates
        date: quotationData.date,
        validUntil: quotationData.validUntil,
        dueDate: quotationData.dueDate,
        
        // Financial
        currency: quotationData.currency,
        taxRate: quotationData.taxRate,
        discount: quotationData.discount,
        discountType: quotationData.discountType,
        
        // Calculations
        subtotal: subtotal,
        discountAmount: discountAmount,
        taxAmount: taxAmount,
        total: total,
        
        // Other
        template: quotationData.template,
        status: isEditing ? (quotationData.status || 'Approved') : 'Approved',
        selectedCategory: quotationData.selectedCategory || '',
        outcomeRemarks: quotationData.outcomeRemarks || '',
        upsales: quotationData.upsales || [],
        option2Heading: quotationData.option2Heading || 'Option 2 - Comparative Offer',
        showOption2InPdf: Boolean(quotationData.showOption2InPdf),
        quoteNote: quotationData.quoteNote || '',
        showQuoteNoteInPdf: Boolean(quotationData.showQuoteNoteInPdf),
        notes: quotationData.notes,
        terms: quotationData.terms,
        createdBy: quotationData.createdByName || '', // Save employee name
        createdById: quotationData.createdBy || '', // Save employee ID for future edits
        createdByPhone: quotationData.createdByPhone || '',
        assignedTo: quotationData.assignedToName || '',
        assignedToId: quotationData.assignedTo || '',
        showAssignedToInPdf: Boolean(quotationData.showAssignedToInPdf),
        confirmationLetter: quotationData.confirmationLetter || '',
        companySealImage: quotationData.companySealImage || '',
        bankDetails: {
          ...DEFAULT_BANK_DETAILS,
          ...(quotationData.bankDetails || {})
        },
        paymentMethods: quotationData.paymentMethods,
        
        // Services and Products
        services: (quotationData.services || []).map((service: any) => ({
          id: service.id,
          name: service.name || '',
          description: service.description || '',
          quantity: service.quantity || 0,
          unitPrice: service.unitPrice || 0,
          total: service.total || 0
        })),
        option2Services: (quotationData.option2Services || []).map((service: any) => ({
          id: service.id,
          name: service.name || '',
          description: service.description || '',
          quantity: service.quantity || 0,
          unitPrice: service.unitPrice || 0,
          total: service.total || 0
        })),
        
        products: (quotationData.products || []).map((product: any) => ({
          id: product.id,
          name: product.name || '',
          sku: product.sku || '',
          description: product.description || '',
          quantity: product.quantity || 0,
          unitPrice: product.unitPrice || 0,
          total: product.total || 0
        })),
        
        // Metadata
        updatedAt: serverTimestamp(),
        createdByUser: 'user'
      }

      let docRef;
      
      // 👇 CHECK IF EDITING OR NEW
      if (isEditing && quotationId) {
        // UPDATE existing quotation
        const quotationDoc = doc(db, "quotations", quotationId);
        await updateDoc(quotationDoc, {
          ...firebaseData,
          updatedAt: serverTimestamp()
        });
        docRef = { id: quotationId };
        console.log("Quotation updated with ID: ", quotationId);
        alert(`✅ Quotation updated successfully`);
      } else {
        // CREATE new quotation
        const newData = {
          ...firebaseData,
          createdAt: serverTimestamp(),
        };
        docRef = await addDoc(collection(db, "quotations"), newData);
        console.log("Quotation saved with ID: ", docRef.id);
        alert(`✅ Quotation saved successfully`);
      }

      // Persist Payment Terms, T&C, Bank Details, and Confirmation Letter as defaults for new quotations
      try {
        localStorage.setItem('quotationDefaults', JSON.stringify({
          quoteNote: quotationData.quoteNote ?? '',
          showQuoteNoteInPdf: Boolean(quotationData.showQuoteNoteInPdf ?? true),
          notes: quotationData.notes ?? '',
          terms: quotationData.terms ?? '',
          confirmationLetter: quotationData.confirmationLetter ?? '',
          companySealImage: quotationData.companySealImage ?? '',
          bankDetails: quotationData.bankDetails ?? {}
        }))
      } catch {}

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      
      if (onSave) {
        onSave({ ...firebaseData, firebaseId: docRef.id })
      }
      
      return docRef.id
      
    } catch (error) {
      console.error("Error saving quotation: ", error)
      alert("❌ Error saving quotation. Please try again.")
      return null
    }
  }

  const handleSave = async () => {
    if (!formData.client || formData.client === '') {
      alert('⚠️ Please select a client before saving.')
      return
    }

    if (!formData.createdBy) {
      alert('⚠️ Please select the member who created this quotation.')
      return
    }

    if (formData.services.length === 0 && formData.products.length === 0) {
      alert('⚠️ Please add at least one service or product before saving.')
      return
    }

    await saveToFirebase(formData)
  }

  const handleAddService = () => {
    const newService = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      description: ''
    }
    setFormData((prev: any) => ({ ...prev, services: [...prev.services, newService] }))
  }

  const handleUpdateService = (id: string, field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = prev.services.map((s: any) => {
        if (s.id === id) {
          const up = { ...s, [field]: value }
          if (field === 'quantity' || field === 'unitPrice') {
            up.total = (up.quantity || 0) * (up.unitPrice || 0)
          }
          return up
        }
        return s
      })
      return { ...prev, services: updated }
    })
  }

  const handleRemoveService = (id: string) => {
    setFormData({ ...formData, services: formData.services.filter((s: any) => s.id !== id) })
  }

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      sku: '',
      description: ''
    }
    setFormData((prev: any) => ({ ...prev, products: [...prev.products, newProduct] }))
  }

  const handleUpdateProduct = (id: string, field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = prev.products.map((p: any) => {
        if (p.id === id) {
          const up = { ...p, [field]: value }
          if (field === 'quantity' || field === 'unitPrice') {
            up.total = (up.quantity || 0) * (up.unitPrice || 0)
          }
          return up
        }
        return p
      })
      return { ...prev, products: updated }
    })
  }

  const handleRemoveProduct = (id: string) => {
    setFormData({ ...formData, products: formData.products.filter((p: any) => p.id !== id) })
  }

  const handleAddOption2Service = () => {
    const newService = {
      id: `opt2_${Date.now().toString()}`,
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      description: ''
    }
    setFormData((prev: any) => ({ ...prev, option2Services: [...(prev.option2Services || []), newService] }))
  }

  const handleUpdateOption2Service = (id: string, field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = (prev.option2Services || []).map((s: any) => {
        if (s.id === id) {
          const up = { ...s, [field]: value }
          if (field === 'quantity' || field === 'unitPrice') {
            up.total = (up.quantity || 0) * (up.unitPrice || 0)
          }
          return up
        }
        return s
      })
      return { ...prev, option2Services: updated }
    })
  }

  const handleRemoveOption2Service = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      option2Services: (prev.option2Services || []).filter((s: any) => s.id !== id)
    }))
  }

  const selectContact = (contactId: string) => {
    const contact = allContacts.find(c => c.id === contactId)
    if (contact) {
      setFormData({
        ...formData,
        clientId: contact.id,
        client: contact.name,
        company: contact.company,
        email: contact.email,
        phone: contact.phone,
        location: contact.location,
        currentAddress: contact.location
      })
      // Hide custom client form when selecting from dropdown
      setShowCustomClient(false)
    }
  }

  const handleAddCustomClient = () => {
    if (!customClient.name.trim()) {
      alert('Please enter client name')
      return
    }
    
    // Set custom client to form
    setFormData({
      ...formData,
      clientId: `custom_${Date.now()}`,
      client: customClient.name,
      company: customClient.company,
      email: customClient.email,
      phone: customClient.phone,
      location: customClient.location,
      currentAddress: customClient.currentAddress || customClient.location
    })
    
    // Reset and close custom client form
    setCustomClient({
      name: '',
      company: '',
      email: '',
      phone: '',
      location: '',
      currentAddress: ''
    })
    setShowCustomClient(false)
    
    alert(`Custom client "${customClient.name}" added successfully!`)
  }

  const handleCancelCustomClient = () => {
    setCustomClient({
      name: '',
      company: '',
      email: '',
      phone: '',
      location: '',
      currentAddress: ''
    })
    setShowCustomClient(false)
  }

  // Handle bank details change
  const handleBankDetailChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      bankDetails: {
        ...formData.bankDetails,
        [field]: value
      }
    })
  }

  const handleCompanySealUpload = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      if (!result) return
      setFormData({ ...formData, companySealImage: result })
    }
    reader.readAsDataURL(file)
  }

  // Handle employee selection - store both ID and NAME
  const handleEmployeeSelect = (employeeId: string) => {
    const selectedEmployee = employees.find(e => e.id === employeeId)
    if (selectedEmployee) {
      setFormData({
        ...formData,
        createdBy: employeeId,        // Store ID for dropdown selection
        createdByName: selectedEmployee.name, // Store NAME for Firebase
        createdByPhone: selectedEmployee.phone || ''
      })
    }
  }

  const handleAssignedToSelect = (employeeId: string) => {
    if (!employeeId) {
      setFormData({
        ...formData,
        assignedTo: '',
        assignedToName: ''
      })
      return
    }

    const selectedEmployee = employees.find(e => e.id === employeeId)
    if (selectedEmployee) {
      setFormData({
        ...formData,
        assignedTo: employeeId,
        assignedToName: selectedEmployee.name
      })
    }
  }

  // Count of filtered items
  const clientsCount = clients.length
  const qualifiedLeadsCount = leads.length

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT: FORM */}
      <div className="flex-1 space-y-6">
        {/* Header Section */}
        <div className="bg-white border border-gray-300 rounded p-4 space-y-4 shadow-none">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
             <h3 className="text-sm font-bold uppercase tracking-tight text-black flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isEditing ? 'Edit Quotation' : 'Quotation Information'}
             </h3>
             <div className="flex items-center gap-2">
               <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                  {formData.quoteNumber}
                  {isEditing && <span className="ml-1 text-blue-600">(Editing)</span>}
               </span>
               {saveSuccess && (
                 <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    ✓ {isEditing ? 'Updated' : 'Saved'} 
                 </span>
               )}
             </div>
          </div>

          {/* Created By Section */}
          <div className="space-y-3 border-b border-gray-100 pb-4 mb-2">
            <h4 className="text-xs font-bold text-gray-700 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              Quotation Created By
            </h4>
            
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 mb-1 block">
                Select Member *
              </label>
              <SearchSuggestSelect
                value={formData.createdBy || ''}
                onChange={(value) => handleEmployeeSelect(value)}
                options={memberOptions}
                placeholder={filteredEmployees.length > 0 ? 'Search and select a member...' : 'No members available'}
                inputClassName="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                {employees.length} members available
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 mb-1 block">
                Assign Quotation To
              </label>
              <SearchSuggestSelect
                value={formData.assignedTo || ''}
                onChange={(value) => handleAssignedToSelect(value)}
                options={memberOptions}
                placeholder={filteredEmployees.length > 0 ? 'Search and assign to a member...' : 'No members available'}
                inputClassName="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
              />
              <label className="inline-flex items-center gap-2 text-xs text-gray-700 mt-2">
                <input
                  type="checkbox"
                  checked={Boolean(formData.showAssignedToInPdf)}
                  onChange={(e) => setFormData({ ...formData, showAssignedToInPdf: e.target.checked })}
                />
                Show assigned member in PDF header
              </label>
            </div>

            {formData.createdByName && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">Selected Creator:</span>{' '}
                  {formData.createdByName}
                </p>
                {formData.assignedToName && (
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">Assigned To:</span>{' '}
                    {formData.assignedToName}
                  </p>
                )}
                <p className="text-[9px] text-blue-600 mt-1">
                  Creator and assignee will be saved in Firebase
                </p>
              </div>
            )}
          </div>

          {/* Client Selection Section */}
          <div className="space-y-3">
            {/* Custom Client Button */}
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">
                Select Client/Lead
              </label>
              <button
                onClick={() => setShowCustomClient(!showCustomClient)}
                className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-3 h-3" />
                {showCustomClient ? 'Cancel Custom Client' : 'Add Custom Client'}
              </button>
            </div>

            {/* Custom Client Form */}
            {showCustomClient && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">Add New Client Details</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Client Name *</label>
                    <input
                      type="text"
                      placeholder="Enter client name"
                      value={customClient.name}
                      onChange={(e) => setCustomClient({...customClient, name: e.target.value})}
                      className="w-full px-3 py-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Company</label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={customClient.company}
                      onChange={(e) => setCustomClient({...customClient, company: e.target.value})}
                      className="w-full px-3 py-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Email</label>
                    <input
                      type="email"
                      placeholder="client@email.com"
                      value={customClient.email}
                      onChange={(e) => setCustomClient({...customClient, email: e.target.value})}
                      className="w-full px-3 py-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+971 50 123 4567"
                      value={customClient.phone}
                      onChange={(e) => setCustomClient({...customClient, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Location</label>
                    <input
                      type="text"
                      placeholder="Dubai Marina, UAE"
                      value={customClient.location}
                      onChange={(e) => setCustomClient({...customClient, location: e.target.value})}
                      className="w-full px-3 py-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Current Home Address</label>
                    <input
                      type="text"
                      placeholder="Apartment, building, street"
                      value={customClient.currentAddress}
                      onChange={(e) => setCustomClient({...customClient, currentAddress: e.target.value})}
                      className="w-full px-3 py-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleAddCustomClient}
                    disabled={!customClient.name.trim()}
                    className={`px-4 py-2 rounded text-xs font-bold ${
                      customClient.name.trim()
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Add Client to Quotation
                  </button>
                  <button
                    onClick={handleCancelCustomClient}
                    className="px-4 py-2 rounded text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-[10px] text-blue-600">
                  * Client name is required. Other fields are optional.
                </p>
              </div>
            )}

            {/* Client Selection Dropdown (only show when custom client form is hidden) */}
            {!showCustomClient && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <SearchSuggestSelect
                    value={formData.clientId || ''}
                    onChange={(value) => selectContact(value)}
                    options={contactOptions}
                    placeholder="Search and select client or lead..."
                    inputClassName="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black bg-white font-medium"
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  {clientsCount} clients & {qualifiedLeadsCount} qualified/won leads available
                </p>
              </>
            )}

            {/* Selected Client Info */}
            {formData.client && !showCustomClient && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">Selected Client:</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    formData.clientId?.startsWith('custom_') 
                      ? 'bg-purple-100 text-purple-700' 
                      : formData.clientId?.startsWith('lead_')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {formData.clientId?.startsWith('custom_') 
                      ? 'Custom Client' 
                      : formData.clientId?.startsWith('lead_')
                      ? 'Qualified/Won Lead'
                      : 'Existing Client'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500">Name:</span>
                    <span className="ml-2 text-xs font-bold text-black">{formData.client}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-500">Company:</span>
                    <span className="ml-2 text-xs font-bold text-black">{formData.company || 'N/A'}</span>
                  </div>
                  {formData.email && (
                    <div>
                      <span className="text-[11px] font-bold text-gray-500">Email:</span>
                      <span className="ml-2 text-xs font-bold text-black">{formData.email}</span>
                    </div>
                  )}
                  {formData.phone && (
                    <div>
                      <span className="text-[11px] font-bold text-gray-500">Phone:</span>
                      <span className="ml-2 text-xs font-bold text-black">{formData.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Issue Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Valid Until</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Quotation Status</label>
              <div className="w-full px-3 py-2 border border-green-300 rounded text-sm font-bold bg-green-50 text-green-700">
                {isEditing ? (formData.status || 'Approved') : 'Approved (Auto)'}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Category</label>
              <SearchSuggestSelect
                value={formData.selectedCategory || ''}
                onChange={(value) => setFormData({ ...formData, selectedCategory: value })}
                options={categoryOptions}
                placeholder={categoryOptions.length > 0 ? 'Search and select category...' : 'No categories available'}
                inputClassName="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black bg-white"
              />
            </div>
          </div>

          <div className="mt-3 text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
            New quotations are automatically saved as Approved and shown in the quotation list.
          </div>

          {/* Client Details Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-3 rounded border border-gray-100 italic">
            <div className="space-y-1">
               <label className="text-[9px] uppercase font-bold text-gray-400">Company</label>
               <input
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-transparent border-none p-0 text-xs font-bold text-black focus:ring-0 placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-1">
               <label className="text-[9px] uppercase font-bold text-gray-400">Email Address</label>
               <input
                type="email"
                placeholder="client@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-none p-0 text-xs font-bold text-black focus:ring-0 placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-1">
               <label className="text-[9px] uppercase font-bold text-gray-400">Location / Area</label>
               <input
                type="text"
                placeholder="Dubai Marina, UAE"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-transparent border-none p-0 text-xs font-bold text-black focus:ring-0 placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-1 md:col-span-3">
               <label className="text-[9px] uppercase font-bold text-gray-400">Current Home Address</label>
               <input
                type="text"
                placeholder="Apartment, building, street"
                value={formData.currentAddress}
                onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                className="w-full bg-transparent border-none p-0 text-xs font-bold text-black focus:ring-0 placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white border border-gray-300 rounded p-4 space-y-4 shadow-none">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
            <h3 className="text-sm font-bold uppercase tracking-tight text-black flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Service Line Items
            </h3>
            <button 
              onClick={handleAddService}
              className="px-3 py-1 bg-black text-white text-[10px] uppercase font-bold rounded hover:bg-gray-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" />
              Add Service
            </button>
          </div>

          <div className="space-y-2">
            {formData.services.map((service: any) => (
              <div key={service.id} className="grid grid-cols-12 gap-2 items-start bg-white border border-gray-200 p-2 rounded relative group">
                <div className="col-span-6 space-y-1">
                   <SearchSuggestSelect
                    value={services.find((svc) => svc.name === service.name)?.id || ''}
                    onChange={(value) => {
                      const selectedService = services.find(s => s.id === value)
                      setFormData((prev: any) => {
                        const updatedServices = prev.services.map((row: any) => {
                          if (row.id !== service.id) return row

                          if (!selectedService) {
                            return { ...row, name: '', description: '' }
                          }

                          const nextUnitPrice = Number(selectedService.price) || 0
                          const nextQuantity = Number(row.quantity) || 0
                          return {
                            ...row,
                            name: selectedService.name,
                            unitPrice: nextUnitPrice,
                            description: selectedService.description || '',
                            total: nextQuantity * nextUnitPrice
                          }
                        })

                        return { ...prev, services: updatedServices }
                      })
                    }}
                    options={serviceOptions}
                    placeholder="Search service..."
                    inputClassName="w-full text-xs font-bold border-none p-1 focus:ring-0 bg-gray-50 rounded"
                   />
                     <RichTextEditor
                      value={service.description || ''}
                      onChange={(nextValue) => handleUpdateService(service.id, 'description', nextValue)}
                      placeholder="Service description (rich text): bold, color, bullets, numbering..."
                      minHeightClassName="min-h-[160px]"
                     />
                </div>
                   <div className="col-span-1">
                   <input 
                    type="number" 
                    placeholder="Qty" 
                    className="w-full text-xs font-bold text-center border-none p-2 bg-gray-50 rounded focus:ring-0"
                    value={service.quantity}
                    onChange={(e) => handleUpdateService(service.id, 'quantity', Number(e.target.value) || 0)}
                    min="1"
                   />
                </div>
                   <div className="col-span-2">
                   <div className="relative">
                      <input 
                        type="number" 
                        placeholder="Price" 
                        className="w-full text-xs font-bold text-right border-none p-2 bg-gray-50 rounded focus:ring-0"
                        value={service.unitPrice}
                        onChange={(e) => handleUpdateService(service.id, 'unitPrice', Number(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                   </div>
                </div>
                <div className="col-span-2">
                   <div className="p-2 text-right text-xs font-black text-black">
                      {((service.total || 0).toLocaleString())}
                   </div>
                </div>
                <div className="col-span-1 flex justify-center pt-1.5">
                   <button 
                    onClick={() => handleRemoveService(service.id)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
            
            {formData.services.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded text-gray-400 text-xs italic">
                No services added. Click "Add Service" to start building your quote.
              </div>
            )}
            
            {services.length === 0 && (
              <div className="text-center py-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-600 text-xs">
                No services found. Please add services first.
              </div>
            )}
          </div>
        </div>

        {/* Option 2 Comparative Services Section */}
        <div className="bg-white border border-dashed border-gray-300 rounded p-4 space-y-4 shadow-none">
          <div className="flex flex-col gap-3 border-b border-gray-100 pb-3 mb-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <input
                id="show-option2-in-pdf"
                type="checkbox"
                checked={Boolean(formData.showOption2InPdf)}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, showOption2InPdf: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="show-option2-in-pdf" className="text-xs font-black uppercase tracking-wider text-black">
                Show Option 2 In PDF
              </label>
            </div>
            <button
              onClick={handleAddOption2Service}
              className="px-3 py-1 bg-black text-white text-[10px] uppercase font-bold rounded hover:bg-gray-800 transition-colors flex items-center gap-1.5"
              type="button"
            >
              <Plus className="w-3 h-3" />
              Add Option 2 Service
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Option 2 Heading (Editable)</label>
            <input
              type="text"
              value={formData.option2Heading || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, option2Heading: e.target.value }))}
              placeholder="Option 2 - Weekly Payment Plan"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-2">
            {(formData.option2Services || []).map((service: any) => (
              <div key={service.id} className="grid grid-cols-12 gap-2 items-start bg-white border border-gray-200 p-2 rounded relative group">
                <div className="col-span-6 space-y-1">
                  <SearchSuggestSelect
                    value={services.find((svc) => svc.name === service.name)?.id || ''}
                    onChange={(value) => {
                      const selectedService = services.find(s => s.id === value)
                      setFormData((prev: any) => {
                        const updatedServices = (prev.option2Services || []).map((row: any) => {
                          if (row.id !== service.id) return row

                          if (!selectedService) {
                            return { ...row, name: '', description: '' }
                          }

                          const nextUnitPrice = Number(selectedService.price) || 0
                          const nextQuantity = Number(row.quantity) || 0
                          return {
                            ...row,
                            name: selectedService.name,
                            unitPrice: nextUnitPrice,
                            description: selectedService.description || '',
                            total: nextQuantity * nextUnitPrice
                          }
                        })

                        return { ...prev, option2Services: updatedServices }
                      })
                    }}
                    options={serviceOptions}
                    placeholder="Search service for option 2..."
                    inputClassName="w-full text-xs font-bold border-none p-1 focus:ring-0 bg-gray-50 rounded"
                  />
                  <RichTextEditor
                    value={service.description || ''}
                    onChange={(nextValue) => handleUpdateOption2Service(service.id, 'description', nextValue)}
                    placeholder="Option 2 description (rich text): bold, color, bullets, numbering..."
                    minHeightClassName="min-h-[140px]"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    type="number"
                    placeholder="Qty"
                    className="w-full text-xs font-bold text-center border-none p-2 bg-gray-50 rounded focus:ring-0"
                    value={service.quantity}
                    onChange={(e) => handleUpdateOption2Service(service.id, 'quantity', Number(e.target.value) || 0)}
                    min="1"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Price"
                    className="w-full text-xs font-bold text-right border-none p-2 bg-gray-50 rounded focus:ring-0"
                    value={service.unitPrice}
                    onChange={(e) => handleUpdateOption2Service(service.id, 'unitPrice', Number(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <div className="p-2 text-right text-xs font-black text-black">
                    {((service.total || 0).toLocaleString())}
                  </div>
                </div>
                <div className="col-span-1 flex justify-center pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleRemoveOption2Service(service.id)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {(formData.option2Services || []).length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded text-gray-400 text-xs italic">
                No Option 2 services added. Add comparative services for alternative offer.
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Letter Section */}
        <div className="bg-white border border-gray-300 rounded p-4 space-y-4 shadow-none">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold uppercase tracking-tight text-black">
              Confirmation Letter
            </h3>
          </div>
          
          <div className="space-y-2">
            <textarea 
              rows={4}
              placeholder="Enter confirmation letter details here... (Optional)
              
Example:
I/We [Client Name] confirm the booking of [Service Name] with Homework Cleaning Services. I agree to the terms and conditions and confirm the quotation amount of [Total Amount]."
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black resize-none"
              value={formData.confirmationLetter || ''}
              onChange={(e) => setFormData({ ...formData, confirmationLetter: e.target.value })}
            />
            <p className="text-[10px] text-gray-400">
              Client confirmation message (optional) - This will appear in the PDF after terms & conditions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Company Seal / Signature Image</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => handleCompanySealUpload(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
              />
              {formData.companySealImage && (
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <img src={formData.companySealImage} alt="Company seal preview" className="h-16 object-contain" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, companySealImage: '' })}
                    className="mt-2 text-[10px] text-red-600 hover:text-red-700"
                  >
                    Remove image
                  </button>
                </div>
              )}
              <p className="text-[10px] text-gray-400">
                Loaded from Settings by default. This will print in the company authorization box.
              </p>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="bg-white border border-gray-300 rounded p-4 space-y-4 shadow-none">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Note for PDF</label>
            <label className="inline-flex items-center gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={Boolean(formData.showQuoteNoteInPdf)}
                onChange={(e) => setFormData({ ...formData, showQuoteNoteInPdf: e.target.checked })}
              />
              Show note above Confirmation Letter in PDF
            </label>
            {formData.showQuoteNoteInPdf && (
              <textarea
                rows={3}
                placeholder="Enter note for PDF..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black resize-none"
                value={formData.quoteNote || ''}
                onChange={(e) => setFormData({ ...formData, quoteNote: e.target.value })}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Payment terms</label>
              <textarea 
                rows={3}
                placeholder="Personal message or important details..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Terms & Conditions</label>
              <textarea 
                rows={3}
                placeholder="Payment terms, validity, scope boundaries..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black resize-none"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Bank Account Details Section */}
        <div className="bg-white border border-gray-300 rounded p-4 space-y-4 shadow-none">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <CreditCard className="w-4 h-4 text-green-600" />
            <h3 className="text-sm font-bold uppercase tracking-tight text-black">
              Bank Account Details
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Account Name</label>
              <input
                type="text"
                value={formData.bankDetails?.accountName || ''}
                onChange={(e) => handleBankDetailChange('accountName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                placeholder="HOMEWORK CLEANING SERVICES LLC"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Account Number</label>
              <input
                type="text"
                value={formData.bankDetails?.accountNumber || ''}
                onChange={(e) => handleBankDetailChange('accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                placeholder="1234567890123"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankDetails?.bankName || ''}
                onChange={(e) => handleBankDetailChange('bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                placeholder="Emirates NBD"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">SWIFT Code</label>
              <input
                type="text"
                value={formData.bankDetails?.swiftCode || ''}
                onChange={(e) => handleBankDetailChange('swiftCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                placeholder="EBILAEAD"
              />
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">IBAN Number</label>
              <input
                type="text"
                value={formData.bankDetails?.iban || ''}
                onChange={(e) => handleBankDetailChange('iban', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                placeholder="AE180260001234567890123"
              />
            </div>
          </div>
          
          <p className="text-[10px] text-gray-400 italic">
            These bank details will appear in the PDF quotation
          </p>
        </div>
      </div>

      {/* RIGHT: SUMMARY & ACTIONS */}
      <div className="w-full lg:w-[320px] space-y-4">
        {/* Created By Summary Card */}
        {formData.createdByName && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="w-3 h-3 text-blue-600" />
              <span className="text-[10px] uppercase font-bold text-blue-700">Quotation Creator</span>
            </div>
            <p className="text-xs font-bold text-blue-800">
              {formData.createdByName}
            </p>
            <p className="text-[9px] text-blue-600 mt-1">
              {employees.find(e => e.id === formData.createdBy)?.position || ''} • {employees.find(e => e.id === formData.createdBy)?.department || ''}
            </p>
          </div>
        )}

        {/* TOTALS BOX */}
        <div className="bg-black text-white rounded p-1 shadow-none">
          <div className="bg-white border border-black rounded p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
               <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pricing Summary</span>
               <span className="text-[10px] font-medium text-black bg-gray-100 px-2 py-0.5 rounded uppercase">{formData.currency || ''}</span>
            </div>

            <div className="space-y-2.5">
               <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Subtotal</span>
                  <span>{calculations.subtotal.toLocaleString()}</span>
               </div>
               
               <div className="flex items-center gap-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] uppercase font-black text-gray-400">Discount</label>
                    <div className="flex gap-1">
                      <input 
                        type="number"
                        className="w-full text-[13px] text-black font-black border border-gray-200 rounded px-2 py-1 focus:border-black focus:ring-0"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) || 0 })}
                        min="0"
                      />
                      <button 
                        onClick={() => setFormData({ ...formData, discountType: formData.discountType === 'percentage' ? 'fixed' : 'percentage' })}
                        className="px-2 border border-gray-200 rounded text-[10px] font-bold bg-gray-50"
                      >
                         {formData.discountType === 'percentage' ? '%' : 'FIX'}
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] uppercase font-black text-gray-400">Tax (%)</label>
                    <input 
                        type="number"
                        className="w-full text-[13px] text-black font-black border border-gray-200 rounded px-2 py-1 focus:border-black focus:ring-0"
                        value={formData.taxRate}
                        onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) || 0 })}
                        min="0"
                        max="100"
                      />
                  </div>
               </div>

               <div className="pt-2 space-y-1">
                  {calculations.discountAmount > 0 && (
                    <div className="flex justify-between text-[11px] font-bold text-green-600">
                      <span>Discount Applied</span>
                      <span>-{calculations.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] font-bold text-gray-400">
                    <span>Tax Amount (VAT)</span>
                    <span>+{calculations.taxAmount.toLocaleString()}</span>
                  </div>
               </div>

               <div className="pt-4 border-t-2 border-black">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[9px] uppercase font-black text-black leading-none mb-1">Total Payable</p>
                        <p className="text-2xl font-black text-black leading-none tracking-tighter">
                          {calculations.total.toLocaleString()}
                        </p>
                     </div>
                     <p className="text-[10px] font-bold text-gray-400">{formData.currency || ''}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* PRIMARY ACTIONS */}
        <div className="space-y-2">
           <button 
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded text-sm font-bold uppercase tracking-widest transition-all shadow-lg text-center hover:bg-gray-800 shadow-black/10"
           >
              <Save className="w-4 h-4" />
              {isEditing ? 'Update Quotation' : 'Save Quotation'}
           </button>
           
           <div className="grid grid-cols-2 gap-2">
              <button 
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-600 py-2 rounded text-[11px] font-bold uppercase tracking-tight hover:bg-gray-50"
              >
                 <Eye className="w-3.5 h-3.5" />
                 Preview
              </button>
              <button 
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded text-[11px] font-bold uppercase tracking-tight hover:bg-red-50"
              >
                 <X className="w-3.5 h-3.5" />
                 Cancel
              </button>
           </div>
           
           {saveSuccess && (
             <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-center">
               <p className="text-[10px] font-bold text-green-700">
                 ✓ Quotation {isEditing ? 'updated' : 'saved'} successfully
               </p>
               <p className="text-[9px] text-green-600 mt-1">
                 All data including calculations saved successfully
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}