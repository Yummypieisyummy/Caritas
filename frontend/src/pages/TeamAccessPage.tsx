import { Plus } from 'lucide-react';
import { useState } from 'react';
import InviteMemberModal from '../components/dashboard/InviteMemberModal';
import PendingInvitesList from '../components/dashboard/PendingInvitesList';
import TeamMemberList from '../components/dashboard/TeamMemberList';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { TeamInviteInput } from '../types/team';

const TeamAccessPage = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { user } = useAuth();
  const {
    teamQuery,
    inviteMutation,
    removeMemberMutation,
    revokeInviteMutation,
    teamMembers,
    pendingInvites,
  } = useTeamMembers();

  const currentMember = teamMembers.find((member) => member.id === user?.id);
  const currentUserRole = currentMember?.role;
  const currentUserIsAdmin = currentUserRole === 'admin';

  const handleInvite = async (input: TeamInviteInput) => {
    await inviteMutation.mutateAsync(input);
  };

  const handleRemoveMember = async (targetUserId: string) => {
    await removeMemberMutation.mutateAsync(targetUserId);
  };

  const handleRevokeInvite = async (inviteId: string) => {
    await revokeInviteMutation.mutateAsync(inviteId);
  };

  return (
    <main className="min-h-screen w-full flex p-6 flex-col items-center">
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Your Team</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage your organization's team and permissions.
          </p>
        </div>

        {currentUserIsAdmin && (
          <Button onClick={() => setIsInviteOpen(true)} variant="primary">
            <Plus strokeWidth={3} className="w-4 h-4 mr-2" />
            Invite members
          </Button>
        )}
      </div>

      <section className="flex flex-col gap-5 bg-white max-w-4xl w-full shadow-card-shadow p-8 rounded-2xl">
        {teamQuery.isPending && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}

        {teamQuery.isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load team access details.
          </div>
        )}

        {teamQuery.isSuccess && (
          <>
            <div>
              <h2 className="text-lg font-semibold mb-3">Active Members</h2>
              <TeamMemberList
                members={teamMembers}
                currentUserId={user?.id}
                currentUserRole={currentUserRole}
                onRemove={handleRemoveMember}
                isRemoving={removeMemberMutation.isPending}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Pending Invites</h2>
              <PendingInvitesList
                invites={pendingInvites}
                onRevoke={handleRevokeInvite}
                isRevoking={revokeInviteMutation.isPending}
              />
            </div>
          </>
        )}
      </section>

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSubmit={handleInvite}
      />
    </main>
  );
};

export default TeamAccessPage;
