import { useState, useRef, useCallback } from "react";
import { Upload, X, GripVertical, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  className?: string;
  max?: number;
}

const MultiImageUpload = ({ value = [], onChange, className, max = 8 }: MultiImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList) => {
    const remaining = max - value.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const promises = toProcess
      .filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024)
      .map((file) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => e.target?.result ? resolve(e.target.result as string) : reject();
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }));
    Promise.all(promises).then((results) => {
      if (results.length > 0) onChange([...value, ...results]);
    });
  }, [value, onChange, max]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (dragIdx !== null) return; // reorder drag
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles, dragIdx]);

  const removeImage = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const addUrl = () => {
    if (urlInput.trim() && value.length < max) {
      onChange([...value, urlInput.trim()]);
      setUrlInput("");
    }
  };

  // Reorder via drag
  const handleReorderDragStart = (idx: number) => setDragIdx(idx);
  const handleReorderDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleReorderDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    const newArr = [...value];
    const [moved] = newArr.splice(dragIdx, 1);
    newArr.splice(idx, 0, moved);
    onChange(newArr);
    setDragIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div className={className}>
      {/* Thumbnails grid with reorder */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {value.map((img, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleReorderDragStart(idx)}
              onDragOver={(e) => handleReorderDragOver(e, idx)}
              onDrop={() => handleReorderDrop(idx)}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              className={`relative group rounded-lg border-2 overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
                dragOverIdx === idx ? "border-primary scale-105" : idx === 0 ? "border-primary" : "border-border"
              }`}
            >
              <img src={img} alt={`Image ${idx + 1}`} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <GripVertical className="h-4 w-4 text-white" />
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {value.length < max && (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
            />
            <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Drag & drop images or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">{value.length}/{max} images • PNG, JPG up to 5MB</p>
          </div>

          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Or paste image URL..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
              className="text-sm"
            />
            <Button type="button" size="sm" variant="outline" onClick={addUrl} disabled={!urlInput.trim()}>
              <ImageIcon className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiImageUpload;
