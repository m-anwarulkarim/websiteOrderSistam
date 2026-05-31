import * as z from "zod";

export const orderSchema = z
  .object({
    // === বেসিক তথ্য ===
    name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে।"),
    whatsapp: z
      .string()
      .min(6, "সঠিক WhatsApp নাম্বার দিন।")
      .regex(/[0-9]/, "নাম্বারে সংখ্যা থাকতে হবে।"),
    domain_status: z.enum(["have", "need"], {
      message: "ডোমেইন আছে নাকি লাগবে সিলেক্ট করুন।",
    }),
    domain_name: z.string().optional(),
    office_address: z.string().optional(),
    hotline: z.string().optional(),

    // === সোশ্যাল ও অ্যাকাউন্ট ===
    fb_page: z.string().optional(),
    youtube: z.string().optional(),
    other_socials: z.string().optional(),
    gmail: z
      .string()
      .email("সঠিক Gmail/email দিন।")
      .optional()
      .or(z.literal("")),
    password: z.string().optional(),

    // === ব্র্যান্ডিং ===
    logo_url: z.string().optional(),
    brand_colors: z.string().optional(),
    tagline: z.string().optional(),

    // === ওয়েবসাইট সম্পর্কিত ===
    website_type: z
      .enum(["business", "ecommerce", "portfolio", "blog", "landing", "other"])
      .optional()
      .or(z.literal("")),
    page_count: z.string().optional(),
    reference_websites: z.string().optional(),
    special_features: z.string().optional(),

    // === কন্টেন্ট ===
    about_us: z.string().optional(),
    services_list: z.string().optional(),
    product_images_url: z.string().optional(),

    // === প্রজেক্ট ===
    budget: z
      .enum(["under_5k", "5k_10k", "10k_20k", "20k_50k", "50k_plus"])
      .optional()
      .or(z.literal("")),
    deadline: z.string().optional(),
  })
  .refine(
    (d) =>
      d.domain_status !== "have" || (d.domain_name?.trim().length ?? 0) > 0,
    { message: "আপনার ডোমেইন নামটি লিখুন।", path: ["domain_name"] },
  );

export type OrderInput = z.infer<typeof orderSchema>;
