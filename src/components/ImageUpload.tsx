import { useAnnotations } from "@/contexts/AnnotationContext";
import { FileUpload } from "./ui/file-upload";

export function ImageUpload() {
  const { setImage } = useAnnotations();

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          setImage(img);
        };
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full  mx-auto border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}

export default ImageUpload;
