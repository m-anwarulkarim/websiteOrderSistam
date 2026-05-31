"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LinkItem = { name?: string; url: string };

type Props = {
  value: string;
  onChange: (json: string) => void;
  maxItems?: number;
  withName?: boolean;
  namePlaceholder?: string;
  urlPlaceholder?: string;
};

function parse(val: string): LinkItem[] {
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}

export function DynamicLinkList({
  value,
  onChange,
  maxItems = 3,
  withName = false,
  namePlaceholder = "নাম",
  urlPlaceholder = "লিংক দিন",
}: Props) {
  const items = parse(value);

  function update(newItems: LinkItem[]) {
    onChange(newItems.length > 0 ? JSON.stringify(newItems) : "");
  }

  function add() {
    if (items.length >= maxItems) return;
    update([...items, withName ? { name: "", url: "" } : { url: "" }]);
  }

  function remove(idx: number) {
    update(items.filter((_, i) => i !== idx));
  }

  function set(idx: number, field: "name" | "url", val: string) {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [field]: val };
    update(copy);
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {withName && (
            <Input
              value={item.name ?? ""}
              onChange={(e) => set(i, "name", e.target.value)}
              placeholder={namePlaceholder}
              className="w-1/3"
            />
          )}
          <Input
            value={item.url}
            onChange={(e) => set(i, "url", e.target.value)}
            placeholder={urlPlaceholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(i)}
            className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            ✕
          </Button>
        </div>
      ))}
      {items.length < maxItems && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          className="text-xs"
        >
          + যোগ করুন
        </Button>
      )}
    </div>
  );
}
