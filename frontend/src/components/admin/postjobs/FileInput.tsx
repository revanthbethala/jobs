import React, { useEffect, useRef, useState } from "react";
import { Control, useController } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface FileInputProps {
  label: string;
  error?: string;
  name: string;
  control: Control;
  accept?: string;
  className?: string;
  required?: boolean;
  previewUrl?: string | null | undefined; // from backend
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  error,
  name,
  control,
  accept = "image/*",
  className,
  required = false,
  previewUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { field } = useController({ name, control });

  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [showPreviewUrl, setShowPreviewUrl] = useState(!!previewUrl);
  const [removedPreviewOnce, setRemovedPreviewOnce] = useState(false);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size <= 150 * 1024) {
        const newUrl = URL.createObjectURL(file);
        setObjectUrl(newUrl);
        setShowPreviewUrl(false);
        setRemovedPreviewOnce(true);
        field.onChange(file);
      } else {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 150KB.",
          variant: "destructive",
        });
        fileInputRef.current!.value = "";
      }
    }
  };

  const handleRemoveFile = () => {
    fileInputRef.current!.value = "";
    field.onChange(null);

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }

    // If we previously removed previewUrl, don't show it again
    if (previewUrl && !removedPreviewOnce) {
      setShowPreviewUrl(true);
    } else {
      setShowPreviewUrl(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size <= 150 * 1024) {
        const newUrl = URL.createObjectURL(file);
        setObjectUrl(newUrl);
        setShowPreviewUrl(false);
        setRemovedPreviewOnce(true);
        field.onChange(file);
      } else {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 150KB.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const currentPreview = (() => {
    if (field.value instanceof File && objectUrl) return objectUrl;
    if (showPreviewUrl && previewUrl) return previewUrl;
    return null;
  })();

  return (
    <div className={cn("space-y-2 animate-fade-in-up", className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      {previewUrl ? (
        <div className="relative w-32 h-32 rounded overflow-hidden border group">
          <img
            src={currentPreview}
            alt="Preview"
            className="w-full h-full object-cover rounded"
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80 transition"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "w-full p-6 rounded-lg border-2 border-dashed border-input bg-background",
            "hover:border-primary transition-colors duration-200 cursor-pointer",
            "flex flex-col items-center justify-center text-center",
            error && "border-destructive"
          )}
        >
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-foreground">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 150KB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-destructive animate-slide-in-right">
          {error}
        </p>
      )}
    </div>
  );
};
