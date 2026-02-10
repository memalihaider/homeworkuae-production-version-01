'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, X, Search, MessageSquare, AlertCircle, CheckCircle, Clock, User, 
  Calendar, Star, Eye, Edit, Trash2, ArrowLeft, Save, UserCheck, TrendingUp,
  Menu, Send
} from 'lucide-react';
import Link from 'next/link';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';

// Firebase Interfaces
interface FirebaseEmployee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  status: string;
  supervisor: string;
  salary: number;
  salaryStructure: string;
  bankName: string;
  bankAccount: string;
  joinDate: string;
  createdAt: string;
  lastUpdated: string;
}

interface FirebaseFeedback {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  submittedBy: string;
  submissionDate: string;
  rating: number;
  category: string;
  title: string;
  content: string;
  status: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface FirebaseComplaint {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  filedBy: string;
  submissionDate: string;
  category: string;
  priority: string;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  resolution: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export default function EmployeeFeedbackAndComplaints() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback' | 'complaints'>('feedback');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Real Data States
  const [employees, setEmployees] = useState<FirebaseEmployee[]>([]);
  const [feedbacks, setFeedbacks] = useState<FirebaseFeedback[]>([]);
  const [complaints, setComplaints] = useState<FirebaseComplaint[]>([]);

  // Form States
  const [feedbackForm, setFeedbackForm] = useState({
    employeeId: '',
    rating: 5,
    category: 'Performance',
    title: '',
    content: '',
    tags: '',
    status: 'Active'
  });

  const [complaintForm, setComplaintForm] = useState({
    employeeId: '',
    category: 'Workplace Safety',
    priority: 'Medium',
    title: '',
    description: '',
    filedBy: 'Employee',
    status: 'Open',
    assignedTo: 'Unassigned',
    resolution: ''
  });

  // Authentication and Session
  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession) {
      router.push('/login/employee');
      return;
    }
    setSession(storedSession);
  }, [router]);

  // Fetch all data from Firebase
  useEffect(() => {
    if (session) {
      fetchEmployees();
      fetchFeedbacks();
      fetchComplaints();
    }
  }, [session]);

  const fetchEmployees = async () => {
    try {
      const employeesRef = collection(db, 'employees');
      const snapshot = await getDocs(employeesRef);
      
      const employeesList: FirebaseEmployee[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        employeesList.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || '',
          position: data.position || '',
          role: data.role || '',
          status: data.status || '',
          supervisor: data.supervisor || '',
          salary: data.salary || 0,
          salaryStructure: data.salaryStructure || '',
          bankName: data.bankName || '',
          bankAccount: data.bankAccount || '',
          joinDate: data.joinDate || '',
          createdAt: data.createdAt || '',
          lastUpdated: data.lastUpdated || ''
        });
      });
      
      setEmployees(employeesList);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const feedbacksRef = collection(db, 'feedbacks');
      const q = query(feedbacksRef, orderBy('submissionDate', 'desc'));
      const snapshot = await getDocs(q);
      
      const feedbacksList: FirebaseFeedback[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        feedbacksList.push({
          id: doc.id,
          employeeId: data.employeeId || '',
          employeeName: data.employeeName || '',
          employeeRole: data.employeeRole || '',
          submittedBy: data.submittedBy || 'Admin',
          submissionDate: data.submissionDate || '',
          rating: data.rating || 0,
          category: data.category || '',
          title: data.title || '',
          content: data.content || '',
          status: data.status || 'Active',
          tags: data.tags || [],
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || ''
        });
      });
      
      setFeedbacks(feedbacksList);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const complaintsRef = collection(db, 'complaints');
      const q = query(complaintsRef, orderBy('submissionDate', 'desc'));
      const snapshot = await getDocs(q);
      
      const complaintsList: FirebaseComplaint[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        complaintsList.push({
          id: doc.id,
          employeeId: data.employeeId || '',
          employeeName: data.employeeName || '',
          employeeRole: data.employeeRole || '',
          filedBy: data.filedBy || 'Employee',
          submissionDate: data.submissionDate || '',
          category: data.category || '',
          priority: data.priority || 'Medium',
          title: data.title || '',
          description: data.description || '',
          status: data.status || 'Open',
          assignedTo: data.assignedTo || 'Unassigned',
          resolution: data.resolution || '',
          attachments: data.attachments || [],
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || ''
        });
      });
      
      setComplaints(complaintsList);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  // Clean data for Firebase
  const cleanFirebaseData = (data: any) => {
    const cleanData: any = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        if (typeof data[key] === 'string' && data[key].trim() === '') {
          cleanData[key] = '';
        } else {
          cleanData[key] = data[key];
        }
      } else {
        cleanData[key] = '';
      }
    });
    return cleanData;
  };

  // Add Feedback to Firebase
  const handleAddFeedback = async () => {
    if (!feedbackForm.employeeId || !feedbackForm.title || !feedbackForm.content) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const employee = employees.find(e => e.id === feedbackForm.employeeId);
      if (!employee) {
        alert('Employee not found');
        return;
      }

      const feedbackData = {
        employeeId: feedbackForm.employeeId,
        employeeName: employee.name,
        employeeRole: employee.position,
        submittedBy: 'Admin',
        submissionDate: new Date().toISOString().split('T')[0],
        rating: feedbackForm.rating,
        category: feedbackForm.category,
        title: feedbackForm.title,
        content: feedbackForm.content,
        status: feedbackForm.status,
        tags: feedbackForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const cleanData = cleanFirebaseData(feedbackData);
      await addDoc(collection(db, 'feedbacks'), cleanData);

      // Reset form and refresh data
      setFeedbackForm({
        employeeId: '',
        rating: 5,
        category: 'Performance',
        title: '',
        content: '',
        tags: '',
        status: 'Active'
      });
      setShowAddModal(false);
      fetchFeedbacks();
      
      alert('Feedback added successfully!');
    } catch (error) {
      console.error('Error adding feedback:', error);
      alert('Error adding feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit Feedback in Firebase
  const handleEditFeedback = async () => {
    if (!editingItem || !feedbackForm.title || !feedbackForm.content) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const updatedFeedback = {
        ...editingItem,
        rating: feedbackForm.rating,
        category: feedbackForm.category,
        title: feedbackForm.title,
        content: feedbackForm.content,
        status: feedbackForm.status,
        tags: feedbackForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        updatedAt: new Date().toISOString()
      };

      const cleanData = cleanFirebaseData(updatedFeedback);
      await updateDoc(doc(db, 'feedbacks', editingItem.id), cleanData);

      // Reset form and refresh data
      setFeedbackForm({
        employeeId: '',
        rating: 5,
        category: 'Performance',
        title: '',
        content: '',
        tags: '',
        status: 'Active'
      });
      setShowEditModal(false);
      setEditingItem(null);
      fetchFeedbacks();
      
      alert('Feedback updated successfully!');
    } catch (error) {
      console.error('Error updating feedback:', error);
      alert('Error updating feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add Complaint to Firebase
  const handleAddComplaint = async () => {
    if (!complaintForm.employeeId || !complaintForm.title || !complaintForm.description) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const employee = employees.find(e => e.id === complaintForm.employeeId);
      if (!employee) {
        alert('Employee not found');
        return;
      }

      const complaintData = {
        employeeId: complaintForm.employeeId,
        employeeName: employee.name,
        employeeRole: employee.position,
        filedBy: complaintForm.filedBy,
        submissionDate: new Date().toISOString().split('T')[0],
        category: complaintForm.category,
        priority: complaintForm.priority,
        title: complaintForm.title,
        description: complaintForm.description,
        status: complaintForm.status,
        assignedTo: complaintForm.assignedTo,
        resolution: complaintForm.resolution,
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const cleanData = cleanFirebaseData(complaintData);
      await addDoc(collection(db, 'complaints'), cleanData);

      // Reset form and refresh data
      setComplaintForm({
        employeeId: '',
        category: 'Workplace Safety',
        priority: 'Medium',
        title: '',
        description: '',
        filedBy: 'Employee',
        status: 'Open',
        assignedTo: 'Unassigned',
        resolution: ''
      });
      setShowAddModal(false);
      fetchComplaints();
      
      alert('Complaint added successfully!');
    } catch (error) {
      console.error('Error adding complaint:', error);
      alert('Error adding complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit Complaint in Firebase
  const handleEditComplaint = async () => {
    if (!editingItem || !complaintForm.title || !complaintForm.description) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const updatedComplaint = {
        ...editingItem,
        category: complaintForm.category,
        priority: complaintForm.priority,
        title: complaintForm.title,
        description: complaintForm.description,
        filedBy: complaintForm.filedBy,
        status: complaintForm.status,
        assignedTo: complaintForm.assignedTo,
        resolution: complaintForm.resolution,
        updatedAt: new Date().toISOString()
      };

      const cleanData = cleanFirebaseData(updatedComplaint);
      await updateDoc(doc(db, 'complaints', editingItem.id), cleanData);

      // Reset form and refresh data
      setComplaintForm({
        employeeId: '',
        category: 'Workplace Safety',
        priority: 'Medium',
        title: '',
        description: '',
        filedBy: 'Employee',
        status: 'Open',
        assignedTo: 'Unassigned',
        resolution: ''
      });
      setShowEditModal(false);
      setEditingItem(null);
      fetchComplaints();
      
      alert('Complaint updated successfully!');
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Error updating complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Feedback from Firebase
  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await deleteDoc(doc(db, 'feedbacks', id));
      fetchFeedbacks();
      alert('Feedback deleted successfully!');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Error deleting feedback. Please try again.');
    }
  };

  // Delete Complaint from Firebase
  const handleDeleteComplaint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await deleteDoc(doc(db, 'complaints', id));
      fetchComplaints();
      alert('Complaint deleted successfully!');
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Error deleting complaint. Please try again.');
    }
  };

  // Open Edit Modal for Feedback
  const openEditFeedback = (feedback: FirebaseFeedback) => {
    setEditingItem(feedback);
    setFeedbackForm({
      employeeId: feedback.employeeId,
      rating: feedback.rating,
      category: feedback.category,
      title: feedback.title,
      content: feedback.content,
      tags: feedback.tags?.join(', ') || '',
      status: feedback.status
    });
    setShowEditModal(true);
  };

  // Open Edit Modal for Complaint
  const openEditComplaint = (complaint: FirebaseComplaint) => {
    setEditingItem(complaint);
    setComplaintForm({
      employeeId: complaint.employeeId,
      category: complaint.category,
      priority: complaint.priority,
      title: complaint.title,
      description: complaint.description,
      filedBy: complaint.filedBy,
      status: complaint.status,
      assignedTo: complaint.assignedTo,
      resolution: complaint.resolution || ''
    });
    setShowEditModal(true);
  };

  // Filter functions
  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesSearch = searchTerm === '' || 
      f.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = searchTerm === '' || 
      c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Status color functions (Code 1 style)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-900/20 text-green-400 border-green-800';
      case 'Active': return 'bg-green-900/20 text-green-400 border-green-800';
      case 'Resolved': return 'bg-green-900/20 text-green-400 border-green-800';
      case 'Pending': return 'bg-amber-900/20 text-amber-400 border-amber-800';
      case 'Pending Action': return 'bg-amber-900/20 text-amber-400 border-amber-800';
      case 'Open': return 'bg-amber-900/20 text-amber-400 border-amber-800';
      case 'In Progress': return 'bg-blue-900/20 text-blue-400 border-blue-800';
      case 'Rejected': return 'bg-red-900/20 text-red-400 border-red-800';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 3.5) return 'text-blue-400';
    if (rating >= 2.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-900/20 text-red-400 border-red-800';
      case 'Medium': return 'bg-amber-900/20 text-amber-400 border-amber-800';
      case 'Low': return 'bg-green-900/20 text-green-400 border-green-800';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  // Summary Statistics
  const summaryStats = {
    totalFeedbacks: feedbacks.length,
    activeFeedbacks: feedbacks.filter(f => f.status === 'Active').length,
    totalComplaints: complaints.length,
    openComplaints: complaints.filter(c => c.status === 'Open').length,
    inProgressComplaints: complaints.filter(c => c.status === 'In Progress').length,
    resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <EmployeeSidebar session={session} open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <main className="flex-1 overflow-auto">
        {/* Header - Code 1 Style */}
        <div className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur border-b border-slate-700">
          <div className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-slate-700 rounded-lg">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Employee Feedback & Complaints</h1>
                <p className="text-sm text-slate-400">Manage employee feedback and handle complaints</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
            >
              New {activeTab === 'feedback' ? 'Feedback' : 'Complaint'}
            </button>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Statistics - Code 1 Style */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Total Feedbacks</p>
              <p className="text-3xl font-bold text-white mt-2">{summaryStats.totalFeedbacks}</p>
              <p className="text-sm text-green-400 mt-1">{summaryStats.activeFeedbacks} Active</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Total Complaints</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">{summaryStats.totalComplaints}</p>
              <p className="text-sm text-red-400 mt-1">{summaryStats.openComplaints} Open</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">{summaryStats.inProgressComplaints}</p>
              <p className="text-sm text-blue-400 mt-1">Complaints</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Resolved</p>
              <p className="text-3xl font-bold text-green-400 mt-2">{summaryStats.resolvedComplaints}</p>
              <p className="text-sm text-green-400 mt-1">Complaints</p>
            </div>
          </div>

          {/* Tab Navigation - Modified Code 1 Style */}
          <div className="flex items-center gap-4 p-1 bg-slate-800 border border-slate-700 rounded-xl w-fit">
            {[
              { id: 'feedback', label: 'Employee Feedback', icon: Star },
              { id: 'complaints', label: 'Complaints', icon: AlertCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setFilterStatus('all');
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Filter - Code 1 Style */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all" className="bg-slate-800">All Status</option>
              {activeTab === 'feedback' ? (
                <>
                  <option value="Active" className="bg-slate-800">Active</option>
                  <option value="Pending Action" className="bg-slate-800">Pending Action</option>
                </>
              ) : (
                <>
                  <option value="Open" className="bg-slate-800">Open</option>
                  <option value="In Progress" className="bg-slate-800">In Progress</option>
                  <option value="Resolved" className="bg-slate-800">Resolved</option>
                </>
              )}
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
            </div>
          )}

          {/* Feedback Tab - Code 1 Style */}
          {activeTab === 'feedback' && !loading && (
            <div className="space-y-4">
              {filteredFeedbacks.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No feedbacks found</p>
                </div>
              ) : (
                filteredFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Star className="w-5 h-5 text-violet-400" />
                          <h3 className="text-lg font-semibold text-white">{feedback.title}</h3>
                          <span className="text-xs px-2 py-1 rounded bg-violet-900/20 text-violet-300">
                            {feedback.category}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(feedback.status)}`}>
                            {feedback.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{feedback.content}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-300">{feedback.employeeName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(feedback.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                            <span className={`ml-2 text-sm font-bold ${getRatingColor(feedback.rating)}`}>
                              {feedback.rating.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar className="w-4 h-4" />
                            {feedback.submissionDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedItem(feedback);
                            setShowViewModal(true);
                          }}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5 text-slate-400 hover:text-violet-400" />
                        </button>
                        <button
                          onClick={() => openEditFeedback(feedback)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5 text-slate-400 hover:text-green-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteFeedback(feedback.id)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-slate-400 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Complaints Tab - Code 1 Style */}
          {activeTab === 'complaints' && !loading && (
            <div className="space-y-4">
              {filteredComplaints.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
                  <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No complaints found</p>
                </div>
              ) : (
                filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                          <h3 className="text-lg font-semibold text-white">{complaint.title}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full border ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority} Priority
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{complaint.description}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-300">{complaint.employeeName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar className="w-4 h-4" />
                            {complaint.submissionDate}
                          </div>
                          <div className="text-sm text-slate-400">
                            Filed by: <span className="text-slate-300">{complaint.filedBy}</span>
                          </div>
                          <div className="text-sm text-slate-400">
                            Assigned to: <span className="text-slate-300">{complaint.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedItem(complaint);
                            setShowViewModal(true);
                          }}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5 text-slate-400 hover:text-violet-400" />
                        </button>
                        <button
                          onClick={() => openEditComplaint(complaint)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5 text-slate-400 hover:text-green-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteComplaint(complaint.id)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-slate-400 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add Feedback/Complaint Modal - Code 1 Style */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                Add {activeTab === 'feedback' ? 'Employee Feedback' : 'Complaint'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Employee *</label>
                <select
                  value={activeTab === 'feedback' ? feedbackForm.employeeId : complaintForm.employeeId}
                  onChange={(e) => {
                    if (activeTab === 'feedback') {
                      setFeedbackForm({...feedbackForm, employeeId: e.target.value});
                    } else {
                      setComplaintForm({...complaintForm, employeeId: e.target.value});
                    }
                  }}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                >
                  <option value="" className="bg-slate-800">Select an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-slate-800">
                      {emp.name} ({emp.position})
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === 'feedback' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Rating *</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.5"
                        value={feedbackForm.rating}
                        onChange={(e) => setFeedbackForm({...feedbackForm, rating: parseFloat(e.target.value)})}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                      <select
                        value={feedbackForm.category}
                        onChange={(e) => setFeedbackForm({...feedbackForm, category: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      >
                        <option value="Performance" className="bg-slate-800">Performance</option>
                        <option value="Quality of Work" className="bg-slate-800">Quality of Work</option>
                        <option value="Development" className="bg-slate-800">Development</option>
                        <option value="Behavior" className="bg-slate-800">Behavior</option>
                        <option value="Other" className="bg-slate-800">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select
                      value={feedbackForm.status}
                      onChange={(e) => setFeedbackForm({...feedbackForm, status: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="Active" className="bg-slate-800">Active</option>
                      <option value="Pending Action" className="bg-slate-800">Pending Action</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                    <input
                      type="text"
                      value={feedbackForm.title}
                      onChange={(e) => setFeedbackForm({...feedbackForm, title: e.target.value})}
                      placeholder="Feedback title"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Feedback *</label>
                    <textarea
                      value={feedbackForm.content}
                      onChange={(e) => setFeedbackForm({...feedbackForm, content: e.target.value})}
                      placeholder="Provide detailed feedback..."
                      className="w-full h-24 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={feedbackForm.tags}
                      onChange={(e) => setFeedbackForm({...feedbackForm, tags: e.target.value})}
                      placeholder="e.g., Leadership, Performance, Professional"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                      <select
                        value={complaintForm.category}
                        onChange={(e) => setComplaintForm({...complaintForm, category: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      >
                        <option value="Workplace Safety" className="bg-slate-800">Workplace Safety</option>
                        <option value="Work Schedule" className="bg-slate-800">Work Schedule</option>
                        <option value="Performance" className="bg-slate-800">Performance</option>
                        <option value="Management" className="bg-slate-800">Management</option>
                        <option value="Other" className="bg-slate-800">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Priority *</label>
                      <select
                        value={complaintForm.priority}
                        onChange={(e) => setComplaintForm({...complaintForm, priority: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      >
                        <option value="High" className="bg-slate-800">High</option>
                        <option value="Medium" className="bg-slate-800">Medium</option>
                        <option value="Low" className="bg-slate-800">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Filed By *</label>
                      <select
                        value={complaintForm.filedBy}
                        onChange={(e) => setComplaintForm({...complaintForm, filedBy: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      >
                        <option value="Employee" className="bg-slate-800">Employee</option>
                        <option value="Supervisor" className="bg-slate-800">Supervisor</option>
                        <option value="Manager" className="bg-slate-800">Manager</option>
                        <option value="Admin" className="bg-slate-800">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Status *</label>
                      <select
                        value={complaintForm.status}
                        onChange={(e) => setComplaintForm({...complaintForm, status: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      >
                        <option value="Open" className="bg-slate-800">Open</option>
                        <option value="In Progress" className="bg-slate-800">In Progress</option>
                        <option value="Resolved" className="bg-slate-800">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Assigned To</label>
                    <input
                      type="text"
                      value={complaintForm.assignedTo}
                      onChange={(e) => setComplaintForm({...complaintForm, assignedTo: e.target.value})}
                      placeholder="e.g., HR Manager, Supervisor"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Complaint Title *</label>
                    <input
                      type="text"
                      value={complaintForm.title}
                      onChange={(e) => setComplaintForm({...complaintForm, title: e.target.value})}
                      placeholder="Brief complaint title"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                    <textarea
                      value={complaintForm.description}
                      onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                      placeholder="Provide detailed complaint description..."
                      className="w-full h-24 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Resolution</label>
                    <textarea
                      value={complaintForm.resolution}
                      onChange={(e) => setComplaintForm({...complaintForm, resolution: e.target.value})}
                      placeholder="Resolution details (if any)"
                      className="w-full h-20 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={activeTab === 'feedback' ? handleAddFeedback : handleAddComplaint}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Saving...' : activeTab === 'feedback' ? 'Add Feedback' : 'Add Complaint'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}