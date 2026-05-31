"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CopyButton } from "@/components/copy-button";
import { FileUpload } from "@/components/file-upload";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Order = {
  id: string;
  name: string;
  whatsapp: string;
  domain_status: "have" | "need";
  domain_name: string | null;
  office_address: string | null;
  hotline: string | null;
  fb_page: string | null;
  youtube: string | null;
  other_socials: string | null;
  gmail: string | null;
  password: string | null;
  status: "new" | "in_progress" | "done";
  created_at: string;
  logo_url: string | null;
  brand_colors: string | null;
  tagline: string | null;
  website_type: string | null;
  page_count: string | null;
  reference_websites: string | null;
  special_features: string | null;
  about_us: string | null;
  services_list: string | null;
  product_images_url: string | null;
  budget: string | null;
  deadline: string | null;
};

type Note = {
  id: string;
  order_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<Order["status"], string> = {
  new: "নতুন",
  in_progress: "কাজ চলছে",
  done: "সম্পন্ন",
};
const BUDGET_LABEL: Record<string, string> = {
  under_5k: "৫,০০০ এর নিচে",
  "5k_10k": "৫-১০ হাজার",
  "10k_20k": "১০-২০ হাজার",
  "20k_50k": "২০-৫০ হাজার",
  "50k_plus": "৫০ হাজার+",
};
const WEBSITE_TYPE_LABEL: Record<string, string> = {
  business: "ব্যবসায়িক",
  ecommerce: "ই-কমার্স",
  portfolio: "পোর্টফোলিও",
  blog: "ব্লগ",
  landing: "ল্যান্ডিং পেজ",
  other: "অন্যান্য",
};

type FieldDef = {
  key: keyof Order;
  label: string;
  section: string;
  long?: boolean;
  image?: boolean;
};

const FIELDS: FieldDef[] = [
  { key: "name", label: "নাম", section: "বেসিক তথ্য" },
  { key: "whatsapp", label: "WhatsApp", section: "বেসিক তথ্য" },
  { key: "office_address", label: "ঠিকানা", section: "বেসিক তথ্য", long: true },
  { key: "hotline", label: "হটলাইন", section: "বেসিক তথ্য" },
  { key: "gmail", label: "Gmail", section: "বেসিক তথ্য" },
  { key: "password", label: "Password", section: "বেসিক তথ্য" },
  { key: "domain_name", label: "ডোমেইন", section: "ডোমেইন" },
  { key: "fb_page", label: "Facebook", section: "সোশ্যাল" },
  { key: "youtube", label: "YouTube", section: "সোশ্যাল" },
  {
    key: "other_socials",
    label: "অন্যান্য সোশ্যাল",
    section: "সোশ্যাল",
    long: true,
  },
  { key: "logo_url", label: "লোগো", section: "ব্র্যান্ডিং", image: true },
  { key: "brand_colors", label: "ব্র্যান্ড কালার", section: "ব্র্যান্ডিং" },
  { key: "tagline", label: "ট্যাগলাইন", section: "ব্র্যান্ডিং" },
  { key: "website_type", label: "সাইটের ধরন", section: "ওয়েবসাইট" },
  { key: "page_count", label: "পেজ সংখ্যা", section: "ওয়েবসাইট" },
  {
    key: "reference_websites",
    label: "রেফারেন্স সাইট",
    section: "ওয়েবসাইট",
    long: true,
  },
  {
    key: "special_features",
    label: "স্পেশাল ফিচার",
    section: "ওয়েবসাইট",
    long: true,
  },
  { key: "about_us", label: "About Us", section: "কন্টেন্ট", long: true },
  {
    key: "services_list",
    label: "সার্ভিস লিস্ট",
    section: "কন্টেন্ট",
    long: true,
  },
  {
    key: "product_images_url",
    label: "প্রোডাক্ট ছবি",
    section: "কন্টেন্ট",
    image: true,
  },
  { key: "budget", label: "বাজেট", section: "প্রজেক্ট" },
  { key: "deadline", label: "ডেডলাইন", section: "প্রজেক্ট" },
];

// ছবির URL গুলো দেখানোর কম্পোনেন্ট (থাম্বনেইল, ক্লিকে ফুল সাইজ)
function ImagePreview({ value }: { value: string }) {
  const urls = value.split(",").filter(Boolean);
  if (urls.length === 0) return <span className="text-sm">—</span>;
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {urls.map((url, i) => (
        <a key={i} href={url} target="_blank" rel="noreferrer">
          <img
            src={url}
            alt={`img-${i}`}
            className="h-16 w-16 rounded-md border object-cover hover:ring-2 ring-primary"
          />
        </a>
      ))}
    </div>
  );
}

export default function AdminDashboard({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialOrders[0]?.id ?? null,
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [newNoteImage, setNewNoteImage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Order>>({});

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  useEffect(() => {
    const channel = supabase
      .channel("orders-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => setOrders((prev) => [payload.new as Order, ...prev]),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    if (!selectedId) return;
    supabase
      .from("notes")
      .select("*")
      .eq("order_id", selectedId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setNotes((data as Note[]) ?? []));
    setEditing(false);
  }, [selectedId, supabase]);

  async function addNote() {
    if ((!newNote.trim() && !newNoteImage) || !selectedId) return;
    const { data } = await supabase
      .from("notes")
      .insert({
        order_id: selectedId,
        content: newNote.trim(),
        image_url: newNoteImage || null,
      })
      .select()
      .single();
    if (data) setNotes((prev) => [...prev, data as Note]);
    setNewNote("");
    setNewNoteImage("");
  }

  async function changeStatus(status: Order["status"]) {
    if (!selected) return;
    await supabase.from("orders").update({ status }).eq("id", selected.id);
    setOrders((prev) =>
      prev.map((o) => (o.id === selected.id ? { ...o, status } : o)),
    );
  }

  function startEdit() {
    if (!selected) return;
    setEditData({ ...selected });
    setEditing(true);
  }

  async function saveEdit() {
    if (!selected || !editData) return;
    const { error } = await supabase
      .from("orders")
      .update(editData)
      .eq("id", selected.id);
    if (!error) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selected.id ? ({ ...o, ...editData } as Order) : o,
        ),
      );
      setEditing(false);
    }
  }

  function getDisplayValue(o: Order, key: keyof Order): string {
    if (key === "domain_name")
      return o.domain_status === "have"
        ? (o.domain_name ?? "—")
        : "নতুন ডোমেইন লাগবে";
    if (key === "website_type")
      return WEBSITE_TYPE_LABEL[o[key] ?? ""] ?? (o[key] as string) ?? "—";
    if (key === "budget")
      return BUDGET_LABEL[o[key] ?? ""] ?? (o[key] as string) ?? "—";
    return (o[key] as string) ?? "—";
  }

  function copyAll(o: Order) {
    return FIELDS.map(
      ({ key, label }) => `${label}: ${getDisplayValue(o, key)}`,
    ).join("\n");
  }

  const sections = [...new Set(FIELDS.map((f) => f.section))];

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <aside className="w-72 shrink-0 overflow-y-auto border-r bg-muted/30">
        <div className="p-3 text-sm font-medium text-muted-foreground">
          অর্ডার ({orders.length})
        </div>
        {orders.map((o) => (
          <button
            key={o.id}
            onClick={() => setSelectedId(o.id)}
            className={`flex w-full flex-col items-start gap-1 border-b px-3 py-2.5 text-left text-sm hover:bg-accent ${o.id === selectedId ? "bg-accent" : ""}`}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="truncate font-medium"># {o.name}</span>
              <StatusBadge status={o.status} />
            </span>
            <span className="text-xs text-muted-foreground">{o.whatsapp}</span>
          </button>
        ))}
      </aside>

      <section className="flex-1 overflow-y-auto p-6">
        {!selected ? (
          <p className="text-muted-foreground">একটি অর্ডার সিলেক্ট করুন।</p>
        ) : (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-xl font-semibold"># {selected.name}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  value={selected.status}
                  onValueChange={(v) => changeStatus(v as Order["status"])}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">নতুন</SelectItem>
                    <SelectItem value="in_progress">কাজ চলছে</SelectItem>
                    <SelectItem value="done">সম্পন্ন</SelectItem>
                  </SelectContent>
                </Select>
                <CopyButton value={copyAll(selected)} label="সব কপি" />
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={startEdit}>
                    ✏️ এডিট
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit}>
                      💾 সেভ
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(false)}
                    >
                      বাতিল
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {sections.map((section) => (
              <div key={section}>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-2">
                  {section}
                </div>
                <div className="rounded-lg border divide-y">
                  {FIELDS.filter((f) => f.section === section).map(
                    ({ key, label, long, image }) => {
                      const rawVal = (selected[key] as string) ?? "";
                      const val = getDisplayValue(selected, key);
                      return (
                        <div
                          key={key}
                          className="flex items-start justify-between gap-3 px-4 py-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-muted-foreground">
                              {label}
                            </div>
                            {editing ? (
                              image ? (
                                <FileUpload
                                  folder={
                                    key === "logo_url" ? "logos" : "products"
                                  }
                                  multiple={key === "product_images_url"}
                                  value={(editData[key] as string) ?? ""}
                                  onChange={(u) =>
                                    setEditData((p) => ({ ...p, [key]: u }))
                                  }
                                />
                              ) : long ? (
                                <Textarea
                                  className="mt-1 text-sm"
                                  rows={2}
                                  value={(editData[key] as string) ?? ""}
                                  onChange={(e) =>
                                    setEditData((p) => ({
                                      ...p,
                                      [key]: e.target.value,
                                    }))
                                  }
                                />
                              ) : (
                                <Input
                                  className="mt-1 text-sm h-8"
                                  value={(editData[key] as string) ?? ""}
                                  onChange={(e) =>
                                    setEditData((p) => ({
                                      ...p,
                                      [key]: e.target.value,
                                    }))
                                  }
                                />
                              )
                            ) : image ? (
                              <ImagePreview value={rawVal} />
                            ) : (
                              <div className="text-sm whitespace-pre-wrap">
                                {val}
                              </div>
                            )}
                          </div>
                          {!editing && !image && val && val !== "—" && (
                            <CopyButton value={val} />
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ))}

            {/* নোট সেকশন — ছবি সহ */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">অ্যাডমিন নোট</h3>
              <div className="space-y-2">
                {notes.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    এখনো কোনো নোট নেই।
                  </p>
                )}
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-md border bg-muted/30 p-3 text-sm"
                  >
                    {n.content && (
                      <p className="whitespace-pre-wrap">{n.content}</p>
                    )}
                    {n.image_url && (
                      <a href={n.image_url} target="_blank" rel="noreferrer">
                        <img
                          src={n.image_url}
                          alt="note"
                          className="mt-2 max-h-48 rounded-md border object-contain"
                        />
                      </a>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleString("bn-BD")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 rounded-md border p-3">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="নোট লিখুন..."
                  rows={2}
                />
                <FileUpload
                  folder="notes"
                  value={newNoteImage}
                  onChange={(u) => setNewNoteImage(u)}
                />
                <Button
                  onClick={addNote}
                  disabled={!newNote.trim() && !newNoteImage}
                  size="sm"
                >
                  নোট যোগ করুন
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const variant =
    status === "done"
      ? "default"
      : status === "in_progress"
        ? "secondary"
        : "outline";
  return <Badge variant={variant as never}>{STATUS_LABEL[status]}</Badge>;
}
