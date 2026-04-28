import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Send } from 'lucide-react';
import ProfileDetailsForm from '../components/organization-profile/ProfileDetailsForm';
import VerificationDocsForm from '../components/organization-profile/VerificationDocsForm';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useUpdateOrgProfile } from '../hooks/useOrgSettings';
import { submitOrganizationVerificationRequest } from '../services/org.api';
import {
  SetupVerificationFormValues,
  setupVerificationSchema,
} from '../schemas/orgProfileSchema';
import {
  toOrgProfilePayload,
  toVerificationDocuments,
} from '../utils/orgProfileForm';

const SetupVerificationPage = () => {
  const { org } = useAuth();
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const updateOrgProfile = useUpdateOrgProfile(org?.id);

  const methods = useForm<SetupVerificationFormValues>({
    resolver: zodResolver(setupVerificationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      about: org?.about ?? '',
      phone: org?.contact_info?.phone ?? '',
      public_email:
        org?.contact_info?.public_email ??
        org?.contact_info?.email ??
        org?.email ??
        '',
      pfp_url: org?.pfp_url ?? '',
      banner_url: org?.banner_url ?? '',
      documents_link: '',
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<SetupVerificationFormValues> = async (
    values,
  ) => {
    if (!org?.id) {
      throw new Error('Organization ID not found. Please log in again.');
    }

    try {
      await updateOrgProfile.mutateAsync(await toOrgProfilePayload(values));
      const documents = await toVerificationDocuments(values);
      await submitOrganizationVerificationRequest(org.id, documents);
      setIsVerificationPending(true);
    } catch (error) {
      setError('root', {
        message:
          (error as Error).message || 'Failed to submit verification.',
      });
    }
  };

  if (!org?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-text-muted">Organization not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full p-6">
      <FormProvider {...methods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex w-full max-w-5xl flex-col gap-6"
        >
          <header>
            <h1 className="text-3xl font-semibold">
              Complete Organization Verification
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Add the public profile details volunteers will see, then submit
              documents for admin review.
            </p>
          </header>

          {isVerificationPending ? (
            <section className="flex items-start gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-900 shadow-card-shadow">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />
              <div>
                <h2 className="text-xl font-semibold">Verification Pending</h2>
                <p className="mt-1 text-sm">
                  Your profile and documents were submitted. Full dashboard
                  features will unlock once an admin approves your organization.
                </p>
              </div>
            </section>
          ) : (
            <>
              <ProfileDetailsForm />
              <VerificationDocsForm />

              {(updateOrgProfile.error || methods.formState.errors.root) && (
                <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {(updateOrgProfile.error as Error)?.message ||
                    methods.formState.errors.root?.message ||
                    'Failed to submit verification.'}
                </p>
              )}

              <div className="flex justify-end">
                <Button
                  as="button"
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || updateOrgProfile.isPending}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting || updateOrgProfile.isPending
                    ? 'Submitting...'
                    : 'Submit for Verification'}
                </Button>
              </div>
            </>
          )}
        </form>
      </FormProvider>
    </main>
  );
};

export default SetupVerificationPage;
