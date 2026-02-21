// stores/employeeMessages.store.ts
import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc,
  writeBatch,
  orderBy
} from 'firebase/firestore';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'employee' | 'admin';
  recipientRole: 'admin' | 'employee';
  recipientId?: string;
  recipientName?: string;
  timestamp: any;
  read: boolean;
  readBy?: string[];
  status: 'sent' | 'delivered' | 'seen';
  collection: 'employeeMessages' | 'employeeReplies';
  imageBase64?: string;
  imageName?: string;
  deletedFor?: string[];
  deletedForEveryone?: boolean;
  edited?: boolean;
  replyToId?: string;
  replyToContent?: string;
  replyToSender?: string;
}

interface EmployeeMessagesStore {
  messages: Message[];
  employees: any[];
  loading: boolean;
  error: string | null;
  selectedEmployeeId: string | null;
  
  fetchEmployees: () => Promise<void>;
  sendMessageFromEmployee: (data: any) => Promise<void>;
  sendReplyFromAdmin: (data: any) => Promise<void>;
  markAsRead: (messageId: string, collection: string, userId: string) => Promise<void>;
  deleteForMe: (messageId: string, collection: string, userId: string) => Promise<void>;
  deleteForEveryone: (messageId: string, collection: string) => Promise<void>;
  editMessage: (messageId: string, collection: string, newContent: string) => Promise<void>;
  setSelectedEmployeeId: (id: string | null) => void;
  subscribeToEmployeeMessages: (employeeId: string) => () => void;
  subscribeToAdminMessages: () => () => void;
  clearMessages: () => void;
}

export const useEmployeeMessagesStore = create<EmployeeMessagesStore>((set, get) => ({
  messages: [],
  employees: [],
  loading: false,
  error: null,
  selectedEmployeeId: null,

  fetchEmployees: async () => {
    try {
      set({ loading: true });
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef, 
        where('role', '==', 'employee'),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);
      const employeesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ employees: employeesData, loading: false });
    } catch (error) {
      console.error('Error fetching employees:', error);
      set({ error: 'Failed to fetch employees', loading: false });
    }
  },

  sendMessageFromEmployee: async (data) => {
    try {
      await addDoc(collection(db, 'employeeMessages'), {
        ...data,
        timestamp: serverTimestamp(),
        read: false,
        status: 'sent',
        readBy: [],
        deletedFor: [],
        deletedForEveryone: false,
        edited: false
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  sendReplyFromAdmin: async (data) => {
    try {
      await addDoc(collection(db, 'employeeReplies'), {
        ...data,
        timestamp: serverTimestamp(),
        read: false,
        status: 'sent',
        readBy: [],
        deletedFor: [],
        deletedForEveryone: false,
        edited: false
      });
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  },

  markAsRead: async (messageId, collection, userId) => {
    try {
      const messageRef = doc(db, collection, messageId);
      await updateDoc(messageRef, {
        read: true,
        status: 'seen',
        readBy: [userId]
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  },

  deleteForMe: async (messageId, collection, userId) => {
    try {
      const messageRef = doc(db, collection, messageId);
      const message = get().messages.find(m => m.id === messageId);
      const deletedFor = message?.deletedFor || [];
      
      if (!deletedFor.includes(userId)) {
        await updateDoc(messageRef, { 
          deletedFor: [...deletedFor, userId] 
        });
      }
    } catch (error) {
      console.error('Error deleting for me:', error);
    }
  },

  deleteForEveryone: async (messageId, collection) => {
    try {
      const messageRef = doc(db, collection, messageId);
      await updateDoc(messageRef, { deletedForEveryone: true });
    } catch (error) {
      console.error('Error deleting for everyone:', error);
    }
  },

  editMessage: async (messageId, collection, newContent) => {
    try {
      const messageRef = doc(db, collection, messageId);
      await updateDoc(messageRef, {
        content: newContent,
        edited: true,
        editedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error editing message:', error);
    }
  },

  setSelectedEmployeeId: (id) => set({ selectedEmployeeId: id }),

  clearMessages: () => set({ messages: [] }),

  subscribeToEmployeeMessages: (employeeId) => {
    const messagesQuery = query(
      collection(db, 'employeeMessages'),
      where('senderId', '==', employeeId),
      orderBy('timestamp', 'asc')
    );

    const repliesQuery = query(
      collection(db, 'employeeReplies'),
      where('recipientId', '==', employeeId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        collection: 'employeeMessages'
      })) as Message[];
      
      set(state => {
        const replies = state.messages.filter(m => m.collection === 'employeeReplies');
        return { messages: [...msgs, ...replies].sort((a, b) => a.timestamp - b.timestamp) };
      });
    });

    const unsubscribeReplies = onSnapshot(repliesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        collection: 'employeeReplies'
      })) as Message[];
      
      set(state => {
        const messages = state.messages.filter(m => m.collection === 'employeeMessages');
        return { messages: [...messages, ...msgs].sort((a, b) => a.timestamp - b.timestamp) };
      });
    });

    return () => {
      unsubscribeMessages();
      unsubscribeReplies();
    };
  },

  subscribeToAdminMessages: () => {
    const messagesQuery = query(
      collection(db, 'employeeMessages'),
      orderBy('timestamp', 'asc')
    );

    const repliesQuery = query(
      collection(db, 'employeeReplies'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        collection: 'employeeMessages'
      })) as Message[];
      
      set(state => {
        const replies = state.messages.filter(m => m.collection === 'employeeReplies');
        return { messages: [...msgs, ...replies].sort((a, b) => a.timestamp - b.timestamp) };
      });
    });

    const unsubscribeReplies = onSnapshot(repliesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        collection: 'employeeReplies'
      })) as Message[];
      
      set(state => {
        const messages = state.messages.filter(m => m.collection === 'employeeMessages');
        return { messages: [...messages, ...msgs].sort((a, b) => a.timestamp - b.timestamp) };
      });
    });

    return () => {
      unsubscribeMessages();
      unsubscribeReplies();
    };
  }
}));