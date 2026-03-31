// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  status?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Primary role source is users-role. Fallback to legacy users doc.
            const userRoleDoc = await getDoc(doc(db, 'users-role', firebaseUser.uid));
            const userRoleData = userRoleDoc.data();

            let userData = userRoleData;
            if (!userData) {
              const legacyUserDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              userData = legacyUserDoc.data();
            }

            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userData?.name || firebaseUser.email?.split('@')[0] || '',
              role: userData?.portal || userData?.role || 'employee',
              status: userData?.status || 'active'
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Auth context initialization failed:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Auth state listener failed:', error);
        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}