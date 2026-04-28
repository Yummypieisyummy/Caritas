import { MailX } from 'lucide-react';
import Button from '../ui/Button';
import { PendingInvite } from '../../types/team';
import { formatUIDate } from '../../utils/formatDate';

type PendingInvitesListProps = {
  invites: PendingInvite[];
  onRevoke: (inviteId: string) => Promise<void>;
  isRevoking?: boolean;
};

const PendingInvitesList = ({
  invites,
  onRevoke,
  isRevoking = false,
}: PendingInvitesListProps) => {
  if (!invites.length) {
    return (
      <div className="py-8 px-4 text-sm text-text-muted text-center border border-dashed border-filter-stroke rounded-xl bg-gray-50/50">
        No pending invites
      </div>
    );
  }

  return (
    <div className="app-scrollbar overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-filter-stroke">
            <th className="text-left py-3 px-4 font-semibold">Email</th>
            <th className="text-left py-3 px-4 font-semibold">Role</th>
            <th className="text-left py-3 px-4 font-semibold">Invited</th>
            <th className="text-left py-3 px-4 font-semibold">Expires</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {invites.map((invite) => (
            <tr
              key={invite.id}
              className="border-b border-filter-stroke hover:bg-gray-50"
            >
              <td className="p-4">{invite.email}</td>
              <td className="p-4 capitalize">{invite.role}</td>
              <td className="p-4 text-text-muted">
                {formatUIDate(invite.createdAt)}
              </td>
              <td className="p-4 text-text-muted">
                {formatUIDate(invite.expiresAt)}
              </td>
              <td className="p-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="text-red-600"
                    disabled={isRevoking}
                    onClick={() => onRevoke(invite.id)}
                  >
                    <MailX className="w-4 h-4 mr-2" />
                    Revoke
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingInvitesList;
