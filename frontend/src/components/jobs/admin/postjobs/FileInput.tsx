import React, { useRef } from "react";
import { Control, useController } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Upload, X, Image } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
interface FileInputProps {
  label: string;
  error?: string;
  name: string;
  control: Control<any>;
  accept?: string;
  className?: string;
  required?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  error,
  name,
  control,
  accept = "image/*",
  className,
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { field } = useController({ name, control });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size <= 3 * 1024 * 1024) {
        field.onChange(file);
      } else {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 3MB.",
          variant: "destructive",
        });
        fileInputRef.current!.value = "";
      }
    }
  };

  const handleRemoveFile = () => {
    field.onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size <= 3 * 1024 * 1024) {
        field.onChange(file);
      } else {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 3MB.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={cn("space-y-2 animate-fade-in-up", className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

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
        {field.value ? (
          <div className="relative">
            <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
              <Image className="w-6 h-6 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {field.value.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(field.value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 10MB
            </p>
          </>
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
