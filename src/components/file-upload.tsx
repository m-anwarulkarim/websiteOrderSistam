"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
export type FileUploadHandle = {
  uploadPending: () => Promise<string>;
};

type Props = {
  folder: string;
  multiple?: boolean;
  value: string;
  onChange: (urls: string) => void;
  accept?: string;
  deferred?: boolean;
};

export const FileUpload = forwardRef<FileUploadHandle, Props>(
  function FileUpload(
    {
      folder,
      multiple = false,
      value,
      onChange,
      accept = "image/*",
      deferred = false,
    },
    ref,
  ) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pendingFiles = useRef<Map<string, File>>(new Map());
    const [dragOver, setDragOver] = useState(false);

    const urls = value ? value.split(",").filter(Boolean) : [];

    useImperativeHandle(ref, () => ({
      async uploadPending() {
        if (pendingFiles.current.size === 0) {
          return urls.filter((u) => !u.startsWith("blob:")).join(",");
        }
        setUploading(true);
        const supabase = createClient();
        const finalUrls: string[] = [];

        for (const u of urls) {
          const file = pendingFiles.current.get(u);
          if (!file) {
            finalUrls.push(u);
            continue;
          }
          const ext = file.name.split(".").pop() ?? "png";
          const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const { error } = await supabase.storage
            .from("order-files")
            .upload(name, file);
          if (!error) {
            const { data } = supabase.storage
              .from("order-files")
              .getPublicUrl(name);
            finalUrls.push(data.publicUrl);
          }
        }
        pendingFiles.current.clear();
        setUploading(false);
        return finalUrls.join(",");
      },
    }));

    async function uploadNow(file: File): Promise<string | null> {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "png";
      const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("order-files")
        .upload(name, file);
      if (error) return null;
      const { data } = supabase.storage.from("order-files").getPublicUrl(name);
      return data.publicUrl;
    }

    const addFiles = useCallback(
      async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setError(null);
        const newUrls = [...urls];

        for (const file of Array.from(files)) {
          if (file.size > 5 * 1024 * 1024) {
            setError("ফাইল ৫MB এর বেশি হতে পারবে না।");
            continue;
          }

          if (deferred) {
            const blobUrl = URL.createObjectURL(file);
            pendingFiles.current.set(blobUrl, file);
            newUrls.push(blobUrl);
          } else {
            setUploading(true);
            const url = await uploadNow(file);
            if (url) newUrls.push(url);
            else setError("আপলোড ব্যর্থ।");
            setUploading(false);
          }
        }
        onChange(newUrls.join(","));
      },
      [urls, onChange, deferred, folder],
    );

    function removeUrl(idx: number) {
      const removed = urls[idx];
      if (removed?.startsWith("blob:")) {
        pendingFiles.current.delete(removed);
        URL.revokeObjectURL(removed);
      }
      onChange(urls.filter((_, i) => i !== idx).join(","));
    }

    function openPicker() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.multiple = multiple;
      input.onchange = () => addFiles(input.files);
      input.click();
    }

    return (
      <div className="space-y-2">
        <div
          className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors cursor-pointer
          ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`}
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
        >
          <div className="text-muted-foreground text-sm">
            {uploading ? (
              "আপলোড হচ্ছে..."
            ) : (
              <>
                <span className="text-lg">📎</span>
                <p className="mt-1">
                  {multiple
                    ? "ছবি টেনে আনুন বা ক্লিক করুন"
                    : "ছবি বাছুন বা টেনে আনুন"}
                </p>
              </>
            )}
          </div>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {urls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {urls.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt=""
                  className="h-16 w-16 rounded-md border object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUrl(i);
                  }}
                  className="absolute -right-1 -top-1 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
