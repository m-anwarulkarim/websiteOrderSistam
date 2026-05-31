"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import type { z } from "zod";

import { orderSchema } from "@/lib/order-schema";
import { normalizeWhatsapp } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload, type FileUploadHandle } from "@/components/file-upload";
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
import { DynamicLinkList } from "@/lib/dynamic-link-list";

type OrderFormValues = z.input<typeof orderSchema>;

type WebsiteType =
  | ""
  | "business"
  | "ecommerce"
  | "portfolio"
  | "blog"
  | "landing"
  | "other";

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

function SectionTitle({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border-l-4 border-primary pl-3 py-2 mt-6 mb-3">
      <span className="text-lg">{icon}</span>
      <h3 className="text-base font-semibold text-foreground">{children}</h3>
    </div>
  );
}

export default function OrderForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const logoRef = useRef<FileUploadHandle>(null);
  const productRef = useRef<FileUploadHandle>(null);

  const form = useForm({
    defaultValues,
    validators: { onSubmit: orderSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const supabase = createClient();

      const logoUrl =
        (await logoRef.current?.uploadPending()) ?? value.logo_url ?? "";

      const productUrls =
        (await productRef.current?.uploadPending()) ??
        value.product_images_url ??
        "";

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
        p_logo_url: logoUrl,
        p_brand_colors: value.brand_colors ?? "",
        p_tagline: value.tagline ?? "",
        p_website_type: value.website_type ?? "",
        p_page_count: value.page_count ?? "",
        p_reference_websites: value.reference_websites ?? "",
        p_special_features: value.special_features ?? "",
        p_about_us: value.about_us ?? "",
        p_services_list: value.services_list ?? "",
        p_product_images_url: productUrls,
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
      className="space-y-2"
    >
      {serverError && (
        <Alert
          variant="destructive"
          className="animate-in fade-in slide-in-from-top-2"
        >
          <AlertTitle>জমা দেওয়া যায়নি</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {/* ========== বেসিক তথ্য ========== */}
      <SectionTitle icon="📋">বেসিক তথ্য</SectionTitle>

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
                  className="transition-all focus:ring-2 focus:ring-primary/20"
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
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />

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
                className="transition-all focus:ring-2 focus:ring-primary/20"
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
                className="transition-all focus:ring-2 focus:ring-primary/20"
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
                  এই Gmail ও Password ব্যবহার করে আপনার ওয়েবসাইট তৈরি করা হবে।
                  আপনার তথ্য নিরাপদে ব্যবহার করা হবে।
                </FieldDescription>

                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={invalid}
                  placeholder="you@gmail.com"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
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
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {/* ========== ডোমেইন ========== */}
      <SectionTitle icon="🌐">ডোমেইন</SectionTitle>

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
                        className="transition-all focus:ring-2 focus:ring-primary/20"
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

      {/* ========== সোশ্যাল মিডিয়া ========== */}
      <SectionTitle icon="📱">সোশ্যাল মিডিয়া</SectionTitle>

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
                className="transition-all focus:ring-2 focus:ring-primary/20"
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
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="other_socials">
          {(field) => (
            <Field>
              <FieldLabel>অন্যান্য সোশ্যাল</FieldLabel>

              <DynamicLinkList
                value={field.state.value ?? ""}
                onChange={(value) => field.handleChange(value)}
                maxItems={3}
                withName
                namePlaceholder="যেমন: Instagram"
                urlPlaceholder="লিংক দিন"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {/* ========== ব্র্যান্ডিং ========== */}
      <SectionTitle icon="🎨">ব্র্যান্ডিং</SectionTitle>

      <FieldGroup>
        <form.Field name="logo_url">
          {(field) => (
            <Field>
              <FieldLabel>লোগো আপলোড করুন</FieldLabel>

              <FileUpload
                ref={logoRef}
                folder="logos"
                deferred
                value={field.state.value ?? ""}
                onChange={(url) => field.handleChange(url)}
              />

              <FieldDescription>সর্বোচ্চ ৫MB, PNG/JPG</FieldDescription>
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
                placeholder="যেমন: নীল, সাদা বা #1a73e8"
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {/* ========== ওয়েবসাইট সম্পর্কিত ========== */}
      <SectionTitle icon="🖥️">ওয়েবসাইট সম্পর্কিত</SectionTitle>

      <FieldGroup>
        <form.Field name="website_type">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                কী ধরনের ওয়েবসাইট চান
              </FieldLabel>

              <Select
                value={(field.state.value ?? "") as WebsiteType}
                onValueChange={(value) =>
                  field.handleChange(value as WebsiteType)
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
              <FieldLabel>রেফারেন্স ওয়েবসাইট</FieldLabel>

              <DynamicLinkList
                value={field.state.value ?? ""}
                onChange={(value) => field.handleChange(value)}
                maxItems={3}
                urlPlaceholder="https://example.com"
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
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {/* ========== কন্টেন্ট ========== */}
      <SectionTitle icon="📝">কন্টেন্ট</SectionTitle>

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
                className="transition-all focus:ring-2 focus:ring-primary/20"
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
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="product_images_url">
          {(field) => (
            <Field>
              <FieldLabel>প্রোডাক্ট ছবি আপলোড করুন</FieldLabel>

              <FileUpload
                ref={productRef}
                folder="products"
                multiple
                deferred
                value={field.state.value ?? ""}
                onChange={(url) => field.handleChange(url)}
              />

              <FieldDescription>
                একাধিক ছবি দিতে পারবেন, সর্বোচ্চ ৫MB প্রতিটা
              </FieldDescription>
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {/* ========== সময়সীমা ========== */}
      <SectionTitle icon="⏰">সময়সীমা</SectionTitle>

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
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit}
            size="lg"
            className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                জমা হচ্ছে...
              </span>
            ) : (
              "ফর্ম জমা দিন"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
