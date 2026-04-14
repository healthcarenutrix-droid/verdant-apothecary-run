import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AdminBlogPost } from "@/data/dashboard-data";

interface BlogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: AdminBlogPost | null;
  onSave: (post: AdminBlogPost) => void;
}

const CATEGORIES = ["Wellness", "Herbs", "Remedies", "Nutrition", "Guides", "Beauty", "Spices"];

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

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setCategory(post.category);
      setAuthor(post.author);
      setExcerpt(post.excerpt);
      setContent(post.content);
      setImage(post.image);
      setReadTime(post.readTime);
      setFeatured(post.featured || false);
      setStatus(post.status);
    } else {
      setTitle("");
      setSlug("");
      setCategory("Wellness");
      setAuthor("MSUR Herbs");
      setExcerpt("");
      setContent("");
      setImage("/placeholder.svg");
      setReadTime("5 Min Read");
      setFeatured(false);
      setStatus("published");
    }
  }, [post, open]);

  const generateSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!post) setSlug(generateSlug(v));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
    onSave({
      id: post?.id || `blog-${Date.now()}`,
      slug: slug || generateSlug(title),
      title: title.trim(),
      category,
      date: post?.date || dateStr,
      readTime,
      author,
      excerpt: excerpt.trim(),
      image: image || "/placeholder.svg",
      featured,
      content: content.trim(),
      status,
      createdAt: post?.createdAt || now.toISOString().split("T")[0],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Blog Post" : "Create Blog Post"}</DialogTitle>
          <DialogDescription>
            {post ? "Update the blog post details below." : "Fill in the details to create a new blog post."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Enter blog title" />
          </div>

          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated-from-title" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Author</Label>
              <Input value={author} onChange={e => setAuthor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Read Time</Label>
              <Input value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="5 Min Read" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label>Excerpt *</Label>
            <Textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description..." rows={2} />
          </div>

          <div className="space-y-2">
            <Label>Content *</Label>
            <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Full blog content... Use double newlines for paragraphs." rows={10} />
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={featured} onCheckedChange={setFeatured} />
            <Label>Featured post</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim() || !content.trim()}>
            {post ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogFormDialog;
