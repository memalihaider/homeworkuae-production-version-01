'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  MessageSquare,
  Phone,
  Mail,
  HelpCircle,
  Send,
  Clock,
  Check,
  AlertCircle,
  ChevronDown,
  Plus,
  X,
  Search,
  Filter,
  Zap,
  Tag
} from 'lucide-react'

interface TicketMessage {
  author: string
  time: string
  message: string
}

interface SupportTicket {
  id: string
  subject: string
  category: 'General Inquiry' | 'Booking' | 'Billing' | 'Technical' | 'Other'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  created: string
  updated: string
  priority: 'Low' | 'Normal' | 'High' | 'Critical'
  messages: TicketMessage[]
}

export default function Support() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'closed'>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'normal' | 'high' | 'critical'>('all')
  const [createForm, setCreateForm] = useState({ subject: '', category: 'General Inquiry' as const, priority: 'Normal' as const, description: '' })

  const supportTickets: SupportTicket[] = [
    {
      id: 'TK001',
      subject: 'Question about Deep Cleaning Service',
      category: 'General Inquiry',
      status: 'Resolved',
      created: 'Dec 20, 2025',
      updated: 'Dec 21, 2025',
      priority: 'Normal',
      messages: [
        { author: 'You', time: 'Dec 20, 9:15 AM', message: 'What areas does the deep cleaning service cover?' },
        { author: 'Support Team', time: 'Dec 20, 10:30 AM', message: 'Our deep cleaning service covers all areas within Dubai including villas, apartments, and commercial spaces.' },
        { author: 'You', time: 'Dec 20, 11:00 AM', message: 'Perfect! Thank you for the clarification.' },
      ]
    },
    {
      id: 'TK002',
      subject: 'Booking Cancellation Request',
      category: 'Booking',
      status: 'In Progress',
      created: 'Dec 22, 2025',
      updated: 'Dec 23, 2025',
      priority: 'High',
      messages: [
        { author: 'You', time: 'Dec 22, 2:45 PM', message: 'I need to cancel my booking for Dec 25. Is there a cancellation fee?' },
        { author: 'Support Team', time: 'Dec 22, 3:20 PM', message: 'Thank you for reaching out. Cancellations made more than 24 hours before the service have no fees. Let me process this for you.' },
      ]
    },
    {
      id: 'TK003',
      subject: 'Payment Issue',
      category: 'Billing',
      status: 'Open',
      created: 'Dec 21, 2025',
      updated: 'Dec 23, 2025',
      priority: 'High',
      messages: [
        { author: 'You', time: 'Dec 21, 1:00 PM', message: 'My payment for invoice INV003 keeps failing. Error code: 5001' },
        { author: 'Support Team', time: 'Dec 21, 1:45 PM', message: 'We\'re investigating this. Could you verify that your card details are up to date?' },
      ]
    },
    {
      id: 'TK004',
      subject: 'Service Quality Feedback',
      category: 'Other',
      status: 'Closed',
      created: 'Dec 15, 2025',
      updated: 'Dec 18, 2025',
      priority: 'Low',
      messages: [
        { author: 'You', time: 'Dec 15, 4:00 PM', message: 'I wanted to give feedback on the excellent service provided by the team last week.' },
      ]
    },
  ]

  // Handler Functions
  const handleSendMessage = useCallback(() => {
    if (!selectedTicket || !newMessage.trim()) return
    alert('Message sent successfully!')
    setNewMessage('')
  }, [selectedTicket, newMessage])

  const handleCreateTicket = useCallback(() => {
    if (!createForm.subject || !createForm.description) {
      alert('Please fill in all fields')
      return
    }
    alert(`Support ticket #${supportTickets.length + 1} created successfully!`)
    setShowCreateModal(false)
    setCreateForm({ subject: '', category: 'General Inquiry', priority: 'Normal', description: '' })
  }, [createForm, supportTickets.length])

  const handleCloseTicket = useCallback((ticketId: string) => {
    if (confirm('Are you sure you want to close this ticket?')) {
      alert(`Ticket ${ticketId} closed successfully!`)
      setShowDetailModal(false)
    }
  }, [])

  const handleReopenTicket = useCallback((ticketId: string) => {
    alert(`Ticket ${ticketId} reopened successfully!`)
  }, [])

  // Filtering and Search
  const filteredTickets = useMemo(() => {
    return supportTickets.filter(ticket => {
      const matchesSearch = ticket.id.includes(searchTerm) || ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || ticket.status.toLowerCase().replace(' ', '-') === filterStatus
      const matchesPriority = filterPriority === 'all' || ticket.priority.toLowerCase() === filterPriority
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [supportTickets, searchTerm, filterStatus, filterPriority])

  // Statistics
  const stats = useMemo(() => ({
    open: supportTickets.filter(t => t.status === 'Open').length,
    inProgress: supportTickets.filter(t => t.status === 'In Progress').length,
    resolved: supportTickets.filter(t => t.status === 'Resolved').length,
    closed: supportTickets.filter(t => t.status === 'Closed').length,
    total: supportTickets.length,
  }), [supportTickets])

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30'
      case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
      case 'Normal': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30'
      default: return 'bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
      case 'In Progress': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30'
      case 'Resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30'
      case 'Closed': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30'
      default: return 'bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Open': return <AlertCircle className="h-5 w-5 text-blue-600" />
      case 'In Progress': return <Clock className="h-5 w-5 text-purple-600" />
      case 'Resolved': return <Check className="h-5 w-5 text-green-600" />
      case 'Closed': return <X className="h-5 w-5 text-gray-600" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Support & Help</h1>
          <p className="text-muted-foreground mt-1">Track your support tickets and get help</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          New Ticket
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-3xl font-black">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-muted-foreground">Open</p>
          </div>
          <p className="text-3xl font-black text-blue-600">{stats.open}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-purple-600" />
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <p className="text-3xl font-black text-purple-600">{stats.inProgress}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Check className="h-4 w-4 text-green-600" />
            <p className="text-sm text-muted-foreground">Resolved</p>
          </div>
          <p className="text-3xl font-black text-green-600">{stats.resolved}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <X className="h-4 w-4 text-gray-600" />
            <p className="text-sm text-muted-foreground">Closed</p>
          </div>
          <p className="text-3xl font-black text-gray-600">{stats.closed}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-card border rounded-lg p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ticket ID or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm font-bold bg-background"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm font-bold bg-background"
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => {
                setSelectedTicket(ticket)
                setShowDetailModal(true)
              }}
              className="bg-card border rounded-lg p-4 hover:shadow-lg cursor-pointer transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-lg text-blue-600">{ticket.id}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="font-bold text-lg mb-1">{ticket.subject}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Category: {ticket.category}</span>
                    <span>Created: {ticket.created}</span>
                    <span>{ticket.messages.length} messages</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="font-bold">{ticket.updated}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card border rounded-lg p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No tickets found for this filter</p>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create Support Ticket</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-2 block">Subject</label>
                <input
                  type="text"
                  value={createForm.subject}
                  onChange={(e) => setCreateForm({...createForm, subject: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Category</label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm({...createForm, category: e.target.value as any})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Booking">Booking Issue</option>
                  <option value="Billing">Billing Issue</option>
                  <option value="Technical">Technical Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Priority</label>
                <select
                  value={createForm.priority}
                  onChange={(e) => setCreateForm({...createForm, priority: e.target.value as any})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  className="w-full p-2 border rounded-lg h-32"
                  placeholder="Detailed description of your issue..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {showDetailModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold">{selectedTicket.id}</h3>
                <p className="text-muted-foreground">{selectedTicket.subject}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Ticket Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Status</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedTicket.status)}`}>
                  {getStatusIcon(selectedTicket.status)}
                  {selectedTicket.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Priority</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedTicket.priority)}`}>
                  <Zap className="h-3 w-3" />
                  {selectedTicket.priority}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Created</p>
                <p className="font-bold text-sm">{selectedTicket.created}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Category</p>
                <p className="font-bold text-sm">{selectedTicket.category}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {selectedTicket.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${msg.author === 'You' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 ml-4' : 'bg-muted mr-4'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-sm">{msg.author}</p>
                    <p className="text-xs text-muted-foreground">{msg.time}</p>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* New Message */}
            {selectedTicket.status !== 'Closed' && (
              <div className="mb-4">
                <label className="text-sm font-bold mb-2 block">Reply</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-bold"
              >
                Close
              </button>
              {selectedTicket.status === 'Closed' && (
                <button
                  onClick={() => handleReopenTicket(selectedTicket.id)}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-bold"
                >
                  Reopen
                </button>
              )}
              {selectedTicket.status !== 'Closed' && (
                <button
                  onClick={() => handleCloseTicket(selectedTicket.id)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-bold"
                >
                  Close Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
