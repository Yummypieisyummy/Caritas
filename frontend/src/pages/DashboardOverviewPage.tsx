import Button from '../components/ui/Button';

const DashboardOverviewPage = () => {
  const stats = {
    totalPosts: 24,
    pendingPosts: 3,
    teamMembers: 8,
  };

  return (
    <main className="min-h-screen w-full flex p-6 flex-col items-center justify-center">
      <div className="w-full max-w-3xl flex flex-col mb-6 text-center">
        <h1 className="text-3xl font-semibold">Welcome, Habitat Restore</h1>
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
