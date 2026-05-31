"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "./copy-button";

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
};

type Note = {
  id: string;
  order_id: string;
  content: string;
  created_at: string;
};

const STATUS_LABEL: Record<Order["status"], string> = {
  new: "নতুন",
  in_progress: "কাজ চলছে",
  done: "সম্পন্ন",
};

const FIELDS: { key: keyof Order; label: string }[] = [
  { key: "name", label: "নাম" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "domain_name", label: "ডোমেইন" },
  { key: "office_address", label: "ঠিকানা" },
  { key: "hotline", label: "হটলাইন" },
  { key: "fb_page", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "other_socials", label: "অন্যান্য সোশ্যাল" },
  { key: "gmail", label: "Gmail" },
  { key: "password", label: "Password" },
];

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

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  // নতুন order live-আপডেট
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

  // সিলেক্টেড order-এর নোট লোড
  useEffect(() => {
    if (!selectedId) return;
    supabase
      .from("notes")
      .select("*")
      .eq("order_id", selectedId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setNotes((data as Note[]) ?? []));
  }, [selectedId, supabase]);

  async function addNote() {
    if (!newNote.trim() || !selectedId) return;
    const { data } = await supabase
      .from("notes")
      .insert({ order_id: selectedId, content: newNote.trim() })
      .select()
      .single();
    if (data) setNotes((prev) => [...prev, data as Note]);
    setNewNote("");
  }

  async function changeStatus(status: Order["status"]) {
    if (!selected) return;
    await supabase.from("orders").update({ status }).eq("id", selected.id);
    setOrders((prev) =>
      prev.map((o) => (o.id === selected.id ? { ...o, status } : o)),
    );
  }

  function copyAll(o: Order) {
    const lines = [
      `নাম: ${o.name}`,
      `WhatsApp: ${o.whatsapp}`,
      `ডোমেইন: ${o.domain_status === "have" ? (o.domain_name ?? "") : "নতুন লাগবে"}`,
      `ঠিকানা: ${o.office_address ?? ""}`,
      `হটলাইন: ${o.hotline ?? ""}`,
      `Facebook: ${o.fb_page ?? ""}`,
      `YouTube: ${o.youtube ?? ""}`,
      `অন্যান্য: ${o.other_socials ?? ""}`,
      `Gmail: ${o.gmail ?? ""}`,
      `Password: ${o.password ?? ""}`,
    ];
    return lines.join("\n");
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* বাম: চ্যানেল লিস্ট */}
      <aside className="w-72 shrink-0 overflow-y-auto border-r bg-muted/30">
        <div className="p-3 text-sm font-medium text-muted-foreground">
          অর্ডার ({orders.length})
        </div>
        {orders.map((o) => (
          <button
            key={o.id}
            onClick={() => setSelectedId(o.id)}
            className={`flex w-full flex-col items-start gap-1 border-b px-3 py-2.5 text-left text-sm hover:bg-accent ${
              o.id === selectedId ? "bg-accent" : ""
            }`}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="truncate font-medium"># {o.name}</span>
              <StatusBadge status={o.status} />
            </span>
            <span className="text-xs text-muted-foreground">{o.whatsapp}</span>
          </button>
        ))}
      </aside>

      {/* ডান: ডিটেইল */}
      <section className="flex-1 overflow-y-auto p-6">
        {!selected ? (
          <p className="text-muted-foreground">একটি অর্ডার সিলেক্ট করুন।</p>
        ) : (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold"># {selected.name}</h2>
              <div className="flex items-center gap-2">
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
              </div>
            </div>

            {/* ফিল্ডগুলো — প্রতিটার পাশে কপি বাটন */}
            <div className="rounded-lg border divide-y">
              {FIELDS.map(({ key, label }) => {
                let val: string;
                if (key === "domain_name") {
                  val =
                    selected.domain_status === "have"
                      ? (selected.domain_name ?? "—")
                      : "নতুন ডোমেইন লাগবে";
                } else {
                  val = (selected[key] as string) ?? "—";
                }
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 px-4 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">
                        {label}
                      </div>
                      <div className="truncate text-sm">{val}</div>
                    </div>
                    {val && val !== "—" && <CopyButton value={val} />}
                  </div>
                );
              })}
            </div>

            {/* নোট সেকশন */}
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
                    <p className="whitespace-pre-wrap">{n.content}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleString("bn-BD")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="নোট লিখুন..."
                  rows={2}
                />
                <Button onClick={addNote} disabled={!newNote.trim()}>
                  যোগ করুন
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
