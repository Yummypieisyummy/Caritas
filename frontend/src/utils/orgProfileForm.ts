import { UpdateOrgProfileRequest } from '../services/org.api';
import {
  OrgProfileFormValues,
  SetupVerificationFormValues,
} from '../schemas/orgProfileSchema';

type VerificationDocuments =
  | {
      type: '501c3_or_equivalent';
      fileName: string;
      mimeType: string;
      size: number;
      dataUrl: string;
      submittedAt: string;
    }
  | {
      type: 'manual_verification_link';
      url: string;
      submittedAt: string;
    };

export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const optionalImageUrl = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const isFile = (value: unknown): value is File =>
  typeof File !== 'undefined' && value instanceof File;

const firstFile = (value: unknown): File | null => {
  if (!value) {
    return null;
  }

  if (isFile(value)) {
    return value;
  }

  if (typeof value !== 'object' || !('length' in value)) {
    return null;
  }

  const file =
    'item' in value && typeof value.item === 'function'
      ? value.item(0)
      : (value as File[])[0];

  return isFile(file) ? file : null;
};

export const toOrgProfilePayload = async (
  values: OrgProfileFormValues | SetupVerificationFormValues,
): Promise<UpdateOrgProfileRequest> => {
  const pfpFile = firstFile(values.pfp_file);
  const bannerFile = firstFile(values.banner_file);

  return {
    about: values.about.trim(),
    contact_info: {
      phone: values.phone.trim(),
      public_email: values.public_email.trim().toLowerCase(),
    },
    pfp_url: pfpFile
      ? await readFileAsDataUrl(pfpFile)
      : optionalImageUrl(values.pfp_url),
    banner_url: bannerFile
      ? await readFileAsDataUrl(bannerFile)
      : optionalImageUrl(values.banner_url),
  };
};

export const toVerificationDocuments = async (
  values: SetupVerificationFormValues,
): Promise<VerificationDocuments> => {
  const file = firstFile(values.documents);

  if (file) {
    return {
      type: '501c3_or_equivalent',
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      dataUrl: await readFileAsDataUrl(file),
      submittedAt: new Date().toISOString(),
    };
  }

  return {
    type: 'manual_verification_link',
    url: values.documents_link?.trim() ?? '',
    submittedAt: new Date().toISOString(),
  };
};
