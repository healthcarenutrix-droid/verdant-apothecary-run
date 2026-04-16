import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AdminBlogPost } from "@/data/dashboard-data";
import {
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link as LinkIcon, Minus,
  Upload, X, Image as ImageIcon
} from "lucide-react";

interface BlogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: AdminBlogPost | null;
  onSave: (post: AdminBlogPost) => void;
}

const CATEGORIES = ["Wellness", "Herbs", "Remedies", "Nutrition", "Guides", "Beauty", "Spices"];

const ToolbarBtn = ({ icon: Icon, label, onClick, active }: { icon: any; label: string; onClick: () => void; active?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`p-1.5 rounded hover:bg-accent transition-colors ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const BlogFormDialog = ({ open, onOpenChange, post, onSave }: BlogFormDialogProps) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Wellness");
  const [author, setAuthor] = useState("MSUR Herbs");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [readTime, setReadTime] = useState("5 Min Read");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const inlineImageRef = useRef<HTMLInputElement>(null);
  const [showInlineImageDialog, setShowInlineImageDialog] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState("");
  const [inlineImageMode, setInlineImageMode] = useState<"upload" | "url">("upload");

  useEffect(() => {
    if (post) {
      setTitle(post.title); setSlug(post.slug); setCategory(post.category);
      setAuthor(post.author); setExcerpt(post.excerpt); setContent(post.content);
      setImage(post.image); setReadTime(post.readTime); setFeatured(post.featured || false);
      setStatus(post.status); setImageMode(post.image?.startsWith("http") ? "url" : "upload");
    } else {
      setTitle(""); setSlug(""); setCategory("Wellness"); setAuthor("MSUR Herbs");
      setExcerpt(""); setContent(""); setImage(""); setReadTime("5 Min Read");
      setFeatured(false); setStatus("published"); setImageMode("upload");
    }
  }, [post, open]);

  const generateSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!post) setSlug(generateSlug(v));
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (e) => { if (e.target?.result) setImage(e.target.result as string); };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const insertFormatting = (before: string, after: string = "") => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newContent);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + before.length, start + before.length + selected.length); }, 0);
  };

  const insertBlock = (prefix: string) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    const newContent = content.substring(0, lineStart) + prefix + content.substring(lineStart);
    setContent(newContent);
    setTimeout(() => { ta.focus(); }, 0);
  };

  const insertInlineImage = useCallback((url: string) => {
    if (!url) return;
    const ta = contentRef.current;
    const pos = ta ? ta.selectionStart : content.length;
    const imgMarkdown = `\n\n![image](${url})\n\n`;
    const newContent = content.substring(0, pos) + imgMarkdown + content.substring(pos);
    setContent(newContent);
    setShowInlineImageDialog(false);
    setInlineImageUrl("");
    setTimeout(() => { ta?.focus(); }, 0);
  }, [content]);

  const handleInlineFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) insertInlineImage(e.target.result as string);
    };
    reader.readAsDataURL(file);
  }, [insertInlineImage]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
    onSave({
      id: post?.id || `blog-${Date.now()}`,
      slug: slug || generateSlug(title),
      title: title.trim(), category,
      date: post?.date || dateStr, readTime, author,
      excerpt: excerpt.trim(),
      image: image || "/placeholder.svg",
      featured, content: content.trim(), status,
      createdAt: post?.createdAt || now.toISOString().split("T")[0],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Blog Post" : "Create Blog Post"}</DialogTitle>
          <DialogDescription>{post ? "Update the blog post details below." : "Fill in the details to create a new blog post."}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Enter blog title" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated-from-title" />
            </div>
          </div>

          {/* Category, Status, Author, Read Time */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={v => setStatus(v as "published" | "draft")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input value={author} onChange={e => setAuthor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Read Time</Label>
              <Input value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="5 Min Read" />
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label>Featured Image</Label>
            <div className="flex gap-2 mb-2">
              <Button type="button" size="sm" variant={imageMode === "upload" ? "default" : "outline"} onClick={() => setImageMode("upload")} className="text-xs">
                <Upload className="h-3 w-3 mr-1" /> Upload
              </Button>
              <Button type="button" size="sm" variant={imageMode === "url" ? "default" : "outline"} onClick={() => setImageMode("url")} className="text-xs">
                <ImageIcon className="h-3 w-3 mr-1" /> URL
              </Button>
            </div>
            {imageMode === "upload" ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
              >
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
                {image ? (
                  <div className="relative inline-block">
                    <img src={image} alt="Preview" className="w-32 h-20 object-cover rounded-lg mx-auto" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setImage(""); }} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"><X className="h-3 w-3" /></button>
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
                <Input placeholder="https://example.com/image.jpg" value={image?.startsWith("data:") ? "" : image} onChange={(e) => setImage(e.target.value)} />
                {image && !image.startsWith("data:") && (
                  <div className="relative inline-block">
                    <img src={image} alt="Preview" className="w-32 h-20 object-cover rounded-lg" />
                    <button type="button" onClick={() => setImage("")} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"><X className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label>Excerpt *</Label>
            <Textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description for blog listing..." rows={2} />
          </div>

          {/* Rich Text Content Editor */}
          <div className="space-y-2">
            <Label>Content *</Label>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex flex-wrap items-center gap-0.5 p-2 bg-muted/50 border-b border-border">
                <ToolbarBtn icon={Bold} label="Bold" onClick={() => insertFormatting("**", "**")} />
                <ToolbarBtn icon={Italic} label="Italic" onClick={() => insertFormatting("*", "*")} />
                <ToolbarBtn icon={Underline} label="Underline" onClick={() => insertFormatting("<u>", "</u>")} />
                <Separator orientation="vertical" className="h-6 mx-1" />
                <ToolbarBtn icon={Heading1} label="Heading 1" onClick={() => insertBlock("# ")} />
                <ToolbarBtn icon={Heading2} label="Heading 2" onClick={() => insertBlock("## ")} />
                <ToolbarBtn icon={Heading3} label="Heading 3" onClick={() => insertBlock("### ")} />
                <Separator orientation="vertical" className="h-6 mx-1" />
                <ToolbarBtn icon={List} label="Bullet List" onClick={() => insertBlock("- ")} />
                <ToolbarBtn icon={ListOrdered} label="Numbered List" onClick={() => insertBlock("1. ")} />
                <ToolbarBtn icon={Quote} label="Blockquote" onClick={() => insertBlock("> ")} />
                <Separator orientation="vertical" className="h-6 mx-1" />
                <ToolbarBtn icon={LinkIcon} label="Link" onClick={() => insertFormatting("[", "](url)")} />
                <ToolbarBtn icon={Minus} label="Horizontal Rule" onClick={() => insertFormatting("\n\n---\n\n")} />
                <Separator orientation="vertical" className="h-6 mx-1" />
                <ToolbarBtn icon={ImageIcon} label="Insert Image" onClick={() => setShowInlineImageDialog(true)} />
              </div>
              <Textarea
                ref={contentRef}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your blog content here... Supports markdown formatting."
                rows={14}
                className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-y font-mono text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supports Markdown: **bold**, *italic*, # headings, - lists, &gt; quotes, [links](url), ![image](url)
            </p>
          </div>

          {/* Inline Image Insert Panel */}
          {showInlineImageDialog && (
            <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Insert Image into Content</Label>
                <button type="button" onClick={() => { setShowInlineImageDialog(false); setInlineImageUrl(""); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant={inlineImageMode === "upload" ? "default" : "outline"} onClick={() => setInlineImageMode("upload")} className="text-xs">
                  <Upload className="h-3 w-3 mr-1" /> Upload
                </Button>
                <Button type="button" size="sm" variant={inlineImageMode === "url" ? "default" : "outline"} onClick={() => setInlineImageMode("url")} className="text-xs">
                  <ImageIcon className="h-3 w-3 mr-1" /> URL
                </Button>
              </div>
              {inlineImageMode === "upload" ? (
                <div
                  onClick={() => inlineImageRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <input ref={inlineImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleInlineFileUpload(e.target.files[0]); }} />
                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Click to upload an image (PNG, JPG up to 5MB)</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input placeholder="https://example.com/image.jpg" value={inlineImageUrl} onChange={(e) => setInlineImageUrl(e.target.value)} className="flex-1" />
                  <Button type="button" size="sm" onClick={() => insertInlineImage(inlineImageUrl)} disabled={!inlineImageUrl.trim()}>Insert</Button>
                </div>
              )}
            </div>
          )}

          {/* Featured toggle */}
          <div className="flex items-center gap-3">
            <Switch checked={featured} onCheckedChange={setFeatured} />
            <Label>Featured post</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim() || !content.trim()}>{post ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogFormDialog;