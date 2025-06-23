import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, Plus } from "lucide-react"
import { useImageUpload } from "@/hooks/useImageUpload"
import toast from "react-hot-toast"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images = [],
  onImagesChange,
  maxImages = 8
}) => {
  const [newImageUrl, setNewImageUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadImage, uploadMultipleImages, uploading } = useImageUpload()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      if (files.length === 1) {
        const url = await uploadImage(files[0])
        if (url) {
          const updatedImages = [...images, url]
          if (updatedImages.length <= maxImages) {
            onImagesChange(updatedImages)
            toast.success('Image uploaded successfully')
          } else {
            toast.error(`Maximum ${maxImages} images allowed`)
          }
        }
      } else {
        const remainingSlots = maxImages - images.length
        if (files.length > remainingSlots) {
          toast.error(`Can only upload ${remainingSlots} more images`)
          return
        }

        const urls = await uploadMultipleImages(files)
        if (urls.length > 0) {
          onImagesChange([...images, ...urls])
          toast.success(`${urls.length} images uploaded successfully`)
        }
      }
    } catch (error) {
      toast.error('Failed to upload images')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addImageUrl = () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter a valid image URL')
      return
    }

    try {
      new URL(newImageUrl)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    if (images.includes(newImageUrl.trim())) {
      toast.error('This image URL is already added')
      return
    }

    onImagesChange([...images, newImageUrl.trim()])
    setNewImageUrl("")
    toast.success('Image URL added successfully')
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    onImagesChange(updatedImages)
  }

  return (
    <div className="space-y-4">
      {/* File Upload Section */}
      <div className="space-y-2">
        <Label>Upload Images</Label>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            variant="outline"
            className="flex-1 border border-dashed rounded-lg py-4 sm:py-8 md:py-10"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Choose Files'}
          </Button>
          <div className="text-sm text-gray-500 flex items-center">
            {images.length}/{maxImages}
          </div>
        </div>
      </div>

      {/* URL Input Section */}
      <div className="space-y-2">
        <Label>Or Add Image URL</Label>
        <div className="flex gap-2">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
            disabled={images.length >= maxImages}
          />
          <Button
            type="button"
            onClick={addImageUrl}
            disabled={images.length >= maxImages}
            className="bg-[#FE7743] hover:bg-[#e56a3a] rounded-lg h-auto text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Images Preview */}
      {images.length > 0 && (
        <div className="space-y-2">
          <Label>Images ({images.length})</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={imageUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-image.jpg'
                    }}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-sm text-gray-500">
        <p>• Upload images directly or add image URLs</p>
        <p>• Maximum {maxImages} images allowed</p>
        <p>• File size limit: 5MB per image</p>
        <p>• Supported formats: JPG, PNG, GIF, WebP</p>
      </div>
    </div>
  )
}