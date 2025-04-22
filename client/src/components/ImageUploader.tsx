import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Upload, X, Image, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Define interface for the polaroid image data
interface PolaroidImage {
  id: number;
  url: string;
  caption: string | null;
  rotation: number;
  createdAt: string;
}

interface ImageUploaderProps {
  onImageUploaded: (imageData: PolaroidImage) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [rotation] = useState(Math.floor(Math.random() * 10) - 5); // Random rotation between -5 and 5 degrees
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation for creating a new polaroid image
  const createPolaroidMutation = useMutation({
    mutationFn: async (imageData: { url: string; caption: string; rotation: number }) => {
      const response = await fetch('/api/polaroids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/polaroids'] });
      onImageUploaded(data);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been added to the book"
      });
      
      // Reset the form
      setUploadedImage(null);
      setCaption('');
      setUploading(false);
    },
    onError: (error) => {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "There was an error saving your image. Please try again.",
        variant: "destructive"
      });
      setUploading(false);
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create a local URL for the file preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      
      // In a real production app, we would upload the file to a storage service
      // like AWS S3 or similar and get back a permanent URL
      // For this demo, we'll just use base64 encoding for simplicity
      
      const reader = new FileReader();
      reader.onload = (event) => {
        // The result is a base64 encoded string representing the file
        // We'll use this as our "url" in the database for demonstration
        if (event.target && typeof event.target.result === 'string') {
          setUploadedImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleSave = () => {
    if (uploadedImage) {
      setUploading(true);
      
      // Save the image to our database
      createPolaroidMutation.mutate({
        url: uploadedImage,
        caption,
        rotation,
      });
    }
  };

  const clearImage = () => {
    if (uploadedImage && !uploadedImage.startsWith('data:')) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload size={16} /> Add Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Polaroid Photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!uploadedImage ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                  : 'border-gray-300 dark:border-gray-700'
              }`}
            >
              <input {...getInputProps()} />
              <Image className="mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDragActive 
                  ? "Drop the image here..." 
                  : "Drag & drop an image here, or click to select one"
                }
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Supports: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={uploadedImage} 
                alt="Uploaded preview" 
                className="max-h-64 mx-auto rounded-md"
              />
              <button 
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                disabled={uploading}
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input 
              id="caption" 
              value={caption} 
              onChange={(e) => setCaption(e.target.value)} 
              placeholder="Add a caption for your photo..."
              disabled={uploading}
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={uploading}>Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={!uploadedImage || uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <>Saving...</>
            ) : (
              <>
                <Check size={16} /> Save to Book
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploader;