"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

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

export default function OrderForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      whatsapp: "",
      domain_status: "" as "have" | "need" | "",
      domain_name: "",
      office_address: "",
      hotline: "",
      fb_page: "",
      youtube: "",
      other_socials: "",
      gmail: "",
      password: "",
    },
    validatorAdapter: zodValidator(),
    validators: { onSubmit: orderSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const supabase = createClient();

      const { error } = await supabase.rpc("create_order", {
        p_name: value.name,
        p_whatsapp: normalizeWhatsapp(value.whatsapp),
        p_domain_status: value.domain_status,
        p_domain_name: value.domain_name,
        p_office_address: value.office_address,
        p_hotline: value.hotline,
        p_fb_page: value.fb_page,
        p_youtube: value.youtube,
        p_other_socials: value.other_socials,
        p_gmail: value.gmail,
        p_password: value.password,
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
      className="space-y-6"
    >
      {serverError && (
        <Alert variant="destructive">
          <AlertTitle>জমা দেওয়া যায়নি</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        {/* নাম */}
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
                  placeholder="যেমন: রফিকুল ইসলাম"
                />
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* WhatsApp */}
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

        {/* ডোমেইন dropdown */}
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

        {/* domain_name — শুধু "আছে" হলে দেখাবে (conditional) */}
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
                        value={field.state.value}
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

        {/* অফিসের ঠিকানা */}
        <form.Field name="office_address">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>অফিসের ঠিকানা</FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="পূর্ণ ঠিকানা লিখুন"
              />
            </Field>
          )}
        </form.Field>

        {/* হটলাইন */}
        <form.Field name="hotline">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>হটলাইন নাম্বার</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="যেমন: 16xxx"
              />
            </Field>
          )}
        </form.Field>

        {/* FB Page */}
        <form.Field name="fb_page">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Facebook পেজ লিংক</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </Field>
          )}
        </form.Field>

        {/* YouTube */}
        <form.Field name="youtube">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>YouTube লিংক</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://youtube.com/@..."
              />
            </Field>
          )}
        </form.Field>

        {/* অন্যান্য সোশ্যাল */}
        <form.Field name="other_socials">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                অন্যান্য সোশ্যাল লিংক
              </FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Instagram, TikTok, LinkedIn ইত্যাদি (প্রতি লাইনে একটি)"
              />
            </Field>
          )}
        </form.Field>

        {/* Gmail */}
        <form.Field name="gmail">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Gmail</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
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

        {/* Password */}
        <form.Field name="password">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="সংশ্লিষ্ট অ্যাকাউন্টের পাসওয়ার্ড"
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
