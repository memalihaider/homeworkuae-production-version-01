'use client'

import { useState, useCallback } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Wrench,
  Truck,
  Package,
  AlertTriangle,
  CheckSquare,
  X,
  Save,
  Plus,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Equipment {
  id: string
  name: string
  type: string
  status: 'available' | 'in_use' | 'maintenance' | 'damaged'
  location: string
  lastMaintenance: string
  nextMaintenance: string
  assigned: boolean
  assignedTo?: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  notes?: string
}

interface InventoryItem {
  id: string
  name: string
  category: string
  required: number
  available: number
  unit: string
  status: 'sufficient' | 'low' | 'critical'
}

export default function EquipmentReadiness() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  // Mock job data
  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    location: 'Downtown, Dubai',
    scheduledDate: '2025-01-20',
    requiredEquipment: ['Floor Scrubber', 'Vacuum Cleaner', 'Cleaning Chemicals', 'Safety Gear']
  }

  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Industrial Floor Scrubber',
      type: 'Cleaning Equipment',
      status: 'available',
      location: 'Warehouse A',
      lastMaintenance: '2025-01-15',
      nextMaintenance: '2025-02-15',
      assigned: true,
      assignedTo: 'Job #1',
      condition: 'excellent'
    },
    {
      id: '2',
      name: 'Commercial Vacuum Cleaner',
      type: 'Cleaning Equipment',
      status: 'available',
      location: 'Warehouse A',
      lastMaintenance: '2025-01-10',
      nextMaintenance: '2025-02-10',
      assigned: true,
      assignedTo: 'Job #1',
      condition: 'good'
    },
    {
      id: '3',
      name: 'Safety Harness Set',
      type: 'Safety Equipment',
      status: 'available',
      location: 'Safety Storage',
      lastMaintenance: '2025-01-01',
      nextMaintenance: '2025-07-01',
      assigned: true,
      assignedTo: 'Job #1',
      condition: 'excellent'
    },
    {
      id: '4',
      name: 'Chemical Sprayer',
      type: 'Cleaning Equipment',
      status: 'maintenance',
      location: 'Maintenance Bay',
      lastMaintenance: '2025-01-18',
      nextMaintenance: '2025-01-25',
      assigned: false,
      condition: 'fair',
      notes: 'Under repair - pump malfunction'
    },
    {
      id: '5',
      name: 'Step Ladder',
      type: 'Access Equipment',
      status: 'in_use',
      location: 'Job Site B',
      lastMaintenance: '2025-01-05',
      nextMaintenance: '2025-04-05',
      assigned: false,
      condition: 'good'
    }
  ])

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Floor Cleaning Solution',
      category: 'Chemicals',
      required: 20,
      available: 15,
      unit: 'Liters',
      status: 'sufficient'
    },
    {
      id: '2',
      name: 'Glass Cleaner',
      category: 'Chemicals',
      required: 10,
      available: 25,
      unit: 'Liters',
      status: 'sufficient'
    },
    {
      id: '3',
      name: 'Microfiber Cloths',
      category: 'Supplies',
      required: 50,
      available: 8,
      unit: 'Pieces',
      status: 'critical'
    },
    {
      id: '4',
      name: 'Safety Gloves',
      category: 'PPE',
      required: 12,
      available: 6,
      unit: 'Pairs',
      status: 'low'
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['all', ...Array.from(new Set(equipment.map(item => item.type)))]

  const filteredEquipment = equipment.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_use':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-orange-600" />
      case 'damaged':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'in_use':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'maintenance':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'damaged':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-700'
      case 'good':
        return 'bg-blue-100 text-blue-700'
      case 'fair':
        return 'bg-yellow-100 text-yellow-700'
      case 'poor':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'sufficient':
        return 'bg-green-100 text-green-700'
      case 'low':
        return 'bg-yellow-100 text-yellow-700'
      case 'critical':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const assignedEquipment = equipment.filter(e => e.assigned).length
  const availableEquipment = equipment.filter(e => e.status === 'available').length
  const totalEquipment = equipment.length

  const criticalInventory = inventory.filter(i => i.status === 'critical').length
  const lowInventory = inventory.filter(i => i.status === 'low').length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/jobs/${jobId}`}
            className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Equipment Readiness</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{assignedEquipment}/{totalEquipment} Assigned</div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(assignedEquipment / totalEquipment) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
            criticalInventory > 0 ? 'bg-red-100 text-red-700' :
            lowInventory > 0 ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {criticalInventory > 0 ? `${criticalInventory} Critical` :
             lowInventory > 0 ? `${lowInventory} Low Stock` :
             'Stock OK'}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-gray-600">Available</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{availableEquipment}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-gray-600">In Use</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{equipment.filter(e => e.status === 'in_use').length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-bold text-gray-600">Maintenance</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{equipment.filter(e => e.status === 'maintenance').length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-gray-600">Assigned</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{assignedEquipment}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Equipment List */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Equipment Status</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Types' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredEquipment.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(item.status)}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getConditionColor(item.condition)}`}>
                          {item.condition}
                        </span>
                        {item.assigned && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            Assigned
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.type} • {item.location} • Next maintenance: {item.nextMaintenance}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                    <button className="px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all text-sm">
                      {item.assigned ? 'Unassign' : 'Assign'}
                    </button>
                  </div>
                </div>

                {item.notes && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-600">{item.notes}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Inventory Status</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {inventory.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                    <div className="text-xs text-gray-600">{item.category}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getInventoryStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {item.available} / {item.required} {item.unit}
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.status === 'critical' ? 'bg-red-600' :
                        item.status === 'low' ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${Math.min((item.available / item.required) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {item.available < item.required && (
                  <div className="mt-2 text-xs text-red-600 font-bold">
                    Short by {item.required - item.available} {item.unit}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              <Plus className="w-4 h-4" />
              Request Supplies
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}