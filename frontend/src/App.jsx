import { useState, useEffect } from 'react'

// API configuration - can be moved to environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedShelf, setSelectedShelf] = useState('')
  const [shelves, setShelves] = useState([])
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  // Fetch available shelves on component mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/shelves`)
      .then(res => res.json())
      .then(data => {
        setShelves(data.shelves || [])
        if (data.shelves && data.shelves.length > 0) {
          setSelectedShelf(data.shelves[0].id)
        }
      })
      .catch(err => console.error('Error fetching shelves:', err))
  }, [])

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResults(null)
      setError(null)
    } else {
      setError('Please select a valid image file')
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    if (!selectedShelf) {
      setError('Please select a shelf ID')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('shelf_id', selectedShelf)

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to analyze image')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the image')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResults(null)
    setError(null)
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'COMPLIANT':
        return 'bg-green-500 text-white'
      case 'MISPLACED':
        return 'bg-yellow-500 text-white'
      case 'OUT_OF_STOCK':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'COMPLIANT':
        return '✓'
      case 'MISPLACED':
        return '⚠'
      case 'OUT_OF_STOCK':
        return '✗'
      default:
        return '?'
    }
  }

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'HIGH':
        return 'bg-red-200 text-red-800'
      case 'LOW':
        return 'bg-yellow-200 text-yellow-800'
      case 'NONE':
        return 'bg-green-200 text-green-800'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🛒 ShelfSmart - CLIP Detection Dashboard
          </h1>
          <p className="text-gray-600">
            Zero-Shot product detection using CLIP + Graph-based misplacement analysis
          </p>
          <p className="text-sm text-gray-500 mt-1">
            CLIP provides fine-grained recognition without custom training
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Simulator Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📷 Shelf Simulator
            </h2>
            
            {/* Shelf Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Shelf ID
              </label>
              <select
                value={selectedShelf}
                onChange={(e) => setSelectedShelf(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {shelves.map((shelf) => (
                  <option key={shelf.id} value={shelf.id}>
                    {shelf.id} - Expected: {shelf.expected_product.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {selectedShelf && shelves.find(s => s.id === selectedShelf) && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-800">
                    <strong>Expected:</strong> {shelves.find(s => s.id === selectedShelf).expected_product.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-blue-800">
                    <strong>Neighbors:</strong> {shelves.find(s => s.id === selectedShelf).neighbors.join(', ').replace(/_/g, ' ')}
                  </p>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Shelf Image
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {selectedFile && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Analyze Button */}
            {selectedFile && !results && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors ${
                    analyzing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {analyzing ? 'Analyzing with CLIP...' : 'Analyze Shelf'}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Results Panel */}
          {results && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📊 Analysis Results
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Image and Status */}
                <div>
                  {/* Uploaded Image */}
                  {previewUrl && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Analyzed Image</h3>
                      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Analyzed"
                          className="max-w-full h-auto"
                        />
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getStatusBadge(results.status)}`}>
                      <span className="mr-2 text-2xl">{getStatusIcon(results.status)}</span>
                      {results.status}
                    </div>
                  </div>

                  {/* Issue Description */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{results.issue_description}</p>
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-4">
                  {/* Confidence Score */}
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Confidence Score</h3>
                    <p className="text-3xl font-bold text-indigo-600">{results.confidence}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{width: `${results.confidence}%`}}
                      ></div>
                    </div>
                  </div>

                  {/* Expected vs Detected */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Product Detection</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Expected:</span>
                        <span className="text-sm font-semibold text-gray-800">{results.expected_product_display}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Detected:</span>
                        <span className="text-sm font-semibold text-gray-800">{results.detected_item_display}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Shelf ID:</span>
                        <span className="text-sm font-semibold text-gray-800">{results.shelf_id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Graph Severity */}
                  {results.severity !== 'NONE' && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Graph Severity</h3>
                      <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getSeverityBadge(results.severity)}`}>
                        {results.severity}
                      </span>
                      <p className="text-xs text-gray-600 mt-2">
                        {results.severity === 'LOW' ? 'Item is a neighbor - likely customer moved it slightly' : 
                         results.severity === 'HIGH' ? 'Complete anomaly - item not related to this shelf' : ''}
                      </p>
                    </div>
                  )}

                  {/* CLIP Analysis Details */}
                  {results.clip_analysis && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">CLIP Analysis Details</h3>
                      <div className="space-y-1">
                        {results.clip_analysis.all_prompts.map((prompt, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-gray-600 truncate mr-2">{prompt}</span>
                            <span className="font-semibold text-purple-700">
                              {results.clip_analysis.all_probabilities[idx]}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
