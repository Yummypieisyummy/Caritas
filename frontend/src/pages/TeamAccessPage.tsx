import InviteMemberModal from '../components/dashboard/InviteMemberModal';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { Plus, Search, Ellipsis } from 'lucide-react';
import { useState } from 'react';

const members = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: 'Feb 12, 2026',
    avatar: 'SJ',
  },
  {
    id: 2,
    name: 'Mark Cuban',
    email: 'mark@example.com',
    role: 'Member',
    status: 'Pending',
    lastActive: '-',
    avatar: 'MC',
  },
];

const TeamAccessPage = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <main className="min-h-screen w-full flex p-6 flex-col items-center justify-center">
      {/* Header */}
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

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      ></InviteMemberModal>

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

        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-filter-stroke">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Last Active
                </th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-filter-stroke hover:bg-gray-50"
                >
                  <td className="p-4">
                    {/* <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                        member.status === 'Active'
                          ? 'bg-accent-green'
                          : 'bg-gray-500'
                      }`}
                    >
                      {member.status}
                    </span> */}

                    {member.name}
                  </td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4">{member.role}</td>
                  <td className="p-4 text-text-muted">{member.status}</td>
                  <td className="p-4 text-text-muted">{member.lastActive}</td>
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
      </section>
    </main>
  );
};

export default TeamAccessPage;
