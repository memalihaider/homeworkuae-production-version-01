'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { auth, db } from '@/lib/firebase';
import { getSession } from '@/lib/auth';
import { format, isToday, isYesterday } from 'date-fns';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  Bell,
  Building2,
  ChevronLeft,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  Search,
  Send,
  Users,
  User,
  X,
} from 'lucide-react';

interface AdminIdentity {
  id: string;
  name: string;
  email: string;
}

interface EmployeeRecord {
  id: string;
  name: string;
  email: string;
  department?: string;
  position?: string;
  role?: string;
  status?: string;
}

interface AdminRecord {
  id: string;
  name: string;
  email: string;
}

type ContactType = 'employee' | 'admin';

interface ChatContact {
  id: string;
  type: ContactType;
  name: string;
  email: string;
  department: string;
  title: string;
  status: string;
}

type ChatCollection = 'employeeMessages' | 'employeeReplies' | 'adminMessages';

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'employee' | 'admin';
  recipientRole: 'admin' | 'employee';
  recipientId?: string;
  recipientName?: string;
  timestamp: Date;
  read: boolean;
  status?: 'sent' | 'delivered' | 'seen';
  readBy?: string[];
  imageBase64?: string;
  imageName?: string;
  collection: ChatCollection;
}

interface ConversationSummary {
  contactId: string;
  lastMessage: ChatMessage | null;
  unreadCount: number;
}

function formatTimestamp(value: Date): string {
  if (isToday(value)) return format(value, 'hh:mm a');
  if (isYesterday(value)) return `Yesterday ${format(value, 'hh:mm a')}`;
  return format(value, 'dd/MM/yy hh:mm a');
}

function formatSidebarTime(value: Date): string {
  if (isToday(value)) return format(value, 'hh:mm a');
  if (isYesterday(value)) return 'Yesterday';
  return format(value, 'dd/MM/yy');
}

function toMessage(docId: string, data: Record<string, any>, collectionName: ChatCollection): ChatMessage {
  return {
    id: docId,
    content: data.content || '',
    senderId: data.senderId || '',
    senderName: data.senderName || 'Unknown',
    senderEmail: data.senderEmail || '',
    senderRole: data.senderRole || 'employee',
    recipientRole: data.recipientRole || 'admin',
    recipientId: data.recipientId,
    recipientName: data.recipientName,
    timestamp: data.timestamp?.toDate?.() || new Date(),
    read: Boolean(data.read),
    status: data.status,
    readBy: data.readBy || [],
    imageBase64: data.imageBase64,
    imageName: data.imageName,
    collection: collectionName,
  };
}

export default function EmployeeChatPage() {
  const [authReady, setAuthReady] = useState(false);
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);

  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const [conversations, setConversations] = useState<Record<string, ConversationSummary>>({});

  const [selectedContactId, setSelectedContactId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);

  const [search, setSearch] = useState('');
  const [contactFilter, setContactFilter] = useState<'all' | 'employee' | 'admin'>('all');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');

  const fileRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const initializedEmployeeIncomingRef = useRef(false);
  const initializedAdminIncomingRef = useRef(false);
  const incomingSeenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }

    setNotificationPermission(Notification.permission);
  }, []);

  const showSystemNotification = (title: string, body: string) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: `chat-${Date.now()}`,
      });
    } catch (error) {
      console.warn('Unable to show system notification:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.warn('Notification permission request failed:', error);
    }
  };

  useEffect(() => {
    if (!authReady || !admin?.id || !auth.currentUser) return;

    const unsubscribeEmployeeIncoming = onSnapshot(
      query(collection(db, 'employeeMessages')),
      (snapshot) => {
        if (!initializedEmployeeIncomingRef.current) {
          snapshot.docs.forEach((item) => incomingSeenIdsRef.current.add(item.id));
          initializedEmployeeIncomingRef.current = true;
          return;
        }

        snapshot.docChanges().forEach((change) => {
          if (change.type !== 'added') return;
          if (incomingSeenIdsRef.current.has(change.doc.id)) return;

          incomingSeenIdsRef.current.add(change.doc.id);
          const data = change.doc.data() as Record<string, any>;
          showSystemNotification(
            `New message from ${data.senderName || 'Employee'}`,
            data.content || 'Sent you an attachment',
          );
        });
      },
      (error) => {
        console.warn('Incoming employee notification listener error:', error);
      },
    );

    const unsubscribeAdminIncoming = onSnapshot(
      query(collection(db, 'adminMessages'), where('recipientId', '==', admin.id)),
      (snapshot) => {
        if (!initializedAdminIncomingRef.current) {
          snapshot.docs.forEach((item) => incomingSeenIdsRef.current.add(item.id));
          initializedAdminIncomingRef.current = true;
          return;
        }

        snapshot.docChanges().forEach((change) => {
          if (change.type !== 'added') return;
          if (incomingSeenIdsRef.current.has(change.doc.id)) return;

          incomingSeenIdsRef.current.add(change.doc.id);
          const data = change.doc.data() as Record<string, any>;
          if (data.senderId === admin.id) return;

          showSystemNotification(
            `New admin message from ${data.senderName || 'Admin'}`,
            data.content || 'Sent you an attachment',
          );
        });
      },
      (error) => {
        console.warn('Incoming admin notification listener error:', error);
      },
    );

    return () => {
      unsubscribeEmployeeIncoming();
      unsubscribeAdminIncoming();
    };
  }, [authReady, admin?.id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthReady(Boolean(firebaseUser));
      if (!firebaseUser) {
        setAdmin(null);
        return;
      }

      const activeSession = getSession();
      if (activeSession?.user?.uid === firebaseUser.uid) {
        setAdmin({
          id: activeSession.user.uid,
          name: activeSession.user.name || firebaseUser.displayName || 'Admin',
          email: activeSession.user.email || firebaseUser.email || '',
        });
        return;
      }

      let name = firebaseUser.displayName || 'Admin';
      let email = firebaseUser.email || '';
      try {
        const roleDoc = await getDoc(doc(db, 'users-role', firebaseUser.uid));
        if (roleDoc.exists()) {
          const roleData = roleDoc.data() as Record<string, any>;
          name = (roleData.name as string) || name;
          email = (roleData.email as string) || email;
        }
      } catch (error) {
        console.warn('Unable to load role profile for chat identity:', error);
      }

      setAdmin({ id: firebaseUser.uid, name, email });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!authReady || !admin?.id || !auth.currentUser) {
        setLoadingContacts(false);
        return;
      }

      setLoadingContacts(true);
      try {
        const [employeesSnapshot, adminsSnapshot] = await Promise.all([
          getDocs(query(collection(db, 'employees'))),
          getDocs(query(collection(db, 'users-role'), where('portal', '==', 'admin'))),
        ]);

        const employeeContacts: ChatContact[] = employeesSnapshot.docs.map((employeeDoc) => {
          const data = employeeDoc.data() as EmployeeRecord;
          return {
            id: employeeDoc.id,
            type: 'employee',
            name: data.name || 'Employee',
            email: data.email || '',
            department: data.department || 'Operations',
            title: data.position || data.role || 'Employee',
            status: data.status || 'Active',
          };
        });

        const adminContacts: ChatContact[] = adminsSnapshot.docs
          .filter((adminDoc) => adminDoc.id !== admin.id)
          .map((adminDoc) => {
            const data = adminDoc.data() as AdminRecord;
            return {
              id: adminDoc.id,
              type: 'admin',
              name: data.name || 'Admin User',
              email: data.email || '',
              department: 'Administration',
              title: 'Admin User',
              status: 'Active',
            };
          });

        const merged = [...employeeContacts, ...adminContacts].sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        setContacts(merged);
        if (!selectedContactId && merged.length > 0) {
          setSelectedContactId(merged[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch chat contacts:', error);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchContacts();
  }, [authReady, admin?.id]);

  useEffect(() => {
    const buildConversationSummary = async () => {
      if (!authReady || !admin?.id || contacts.length === 0 || !auth.currentUser) {
        return;
      }

      const next: Record<string, ConversationSummary> = {};

      for (const contact of contacts) {
        try {
          if (contact.type === 'employee') {
            const [employeeMessagesSnapshot, adminRepliesSnapshot] = await Promise.all([
              getDocs(query(collection(db, 'employeeMessages'), where('senderId', '==', contact.id))),
              getDocs(query(collection(db, 'employeeReplies'), where('recipientId', '==', contact.id))),
            ]);

            const all = [
              ...employeeMessagesSnapshot.docs.map((item) =>
                toMessage(item.id, item.data() as Record<string, any>, 'employeeMessages'),
              ),
              ...adminRepliesSnapshot.docs.map((item) =>
                toMessage(item.id, item.data() as Record<string, any>, 'employeeReplies'),
              ),
            ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            next[contact.id] = {
              contactId: contact.id,
              lastMessage: all[0] || null,
              unreadCount: all.filter((m) => m.senderId === contact.id && !m.read).length,
            };
            continue;
          }

          const [sentSnapshot, receivedSnapshot] = await Promise.all([
            getDocs(
              query(
                collection(db, 'adminMessages'),
                where('senderId', '==', admin.id),
                where('recipientId', '==', contact.id),
              ),
            ),
            getDocs(
              query(
                collection(db, 'adminMessages'),
                where('senderId', '==', contact.id),
                where('recipientId', '==', admin.id),
              ),
            ),
          ]);

          const all = [
            ...sentSnapshot.docs.map((item) =>
              toMessage(item.id, item.data() as Record<string, any>, 'adminMessages'),
            ),
            ...receivedSnapshot.docs.map((item) =>
              toMessage(item.id, item.data() as Record<string, any>, 'adminMessages'),
            ),
          ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

          next[contact.id] = {
            contactId: contact.id,
            lastMessage: all[0] || null,
            unreadCount: all.filter((m) => m.senderId === contact.id && !m.read).length,
          };
        } catch (error: any) {
          if (error?.code !== 'permission-denied') {
            console.error('Failed to build summary for contact:', contact.id, error);
          }
        }
      }

      setConversations(next);
    };

    buildConversationSummary();
  }, [authReady, admin?.id, contacts]);

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.id === selectedContactId) || null,
    [contacts, selectedContactId],
  );

  useEffect(() => {
    if (selectedContactId) {
      setMobileChatOpen(true);
    }
  }, [selectedContactId]);

  useEffect(() => {
    if (!admin?.id || !selectedContact || !authReady || !auth.currentUser) {
      setMessages([]);
      return;
    }

    setLoadingThread(true);

    let outgoing: ChatMessage[] = [];
    let incoming: ChatMessage[] = [];

    const merge = () => {
      const combined = [...outgoing, ...incoming].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
      );
      setMessages(combined);
      setLoadingThread(false);
    };

    if (selectedContact.type === 'admin') {
      const unsubscribeSent = onSnapshot(
        query(
          collection(db, 'adminMessages'),
          where('senderId', '==', admin.id),
          where('recipientId', '==', selectedContact.id),
        ),
        (snapshot) => {
          outgoing = snapshot.docs.map((item) =>
            toMessage(item.id, item.data() as Record<string, any>, 'adminMessages'),
          );
          merge();
        },
        (error: any) => {
          if (error?.code !== 'permission-denied') {
            console.error('admin sent listener error:', error);
          }
        },
      );

      const unsubscribeIncoming = onSnapshot(
        query(
          collection(db, 'adminMessages'),
          where('senderId', '==', selectedContact.id),
          where('recipientId', '==', admin.id),
        ),
        (snapshot) => {
          incoming = snapshot.docs.map((item) =>
            toMessage(item.id, item.data() as Record<string, any>, 'adminMessages'),
          );
          merge();
        },
        (error: any) => {
          if (error?.code !== 'permission-denied') {
            console.error('admin incoming listener error:', error);
          }
        },
      );

      return () => {
        unsubscribeSent();
        unsubscribeIncoming();
      };
    }

    const unsubscribeEmployeeMessages = onSnapshot(
      query(collection(db, 'employeeMessages'), where('senderId', '==', selectedContact.id)),
      (snapshot) => {
        incoming = snapshot.docs.map((item) =>
          toMessage(item.id, item.data() as Record<string, any>, 'employeeMessages'),
        );
        merge();
      },
      (error: any) => {
        if (error?.code !== 'permission-denied') {
          console.error('employee messages listener error:', error);
        }
      },
    );

    const unsubscribeAdminReplies = onSnapshot(
      query(collection(db, 'employeeReplies'), where('recipientId', '==', selectedContact.id)),
      (snapshot) => {
        outgoing = snapshot.docs.map((item) =>
          toMessage(item.id, item.data() as Record<string, any>, 'employeeReplies'),
        );
        merge();
      },
      (error: any) => {
        if (error?.code !== 'permission-denied') {
          console.error('employee replies listener error:', error);
        }
      },
    );

    return () => {
      unsubscribeEmployeeMessages();
      unsubscribeAdminReplies();
    };
  }, [authReady, admin?.id, selectedContact]);

  useEffect(() => {
    if (!admin?.id || !selectedContact || messages.length === 0 || !auth.currentUser) {
      return;
    }

    const markIncomingAsRead = async () => {
      try {
        if (selectedContact.type === 'admin') {
          const unread = await getDocs(
            query(
              collection(db, 'adminMessages'),
              where('senderId', '==', selectedContact.id),
              where('recipientId', '==', admin.id),
              where('read', '==', false),
            ),
          );

          await Promise.all(
            unread.docs.map((item) =>
              updateDoc(item.ref, {
                read: true,
                status: 'seen',
                readBy: [admin.id],
              }),
            ),
          );
          return;
        }

        const unread = await getDocs(
          query(
            collection(db, 'employeeMessages'),
            where('senderId', '==', selectedContact.id),
            where('read', '==', false),
          ),
        );

        await Promise.all(
          unread.docs.map((item) =>
            updateDoc(item.ref, {
              read: true,
              status: 'seen',
              readBy: [admin.id],
            }),
          ),
        );
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    };

    markIncomingAsRead();
  }, [admin?.id, selectedContact, messages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();

    const visible = contacts.filter((contact) => {
      if (contactFilter !== 'all' && contact.type !== contactFilter) return false;
      if (!term) return true;

      return (
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.department.toLowerCase().includes(term) ||
        contact.title.toLowerCase().includes(term)
      );
    });

    return visible.sort((a, b) => {
      const aLast = conversations[a.id]?.lastMessage?.timestamp?.getTime() || 0;
      const bLast = conversations[b.id]?.lastMessage?.timestamp?.getTime() || 0;
      if (aLast !== bLast) return bLast - aLast;
      return a.name.localeCompare(b.name);
    });
  }, [contacts, contactFilter, conversations, search]);

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert('Please use images under 1MB.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    if (!admin?.id || !selectedContact || !auth.currentUser) {
      alert('Authentication is not ready. Please refresh this page.');
      return;
    }

    if (!text.trim() && !imageFile) {
      return;
    }

    setSending(true);

    try {
      let imageBase64: string | undefined;
      if (imageFile) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const payload: Record<string, any> = {
        content: text.trim(),
        senderId: admin.id,
        senderName: admin.name,
        senderEmail: admin.email,
        senderRole: 'admin',
        recipientRole: selectedContact.type === 'admin' ? 'admin' : 'employee',
        recipientId: selectedContact.id,
        recipientName: selectedContact.name,
        timestamp: serverTimestamp(),
        read: false,
        status: 'sent',
        readBy: [],
        deletedFor: [],
        deletedForEveryone: false,
        edited: false,
      };

      if (imageBase64) {
        payload.imageBase64 = imageBase64;
        payload.imageName = imageFile?.name || 'image';
      }

      const targetCollection = selectedContact.type === 'admin' ? 'adminMessages' : 'employeeReplies';
      await addDoc(collection(db, targetCollection), payload);

      showSystemNotification(
        `Message sent to ${selectedContact.name}`,
        payload.content || 'Attachment sent',
      );

      setText('');
      clearImage();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Message could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const onComposerEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    setMobileChatOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="h-[calc(100vh-7.5rem)] overflow-hidden border-0 shadow-xl">
        <div className="grid h-full grid-cols-1 md:grid-cols-[330px_1fr]">
          <aside
            className={cn(
              'border-b border-slate-200 bg-slate-50 md:border-b-0 md:border-r',
              mobileChatOpen ? 'hidden md:block' : 'block',
            )}
          >
            <div className="border-b border-slate-200 px-4 py-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-slate-900 p-2 text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Admin Workspace</p>
                  <h1 className="text-lg font-semibold text-slate-900">Team Chat Center</h1>
                </div>
              </div>

              <div className="mb-3">
                <Button
                  type="button"
                  size="sm"
                  variant={notificationPermission === 'granted' ? 'default' : 'outline'}
                  onClick={requestNotificationPermission}
                  disabled={notificationPermission === 'unsupported' || notificationPermission === 'granted'}
                  className="w-full"
                >
                  <Bell className="mr-2 h-3.5 w-3.5" />
                  {notificationPermission === 'granted' && 'System Alerts Enabled'}
                  {notificationPermission === 'default' && 'Enable System Alerts'}
                  {notificationPermission === 'denied' && 'Notifications Blocked in Browser'}
                  {notificationPermission === 'unsupported' && 'Notifications Not Supported'}
                </Button>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search contacts"
                  className="pl-9"
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  variant={contactFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setContactFilter('all')}
                >
                  <Users className="mr-1 h-3.5 w-3.5" /> All
                </Button>
                <Button
                  size="sm"
                  variant={contactFilter === 'employee' ? 'default' : 'outline'}
                  onClick={() => setContactFilter('employee')}
                >
                  <User className="mr-1 h-3.5 w-3.5" /> Employee
                </Button>
                <Button
                  size="sm"
                  variant={contactFilter === 'admin' ? 'default' : 'outline'}
                  onClick={() => setContactFilter('admin')}
                >
                  <Building2 className="mr-1 h-3.5 w-3.5" /> Admin
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[calc(100%-11.5rem)]">
              {loadingContacts ? (
                <div className="flex items-center justify-center p-6 text-slate-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading contacts...
                </div>
              ) : filteredContacts.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No contacts found.</p>
              ) : (
                <div className="p-2">
                  {filteredContacts.map((contact) => {
                    const summary = conversations[contact.id];
                    const selected = contact.id === selectedContactId;
                    return (
                      <button
                        key={contact.id}
                        onClick={() => handleSelectContact(contact.id)}
                        className={cn(
                          'mb-1 w-full rounded-xl border px-3 py-3 text-left transition',
                          selected
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-100',
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback
                                className={cn(
                                  'text-xs font-semibold',
                                  selected ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-700',
                                )}
                              >
                                {contact.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{contact.name}</p>
                              <p className={cn('truncate text-xs', selected ? 'text-slate-200' : 'text-slate-500')}>
                                {contact.title}
                              </p>
                            </div>
                          </div>

                          {summary?.lastMessage?.timestamp && (
                            <span className={cn('text-[11px]', selected ? 'text-slate-300' : 'text-slate-500')}>
                              {formatSidebarTime(summary.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              'truncate text-xs',
                              selected ? 'text-slate-200' : 'text-slate-500',
                            )}
                          >
                            {summary?.lastMessage?.content || 'No messages yet'}
                          </p>
                          {summary?.unreadCount ? (
                            <Badge
                              className={cn(
                                'rounded-full px-2 py-0 text-[10px]',
                                selected ? 'bg-white text-slate-900' : 'bg-slate-900 text-white',
                              )}
                            >
                              {summary.unreadCount}
                            </Badge>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </aside>

          <section className={cn('relative h-full min-h-0 flex-col bg-white md:flex', mobileChatOpen ? 'flex' : 'hidden')}>
            {!selectedContact ? (
              <div className="flex h-full items-center justify-center p-6 text-center text-slate-500">
                <div>
                  <MessageCircle className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                  <p className="text-base font-semibold text-slate-700">Select a contact to start chatting</p>
                  <p className="text-sm">Choose employee or admin from the left panel.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:px-6">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setMobileChatOpen(false)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-slate-200 text-slate-700">
                        {selectedContact.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-slate-900">{selectedContact.name}</h2>
                      <p className="text-xs text-slate-500">
                        {selectedContact.title} • {selectedContact.department}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {selectedContact.type}
                  </Badge>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden">
                  {loadingThread ? (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading messages...
                    </div>
                  ) : (
                      <div ref={listRef} className="h-full overflow-y-auto px-4 py-4 pb-28 md:px-6">
                      {messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-center text-slate-500">
                          <div>
                            <MessageCircle className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                            <p className="text-sm">No messages yet. Send the first message.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {messages.map((message) => {
                            const mine = message.senderId === admin?.id;
                            return (
                              <div
                                key={message.id}
                                className={cn('flex', mine ? 'justify-end' : 'justify-start')}
                              >
                                <div
                                  className={cn(
                                    'max-w-[80%] rounded-2xl px-3 py-2 shadow-sm',
                                    mine ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900',
                                  )}
                                >
                                  {!mine && (
                                    <p className="mb-1 text-[11px] font-semibold text-slate-500">
                                      {message.senderName}
                                    </p>
                                  )}
                                  {message.content ? <p className="whitespace-pre-wrap text-sm">{message.content}</p> : null}
                                  {message.imageBase64 ? (
                                    <img
                                      src={message.imageBase64}
                                      alt={message.imageName || 'chat image'}
                                      className="mt-2 max-h-52 rounded-lg border object-cover"
                                    />
                                  ) : null}
                                  <p className={cn('mt-1 text-[11px]', mine ? 'text-slate-300' : 'text-slate-500')}>
                                    {formatTimestamp(message.timestamp)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-6px_18px_rgba(15,23,42,0.04)] md:px-6">
                  {imagePreview ? (
                    <div className="mb-3 inline-flex items-center gap-2 rounded-lg border bg-slate-50 px-2 py-2">
                      <img src={imagePreview} alt="preview" className="h-10 w-10 rounded object-cover" />
                      <span className="max-w-45 truncate text-xs text-slate-600">{imageFile?.name}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={clearImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onSelectImage}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileRef.current?.click()}
                      disabled={sending}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      onKeyDown={onComposerEnter}
                      placeholder={`Message ${selectedContact.name}...`}
                      disabled={sending}
                    />
                    <Button onClick={sendMessage} disabled={sending || (!text.trim() && !imageFile)}>
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </Card>
    </div>
  );
}
