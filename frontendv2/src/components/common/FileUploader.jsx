import React, { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, X, File, Image, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const FileUploader = ({ 
  onFilesChange, 
  acceptedTypes = "image/*,.pdf,.doc,.docx", 
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  className 
}) => {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = useCallback((newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
        return false
      }
      return true
    }).slice(0, maxFiles - files.length)

    const updatedFiles = [...files, ...validFiles]
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }, [files, maxFiles, maxSize, onFilesChange])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleChange = useCallback((e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />
    }
    return <File className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragActive && "border-green-500 bg-green-50",
          !dragActive && "border-gray-300 hover:border-green-400"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <input
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleChange}
            className="hidden"
            id="file-upload"
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Supports images, PDF, DOC files up to {maxSize / 1024 / 1024}MB
            </p>
            <p className="text-xs text-gray-400">
              Maximum {maxFiles} files allowed
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => document.getElementById('file-upload').click()}
          >
            Choose Files
          </Button>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader
