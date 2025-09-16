import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Stepper from '@/components/common/Stepper'
import FileUploader from '@/components/common/FileUploader'
import { MapPin, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

const LandRegistration = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    surveyNumber: '',
    address: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    area: '',
    documents: []
  })

  const steps = [
    {
      id: 1,
      title: 'Basic Info',
      description: 'Survey number & address'
    },
    {
      id: 2,
      title: 'Location',
      description: 'Map coordinates'
    },
    {
      id: 3,
      title: 'Documents',
      description: 'Upload ownership docs'
    },
    {
      id: 4,
      title: 'Review',
      description: 'Confirm & submit'
    }
  ]

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFilesChange = (files) => {
    setFormData({
      ...formData,
      documents: files
    })
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Mock submission
    console.log('Land registration submitted:', formData)
    onComplete?.()
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get current location. Please enter coordinates manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="surveyNumber">Survey Number *</Label>
                <Input
                  id="surveyNumber"
                  name="surveyNumber"
                  placeholder="e.g., 123/4A"
                  value={formData.surveyNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Land Area (acres) *</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 2.5"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Property Address *</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="village">Village/City *</Label>
                <Input
                  id="village"
                  name="village"
                  placeholder="Village name"
                  value={formData.village}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  name="district"
                  placeholder="District name"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="State name"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">PIN Code *</Label>
              <Input
                id="pincode"
                name="pincode"
                placeholder="6-digit PIN code"
                value={formData.pincode}
                onChange={handleInputChange}
                maxLength={6}
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mark Your Land Location</h3>
              <p className="text-gray-600 mb-6">
                Use GPS to get current location or enter coordinates manually
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <Button onClick={getCurrentLocation} className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Use Current Location
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  placeholder="e.g., 28.6139"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  placeholder="e.g., 77.2090"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Mock Map Display */}
            <Card className="bg-gray-100">
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map will be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Integration with Google Maps or similar mapping service
                </p>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Upload Ownership Documents</h3>
              <p className="text-gray-600">
                Please upload clear copies of your land ownership documents
              </p>
            </div>

            <FileUploader
              onFilesChange={handleFilesChange}
              acceptedTypes="image/*,.pdf,.doc,.docx"
              maxFiles={5}
              maxSize={10 * 1024 * 1024} // 10MB
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Required Documents:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Land ownership certificate/title deed</li>
                <li>• Survey settlement record</li>
                <li>• Revenue records (Khata/Pahani)</li>
                <li>• Identity proof of landowner</li>
                <li>• Any other relevant documents</li>
              </ul>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Review Your Information</h3>
              <p className="text-gray-600">
                Please review all details before submitting for verification
              </p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Survey Number:</strong> {formData.surveyNumber}</div>
                    <div><strong>Area:</strong> {formData.area} acres</div>
                    <div className="col-span-2"><strong>Address:</strong> {formData.address}</div>
                    <div><strong>Village:</strong> {formData.village}</div>
                    <div><strong>District:</strong> {formData.district}</div>
                    <div><strong>State:</strong> {formData.state}</div>
                    <div><strong>PIN Code:</strong> {formData.pincode}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location Coordinates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Latitude:</strong> {formData.latitude}</div>
                    <div><strong>Longitude:</strong> {formData.longitude}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {formData.documents.length} document(s) uploaded
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> After submission, your land registration will be reviewed by our verification team. 
                You will receive updates via SMS and email. The verification process typically takes 2-3 business days.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.surveyNumber && formData.address && formData.village && 
               formData.district && formData.state && formData.pincode && formData.area
      case 2:
        return formData.latitude && formData.longitude
      case 3:
        return formData.documents.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Land Registration</h1>
          <p className="text-gray-600">Register your farmland for integration and verification</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
            <CardDescription>{steps[currentStep - 1]?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit for Verification
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LandRegistration
