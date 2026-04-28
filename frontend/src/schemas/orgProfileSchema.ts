import { z } from 'zod';

const normalizePhoneInput = (value: string) =>
  value
    .replace(/[‐‑‒–—―]/g, '-')
    .replace(/\u200B/g, '')
    .trim();

const hasSelectedFile = (value: unknown) =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'length' in value &&
      typeof value.length === 'number' &&
      value.length > 0,
  );

const MAX_PROFILE_IMAGE_SIZE = 3 * 1024 * 1024;
const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const selectedFile = (value: unknown): File | null => {
  if (!hasSelectedFile(value)) {
    return null;
  }

  if (
    typeof value === 'object' &&
    value &&
    'item' in value &&
    typeof value.item === 'function'
  ) {
    return (value as FileList).item(0);
  }

  return (value as File[])[0] ?? null;
};

const optionalProfileImage = z
  .any()
  .optional()
  .refine(
    (value) => {
      const file = selectedFile(value);
      return !file || PROFILE_IMAGE_TYPES.includes(file.type);
    },
    { message: 'Upload a JPG, PNG, or WebP image.' },
  )
  .refine(
    (value) => {
      const file = selectedFile(value);
      return !file || file.size <= MAX_PROFILE_IMAGE_SIZE;
    },
    { message: 'Image must be 3MB or smaller.' },
  );

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => !value || /^(https?:\/\/|data:image\/).+/i.test(value), {
    message: 'Please enter a full URL starting with http:// or https://',
  })
  .optional();

export const orgProfileSchema = z.object({
  about: z
    .string()
    .trim()
    .min(10, 'About section must be at least 10 characters')
    .max(1000, 'About section is too long'),
  phone: z
    .string()
    .transform(normalizePhoneInput)
    .pipe(
      z
        .string()
        .regex(/^[\d\s()+-]{10,}$/, 'Please enter a valid phone number'),
    ),
  public_email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Please enter a valid public email.')),
  pfp_url: optionalUrl,
  banner_url: optionalUrl,
  pfp_file: optionalProfileImage,
  banner_file: optionalProfileImage,
});

export const setupVerificationSchema = orgProfileSchema
  .extend({
    documents: z.any().optional(),
    documents_link: optionalUrl,
  })
  .superRefine((values, ctx) => {
    const hasFile = hasSelectedFile(values.documents);
    const hasLink = Boolean(values.documents_link?.trim());

    if (!hasFile && !hasLink) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['documents'],
        message: 'Upload a document or provide a verification link.',
      });
    }
  });

export type OrgProfileFormValues = z.infer<typeof orgProfileSchema>;
export type SetupVerificationFormValues = z.infer<
  typeof setupVerificationSchema
>;
