import { CircleArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
import OrgAbout from '../components/organization-profile/OrgAbout';
import OrgHeader from '../components/organization-profile/OrgHeader';
import OrgPostFeed from '../components/organization-profile/OrgPostFeed';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useOrgProfile } from '../hooks/useOrgProfile';

const OrganizationProfilePage = () => {
  const { id: orgId } = useParams();
  const { data, isLoading, isError } = useOrgProfile(orgId);

  if (!orgId) {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6">
        <p className="text-text-muted">Organization ID was not provided.</p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6">
        <Spinner />
      </main>
    );
  }

  if (isError || !data?.organization) {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6">
        <section className="max-w-md rounded-xl bg-white p-6 text-center shadow-card-shadow">
          <h1 className="text-2xl font-semibold">Organization unavailable</h1>
          <p className="mt-2 text-text-muted">
            We could not load this organization profile. Please try again later.
          </p>
          <Button
            as="link"
            to="/directory"
            variant="primary"
            className="mt-5 gap-2"
          >
            <CircleArrowLeft className="h-5 w-5" />
            Back to Directory
          </Button>
        </section>
      </main>
    );
  }

  const { organization, activePosts } = data;

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-org-bg px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div>
          <Button
            as="link"
            to="/directory"
            variant="textOnly"
            className="gap-2 text-accent-green"
          >
            <CircleArrowLeft className="h-5 w-5" />
            Back to Directory
          </Button>
        </div>

        <OrgHeader organization={organization} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.6fr)]">
          <OrgAbout organization={organization} />
          <OrgPostFeed posts={activePosts} />
        </div>
      </div>
    </main>
  );
};

export default OrganizationProfilePage;
