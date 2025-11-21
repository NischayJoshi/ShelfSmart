import { useState } from 'react'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

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

    setAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🛒 ShelfSmart
          </h1>
          <p className="text-gray-600">
            Retail shelf monitoring using CLIP for detection and Graph logic for misplacements
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {/* Upload Section */}
            <div className="mb-6">
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

            {/* Preview Section */}
            {previewUrl && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Image Preview</h2>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto max-h-96 mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Analyze Button */}
            {selectedFile && !results && (
              <div className="flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors ${
                    analyzing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Shelf'}
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

          {/* Results Section */}
          {results && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Detected Products
                  </h3>
                  <p className="text-3xl font-bold text-indigo-600">
                    {results.summary.total_products}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Misplacements Found
                  </h3>
                  <p className="text-3xl font-bold text-red-600">
                    {results.summary.total_misplacements}
                  </p>
                </div>
              </div>

              {/* Detected Products */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Detected Products
                </h2>
                <div className="space-y-3">
                  {results.detected_products.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          Confidence: {(product.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Location: ({product.location.x}, {product.location.y})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Misplacements */}
              {results.misplacements.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Misplacements Detected
                  </h2>
                  <div className="space-y-3">
                    {results.misplacements.map((misplacement, index) => (
                      <div
                        key={index}
                        className="p-4 bg-red-50 rounded-lg border border-red-200"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-800">
                              {misplacement.product_name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {misplacement.issue}
                            </p>
                            <p className="text-sm text-gray-600">
                              Expected: {misplacement.expected}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              misplacement.severity === 'high'
                                ? 'bg-red-200 text-red-800'
                                : misplacement.severity === 'medium'
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-blue-200 text-blue-800'
                            }`}
                          >
                            {misplacement.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
