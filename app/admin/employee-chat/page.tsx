'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  Mail,
  User,
  Search,
  Users,
  Sparkles,
  Image as ImageIcon,
  X,
  MoreVertical,
  Trash2,
  Edit,
  EyeOff,
  CheckCircle,
  Reply,
  Copy,
  ReplyAll,
  ChevronRight,
  Menu,
  Briefcase,
  Check,
  CheckCheck,
  Building,
  Phone,
  Calendar,
  Award,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
  orderBy
} from 'firebase/firestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Employee Interface
interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  position?: string;
  department?: string;
  status?: string;
  supervisor?: string;
  dateOfBirth?: string;
  nationality?: string;
  emiratesIDNumber?: string;
  passportNumber?: string;
  bankName?: string;
  bankAccount?: string;
  joinDate?: string;
  salary?: number;
  salaryStructure?: string;
  rating?: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  visaNumber?: string;
  visaExpiryDate?: string;
  assignedRoles?: string[];
  documents?: any[];
  team?: string[];
  burnoutRisk?: string;
  createdAt?: string;
  lastUpdated?: string;
}

// Message Interface
interface Message {
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

// Employee Chat Interface
interface EmployeeChat {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeRole?: string;
  employeeDepartment?: string;
  lastMessage?: Message;
  unreadCount: number;
  lastMessageTime?: any;
}

export default function SimpleEmployeeChatPage() {
  // States
  const [chatsSidebarOpen, setChatsSidebarOpen] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [chats, setChats] = useState<EmployeeChat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editContent, setEditContent] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);

  const [isSending, setIsSending] = useState(false);

  // 🔥 FIXED ADMIN ID - Aapni Firebase se li hui admin ki ID dalo
  const ADMIN_ID = "admin_001"; // ← YAHAN ADMIN KI REAL ID DALO
  const ADMIN_NAME = "Admin";
  const ADMIN_EMAIL = "admin@example.com";

  // ============================================
  // FETCH EMPLOYEES FROM FIREBASE - EMPLOYEES COLLECTION
  // ============================================
  useEffect(() => {
    fetchEmployeesFromFirebase();
  }, []);

  const fetchEmployeesFromFirebase = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching employees from Firebase...');
      
      // ✅ Using 'employees' collection
      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef);
      const snapshot = await getDocs(q);
      
      console.log('📊 Found documents:', snapshot.size);
      
      if (snapshot.empty) {
        console.log('⚠️ No documents found in employees collection');
        setEmployees([]);
        setLoading(false);
        return;
      }
      
      let employeesData: Employee[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'No Name',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'employee',
          position: data.position || '',
          department: data.department || '',
          status: data.status || 'Active',
          supervisor: data.supervisor || '',
          dateOfBirth: data.dateOfBirth || '',
          nationality: data.nationality || '',
          emiratesIDNumber: data.emiratesIDNumber || data.emiratesIdNumber || '',
          passportNumber: data.passportNumber || '',
          bankName: data.bankName || '',
          bankAccount: data.bankAccount || '',
          joinDate: data.joinDate || '',
          salary: data.salary || 0,
          salaryStructure: data.salaryStructure || '',
          rating: data.rating || 0,
          emergencyContact: data.emergencyContact || '',
          emergencyPhone: data.emergencyPhone || '',
          emergencyRelation: data.emergencyRelation || '',
          visaNumber: data.visaNumber || '',
          visaExpiryDate: data.visaExpiryDate || '',
          assignedRoles: data.assignedRoles || [],
          documents: data.documents || [],
          team: data.team || [],
          burnoutRisk: data.burnoutRisk || '',
          createdAt: data.createdAt || '',
          lastUpdated: data.lastUpdated || ''
        };
      });
      
      // Sort by name
      employeesData = employeesData.sort((a, b) => 
        (a.name || '').localeCompare(b.name || '')
      );
      
      console.log(`✅ Found ${employeesData.length} employees:`, employeesData);
      setEmployees(employeesData);
      setLoading(false);
      
    } catch (error) {
      console.error('❌ Error fetching employees:', error);
      setLoading(false);
    }
  };

  // ============================================
  // FETCH ALL CHATS
  // ============================================
  useEffect(() => {
    if (employees.length === 0) return;
    
    const fetchAllChats = async () => {
      try {
        const chatsData: EmployeeChat[] = [];
        
        for (const employee of employees) {
          // Messages from employee
          const employeeMessagesQuery = query(
            collection(db, 'employeeMessages'),
            where('senderId', '==', employee.id)
          );
          
          // Replies from admin
          const adminRepliesQuery = query(
            collection(db, 'employeeReplies'),
            where('recipientId', '==', employee.id)
          );
          
          const [employeeSnapshot, repliesSnapshot] = await Promise.all([
            getDocs(employeeMessagesQuery),
            getDocs(adminRepliesQuery)
          ]);
          
          const allMessages: Message[] = [];
          
          employeeSnapshot.forEach(doc => {
            const data = doc.data();
            allMessages.push({
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.toDate() || new Date(),
              collection: 'employeeMessages'
            } as Message);
          });
          
          repliesSnapshot.forEach(doc => {
            const data = doc.data();
            allMessages.push({
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.toDate() || new Date(),
              collection: 'employeeReplies'
            } as Message);
          });
          
          // Sort by timestamp descending for last message
          allMessages.sort((a, b) => b.timestamp - a.timestamp);
          const lastMessage = allMessages[0];
          
          // Calculate unread count
          let unreadCount = 0;
          if (selectedEmployeeId !== employee.id) {
            allMessages.forEach(msg => {
              if (msg.senderRole === 'employee' && !msg.read) {
                unreadCount++;
              }
            });
          }
          
          chatsData.push({
            employeeId: employee.id,
            employeeName: employee.name || 'Employee',
            employeeEmail: employee.email || '',
            employeeRole: employee.position || employee.role,
            employeeDepartment: employee.department,
            lastMessage,
            unreadCount,
            lastMessageTime: lastMessage?.timestamp
          });
        }
        
        // Sort chats by last message time
        chatsData.sort((a, b) => {
          if (!a.lastMessageTime && !b.lastMessageTime) {
            return a.employeeName.localeCompare(b.employeeName);
          }
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          const timeA = a.lastMessageTime?.toDate?.() || new Date(a.lastMessageTime);
          const timeB = b.lastMessageTime?.toDate?.() || new Date(b.lastMessageTime);
          return timeB.getTime() - timeA.getTime();
        });
        
        setChats(chatsData);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    
    fetchAllChats();
  }, [employees, selectedEmployeeId]);

  // Update selected employee details
  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find(e => e.id === selectedEmployeeId);
      if (employee) {
        setSelectedEmployeeDetails(employee);
        markMessagesAsRead(selectedEmployeeId);
      }
    } else {
      setSelectedEmployeeDetails(null);
    }
  }, [selectedEmployeeId, employees]);

  // Mark messages as read
  const markMessagesAsRead = async (employeeId: string) => {
    try {
      const messagesQuery = query(
        collection(db, 'employeeMessages'),
        where('senderId', '==', employeeId),
        where('read', '==', false)
      );
      
      const snapshot = await getDocs(messagesQuery);
      
      snapshot.docs.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          read: true,
          status: 'seen',
          readBy: [ADMIN_ID]
        });
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesScrollRef.current) {
      messagesScrollRef.current.scrollTo({
        top: messagesScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Image handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Image size should be less than 1MB');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearReply = () => {
    setReplyingTo(null);
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Send message
  const handleSendMessage = async () => {
    if (!selectedEmployeeId) {
      alert('Please select an employee first');
      return;
    }

    if (!newMessage.trim() && !selectedImage) {
      alert('Please enter a message or select an image');
      return;
    }

    const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);
    if (!selectedEmployee) {
      alert('Selected employee not found');
      return;
    }

    setIsSending(true);
    const messageContent = newMessage;
    setNewMessage('');

    try {
      let imageBase64 = null;
      let imageName = null;

      if (selectedImage) {
        imageBase64 = await convertImageToBase64(selectedImage);
        imageName = selectedImage.name;
        clearSelectedImage();
      }

      const messageData: any = {
        content: messageContent,
        senderId: ADMIN_ID,
        senderName: ADMIN_NAME,
        senderEmail: ADMIN_EMAIL,
        senderRole: 'admin',
        recipientRole: 'employee',
        recipientId: selectedEmployeeId,
        recipientName: selectedEmployee.name,
        timestamp: serverTimestamp(),
        read: false,
        status: 'sent',
        readBy: [],
        deletedFor: [],
        deletedForEveryone: false,
        edited: false,
        createdAt: new Date().toISOString()
      };

      if (imageBase64) {
        messageData.imageBase64 = imageBase64;
        messageData.imageName = imageName;
      }

      if (replyingTo) {
        messageData.replyToId = replyingTo.id;
        messageData.replyToContent = replyingTo.content || '';
        messageData.replyToSender = replyingTo.senderName || 'Someone';
      }

      await addDoc(collection(db, 'employeeReplies'), messageData);
      clearReply();
      
    } catch (error) {
      console.error('❌ Send error:', error);
      alert('Failed to send message');
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  // Message actions
  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Message copied!');
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const handleDeleteForMe = async (message: Message) => {
    try {
      const messageRef = doc(db, message.collection, message.id);
      const deletedFor = message.deletedFor || [];
      
      if (!deletedFor.includes(ADMIN_ID)) {
        await updateDoc(messageRef, { 
          deletedFor: [...deletedFor, ADMIN_ID] 
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDeleteForEveryone = async (message: Message) => {
    if (!confirm('Delete for everyone? This cannot be undone.')) {
      return;
    }
    try {
      await deleteDoc(doc(db, message.collection, message.id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleEditMessage = async () => {
    if (!editingMessage || !editContent.trim()) return;
    try {
      const messageRef = doc(db, editingMessage.collection, editingMessage.id);
      await updateDoc(messageRef, {
        content: editContent,
        edited: true,
        editedAt: serverTimestamp()
      });
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  const startEditing = (message: Message) => {
    setEditingMessage(message);
    setEditContent(message.content || '');
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 100);
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  // Format time
  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isToday(date)) return format(date, 'hh:mm a');
      if (isYesterday(date)) return `Yesterday ${format(date, 'hh:mm a')}`;
      return format(date, 'dd/MM/yy hh:mm a');
    } catch {
      return '';
    }
  };

  const formatChatTime = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isToday(date)) return format(date, 'hh:mm a');
      if (isYesterday(date)) return 'Yesterday';
      return format(date, 'dd/MM/yy');
    } catch {
      return '';
    }
  };

  // Filter out deleted messages
  const visibleMessages = messages.filter(msg => {
    const deletedFor = msg.deletedFor || [];
    return !deletedFor.includes(ADMIN_ID) && !msg.deletedForEveryone;
  });

  // Group messages by date
  const groupedMessages = visibleMessages.reduce((groups: any, msg) => {
    try {
      const date = msg.timestamp?.toDate 
        ? format(msg.timestamp.toDate(), 'yyyy-MM-dd')
        : format(new Date(msg.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    } catch {
      const date = format(new Date(), 'yyyy-MM-dd');
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    }
    return groups;
  }, {});

  const formatDateHeader = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isToday(date)) return 'Today';
      if (isYesterday(date)) return 'Yesterday';
      return format(date, 'MMMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  // ============================================
  // FIXED: Fetch messages WITHOUT orderBy to avoid index error
  // ============================================
  useEffect(() => {
    if (!selectedEmployeeId) {
      setMessages([]);
      return;
    }

    console.log('🔍 Setting up messages for employee:', selectedEmployeeId);

    // Messages from employee - WITHOUT orderBy (to avoid index error)
    const employeeMessagesQuery = query(
      collection(db, 'employeeMessages'),
      where('senderId', '==', selectedEmployeeId)
    );

    // Replies from admin - WITHOUT orderBy (to avoid index error)
    const adminRepliesQuery = query(
      collection(db, 'employeeReplies'),
      where('recipientId', '==', selectedEmployeeId)
    );

    const unsubscribeEmployeeMessages = onSnapshot(employeeMessagesQuery, (snapshot) => {
      const employeeMsgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
          collection: 'employeeMessages'
        };
      }) as Message[];
      
      setMessages(prev => {
        const replies = prev.filter(m => m.collection === 'employeeReplies');
        // Client-side sorting
        const allMsgs = [...employeeMsgs, ...replies];
        return allMsgs.sort((a, b) => a.timestamp - b.timestamp);
      });
    });

    const unsubscribeAdminReplies = onSnapshot(adminRepliesQuery, (snapshot) => {
      const replyMsgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
          collection: 'employeeReplies'
        };
      }) as Message[];
      
      setMessages(prev => {
        const employeeMsgs = prev.filter(m => m.collection === 'employeeMessages');
        // Client-side sorting
        const allMsgs = [...employeeMsgs, ...replyMsgs];
        return allMsgs.sort((a, b) => a.timestamp - b.timestamp);
      });
    });

    return () => {
      unsubscribeEmployeeMessages();
      unsubscribeAdminReplies();
    };
  }, [selectedEmployeeId]);

  // Filters
  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChats = chats.filter(chat => 
    chat.employeeName?.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    chat.employeeEmail?.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    chat.employeeDepartment?.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    chat.employeeRole?.toLowerCase().includes(chatSearchQuery.toLowerCase())
  );

  const handleChatSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    if (window.innerWidth < 768) {
      setChatsSidebarOpen(false);
    }
  };

  // Employee details component
  const EmployeeDetailsCard = ({ employee }: { employee: Employee }) => (
    <div className="bg-white border-b border-gray-200/80 px-6 py-5 shrink-0">
      <div className="flex items-start gap-5">
        <Avatar className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-2xl font-serif">
            {employee.name?.charAt(0) || 'E'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {employee.name}
            </h2>
            <Badge className={cn(
              "border-0 rounded-full px-4 py-1",
              employee.status === 'Active' 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-100 text-gray-700"
            )}>
              {employee.status || 'Active'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="truncate">{employee.email}</span>
            </div>
            
            {employee.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>{employee.phone}</span>
              </div>
            )}
            
            {employee.position && (
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="w-4 h-4 text-blue-500" />
                <span>{employee.position}</span>
              </div>
            )}
            
            {employee.department && (
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="w-4 h-4 text-blue-500" />
                <span>{employee.department}</span>
              </div>
            )}
            
            {employee.salary && (
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4 text-blue-500" />
                <span>{employee.salary} {employee.salaryStructure}</span>
              </div>
            )}
            
            {employee.joinDate && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Joined: {employee.joinDate}</span>
              </div>
            )}
          </div>
          
          {employee.rating && (
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(employee.rating || 0) ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
              <span className="text-xs text-gray-500 ml-1">({employee.rating})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Chats Sidebar */}
      <div className={cn(
        "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden",
        chatsSidebarOpen ? "w-80" : "w-0"
      )}>
        {chatsSidebarOpen && (
          <>
            <div className="shrink-0 bg-white border-b border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-serif font-bold text-gray-900">
                  Employees ({chats.length})
                </h2>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, department..."
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-gray-100 border-0 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredChats.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No employees found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredChats.map((chat) => (
                      <button
                        key={chat.employeeId}
                        onClick={() => handleChatSelect(chat.employeeId)}
                        className={cn(
                          "w-full flex items-start gap-3 p-3 rounded-xl transition-all",
                          selectedEmployeeId === chat.employeeId
                            ? "bg-blue-500/10 border border-blue-500/30"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <Avatar className="w-12 h-12 rounded-xl border-2 border-white shadow-sm">
                          <AvatarFallback className={cn(
                            "text-white text-lg font-serif",
                            selectedEmployeeId === chat.employeeId
                              ? "bg-gradient-to-br from-blue-500 to-blue-700"
                              : "bg-gradient-to-br from-gray-400 to-gray-600"
                          )}>
                            {chat.employeeName?.charAt(0) || 'E'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex-1">
                              <h3 className="font-medium truncate">
                                {chat.employeeName}
                              </h3>
                              <p className="text-xs text-gray-500 truncate">
                                {chat.employeeDepartment || chat.employeeRole || chat.employeeEmail}
                              </p>
                            </div>
                            {chat.lastMessageTime && (
                              <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                {formatChatTime(chat.lastMessageTime)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400 truncate max-w-[140px]">
                              {chat.lastMessage ? (
                                <>
                                  {chat.lastMessage.senderRole === 'admin' ? 'You: ' : ''}
                                  {chat.lastMessage.content || '📷 Image'}
                                </>
                              ) : (
                                <span className="italic">No messages yet</span>
                              )}
                            </p>
                            
                            {chat.unreadCount > 0 && (
                              <Badge className="bg-blue-500 text-white border-0 rounded-full ml-2">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>

      {!chatsSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-[72px] top-20 z-40 h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={() => setChatsSidebarOpen(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100"
                  onClick={() => setChatsSidebarOpen(!chatsSidebarOpen)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Employee Chat</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {employees.length} Employees Available
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Badge variant="outline" className="px-4 py-2 border-blue-500/30 text-blue-600 bg-white rounded-full">
              <Users className="w-3.5 h-3.5 mr-2" />
              {employees.length} Employees
            </Badge>
          </div>
        </header>

        <div className="flex-1 overflow-hidden p-6 pt-0">
          <Card className="h-full border-0 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col">
            
            <div className="flex-1 flex flex-col min-h-0">
              
              <div className="bg-gradient-to-r from-white to-gray-50/80 px-6 py-5 border-b border-gray-200/80 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 block">
                      SELECT EMPLOYEE TO CHAT
                    </label>
                    <Select 
                      value={selectedEmployeeId} 
                      onValueChange={setSelectedEmployeeId}
                    >
                      <SelectTrigger className="w-full md:w-[400px] h-14 border-2 border-gray-200/80 hover:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 rounded-2xl bg-white/80">
                        <SelectValue placeholder={
                          <div className="flex items-center gap-3 text-gray-500">
                            <User className="w-5 h-5 text-blue-500" />
                            <span>Choose an employee</span>
                          </div>
                        } />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-0 shadow-2xl p-2 bg-white/95">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder="Search by name, email, department..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/30"
                            />
                          </div>
                        </div>
                        <ScrollArea className="h-[280px]">
                          {filteredEmployees.length > 0 ? (
                            filteredEmployees.map(emp => (
                              <SelectItem 
                                key={emp.id} 
                                value={emp.id}
                                className="rounded-xl py-3 px-3 cursor-pointer hover:bg-blue-500/5"
                              >
                                <div className="flex items-start gap-3">
                                  <Avatar className="w-8 h-8 mt-1">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-blue-700/10 text-blue-600 text-xs">
                                      {emp.name?.charAt(0) || 'E'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900">{emp.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {emp.position || emp.role} • {emp.department || 'No Dept'}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                      {emp.email}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="py-8 text-center text-gray-500">
                              No employees found
                            </div>
                          )}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedEmployeeDetails && (
                    <div className="flex items-center gap-4 px-4 py-2 bg-blue-500/5 rounded-2xl border border-blue-500/20 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-600">Online</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedEmployeeId && selectedEmployeeDetails ? (
                <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-gray-50 to-white">
                  
                  {/* Employee Details Card */}
                  <EmployeeDetailsCard employee={selectedEmployeeDetails} />

                  {/* Messages Area */}
                  <div className="flex-1 bg-[#f3f2f1] relative min-h-0">
                    <ScrollArea 
                      ref={messagesScrollRef}
                      className="absolute inset-0 w-full h-full"
                    >
                      <div className="px-6 py-6">
                        {visibleMessages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-[300px]">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-700/10 rounded-3xl flex items-center justify-center mb-4">
                              <MessageCircle className="w-12 h-12 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No messages yet</h3>
                            <p className="text-gray-500 text-center">
                              Start a conversation with {selectedEmployeeDetails.name}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {Object.entries(groupedMessages).map(([date, dateMessages]: [string, any]) => (
                              <div key={date}>
                                <div className="flex justify-center mb-4">
                                  <span className="bg-gray-900/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full shadow-lg">
                                    {formatDateHeader(date)}
                                  </span>
                                </div>
                                
                                <div className="space-y-3">
                                  {(dateMessages as Message[]).map((msg) => {
                                    const isMe = msg.senderRole === 'admin';
                                    
                                    return (
                                      <div key={msg.id} className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
                                        
                                        {!isMe && (
                                          <Avatar className="w-8 h-8 ring-2 ring-white shadow-md">
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs">
                                              {msg.senderName?.charAt(0) || 'E'}
                                            </AvatarFallback>
                                          </Avatar>
                                        )}
                                        
                                        <div className={cn("max-w-xs lg:max-w-md", isMe ? "order-2" : "order-1")}>
                                          <div className={cn(
                                            "px-4 py-2.5 rounded-2xl text-sm shadow-sm relative group/message",
                                            isMe 
                                              ? "bg-gradient-to-br from-[#dcf8c6] to-[#c8e6b5] text-gray-800 rounded-br-none" 
                                              : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                                          )}>
                                            {!isMe && (
                                              <p className="text-xs font-semibold text-blue-600 mb-1">
                                                {msg.senderName}
                                              </p>
                                            )}
                                            {isMe && (
                                              <p className="text-xs font-semibold text-blue-600 mb-1">
                                                You (Admin)
                                              </p>
                                            )}
                                            
                                            {msg.replyToId && (
                                              <div className="mb-2 pl-2 border-l-3 border-blue-500 bg-gray-50 p-2 rounded-lg text-xs">
                                                <p className="text-blue-600 font-semibold">
                                                  Replying to {msg.replyToSender}
                                                </p>
                                                <p className="text-gray-600 line-clamp-2">
                                                  {msg.replyToContent || '📷 Image'}
                                                </p>
                                              </div>
                                            )}
                                            
                                            {editingMessage?.id === msg.id ? (
                                              <div className="flex items-center gap-2">
                                                <Input
                                                  ref={editInputRef}
                                                  value={editContent}
                                                  onChange={(e) => setEditContent(e.target.value)}
                                                  className="flex-1"
                                                  onKeyPress={(e) => e.key === 'Enter' && handleEditMessage()}
                                                />
                                                <Button size="sm" onClick={handleEditMessage}>Save</Button>
                                                <Button size="sm" variant="ghost" onClick={cancelEditing}>Cancel</Button>
                                              </div>
                                            ) : (
                                              <>
                                                {msg.content && (
                                                  <p className="whitespace-pre-wrap break-words leading-relaxed mb-2">
                                                    {msg.content}
                                                    {msg.edited && (
                                                      <span className="text-[10px] text-gray-500 ml-1 italic">
                                                        (edited)
                                                      </span>
                                                    )}
                                                  </p>
                                                )}
                                                
                                                {msg.imageBase64 && (
                                                  <div className="mb-2 rounded-lg overflow-hidden border border-gray-200">
                                                    <img 
                                                      src={msg.imageBase64} 
                                                      alt={msg.imageName}
                                                      className="max-w-full h-auto max-h-64 object-contain"
                                                    />
                                                  </div>
                                                )}
                                              </>
                                            )}
                                            
                                            <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-400">
                                              <span>{formatMessageTime(msg.timestamp)}</span>
                                              {isMe && msg.status === 'sent' && <Check className="w-3 h-3" />}
                                              {isMe && msg.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                                              {isMe && msg.status === 'seen' && <CheckCheck className="w-3 h-3 text-blue-600" />}
                                            </div>

                                            {editingMessage?.id !== msg.id && (
                                              <div className="absolute -top-2 -right-2 opacity-0 group-hover/message:opacity-100 transition-opacity">
                                                <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white shadow-md">
                                                      <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => setReplyingTo(msg)}>
                                                      <Reply className="w-4 h-4 mr-2" /> Reply
                                                    </DropdownMenuItem>
                                                    {msg.content && (
                                                      <DropdownMenuItem onClick={() => handleCopyMessage(msg.content)}>
                                                        <Copy className="w-4 h-4 mr-2" /> Copy
                                                      </DropdownMenuItem>
                                                    )}
                                                    {isMe && (
                                                      <>
                                                        <DropdownMenuItem onClick={() => startEditing(msg)}>
                                                          <Edit className="w-4 h-4 mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteForMe(msg)}>
                                                          <EyeOff className="w-4 h-4 mr-2" /> Delete for me
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                          onClick={() => handleDeleteForEveryone(msg)}
                                                          className="text-red-600"
                                                        >
                                                          <Trash2 className="w-4 h-4 mr-2" /> Delete for everyone
                                                        </DropdownMenuItem>
                                                      </>
                                                    )}
                                                  </DropdownMenuContent>
                                                </DropdownMenu>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        
                                        {isMe && (
                                          <Avatar className="w-8 h-8 ring-2 ring-white shadow-md">
                                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xs">
                                              A
                                            </AvatarFallback>
                                          </Avatar>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Message Input */}
                  <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/80 px-6 py-1 shrink-0">
                    
                    {replyingTo && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg flex items-center gap-3 border-l-4 border-blue-500">
                        <ReplyAll className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-700">
                            Replying to {replyingTo.senderName}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {replyingTo.content || '📷 Image'}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={clearReply}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    
                    {imagePreview && (
                      <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-sm text-gray-600 truncate">
                          {selectedImage?.name}
                        </div>
                        <Button variant="ghost" size="icon" onClick={clearSelectedImage}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 py-3">
                      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                      
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shrink-0" onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="w-5 h-5" />
                      </Button>
                      
                      <div className="flex-1 bg-gray-100/80 rounded-2xl border border-gray-200/50">
                        <div className="flex items-center px-4">
                          {replyingTo && <ReplyAll className="w-4 h-4 text-blue-500 mr-2" />}
                          <MessageCircle className="w-5 h-5 text-gray-400" />
                          <Input
                            ref={replyInputRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message ${selectedEmployeeDetails?.name || 'employee'}...`}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="border-0 bg-transparent px-3 py-5 focus-visible:ring-0 text-sm"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!newMessage.trim() && !selectedImage || isSending}
                        className="h-12 px-6 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-2xl shadow-lg"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSending ? 'Sending...' : 'Send'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                  <div className="text-center max-w-md px-6">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-500/20 to-blue-700/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Briefcase className="w-14 h-14 text-blue-600/40" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                      Employee Chat
                    </h3>
                    <p className="text-gray-500 mb-8">
                      Select an employee from the dropdown above to start messaging.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-500/10 px-6 py-3 rounded-2xl">
                      <Sparkles className="w-4 h-4" />
                      <span>{employees.length} employees available</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}