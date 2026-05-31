"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Props = {
  /** Supabase Storage এ ফোল্ডার পাথ, যেমন "logos" বা "products" */
  folder: string;
  /** একাধিক ফাইল আপলোড করা যাবে কিনা */
  multiple?: boolean;
  /** বর্তমান URL(গুলো) */
  value: string;
  /** URL বদলালে call হবে — একাধিক হলে কমা দিয়ে জোড়া */
  onChange: (urls: string) => void;
  /** গ্রহণযোগ্য ফাইল টাইপ */
  accept?: string;
};

export function FileUpload({
  folder,
  multiple = false,
  value,
  onChange,
  accept = "image/*",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urls = value ? value.split(",").filter(Boolean) : [];

  const upload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      setError(null);

      const supabase = createClient();
      const newUrls: string[] = [...urls];

      for (const file of Array.from(files)) {
        // 5MB লিমিট
        if (file.size > 5 * 1024 * 1024) {
          setError("ফাইল ৫MB এর বেশি হতে পারবে না।");
          continue;
        }

        const ext = file.name.split(".").pop() ?? "png";
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("order-files")
          .upload(fileName, file, { upsert: false });

        if (uploadError) {
          setError("আপলোড ব্যর্থ: " + uploadError.message);
          continue;
        }

        const { data } = supabase.storage
          .from("order-files")
          .getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
      }

      onChange(newUrls.join(","));
      setUploading(false);
    },
    [folder, onChange, urls],
  );

  function removeUrl(idx: number) {
    const updated = urls.filter((_, i) => i !== idx);
    onChange(updated.join(","));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = accept;
            input.multiple = multiple;
            input.onchange = () => upload(input.files);
            input.click();
          }}
        >
          {uploading
            ? "আপলোড হচ্ছে..."
            : multiple
              ? "📎 ছবি যোগ করুন"
              : "📎 ফাইল বাছুন"}
        </Button>
        {!multiple && urls.length > 0 && (
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            ✅ আপলোড হয়েছে
          </span>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* প্রিভিউ */}
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt={`upload-${i}`}
                className="h-16 w-16 rounded-md border object-cover"
              />
              <button
                type="button"
                onClick={() => removeUrl(i)}
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
}
