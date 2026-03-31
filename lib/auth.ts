import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { auth, db } from '@/lib/firebase'

const ADMIN_PAGE_ALIASES: Record<string, string> = {
  report: 'Report',
  'process inquiry': 'Process Inquiry',
  communications: 'Communications',
  crm: 'CRM',
  quotations: 'Quotations',
  'inventory & services': 'Inventory & Services',
}

const normalizePageKey = (page: string) => {
  const trimmed = page?.trim()
  if (!trimmed) return ''

  const alias = ADMIN_PAGE_ALIASES[trimmed] || ADMIN_PAGE_ALIASES[trimmed.toLowerCase()]
  return alias || trimmed
}

const normalizePagesForPortal = (portal: 'admin' | 'employee', pages: string[]) => {
  const normalized = Array.from(new Set((pages || []).map(normalizePageKey).filter(Boolean)))

  if (portal === 'employee') {
    return ['Employee Chat']
  }

  const criticalPages = ['Dashboard', 'Quotations', 'Quotation List', 'Process Inquiry']
  criticalPages.forEach((page) => {
    if (!normalized.includes(page)) {
      normalized.push(page)
    }
  })

  return normalized
}

const ALL_ACTIONS = ['view', 'add', 'edit', 'remove'] as const

const normalizeActionsForPortal = (portal: 'admin' | 'employee', actions?: string[]) => {
  if (portal === 'admin') {
    return [...ALL_ACTIONS]
  }

  const normalized = Array.from(
    new Set((actions || []).map((action) => action?.toString().toLowerCase().trim()).filter(Boolean)),
  )

  if (!normalized.includes('view')) {
    normalized.unshift('view')
  }

  return normalized
}

export interface UserRole {
  id: string
  email: string
  name: string
  allowedPages: string[]
  allowedActions?: string[]
  createdAt: string
  updatedAt: string
  portal: 'admin' | 'employee'  // ✅ Added portal field
  employeeId?: string            // ✅ Added employeeId field
  employeeName?: string          // ✅ Added employeeName field
  roleName?:string
}

export interface SessionData {
  roleName: string
  user: {
    uid: string
    email: string | null
    name: string | null
  }
  allowedPages: string[]
  portal: 'admin' | 'employee'   // ✅ Changed from roleName to portal
  employeeId?: string             // ✅ This is a property, not a method
  employeeName?: string           // ✅ Added employeeName
  loggedInAt?: string
}

export async function createUserWithRole(
  email: string, 
  password: string, 
  name: string, 
  allowedPages: string[], 
  portal: 'admin' | 'employee',
  employeeId?: string,
  employeeName?: string,
  roleName?: string,
  allowedActions?: string[]
) {
  try {
    console.log('📝 Creating user:', { email, name, portal, employeeId });
    
    // Firebase authentication mein user create karna
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // User profile update
    await updateProfile(userCredential.user, {
      displayName: name
    })
    
    // Firestore mein user-role collection mein store karna
    const userRoleRef = doc(db, 'users-role', userCredential.user.uid)
    
    const userData: {
      email: string
      name: string
      allowedPages: string[]
      portal: 'admin' | 'employee'
      roleName: string
      allowedActions: string[]
      createdAt: string
      updatedAt: string
      employeeId?: string
      employeeName?: string
    } = {
      email,
      name,
      allowedPages,
      portal,
      roleName: roleName || (portal === 'admin' ? 'admin' : 'employee'),
      allowedActions: normalizeActionsForPortal(portal, allowedActions),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Add employee fields if portal is employee
    if (portal === 'employee') {
      userData.employeeId = employeeId || ''
      userData.employeeName = employeeName || name
    }
    
    await setDoc(userRoleRef, userData)
    
    console.log('✅ User created successfully:', userCredential.user.uid)
    return { success: true, userId: userCredential.user.uid }
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError
    console.error('❌ Error creating user:', error)
    return { success: false, error: firebaseError.message }
  }
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    const userRoleRef = doc(db, 'users-role', uid)
    const docSnap = await getDoc(userRoleRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      const rawPortal = (data.portal || '').toString().toLowerCase()
      const rawRoleName = (data.roleName || '').toString().toLowerCase()
      const inferredPortal: 'admin' | 'employee' =
        rawPortal === 'employee' || rawRoleName === 'employee' ? 'employee' : 'admin'

      const normalizedAllowedPages = normalizePagesForPortal(
        inferredPortal,
        (data.allowedPages || []) as string[],
      )
      const normalizedAllowedActions = normalizeActionsForPortal(
        inferredPortal,
        (data.allowedActions || []) as string[],
      )
      const roleName = inferredPortal === 'admin' ? 'admin' : 'employee'

      const sourceAllowedPages = Array.isArray(data.allowedPages) ? data.allowedPages : []
      const allowedPagesChanged =
        normalizedAllowedPages.length !== sourceAllowedPages.length ||
        normalizedAllowedPages.some((page, index) => page !== sourceAllowedPages[index])
      const sourceAllowedActions = Array.isArray(data.allowedActions) ? data.allowedActions : []
      const allowedActionsChanged =
        normalizedAllowedActions.length !== sourceAllowedActions.length ||
        normalizedAllowedActions.some((action, index) => action !== sourceAllowedActions[index])
      const roleNameChanged = (data.roleName || '').toString().toLowerCase() !== roleName

      if (!data.portal || allowedPagesChanged || allowedActionsChanged || roleNameChanged) {
        await updateDoc(userRoleRef, {
          portal: inferredPortal,
          roleName,
          allowedPages: normalizedAllowedPages,
          allowedActions: normalizedAllowedActions,
          updatedAt: new Date().toISOString(),
        })
      }

      return {
        id: docSnap.id,
        email: data.email || '',
        name: data.name || '',
        allowedPages: normalizedAllowedPages,
        allowedActions: normalizedAllowedActions,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
        portal: inferredPortal,
        employeeId: data.employeeId || '',
        employeeName: data.employeeName || '',
        roleName
      } as UserRole
    }
    return null
  } catch (error) {
    console.error('Error fetching user role:', error)
    return null
  }
}

export async function updateUserRole(uid: string, data: Partial<UserRole>) {
  try {
    const userRoleRef = doc(db, 'users-role', uid)
    await updateDoc(userRoleRef, {
      ...data,
      updatedAt: new Date().toISOString()
    })
    return { success: true }
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError
    console.error('Error updating user role:', error)
    return { success: false, error: firebaseError.message }
  }
}

export async function deleteUserRole(uid: string) {
  try {
    const userRoleRef = doc(db, 'users-role', uid)
    await setDoc(userRoleRef, { deleted: true })
    return { success: true }
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError
    console.error('Error deleting user role:', error)
    return { success: false, error: firebaseError.message }
  }
}

export async function validateCredentials(portal: 'admin' | 'employee', email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()

  try {
    console.log(`🔐 Validating ${portal} credentials for:`, normalizedEmail);
    
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password)
    console.log('✅ Firebase Auth successful:', userCredential.user.uid);
    
    const userRole = await getUserRole(userCredential.user.uid)
    
    if (!userRole) {
      console.log('❌ User role not found in Firestore');
      await signOut(auth).catch((cleanupError) => {
        console.warn('Auth cleanup failed after missing role:', cleanupError)
      })
      clearSession()
      return { 
        success: false, 
        message: 'User role not found. Please contact administrator.',
        redirectTo: null
      }
    }
    
    console.log('📄 User role from Firestore:', { 
      portal: userRole.portal,
      name: userRole.name,
      allowedPages: userRole.allowedPages 
    });
    
    // ✅ Check if portal matches
    if (userRole.portal !== portal) {
      console.log(`❌ Portal mismatch: expected ${portal}, got ${userRole.portal}`);
      await signOut(auth).catch((cleanupError) => {
        console.warn('Auth cleanup failed after portal mismatch:', cleanupError)
      })
      clearSession()
      return { 
        success: false, 
        message: portal === 'admin' 
          ? 'This is an employee account. Please use Employee Login.'
          : 'This is an admin account. Please use Admin Login.',
        redirectTo: null
      }
    }
    
    const session: SessionData = {
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userRole.name
      },
      allowedPages: userRole.allowedPages,
      portal: userRole.portal,
      employeeId: userRole.employeeId,
      employeeName: userRole.employeeName,
      loggedInAt: new Date().toISOString(),
      roleName: userRole.roleName || userRole.portal
    }
    
    // Determine redirect path based on portal
    const redirectTo = portal === 'admin' ? '/admin/dashboard' : '/employee/dashboard'
    
    return { 
      success: true, 
      session,
      redirectTo
    }
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError
    console.error('❌ Login error:', error)
    
    let message = 'Login failed. Please check your credentials.'
    if (firebaseError.code === 'auth/user-not-found') {
      message = 'User not found.'
    } else if (firebaseError.code === 'auth/wrong-password') {
      message = 'Incorrect password.'
    } else if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/invalid-login-credentials') {
      message = 'Invalid email or password.'
    } else if (firebaseError.code === 'auth/invalid-email') {
      message = 'Invalid email format.'
    } else if (firebaseError.code === 'auth/too-many-requests') {
      message = 'Too many failed attempts. Please try again later.'
    }
    
    return { 
      success: false, 
      message, 
      error: firebaseError.code,
      redirectTo: null
    }
  }
}

export function storeSession(session: SessionData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userSession', JSON.stringify(session))
    // Also set a cookie for middleware
    document.cookie = `userSession=${JSON.stringify(session)}; path=/; max-age=86400`
  }
}

export function getSession(): SessionData | null {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('userSession')
    return session ? JSON.parse(session) : null
  }
  return null
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
    document.cookie = 'userSession=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
  }
}

export async function logout() {
  try {
    await signOut(auth)
    clearSession()
    return { success: true }
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError
    console.error('Logout error:', error)
    return { success: false, error: firebaseError.message }
  }
}

export const DEMO_CREDENTIALS: Record<string, { email: string; password: string }> = {
  admin: { email: 'admin@homeware.ae', password: 'Demo@123' },
  manager: { email: 'manager@homeware.com', password: 'manager123' },
  supervisor: { email: 'supervisor@homeware.com', password: 'supervisor123' },
  employee: { email: 'employee@homeware.ae', password: 'Demo@123' },
  client: { email: 'client@homeware.com', password: 'client123' },
  guest: { email: 'guest@homeware.com', password: 'guest123' }
};

export type PortalType = 'admin' | 'manager' | 'supervisor' | 'employee' | 'client' | 'guest';