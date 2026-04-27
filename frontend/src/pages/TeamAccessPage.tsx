import InviteMemberModal from '../components/dashboard/InviteMemberModal';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { Plus, Search, Ellipsis, Users } from 'lucide-react'; // Added Users icon
import { useState } from 'react';
import { useTeamMember } from '../hooks/useTeamMembers';
import { formatUIDate } from '../utils/formatDate';

const TeamAccessPage = () => {
  const { teamMembers, addTeamMember } = useTeamMember();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <main className="min-h-screen w-full flex p-6 flex-col items-center justify-center">
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Your Team</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage your organization's team and permissions.
          </p>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setIsInviteOpen(true)} variant="primary">
            <Plus strokeWidth={3} className="w-4 h-4 mr-2" />
            Invite members
          </Button>
        </div>
      </div>

      <section className="flex flex-col justify-center gap-4 bg-white max-w-4xl w-full shadow-card-shadow p-8 rounded-2xl">
        <div className="flex gap-6 mb-6 justify-between items-center">
          <div className="flex gap-2">
            <Select
              options={['All roles', 'Admins', 'Members']}
              variant="gray"
            />
            <Select
              options={['All Status', 'Active', 'Pending', 'Deactivated']}
              variant="gray"
            />
          </div>

          <div className="relative flex items-center w-80">
            <Input id="searchPosts" placeholder="Search" variant="secondary" />
            <Button as="button" variant="icon" className="absolute right-0">
              <Search className="text-text-muted/80 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="w-full">
          {teamMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-accent-green rounded-xl bg-gray-50/50">
              <div className="bg-white p-3 rounded-full shadow-sm mb-4 border border-filter-stroke">
                <Users className="w-6 h-6 text-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No team members yet
              </h3>
              <p className="text-sm text-text-muted mb-6 max-w-sm">
                Build your organization by inviting your first team member.
                They'll receive an email link to join.
              </p>
              <Button variant="primary" onClick={() => setIsInviteOpen(true)}>
                <Plus strokeWidth={3} className="w-4 h-4 mr-2" />
                Invite a member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-filter-stroke">
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Date Added
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {teamMembers.map((member) => (
                    <tr
                      key={member.role}
                      className="border-b border-filter-stroke hover:bg-gray-50"
                    >
                      <td className="p-4">{member.email}</td>
                      <td className="p-4 capitalize">{member.role}</td>
                      <td className="p-4 text-text-muted capitalize">
                        {member.status}
                      </td>
                      <td className="p-4 text-text-muted">
                        {formatUIDate(member.invitedAt)}
                      </td>
                      <td className="p-4 text-center">
                        <Button size="sm" variant="icon">
                          <Ellipsis
                            strokeWidth={1.5}
                            className="w-5 h-5 text-text-muted"
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSubmit={addTeamMember}
      />
    </main>
  );
};

export default TeamAccessPage;
