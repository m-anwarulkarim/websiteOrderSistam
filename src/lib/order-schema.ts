import * as z from "zod"

export const orderSchema = z
  .object({
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
    fb_page: z.string().optional(),
    youtube: z.string().optional(),
    other_socials: z.string().optional(),
    gmail: z
      .string()
      .email("সঠিক Gmail/email দিন।")
      .optional()
      .or(z.literal("")),
    password: z.string().optional(),
  })
  // ডোমেইন "আছে" সিলেক্ট করলে domain_name বাধ্যতামূলক
  .refine(
    (d) => d.domain_status !== "have" || (d.domain_name?.trim().length ?? 0) > 0,
    { message: "আপনার ডোমেইন নামটি লিখুন।", path: ["domain_name"] }
  )

export type OrderInput = z.infer<typeof orderSchema>
