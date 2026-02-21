'use client'

import { useState, useCallback } from 'react'
import { Plus, Trash2, Upload, Camera, Video, Ruler, MapPin, Phone, Mail, FileText } from 'lucide-react'

export default function SurveyForm() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    location: '',
    serviceType: '',
    notes: ''
  })

  const [measurements, setMeasurements] = useState<any[]>([])
  const [media, setMedia] = useState({ photos: [] as any[], videos: [] as any[] })
  const [showMeasurementModal, setShowMeasurementModal] = useState(false)
  const [measurementData, setMeasurementData] = useState({
    areaName: '',
    length: '',
    width: '',
    type: 'Room'
  })

  const calculateArea = useCallback((length: any, width: any) => {
    return (parseFloat(length) * parseFloat(width)).toFixed(2)
  }, [])

  const handleAddMeasurement = useCallback(() => {
    if (!measurementData.areaName || !measurementData.length || !measurementData.width) {
      alert('Please fill all measurement fields')
      return
    }

    const area = calculateArea(measurementData.length, measurementData.width)
    const newMeasurement = {
      id: Date.now(),
      ...measurementData,
      area: parseFloat(area),
      addedDate: new Date().toISOString().split('T')[0]
    }

    setMeasurements([...measurements, newMeasurement])
    setMeasurementData({ areaName: '', length: '', width: '', type: 'Room' })
    setShowMeasurementModal(false)
    alert('Measurement added successfully')
  }, [measurementData, calculateArea, measurements])

  const handleDeleteMeasurement = useCallback((id: any) => {
    if (confirm('Delete this measurement?')) {
      setMeasurements(measurements.filter(m => m.id !== id))
    }
  }, [measurements])

  const handleAddMedia = useCallback((type: any) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = type === 'photo' ? 'image/*' : 'video/*'
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const mediaItem = {
          id: Date.now(),
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          type: type,
          uploadedDate: new Date().toISOString().split('T')[0]
        }

        if (type === 'photo') {
          setMedia({ ...media, photos: [...media.photos, mediaItem] })
        } else {
          setMedia({ ...media, videos: [...media.videos, mediaItem] })
        }
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`)
      }
    }
    fileInput.click()
  }, [media])

  const handleDeleteMedia = useCallback((id: any, type: any) => {
    if (type === 'photo') {
      setMedia({ ...media, photos: media.photos.filter(p => p.id !== id) })
    } else {
      setMedia({ ...media, videos: media.videos.filter(v => v.id !== id) })
    }
  }, [media])

  const totalArea = measurements.reduce((sum, m) => sum + m.area, 0)

  const handleSubmitSurvey = useCallback(() => {
    if (!formData.clientName || !formData.location || !formData.serviceType) {
      alert('Please fill client, location, and service type')
      return
    }

    if (measurements.length === 0) {
      alert('Please add at least one measurement')
      return
    }

    const surveyData = {
      ...formData,
      measurements,
      media,
      totalArea,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted'
    }

    console.log('Survey submitted:', surveyData)
    alert('Survey submitted successfully!')
    // Reset form
    setFormData({ clientName: '', clientPhone: '', clientEmail: '', location: '', serviceType: '', notes: '' })
    setMeasurements([])
    setMedia({ photos: [], videos: [] })
  }, [formData, measurements, media, totalArea])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Survey Form</h1>
        <p className="text-muted-foreground">Mobile-friendly survey with measurements and media uploads</p>
      </div>

      {/* Client Information */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold">Client Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Client Name *
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mt-1"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone
            </label>
            <input
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              className="w-full px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mt-1"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mt-1"
              placeholder="Email address"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mt-1"
              placeholder="Survey location"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Service Type *</label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mt-1"
            >
              <option value="">Select service</option>
              <option>Deep Cleaning</option>
              <option>Regular Cleaning</option>
              <option>Medical Facility Sanitization</option>
              <option>Office Cleaning</option>
              <option>Carpet Cleaning</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mt-1 h-24"
              placeholder="Add any additional notes..."
            ></textarea>
          </div>
        </div>
      </div>

      {/* Area Measurements */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Ruler className="h-5 w-5 text-pink-600" />
              Area Measurements
            </h2>
            <p className="text-sm text-muted-foreground">Total Area: <span className="font-bold text-pink-600">{totalArea.toFixed(2)} sqm</span></p>
          </div>
          <button
            onClick={() => setShowMeasurementModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Measurement
          </button>
        </div>

        {measurements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {measurements.map((m) => (
              <div key={m.id} className="bg-muted/50 border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold">{m.areaName}</p>
                    <p className="text-xs text-muted-foreground">{m.type}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMeasurement(m.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Length: {m.length} m × Width: {m.width} m</p>
                  <p className="font-bold text-pink-600">Area: {m.area.toFixed(2)} sqm</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Ruler className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No measurements added yet</p>
          </div>
        )}
      </div>

      {/* Media Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Photos */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Photos ({media.photos.length})
            </h2>
            <button
              onClick={() => handleAddMedia('photo')}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload
            </button>
          </div>

          {media.photos.length > 0 ? (
            <div className="space-y-2">
              {media.photos.map((photo) => (
                <div key={photo.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium truncate">{photo.name}</p>
                    <p className="text-xs text-muted-foreground">{photo.size} MB</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMedia(photo.id, 'photo')}
                    className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No photos uploaded</p>
            </div>
          )}
        </div>

        {/* Videos */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-600" />
              Videos ({media.videos.length})
            </h2>
            <button
              onClick={() => handleAddMedia('video')}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload
            </button>
          </div>

          {media.videos.length > 0 ? (
            <div className="space-y-2">
              {media.videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium truncate">{video.name}</p>
                    <p className="text-xs text-muted-foreground">{video.size} MB</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMedia(video.id, 'video')}
                    className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No videos uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-3 border rounded-lg font-bold hover:bg-muted transition-colors">
          Save as Draft
        </button>
        <button
          onClick={handleSubmitSurvey}
          className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors"
        >
          Submit Survey
        </button>
      </div>

      {/* Measurement Modal */}
      {showMeasurementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Add Measurement</h2>
              <button
                onClick={() => setShowMeasurementModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Area Name</label>
                <input
                  type="text"
                  value={measurementData.areaName}
                  onChange={(e) => setMeasurementData({ ...measurementData, areaName: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mt-1"
                  placeholder="e.g., Main Hall"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  value={measurementData.type}
                  onChange={(e) => setMeasurementData({ ...measurementData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mt-1"
                >
                  <option>Room</option>
                  <option>Floor</option>
                  <option>Corridor</option>
                  <option>Facility</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Length (m)</label>
                  <input
                    type="number"
                    value={measurementData.length}
                    onChange={(e) => setMeasurementData({ ...measurementData, length: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mt-1"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Width (m)</label>
                  <input
                    type="number"
                    value={measurementData.width}
                    onChange={(e) => setMeasurementData({ ...measurementData, width: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mt-1"
                    placeholder="0"
                  />
                </div>
              </div>

              {measurementData.length && measurementData.width && (
                <div className="bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/30 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Calculated Area:</p>
                  <p className="text-lg font-bold text-pink-600">
                    {calculateArea(measurementData.length, measurementData.width)} sqm
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowMeasurementModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMeasurement}
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
