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
  previewUrl?: string;
  accept?: string;
  className?: string;
  required?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  error,
  name,
  previewUrl,
  control,
  accept = "image/*",
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { field } = useController({
    name,
    control,
    defaultValue: null,
  });

  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const handleFileChange = (file: File) => {
    if (file.size <= 150 * 1024) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      field.onChange(file);
    } else {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 150KB.",
        variant: "destructive",
      });
      fileInputRef.current!.value = "";
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) handleFileChange(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveFile = () => {
    fileInputRef.current!.value = "";
    field.onChange(null);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
  };

  return (
    <div className={cn("space-y-2 animate-fade-in-up")}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      <div
        className={cn(
          "grid gap-10",
          previewUrl
            ? "grid-cols-2 justify-between items-center"
            : "grid-cols-1"
        )}
      >
        <div>
          {objectUrl ? (
            <div className="relative w-32 h-32 rounded overflow-hidden border group">
              <img
                src={objectUrl}
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
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 150KB
              </p>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="flex flex-col gap-2">
            <span className="font-medium">Uploaded Logo</span>
            <div className="w-28 h-28 rounded overflow-hidden border">
              <img
                src={previewUrl}
                alt="Existing Preview"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
        )}
      </div>

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
