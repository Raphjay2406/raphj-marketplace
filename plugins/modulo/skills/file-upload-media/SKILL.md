---
name: file-upload-media
description: "File upload patterns: drag-drop zones, image crop, multi-file with progress, video player, gallery/lightbox, avatar upload. Works with Next.js and Astro."
---

Use this skill when the user mentions file upload, drag and drop, image upload, image crop, avatar upload, video player, gallery, lightbox, media, or file handling. Triggers on: upload, drag drop, file, image crop, avatar, video, gallery, lightbox, media, dropzone.

You are an expert at building polished file upload and media handling UIs.

## Drag-and-Drop Upload Zone

```tsx
'use client'
import { useCallback, useState } from 'react'
import { Upload, X, FileIcon, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileWithPreview extends File {
  preview?: string
}

export function DropZone({ onUpload, accept = 'image/*', maxSize = 5 * 1024 * 1024, multiple = true }: DropZoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.size <= maxSize && (accept === '*' || f.type.match(accept.replace('*', '.*')))
    )
    const withPreviews = dropped.map((f) =>
      Object.assign(f, { preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined })
    )
    setFiles((prev) => (multiple ? [...prev, ...withPreviews] : withPreviews))
  }, [accept, maxSize, multiple])

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const next = [...prev]
      if (next[index].preview) URL.revokeObjectURL(next[index].preview!)
      next.splice(index, 1)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => document.getElementById('file-input')?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) handleDrop({ dataTransfer: { files: e.target.files }, preventDefault: () => {} } as any)
          }}
        />
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">
          {accept === 'image/*' ? 'PNG, JPG, GIF' : accept} up to {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              {file.preview ? (
                <img src={file.preview} alt="" className="h-10 w-10 rounded object-cover" />
              ) : (
                <FileIcon className="h-10 w-10 text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(i)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Upload Progress
```tsx
function UploadProgress({ progress, fileName }: { progress: number; fileName: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className="flex-1 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="truncate font-medium">{fileName}</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      {progress === 100 ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground flex-shrink-0" />
      )}
    </div>
  )
}
```

## Avatar Upload with Crop

```tsx
'use client'
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function AvatarUpload({ currentAvatar, onSave }: AvatarUploadProps) {
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input')?.click()}>
        <Avatar className="h-20 w-20">
          <AvatarImage src={currentAvatar} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="h-5 w-5 text-white" />
        </div>
        <input id="avatar-input" type="file" accept="image/*" className="sr-only" onChange={onFileSelect} />
      </div>

      <Dialog open={!!image} onOpenChange={() => setImage(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Crop Avatar</DialogTitle></DialogHeader>
          <div className="relative h-64">
            {image && (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setCroppedArea(area)}
              />
            )}
          </div>
          <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={([v]) => setZoom(v)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setImage(null)}>Cancel</Button>
            <Button onClick={() => { /* crop and save */ }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

## Video Player with Custom Controls

```tsx
export function VideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [muted, setMuted] = useState(false)

  const togglePlay = () => {
    if (videoRef.current?.paused) { videoRef.current.play(); setPlaying(true) }
    else { videoRef.current?.pause(); setPlaying(false) }
  }

  return (
    <div className="relative group rounded-xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        onTimeUpdate={() => {
          if (videoRef.current) setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
        }}
        onClick={togglePlay}
        className="w-full aspect-video"
      />
      {/* Controls overlay */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Progress value={progress} className="h-1 mb-3 cursor-pointer" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setMuted(!muted)}>
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <span className="text-xs text-white/70 ml-auto">
            {formatTime(videoRef.current?.currentTime)} / {formatTime(videoRef.current?.duration)}
          </span>
        </div>
      </div>
    </div>
  )
}
```

## Gallery / Lightbox

```tsx
export function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button key={i} onClick={() => setSelected(i)} className="relative aspect-square overflow-hidden rounded-lg group">
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          </button>
        ))}
      </div>

      <Dialog open={selected !== null} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none">
          {selected !== null && (
            <div className="relative">
              <img src={images[selected].src} alt={images[selected].alt} className="w-full h-auto max-h-[80vh] object-contain" />
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white"
                onClick={() => setSelected(null)}>
                <X className="h-5 w-5" />
              </Button>
              {selected > 0 && (
                <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 text-white"
                  onClick={() => setSelected(selected - 1)}>
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              {selected < images.length - 1 && (
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
                  onClick={() => setSelected(selected + 1)}>
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
```

## Best Practices

1. **Drag-and-drop + click**: Always support both — not everyone uses drag
2. **Show file previews**: Thumbnails for images, icons + name for other files
3. **Progress feedback**: Show per-file progress bars during upload
4. **Validate client-side**: Check file type and size before uploading
5. **Revoke object URLs**: Clean up `URL.createObjectURL` to prevent memory leaks
6. **Crop before upload**: Send cropped images, not full-size with crop metadata
7. **Accessible**: Label the hidden input, announce upload status to screen readers
8. **Max file size**: Always enforce and communicate limits clearly
