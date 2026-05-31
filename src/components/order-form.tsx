"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import type { z } from "zod";

import { orderSchema } from "@/lib/order-schema";
import { normalizeWhatsapp } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type OrderFormValues = z.input<typeof orderSchema>;

const defaultValues: OrderFormValues = {
  name: "",
  whatsapp: "",
  domain_status: "need",
  domain_name: "",
  office_address: "",
  hotline: "",
  fb_page: "",
  youtube: "",
  other_socials: "",
  gmail: "",
  password: "",
  logo_url: "",
  brand_colors: "",
  tagline: "",
  website_type: "",
  page_count: "",
  reference_websites: "",
  special_features: "",
  about_us: "",
  services_list: "",
  product_images_url: "",
  budget: "",
  deadline: "",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b pb-2 pt-4">
      <h3 className="text-base font-semibold">{children}</h3>
    </div>
  );
}

export default function OrderForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues,
    validators: { onSubmit: orderSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const supabase = createClient();

      const { error } = await supabase.rpc("create_order", {
        p_name: value.name,
        p_whatsapp: normalizeWhatsapp(value.whatsapp),
        p_domain_status: value.domain_status,
        p_domain_name: value.domain_name ?? "",
        p_office_address: value.office_address ?? "",
        p_hotline: value.hotline ?? "",
        p_fb_page: value.fb_page ?? "",
        p_youtube: value.youtube ?? "",
        p_other_socials: value.other_socials ?? "",
        p_gmail: value.gmail ?? "",
        p_password: value.password ?? "",
        p_logo_url: value.logo_url ?? "",
        p_brand_colors: value.brand_colors ?? "",
        p_tagline: value.tagline ?? "",
        p_website_type: value.website_type ?? "",
        p_page_count: value.page_count ?? "",
        p_reference_websites: value.reference_websites ?? "",
        p_special_features: value.special_features ?? "",
        p_about_us: value.about_us ?? "",
        p_services_list: value.services_list ?? "",
        p_product_images_url: value.product_images_url ?? "",
        p_budget: value.budget ?? "",
        p_deadline: value.deadline ?? "",
      });

      if (error) {
        if (error.message.includes("RATE_LIMIT")) {
          setServerError(
            "এই WhatsApp নাম্বার থেকে গত ২৪ ঘণ্টায় একটি ফর্ম জমা হয়েছে। অনুগ্রহ করে ২৪ ঘণ্টা পর আবার চেষ্টা করুন।",
          );
        } else {
          setServerError("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        }
        return;
      }
      router.push("/thank-you");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {serverError && (
        <Alert variant="destructive">
          <AlertTitle>জমা দেওয়া যায়নি</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {/* ========== সেকশন ১: বেসিক তথ্য ========== */}
      <SectionTitle>📋 বেসিক তথ্য</SectionTitle>
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>আপনার নাম *</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={invalid}
                  placeholder="যেমন: রকিবুল ইসলাম"
                />
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="whatsapp">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>WhatsApp নাম্বার *</FieldLabel>
                <Input
                  id={field.name}
                  inputMode="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={invalid}
                  placeholder="01XXXXXXXXX"
                />
                <FieldDescription>
                  এই নাম্বার দিয়েই ২৪ ঘণ্টায় একবার ফর্ম জমা দেওয়া যাবে।
                </FieldDescription>
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="office_address">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>অফিসের ঠিকানা</FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="পূর্ণ ঠিকানা লিখুন"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="hotline">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>হটলাইন নাম্বার</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="যেমন: 16xxx"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="gmail">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Gmail</FieldLabel>
                <FieldDescription>
                  এই Gmail এবং Password ব্যবহার করে আপনার জন্য ওয়েবসাইট তৈরি করা
                  হবে। ওয়েবসাইটের প্রয়োজনীয় সেটআপ, অ্যাকাউন্ট কানেকশন এবং
                  ডেভেলপমেন্ট কাজের জন্য এই তথ্যগুলো দরকার হবে। আপনার তথ্য
                  নিরাপদে ব্যবহার করা হবে ।
                </FieldDescription>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={invalid}
                  placeholder="you@gmail.com"
                />
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="সংশ্লিষ্ট অ্যাকাউন্টের পাসওয়ার্ড"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {/* ========== সেকশন ২: ডোমেইন ========== */}
      <SectionTitle>🌐 ডোমেইন</SectionTitle>
      <FieldGroup>
        <form.Field name="domain_status">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>ডোমেইন *</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as "have" | "need")
                  }
                >
                  <SelectTrigger id={field.name} aria-invalid={invalid}>
                    <SelectValue placeholder="সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="have">আমার ডোমেইন আছে</SelectItem>
                    <SelectItem value="need">নতুন ডোমেইন লাগবে</SelectItem>
                  </SelectContent>
                </Select>
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe selector={(s) => s.values.domain_status}>
          {(domainStatus) =>
            domainStatus === "have" ? (
              <form.Field name="domain_name">
                {(field) => {
                  const invalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name}>ডোমেইন নাম *</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={invalid}
                        placeholder="example.com"
                      />
                      {invalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            ) : null
          }
        </form.Subscribe>
      </FieldGroup>

      {/* ========== সেকশন ৩: সোশ্যাল মিডিয়া ========== */}
      <SectionTitle>📱 সোশ্যাল মিডিয়া</SectionTitle>
      <FieldGroup>
        <form.Field name="fb_page">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Facebook পেজ</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="youtube">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>YouTube</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://youtube.com/@..."
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="other_socials">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>অন্যান্য সোশ্যাল</FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Instagram, TikTok ইত্যাদি (প্রতি লাইনে একটি)"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {/* ========== সেকশন ৪: ব্র্যান্ডিং ========== */}
      <SectionTitle>🎨 ব্র্যান্ডিং</SectionTitle>
      <FieldGroup>
        <form.Field name="logo_url">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>লোগো (লিংক)</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Google Drive / Dropbox লিংক"
              />
              <FieldDescription>
                লোগো ফাইল Google Drive বা Dropbox-এ আপলোড করে শেয়ারেবল লিংক
                দিন।
              </FieldDescription>
            </Field>
          )}
        </form.Field>

        <form.Field name="brand_colors">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>ব্র্যান্ড কালার</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="যেমন: নীল, সাদা বা #1a73e8, #ffffff"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {/* ========== সেকশন ৫: ওয়েবসাইট সম্পর্কিত ========== */}
      <SectionTitle>🖥️ ওয়েবসাইট সম্পর্কিত</SectionTitle>
      <FieldGroup>
        <form.Field name="website_type">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                কী ধরনের ওয়েবসাইট চান
              </FieldLabel>
              <Select
                value={field.state.value ?? ""}
                onValueChange={(v) =>
                  field.handleChange(v as OrderFormValues["website_type"])
                }
              >
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="সিলেক্ট করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">ব্যবসায়িক</SelectItem>
                  <SelectItem value="ecommerce">ই-কমার্স</SelectItem>
                  <SelectItem value="portfolio">পোর্টফোলিও</SelectItem>
                  <SelectItem value="blog">ব্লগ</SelectItem>
                  <SelectItem value="landing">ল্যান্ডিং পেজ</SelectItem>
                  <SelectItem value="other">অন্যান্য</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>

        <form.Field name="reference_websites">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>রেফারেন্স ওয়েবসাইট</FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="এমন কোনো সাইটের লিংক যেটা আপনার পছন্দ (প্রতি লাইনে একটি)"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="special_features">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>স্পেশাল ফিচার</FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="অনলাইন পেমেন্ট, বুকিং সিস্টেম, লাইভ চ্যাট ইত্যাদি"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {/* ========== সেকশন ৬: কন্টেন্ট ========== */}
      <SectionTitle>📝 কন্টেন্ট</SectionTitle>
      <FieldGroup>
        <form.Field name="about_us">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                About Us / কোম্পানি সম্পর্কে
              </FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={4}
                placeholder="আপনার কোম্পানি/ব্যবসা সম্পর্কে সংক্ষেপে লিখুন"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="services_list">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                সার্ভিস / প্রোডাক্ট লিস্ট
              </FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
                placeholder="আপনার সেবা বা পণ্যের তালিকা"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="product_images_url">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>প্রোডাক্ট ছবি (লিংক)</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Google Drive ফোল্ডার লিংক"
              />
              <FieldDescription>
                ছবিগুলো একটা ফোল্ডারে রেখে শেয়ারেবল লিংক দিন।
              </FieldDescription>
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {/* ========== সেকশন ৭: বাজেট ও সময় ========== */}
      <SectionTitle> সময়সীমা</SectionTitle>
      <FieldGroup>
        <form.Field name="deadline">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>ডেডলাইন / কতদিনে চান</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="যেমন: ১৫ দিন বা ১ মাস"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit} className="w-full">
            {isSubmitting ? "জমা হচ্ছে..." : "ফর্ম জমা দিন"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
