import { Trash2, Users } from 'lucide-react';
import Button from '../ui/Button';
import { TeamMember, TeamRole } from '../../types/team';
import { formatUIDate } from '../../utils/formatDate';

type TeamMemberListProps = {
  members: TeamMember[];
  currentUserId?: string;
  currentUserRole?: TeamRole;
  onRemove: (targetUserId: string) => Promise<void>;
  isRemoving?: boolean;
};

const TeamMemberList = ({
  members,
  currentUserId,
  currentUserRole,
  onRemove,
  isRemoving = false,
}: TeamMemberListProps) => {
  if (!members.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-accent-green rounded-xl bg-gray-50/50">
        <div className="bg-white p-3 rounded-full shadow-sm mb-4 border border-filter-stroke">
          <Users className="w-6 h-6 text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No team members yet
        </h3>
        <p className="text-sm text-text-muted max-w-sm">
          Build your organization by inviting your first team member.
        </p>
      </div>
    );
  }

  const currentUserIsAdmin = currentUserRole === 'admin';

  return (
    <div className="app-scrollbar overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-filter-stroke">
            <th className="text-left py-3 px-4 font-semibold">Email</th>
            <th className="text-left py-3 px-4 font-semibold">Role</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-left py-3 px-4 font-semibold">Date Added</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => {
            const canRemove =
              currentUserIsAdmin &&
              member.role === 'member' &&
              member.id !== currentUserId;

            return (
              <tr
                key={member.id}
                className="border-b border-filter-stroke hover:bg-gray-50"
              >
                <td className="p-4">{member.email}</td>
                <td className="p-4 capitalize">{member.role}</td>
                <td className="p-4 text-text-muted capitalize">
                  {member.status}
                </td>
                <td className="p-4 text-text-muted">
                  {formatUIDate(member.createdAt)}
                </td>
                <td className="p-4">
                  <div className="flex justify-end">
                    {canRemove && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="text-red-600"
                        disabled={isRemoving}
                        onClick={() => onRemove(member.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMemberList;
