import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const DashboardOverviewPage = () => {
  const { org } = useAuth();
  const isOrgVerified = org?.verified === true;

  const stats = {
    totalPosts: 24,
    pendingPosts: 3,
    teamMembers: 8,
  };

  return (
    <main className="min-h-screen w-full flex p-6 flex-col items-center justify-center">
      {!isOrgVerified && (
        <section className="w-full max-w-4xl mb-8 rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 shadow-card-shadow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-amber-950">
                Action Required
              </h2>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                Your organization is currently in limited access mode. Please
                complete your organization profile and submit your verification
                documents to unlock full features.
              </p>
            </div>
            <Button
              as="link"
              to="/dashboard/setup-verification"
              variant="primary"
              size="md"
              className="shrink-0"
            >
              Complete Verification
            </Button>
          </div>
        </section>
      )}

      <div className="w-full max-w-3xl flex flex-col mb-6 text-center">
        <h1 className="text-3xl font-semibold">
          Welcome, {org?.name ?? 'Organization'}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Here's a quick overview of your organization
        </p>
      </div>

      <section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-card-shadow p-6 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-text-muted text-sm mb-2">Total Posts</span>
          <span className="text-2xl font-bold">{stats.totalPosts}</span>
        </div>

        <div className="bg-white shadow-card-shadow p-6 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-text-muted text-sm mb-2">Pending Posts</span>
          <span className="text-2xl font-bold">{stats.pendingPosts}</span>
        </div>

        <div className="bg-white shadow-card-shadow p-6 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-text-muted text-sm mb-2">Team Members</span>
          <span className="text-2xl font-bold">{stats.teamMembers}</span>
        </div>
      </section>

      <section className="w-full max-w-3xl bg-white shadow-card-shadow rounded-2xl p-6 flex flex-col gap-4 items-center justify-center">
        <h2 className="font-medium text-lg mb-2 text-center">Quick Actions</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button as="link" to="/dashboard/posts" variant="primary" size="lg">
            View All Posts
          </Button>
          <Button as="link" to="/dashboard/team" variant="secondary" size="lg">
            Manage Team
          </Button>
          <Button
            as="link"
            to="/dashboard/settings"
            variant="secondary"
            size="lg"
          >
            Organization Settings
          </Button>
        </div>
      </section>
    </main>
  );
};

export default DashboardOverviewPage;
