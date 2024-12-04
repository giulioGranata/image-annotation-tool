import { Button } from "@/components/ui/button";
import React, { ChangeEvent } from "react";
import { Input } from "./ui/input";

interface ImageUploadProps {
  onImageUpload: (image: HTMLImageElement) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          onImageUpload(img);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-full justify-center items-center p-4">
      <label htmlFor="image-upload" className="cursor-pointer">
        <Button
          variant="outline"
          className="mr-2"
          onClick={() => inputRef.current?.click()}
        >
          Carica un'immagine
        </Button>
        <Input
          ref={inputRef}
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ImageUpload;
