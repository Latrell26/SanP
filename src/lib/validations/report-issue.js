import { z } from "zod";

export const ISSUE_CATEGORIES = [
  { value: "roads", label: "Roads & Infrastructure" },
  { value: "waste", label: "Garbage & Waste Collection" },
  { value: "water", label: "Water Supply & Drainage" },
  { value: "electrical", label: "Streetlights & Electrical" },
  { value: "flooding", label: "Flooding" },
  { value: "lakes", label: "Lake & Waterway Concern" },
  { value: "safety", label: "Public Safety & Peace and Order" },
  { value: "other", label: "Other" },
];

export const URGENCY_LEVELS = [
  {
    value: "low",
    label: "Low",
    hint: "Can wait — no immediate risk",
  },
  {
    value: "medium",
    label: "Medium",
    hint: "Needs attention this week",
  },
  {
    value: "high",
    label: "High",
    hint: "Needs attention within 24–48 hours",
  },
  {
    value: "emergency",
    label: "Emergency",
    hint: "Danger to life or property right now",
  },
];

const PH_MOBILE_REGEX = /^(09\d{9}|\+639\d{9})$/;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const reportIssueSchema = z
  .object({
    isAnonymous: z.boolean().default(false),
    reporterName: z
      .string()
      .max(100, "Name must be 100 characters or fewer")
      .optional()
      .or(z.literal("")),
    contactNumber: z
      .string()
      .max(20, "Contact number looks too long")
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .max(150, "Email looks too long")
      .optional()
      .or(z.literal("")),
    barangay: z.string().min(1, "Please select your barangay"),
    category: z.string().min(1, "Please select an issue category"),
    urgency: z.enum(["low", "medium", "high", "emergency"], {
      errorMap: () => ({ message: "Please select how urgent this is" }),
    }),
    landmark: z
      .string()
      .min(5, "Add at least 5 characters so the crew can find the spot")
      .max(200, "Keep the location under 200 characters"),
    description: z
      .string()
      .min(20, "Please describe the issue in at least 20 characters")
      .max(1000, "Description must be 1000 characters or fewer"),
    photo: z.any().optional(),
    consent: z.literal(true, {
      errorMap: () => ({
        message: "You must confirm this report is accurate to submit",
      }),
    }),
  })
  .superRefine((data, ctx) => {
    // Reporter identity is only required when NOT filing anonymously.
    if (!data.isAnonymous) {
      if (!data.reporterName || data.reporterName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reporterName"],
          message: "Full name is required (at least 2 characters)",
        });
      }
      if (!data.contactNumber || !PH_MOBILE_REGEX.test(data.contactNumber.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["contactNumber"],
          message: "Enter a valid PH mobile number, e.g. 09171234567",
        });
      }
    }

    // Email is optional, but if provided it must be valid.
    if (data.email && data.email.trim().length > 0) {
      const check = z.string().email().safeParse(data.email.trim());
      if (!check.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: "Enter a valid email address",
        });
      }
    }

    // Photo is optional, but if attached it must meet size/type limits.
    const fileList = data.photo;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file.size > MAX_PHOTO_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["photo"],
          message: "Photo must be smaller than 5MB",
        });
      }
      if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["photo"],
          message: "Only JPG, PNG, or WEBP images are allowed",
        });
      }
    }
  });
