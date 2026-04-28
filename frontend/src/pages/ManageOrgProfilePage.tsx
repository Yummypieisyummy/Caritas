import { useEffect, useMemo } from 'react';
import {
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ExternalLink, Save } from 'lucide-react';
import ProfileDetailsForm from '../components/organization-profile/ProfileDetailsForm';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useOrgProfile } from '../hooks/useOrgProfile';
import { useUpdateOrgProfile } from '../hooks/useOrgSettings';
import {
  OrgProfileFormValues,
  orgProfileSchema,
} from '../schemas/orgProfileSchema';
import { toOrgProfilePayload } from '../utils/orgProfileForm';

const ManageOrgProfilePage = () => {
  const { org } = useAuth();
  const orgId = org?.id;
  const { data, isLoading, isError } = useOrgProfile(orgId);
  const updateOrgProfile = useUpdateOrgProfile(orgId);

  const defaultValues = useMemo<OrgProfileFormValues>(() => {
    const organization = data?.organization ?? org;
    const contact = organization?.contact_info;

    return {
      about: organization?.about ?? '',
      phone: contact?.phone ?? '',
      public_email:
        contact?.public_email ?? contact?.email ?? organization?.email ?? '',
      pfp_url: organization?.pfp_url ?? '',
      banner_url: organization?.banner_url ?? '',
      pfp_file: undefined,
      banner_file: undefined,
    };
  }, [data?.organization, org]);

  const methods = useForm<OrgProfileFormValues>({
    resolver: zodResolver(orgProfileSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit: SubmitHandler<OrgProfileFormValues> = async (values) => {
    const payload = await toOrgProfilePayload(values);

    try {
      const updatedOrg = await updateOrgProfile.mutateAsync(payload);
      reset({
        ...values,
        pfp_url: updatedOrg.pfp_url ?? '',
        banner_url: updatedOrg.banner_url ?? '',
        pfp_file: undefined,
        banner_file: undefined,
      });
    } catch (error) {
      console.error('[ManageOrgProfilePage] mutation failed', error);
    }
  };

  if (!orgId) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-text-muted">Organization not found.</p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Spinner />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <section className="max-w-md rounded-2xl bg-white p-8 text-center shadow-card-shadow">
          <h1 className="text-2xl font-semibold">Profile unavailable</h1>
          <p className="mt-2 text-text-muted">
            We could not load your organization profile. Please try again.
          </p>
        </section>
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
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">
                Edit Organization Profile
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Keep your public profile details current for volunteers.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                as="link"
                to={`/organization/${orgId}`}
                variant="secondary"
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Public Profile
              </Button>
              <Button
                as="button"
                type="button"
                variant="secondary"
                onClick={() => reset(defaultValues)}
                disabled={isSubmitting || updateOrgProfile.isPending}
              >
                Cancel
              </Button>
              <Button
                as="button"
                type="submit"
                variant="primary"
                disabled={isSubmitting || updateOrgProfile.isPending}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {updateOrgProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </header>

          <ProfileDetailsForm />

          {updateOrgProfile.isSuccess && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">Profile changes saved.</p>
            </div>
          )}

          {updateOrgProfile.error && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {(updateOrgProfile.error as Error).message ||
                'Failed to save organization profile.'}
            </p>
          )}
        </form>
      </FormProvider>
    </main>
  );
};

export default ManageOrgProfilePage;
