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

interface ImageUploaderProps {
  onImageUploaded: (imageData: { id: string; url: string; caption: string }) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create a local URL for the file
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
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
      // In a real app, you would upload the image to a server here
      // and get back a permanent URL
      
      // For our demo, we'll just use the local object URL
      const imageData = {
        id: Date.now().toString(),
        url: uploadedImage,
        caption: caption
      };
      
      onImageUploaded(imageData);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been added to the book"
      });
      
      // Reset the form
      setUploadedImage(null);
      setCaption('');
    }
  };

  const clearImage = () => {
    if (uploadedImage) {
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
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={!uploadedImage}
            className="flex items-center gap-2"
          >
            <Check size={16} /> Save to Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploader;