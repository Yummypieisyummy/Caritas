import { FileText, HandHeart, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useOrgPosts } from '../hooks/useOrgPosts';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { PostResponse } from '../types/posts';
import { formatUIDate } from '../utils/formatDate';

const postTypeLabels: Record<PostResponse['post_type'], string> = {
  volunteer_request: 'Volunteer Request',
  volunteer_offer: 'Volunteer Offer',
  item_request: 'Item Request',
  item_offer: 'Item Offer',
};

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  helper?: string;
};

const StatCard = ({ label, value, icon, helper }: StatCardProps) => (
  <div className="bg-white shadow-card-shadow p-6 rounded-2xl flex flex-col gap-3">
    <div className="flex items-center justify-between gap-4">
      <span className="text-text-muted text-sm">{label}</span>
      <div className="text-text-green">{icon}</div>
    </div>
    <span className="text-3xl font-bold">{value}</span>
    {helper && <span className="text-xs text-text-muted">{helper}</span>}
  </div>
);

const DashboardOverviewPage = () => {
  const { org } = useAuth();
  const isOrgVerified = org?.verified === true;
  const { orgPosts, status: postsStatus } = useOrgPosts();
  const { teamQuery, teamMembers } = useTeamMembers();

  const activePosts = orgPosts.filter((post) => post.status === 'active');
  const volunteerRequests = orgPosts.filter(
    (post) => post.post_type === 'volunteer_request',
  );
  const recentPosts = [...orgPosts]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 3);

  const postsLoading = postsStatus === 'pending';
  const postsUnavailable = postsStatus === 'error';
  const teamCount =
    teamQuery.isPending || teamQuery.isError ? '—' : teamMembers.length;
  const totalPosts = postsLoading || postsUnavailable ? '—' : orgPosts.length;
  const activePostCount =
    postsLoading || postsUnavailable ? '—' : activePosts.length;
  const volunteerRequestCount =
    postsLoading || postsUnavailable ? '—' : volunteerRequests.length;

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 sm:p-6">
      {!isOrgVerified && (
        <section className="w-full max-w-5xl mb-8 rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 shadow-card-shadow">
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
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Button
                as="link"
                to="/dashboard/profile"
                variant="secondary"
                size="md"
                className="w-full sm:w-auto"
              >
                Manage Org Profile
              </Button>
              <Button
                as="link"
                to="/dashboard/setup-verification"
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
              >
                Complete Verification
              </Button>
            </div>
          </div>
        </section>
      )}

      <div className="w-full max-w-5xl flex flex-col mb-6">
        <h1 className="text-3xl font-semibold">
          Welcome, {org?.name ?? 'Organization'}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Here's a quick overview of your organization
        </p>
      </div>

      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Posts"
          value={totalPosts}
          icon={<FileText className="h-5 w-5" />}
          helper={postsUnavailable ? 'Available after verification' : undefined}
        />
        <StatCard
          label="Active Posts"
          value={activePostCount}
          icon={<FileText className="h-5 w-5" />}
          helper="Currently visible opportunities"
        />
        <StatCard
          label="Volunteer Requests"
          value={volunteerRequestCount}
          icon={<HandHeart className="h-5 w-5" />}
          helper="Posts asking for volunteer help"
        />
        <StatCard
          label="Team Members"
          value={teamCount}
          icon={<Users className="h-5 w-5" />}
          helper={teamQuery.isError ? 'Admin access required' : undefined}
        />
      </section>

      <section className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white shadow-card-shadow rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-medium text-lg">Recent Posts</h2>
            <Button
              as="link"
              to="/dashboard/posts"
              variant="textOnly"
              size="sm"
              className="text-text-green"
            >
              View All
            </Button>
          </div>

          {postsLoading && (
            <p className="text-sm text-text-muted">Loading posts...</p>
          )}

          {postsUnavailable && (
            <p className="text-sm text-text-muted">
              Post activity will appear after your organization is verified.
            </p>
          )}

          {!postsLoading && !postsUnavailable && recentPosts.length === 0 && (
            <p className="text-sm text-text-muted">
              No posts yet. Create your first opportunity when you're ready.
            </p>
          )}

          <div className="flex flex-col divide-y divide-filter-stroke">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-text-muted">
                    {postTypeLabels[post.post_type]} ·{' '}
                    {formatUIDate(post.created_at)}
                  </p>
                </div>
                <span className="w-fit rounded-xl bg-gray-50 px-3 py-1 text-xs font-medium capitalize text-text-muted">
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-white shadow-card-shadow rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-medium text-lg">Quick Actions</h2>
          <Button as="link" to="/dashboard/posts" variant="primary" size="lg">
            View All Posts
          </Button>
          <Button
            as="link"
            to="/dashboard/posts/create"
            variant="secondary"
            size="lg"
          >
            Create Post
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
        </aside>
      </section>
    </main>
  );
};

export default DashboardOverviewPage;
