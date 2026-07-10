"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  FileText,
  Code,
  Film,
  Plus,
  Search,
  Trash2,
  X,
  Save,
  Loader2,
  AlertCircle,
  Upload,
  Link as LinkIcon,
  RefreshCw,
  Copy,
  Calendar,
  HardDrive,
  Maximize,
  Tag,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

// ---------- Types ----------
type MediaCategory =
  | "IMAGE"
  | "VIDEO"
  | "AUDIO"
  | "DOCUMENT"
  | "SVG"
  | "ANIMATION"
  | "GENERAL";

interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: MediaCategory;
  tags: string[] | null;
  altText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MediaFormData {
  url: string;
  originalName: string;
  category: MediaCategory;
  altText: string;
  caption: string;
  tags: string;
  width: string;
  height: string;
}

const CATEGORIES: { value: MediaCategory; label: string }[] = [
  { value: "IMAGE", label: "Images" },
  { value: "VIDEO", label: "Videos" },
  { value: "AUDIO", label: "Audio" },
  { value: "DOCUMENT", label: "Documents" },
  { value: "SVG", label: "SVG" },
  { value: "ANIMATION", label: "Animations" },
];

const FILTER_TABS: { value: MediaCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  ...CATEGORIES,
];

const CATEGORY_CONFIG: Record<
  MediaCategory,
  {
    label: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconText: string;
  }
> = {
  IMAGE: {
    label: "Image",
    badge: "bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800",
    icon: ImageIcon,
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconText: "text-sky-600 dark:text-sky-400",
  },
  VIDEO: {
    label: "Video",
    badge: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800",
    icon: VideoIcon,
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconText: "text-rose-600 dark:text-rose-400",
  },
  AUDIO: {
    label: "Audio",
    badge: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
    icon: Music,
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconText: "text-amber-600 dark:text-amber-400",
  },
  DOCUMENT: {
    label: "Document",
    badge: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: FileText,
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconText: "text-slate-600 dark:text-slate-300",
  },
  SVG: {
    label: "SVG",
    badge: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
    icon: Code,
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconText: "text-purple-600 dark:text-purple-400",
  },
  ANIMATION: {
    label: "Animation",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    icon: Film,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconText: "text-emerald-600 dark:text-emerald-400",
  },
  GENERAL: {
    label: "General",
    badge: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: FileText,
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconText: "text-slate-600 dark:text-slate-300",
  },
};

const EMPTY_FORM: MediaFormData = {
  url: "",
  originalName: "",
  category: "IMAGE",
  altText: "",
  caption: "",
  tags: "",
  width: "",
  height: "",
};

function getCategoryFromMime(mimeType: string, fallback: MediaCategory): MediaCategory {
  if (mimeType.startsWith("image/svg")) return "SVG";
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType.startsWith("audio/")) return "AUDIO";
  if (mimeType.startsWith("application/pdf") || mimeType.includes("document") || mimeType.includes("text")) return "DOCUMENT";
  if (mimeType.includes("gif")) return "ANIMATION";
  return fallback;
}

function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function filenameFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const last = parts[parts.length - 1];
    return last ? decodeURIComponent(last) : "media-file";
  } catch {
    const parts = url.split("/");
    return parts[parts.length - 1] || "media-file";
  }
}

function mimeTypeFromUrl(url: string, category: MediaCategory): string {
  const lower = url.toLowerCase();
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".wav")) return "audio/wav";
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".json")) return "application/json";
  if (category === "IMAGE") return "image/jpeg";
  if (category === "VIDEO") return "video/mp4";
  if (category === "AUDIO") return "audio/mpeg";
  if (category === "SVG") return "image/svg+xml";
  if (category === "DOCUMENT") return "application/pdf";
  return "application/octet-stream";
}

export default function MediaLibraryAdminPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<MediaCategory | "ALL">(
    "ALL"
  );

  // Dialog state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form, setForm] = useState<MediaFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Details panel
  const [selected, setSelected] = useState<Media | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Replace dialog (uses same shape as upload)
  const [replaceTarget, setReplaceTarget] = useState<Media | null>(null);
  const [replaceUrl, setReplaceUrl] = useState("");
  const [replacing, setReplacing] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "ALL") params.set("category", activeCategory);
      if (search.trim()) params.set("search", search.trim());
      params.set("limit", "100");
      const res = await fetch(`/api/admin/media?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch media");
      const json = await res.json();
      setMedia(json.data || []);
    } catch (err) {
      toast.error("Failed to load media", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const openUpload = () => {
    setForm(EMPTY_FORM);
    setUploadOpen(true);
  };

  const handleUpload = async () => {
    if (!form.url.trim()) {
      toast.error("URL is required");
      return;
    }
    if (!form.originalName.trim()) {
      toast.error("Original filename is required");
      return;
    }

    setSaving(true);
    const url = form.url.trim();
    const originalName = form.originalName.trim();
    const mimeType = mimeTypeFromUrl(url, form.category);
    const category = getCategoryFromMime(mimeType, form.category);
    const filename = `${Date.now()}-${filenameFromUrl(url)}`;
    const tags = form.tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      filename,
      originalName,
      mimeType,
      size: 0,
      url,
      category,
      tags: tags.length ? tags : undefined,
      altText: form.altText.trim() || undefined,
      caption: form.caption.trim() || undefined,
      width: form.width ? Number(form.width) : undefined,
      height: form.height ? Number(form.height) : undefined,
    };

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to upload media");
      toast.success("Media added", { description: originalName });
      setUploadOpen(false);
      fetchMedia();
    } catch (err) {
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReplace = async () => {
    if (!replaceTarget || !replaceUrl.trim()) return;
    setReplacing(true);
    try {
      const res = await fetch(`/api/admin/media/${replaceTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: replaceUrl.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to replace media");
      toast.success("Media replaced", {
        description: replaceTarget.originalName,
      });
      setReplaceTarget(null);
      setReplaceUrl("");
      setSelected((s) =>
        s && s.id === replaceTarget.id ? { ...s, url: replaceUrl.trim() } : s
      );
      fetchMedia();
    } catch (err) {
      toast.error("Replace failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setReplacing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete media");
      toast.success("Media deleted", {
        description: deleteTarget.originalName,
      });
      if (selected?.id === deleteTarget.id) {
        setSelected(null);
        setDetailsOpen(false);
      }
      setDeleteTarget(null);
      fetchMedia();
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard");
    } catch {
      toast.error("Could not copy URL");
    }
  };

  // ---------- Derived ----------
  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: media.length };
    for (const m of media) {
      c[m.category] = (c[m.category] || 0) + 1;
    }
    return c;
  }, [media]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Media Library
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Centralized library of images, videos, audio, and documents used
            across the academy.
          </p>
        </div>
        <Button onClick={openUpload} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Media
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{counts.IMAGE || 0}</div>
              <div className="text-xs text-slate-500">Images</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
              <VideoIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{counts.VIDEO || 0}</div>
              <div className="text-xs text-slate-500">Videos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Music className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{counts.AUDIO || 0}</div>
              <div className="text-xs text-slate-500">Audio</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <FileText className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <div className="text-2xl font-bold">{counts.DOCUMENT || 0}</div>
              <div className="text-xs text-slate-500">Documents</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{counts.SVG || 0}</div>
              <div className="text-xs text-slate-500">SVG</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Film className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{counts.ANIMATION || 0}</div>
              <div className="text-xs text-slate-500">Animations</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter tabs + search */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {FILTER_TABS.map((tab) => {
                const isActive = activeCategory === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveCategory(tab.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
                        : "bg-transparent text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab.label}
                    {tab.value !== "ALL" && (
                      <span
                        className={`ml-1.5 text-xs ${
                          isActive ? "opacity-80" : "text-slate-400"
                        }`}
                      >
                        {counts[tab.value] || 0}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search media..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchMedia}
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-44 w-full rounded-lg" />
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                {search || activeCategory !== "ALL"
                  ? "No matching media"
                  : "Media library is empty"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {search || activeCategory !== "ALL"
                  ? "Try a different search or filter."
                  : "Add your first media item by providing a URL."}
              </p>
              {!search && activeCategory === "ALL" && (
                <Button onClick={openUpload} className="mt-4 gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Media
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {media.map((item) => {
                const cfg = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.GENERAL;
                const Icon = cfg.icon;
                const isImage =
                  item.category === "IMAGE" ||
                  item.category === "SVG" ||
                  item.category === "ANIMATION" ||
                  item.mimeType.startsWith("image/");
                const isVideo = item.mimeType.startsWith("video/");
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelected(item);
                      setDetailsOpen(true);
                    }}
                    className="group text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    {/* Thumbnail / Preview */}
                    <div className="aspect-square relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      {isImage ? (
                        <img
                          src={item.url}
                          alt={item.altText || item.originalName}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                            const parent = img.parentElement;
                            if (parent && !parent.querySelector(".fallback-icon")) {
                              const div = document.createElement("div");
                              div.className =
                                "fallback-icon absolute inset-0 flex items-center justify-center";
                              div.innerHTML =
                                '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M21 15l-5-5L5 21"/></svg>';
                              parent.appendChild(div);
                            }
                          }}
                        />
                      ) : isVideo ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <VideoIcon className="h-10 w-10 text-slate-400" />
                          <video
                            src={item.url}
                            className="h-full w-full object-cover"
                            muted
                          />
                        </div>
                      ) : (
                        <div
                          className={`absolute inset-0 flex items-center justify-center ${cfg.iconBg}`}
                        >
                          <Icon className={`h-10 w-10 ${cfg.iconText}`} />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant="outline"
                          className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur ${cfg.badge}`}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {cfg.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 space-y-1">
                      <div
                        className="text-sm font-medium text-slate-900 dark:text-white truncate"
                        title={item.originalName}
                      >
                        {item.originalName}
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {formatBytes(item.size)}
                        </span>
                        {(item.width || item.height) && (
                          <span className="flex items-center gap-1">
                            <Maximize className="h-3 w-3" />
                            {item.width || "?"}×{item.height || "?"}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 pt-0.5">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {!loading && media.length > 0 && (
            <div className="mt-3 text-xs text-slate-500 px-1">
              Showing {media.length} media item{media.length !== 1 ? "s" : ""}
              {activeCategory !== "ALL" && ` in ${activeCategory.toLowerCase()}`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Add Media
            </DialogTitle>
            <DialogDescription>
              Provide a publicly accessible URL for an existing media file.
              Metadata will be saved to the library.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* URL */}
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="url">
                Media URL <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="url"
                  value={form.url}
                  onChange={(e) => {
                    const url = e.target.value;
                    setForm((p) => ({
                      ...p,
                      url,
                      originalName:
                        p.originalName || filenameFromUrl(url),
                    }));
                  }}
                  className="pl-9"
                  placeholder="https://example.com/path/to/image.jpg"
                />
              </div>
              {form.url && (form.category === "IMAGE" || form.category === "SVG" || form.category === "ANIMATION") && (
                <div className="h-32 w-full rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <img
                    src={form.url}
                    alt="Preview"
                    className="h-full w-full object-contain"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.opacity = "0.2")
                    }
                  />
                </div>
              )}
            </div>

            {/* Original Name */}
            <div className="space-y-2">
              <Label htmlFor="originalName">
                Original Filename <span className="text-red-500">*</span>
              </Label>
              <Input
                id="originalName"
                value={form.originalName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, originalName: e.target.value }))
                }
                placeholder="cabin-crew-training.jpg"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, category: v as MediaCategory }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => {
                    const cfg = CATEGORY_CONFIG[c.value];
                    const Icon = cfg.icon;
                    return (
                      <SelectItem key={c.value} value={c.value}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {c.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Width */}
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                min={0}
                value={form.width}
                onChange={(e) =>
                  setForm((p) => ({ ...p, width: e.target.value }))
                }
                placeholder="1920"
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                min={0}
                value={form.height}
                onChange={(e) =>
                  setForm((p) => ({ ...p, height: e.target.value }))
                }
                placeholder="1080"
              />
            </div>

            {/* Alt text */}
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                value={form.altText}
                onChange={(e) =>
                  setForm((p) => ({ ...p, altText: e.target.value }))
                }
                placeholder="Describe the media for accessibility"
              />
            </div>

            {/* Caption */}
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                rows={2}
                value={form.caption}
                onChange={(e) =>
                  setForm((p) => ({ ...p, caption: e.target.value }))
                }
                placeholder="Optional caption shown under the media"
              />
            </div>

            {/* Tags */}
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="tags">
                Tags{" "}
                <span className="text-xs font-normal text-slate-500">
                  (comma separated)
                </span>
              </Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tags: e.target.value }))
                }
                placeholder="cabin-crew, safety, training"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setUploadOpen(false)}
              disabled={saving}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add to Library
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Panel (Modal) */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden p-0">
          {selected && (
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-200 dark:border-slate-800">
                <div className="min-w-0">
                  <DialogTitle className="truncate">
                    {selected.originalName}
                  </DialogTitle>
                  <div className="text-xs text-slate-500 mt-1 truncate">
                    {selected.filename} · {selected.mimeType}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-1 -mt-1"
                  onClick={() => setDetailsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Body */}
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* Preview */}
                  <div className="bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 min-h-[280px]">
                    {(selected.category === "IMAGE" ||
                      selected.category === "SVG" ||
                      selected.category === "ANIMATION" ||
                      selected.mimeType.startsWith("image/")) ? (
                      <img
                        src={selected.url}
                        alt={selected.altText || selected.originalName}
                        className="max-h-[400px] max-w-full object-contain rounded"
                      />
                    ) : selected.mimeType.startsWith("video/") ? (
                      <video
                        src={selected.url}
                        controls
                        className="max-h-[400px] max-w-full rounded"
                      />
                    ) : selected.mimeType.startsWith("audio/") ? (
                      <div className="w-full max-w-sm flex flex-col items-center gap-4 py-8">
                        <Music className="h-16 w-16 text-amber-500" />
                        <audio src={selected.url} controls className="w-full" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 py-12">
                        <FileText className="h-16 w-16 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          No preview available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-4 overflow-y-auto">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={
                          (CATEGORY_CONFIG[selected.category] ||
                            CATEGORY_CONFIG.GENERAL).badge
                        }
                      >
                        {selected.category}
                      </Badge>
                      {selected.tags?.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="font-normal"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {t}
                        </Badge>
                      ))}
                    </div>

                    <DetailRow
                      label="Dimensions"
                      value={
                        selected.width || selected.height
                          ? `${selected.width || "?"} × ${
                              selected.height || "?"
                            } px`
                          : "—"
                      }
                      icon={Maximize}
                    />
                    <DetailRow
                      label="File size"
                      value={formatBytes(selected.size)}
                      icon={HardDrive}
                    />
                    <DetailRow
                      label="Uploaded"
                      value={formatDate(selected.createdAt)}
                      icon={Calendar}
                    />
                    {selected.altText && (
                      <div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                          Alt text
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          {selected.altText}
                        </p>
                      </div>
                    )}
                    {selected.caption && (
                      <div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                          Caption
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          {selected.caption}
                        </p>
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        URL
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={selected.url}
                          className="text-xs font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyUrl(selected.url)}
                          title="Copy URL"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="Open"
                        >
                          <a
                            href={selected.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Footer */}
              <DialogFooter className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <Button
                  variant="outline"
                  onClick={() => {
                    setReplaceTarget(selected);
                    setReplaceUrl("");
                  }}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Replace
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteTarget(selected)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Replace Dialog */}
      <Dialog
        open={!!replaceTarget}
        onOpenChange={(o) => {
          if (!replacing) {
            setReplaceTarget(o ? replaceTarget : null);
            setReplaceUrl("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Replace Media
            </DialogTitle>
            <DialogDescription>
              Enter a new URL for{" "}
              <span className="font-medium">{replaceTarget?.originalName}</span>.
              The original file will not be deleted from storage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="replaceUrl">New URL</Label>
            <Input
              id="replaceUrl"
              value={replaceUrl}
              onChange={(e) => setReplaceUrl(e.target.value)}
              placeholder="https://example.com/new-image.jpg"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setReplaceTarget(null);
                setReplaceUrl("");
              }}
              disabled={replacing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReplace}
              disabled={replacing || !replaceUrl.trim()}
            >
              {replacing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Replace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) =>
          !deleting && setDeleteTarget(o ? deleteTarget : null)
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              Delete Media?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You are about to remove{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {deleteTarget?.originalName}
            </span>{" "}
            from the library. The file at the source URL will not be deleted.
            This action cannot be undone.
          </p>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="text-sm text-slate-700 dark:text-slate-200 text-right">
        {value}
      </span>
    </div>
  );
}
