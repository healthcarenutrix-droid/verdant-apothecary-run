import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

const ImageUpload = ({ value, onChange, className }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value && value.startsWith("http") ? "url" : "upload");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) onChange(e.target.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragActive(false), []);

  return (
    <div className={className}>
      <div className="flex gap-2 mb-2">
        <Button type="button" size="sm" variant={mode === "upload" ? "default" : "outline"} onClick={() => setMode("upload")} className="text-xs">
          <Upload className="h-3 w-3 mr-1" /> Upload
        </Button>
        <Button type="button" size="sm" variant={mode === "url" ? "default" : "outline"} onClick={() => setMode("url")} className="text-xs">
          <ImageIcon className="h-3 w-3 mr-1" /> URL
        </Button>
      </div>

      {mode === "upload" ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
          {value ? (
            <div className="relative inline-block">
              <img src={value} alt="Preview" className="w-24 h-24 object-cover rounded-lg mx-auto" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop an image or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={value?.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <div className="relative inline-block">
              <img src={value} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
