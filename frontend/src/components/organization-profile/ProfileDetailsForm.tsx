import { useMemo, type ChangeEvent } from 'react';
import { Camera, ImageUp } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import Input from '../ui/Input';
import {
  OrgProfileFormValues,
  SetupVerificationFormValues,
} from '../../schemas/orgProfileSchema';

type ProfileFormContext = OrgProfileFormValues &
  Partial<Pick<SetupVerificationFormValues, 'documents' | 'documents_link'>>;

const createPreviewUrl = (file?: File) => {
  if (!file || typeof URL.createObjectURL !== 'function') {
    return '';
  }

  return URL.createObjectURL(file);
};

const ProfileDetailsForm = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<ProfileFormContext>();
  const [pfpUrl, bannerUrl, pfpFileList, bannerFileList] = useWatch({
    name: ['pfp_url', 'banner_url', 'pfp_file', 'banner_file'],
  });

  const pfpPreview = useMemo(() => {
    const file = pfpFileList?.[0];
    return file ? createPreviewUrl(file) : pfpUrl;
  }, [pfpFileList, pfpUrl]);

  const bannerPreview = useMemo(() => {
    const file = bannerFileList?.[0];
    return file ? createPreviewUrl(file) : bannerUrl;
  }, [bannerFileList, bannerUrl]);

  const aboutRegistration = register('about');
  const phoneRegistration = register('phone');
  const publicEmailRegistration = register('public_email');
  const profileImageRegistration = register('pfp_file');
  const bannerImageRegistration = register('banner_file');

  const handleAboutChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    void aboutRegistration.onChange(event);
    setValue('about', event.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    void phoneRegistration.onChange(event);
    setValue('phone', event.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handlePublicEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    void publicEmailRegistration.onChange(event);
    setValue('public_email', event.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleProfileImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    void profileImageRegistration.onChange(event);
    setValue('pfp_file', event.target.files, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleBannerImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    void bannerImageRegistration.onChange(event);
    setValue('banner_file', event.target.files, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="rounded-2xl bg-white p-8 shadow-card-shadow">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Public Profile Details</h2>
        <p className="mt-1 text-sm text-text-muted">
          These details appear on your public organization profile.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="about" className="text-sm font-medium">
              About
            </label>
            <textarea
              {...aboutRegistration}
              id="about"
              rows={6}
              onChange={handleAboutChange}
              className="resize-none rounded-xl border border-filter-stroke bg-gray-50 px-3 py-2 text-sm outline-none transition-all duration-200 placeholder:text-sm placeholder:text-text-muted hover:border-accent-green/50 focus:border-accent-green focus:ring-2 focus:ring-accent-green/10"
              placeholder="Tell volunteers about your mission, programs, and the community you serve."
            />
            {errors.about && (
              <span className="mt-1 text-sm text-red-500">
                {errors.about.message}
              </span>
            )}
          </div>
        </div>

        <Input
          {...phoneRegistration}
          id="phone"
          type="tel"
          label="Public Phone"
          placeholder="(555) 555-5555"
          variant="secondary"
          size="sm"
          onChange={handlePhoneChange}
          error={errors.phone?.message}
        />

        <Input
          {...publicEmailRegistration}
          id="public_email"
          type="email"
          label="Public Email"
          placeholder="volunteer@example.org"
          variant="secondary"
          size="sm"
          onChange={handlePublicEmailChange}
          error={errors.public_email?.message}
        />

        <p className="text-xs text-text-muted lg:col-start-2">
          This is the email shown to the public. It does not change your login
          email.
        </p>

        <input {...register('pfp_url')} type="hidden" />
        <input {...register('banner_url')} type="hidden" />

        <div className="flex flex-col gap-3">
          <label htmlFor="pfp_file" className="text-sm font-medium">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="pfp_file"
              className="group flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-filter-stroke bg-gray-100 transition-colors duration-200 hover:border-accent-green hover:bg-accent-green/5 focus-within:border-accent-green focus-within:ring-2 focus-within:ring-accent-green/10"
            >
              {pfpPreview ? (
                <img
                  src={pfpPreview}
                  alt=""
                  className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                />
              ) : (
                <Camera className="h-6 w-6 text-text-muted transition-colors duration-200 group-hover:text-accent-green" />
              )}
            </label>
            <input
              {...profileImageRegistration}
              id="pfp_file"
              data-testid="logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleProfileImageChange}
              className="sr-only"
            />
            <div className="min-w-0 text-sm text-text-muted">
              <p className="font-medium text-text-primary">
                Click to upload logo
              </p>
              <p>JPG, PNG, or WebP up to 3MB.</p>
              {errors.pfp_file && (
                <span className="mt-1 block text-sm text-red-500">
                  {errors.pfp_file.message?.toString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="banner_file" className="text-sm font-medium">
            Banner Image
          </label>
          <div className="flex flex-col gap-3">
            <label
              htmlFor="banner_file"
              className="group flex h-28 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-filter-stroke bg-gray-100 transition-colors duration-200 hover:border-accent-green hover:bg-accent-green/5 focus-within:border-accent-green focus-within:ring-2 focus-within:ring-accent-green/10"
            >
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt=""
                  className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-sm text-text-muted transition-colors duration-200 group-hover:text-accent-green">
                  <ImageUp className="h-6 w-6" />
                  <span className="font-medium">Click to upload banner</span>
                </div>
              )}
            </label>
            <input
              {...bannerImageRegistration}
              id="banner_file"
              data-testid="cover-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleBannerImageChange}
              className="sr-only"
            />
            {errors.banner_file && (
              <span className="text-sm text-red-500">
                {errors.banner_file.message?.toString()}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-text-muted lg:col-span-2">
          JPG, PNG, or WebP. Images appear on your public profile after saving.
        </p>
      </div>
    </section>
  );
};

export default ProfileDetailsForm;
