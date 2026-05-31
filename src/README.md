# ওয়েবসাইট অর্ডার সিস্টেম

ক্লায়েন্ট একটা ফর্ম ফিল করে → অ্যাডমিন প্যানেলে Discord-স্টাইল চ্যানেল তৈরি হয় → অ্যাডমিন
সব তথ্য ১ ক্লিকে কপি করতে পারে ও নোট রাখতে পারে। একই WhatsApp নাম্বার থেকে ২৪ ঘণ্টায়
একবারই ফর্ম জমা দেওয়া যায়।

**স্ট্যাক:** Next.js (App Router) · Shadcn UI · Tailwind · TanStack Form · Supabase · Vercel

---

## ১. বেস প্রজেক্ট তৈরি

```bash
npx create-next-app@latest website-order-system
# TypeScript: Yes, Tailwind: Yes, App Router: Yes, src dir: No, import alias: @/*

cd website-order-system
npx shadcn@latest init        # base color বেছে নিন (যেমন Neutral)
```

## ২. দরকারি প্যাকেজ ও Shadcn কম্পোনেন্ট

```bash
# Supabase + Form
npm install @supabase/ssr @supabase/supabase-js @tanstack/react-form @tanstack/zod-form-adapter zod

# Shadcn components
npx shadcn@latest add button input textarea select field alert card badge
```

## ৩. এই ফোল্ডারের ফাইলগুলো কপি করুন

জেনারেট হওয়া প্রজেক্টের ভেতরে নিচের ফাইল/ফোল্ডারগুলো বসান (যা আছে তার সাথে merge করুন):

```
lib/utils.ts                      ← cn() + normalizeWhatsapp() (পুরোনোটা replace করুন)
lib/order-schema.ts
lib/supabase/client.ts
lib/supabase/server.ts
middleware.ts
app/page.tsx                      ← পাবলিক ফর্ম পেজ (replace করুন)
app/thank-you/page.tsx
app/admin/login/page.tsx
app/admin/(dashboard)/layout.tsx  ← auth গার্ড
app/admin/(dashboard)/page.tsx    ← ড্যাশবোর্ড
components/order-form.tsx
components/admin-dashboard.tsx
components/copy-button.tsx
components/logout-button.tsx
```

## ৪. Supabase সেটআপ

1. https://supabase.com এ একটা প্রজেক্ট তৈরি করুন।
2. **SQL Editor** খুলে `supabase/schema.sql` ফাইলের পুরো কোড paste করে **Run** করুন।
   (টেবিল, RLS, ২৪ ঘণ্টার চেক ফাংশন, realtime — সব একসাথে সেট হবে।)
3. **Project Settings > API** থেকে URL ও anon key নিয়ে `.env.local` বানান:

```bash
cp .env.local.example .env.local
# তারপর মান বসান:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## ৫. অ্যাডমিন ইউজার তৈরি

Supabase Dashboard > **Authentication > Users > Add user** → ইমেইল ও পাসওয়ার্ড দিন
(Auto-confirm চালু রাখুন)। এটাই আপনার অ্যাডমিন লগইন।

> ক্লায়েন্টের কোনো লগইন লাগে না — শুধু অ্যাডমিন লগইন করবে `/admin` এ।

## ৬. চালান

```bash
npm run dev
```

- পাবলিক ফর্ম: `http://localhost:3000`
- অ্যাডমিন প্যানেল: `http://localhost:3000/admin` (লগইন লাগবে)

## ৭. Vercel এ ডিপ্লয়

```bash
# কোড GitHub এ push করুন, তারপর vercel.com এ import করুন
```

Vercel-এ একই দুটো environment variable (URL ও anon key) যোগ করতে ভুলবেন না।

---

## নিরাপত্তা নোট 🔒

- `orders`/`notes` টেবিলে **পাবলিক read বন্ধ** — শুধু লগইন করা অ্যাডমিন পড়তে পারে।
  পাবলিক শুধু `create_order()` ফাংশন দিয়ে ফর্ম জমা দিতে পারে।
- **পাসওয়ার্ড এখন সাধারণভাবে সংরক্ষিত** (আপনার পছন্দ অনুযায়ী)। পরে নিরাপত্তা বাড়াতে
  চাইলে `pgcrypto` দিয়ে encrypt করা যাবে — বলবেন, যোগ করে দেব।

## কীভাবে কাজ করে (সংক্ষেপে)

| অংশ                      | ফাইল                                                |
| ------------------------ | --------------------------------------------------- |
| ২৪ ঘণ্টার লিমিট          | `supabase/schema.sql` → `create_order()` ফাংশন      |
| নাম্বার নরমালাইজ         | `lib/utils.ts` → `normalizeWhatsapp()`              |
| Conditional ডোমেইন ফিল্ড | `components/order-form.tsx` → `form.Subscribe`      |
| Live নতুন অর্ডার         | `components/admin-dashboard.tsx` → realtime channel |
| ১ ক্লিক কপি              | `components/copy-button.tsx` + "সব কপি" বাটন        |
