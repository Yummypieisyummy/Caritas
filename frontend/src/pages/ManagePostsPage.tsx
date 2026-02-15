import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Search } from 'lucide-react';

const ManagePostsPage = () => {
  const posts = [
    {
      id: 1,
      status: 'Active',
      title: 'Stocking, organizing...',
      volunteers: 5,
      datePosted: 'Feb 12, 2026',
    },
    {
      id: 2,
      status: 'Draft',
      title: 'Habitat Restore...',
      datePosted: 'Feb 12, 2026',
    },
    {
      id: 3,
      status: 'Active',
      title: 'Food Bank',
      volunteers: 5,
      datePosted: 'Feb 12, 2026',
    },
  ];

  return (
    <main className="min-h-screen w-full flex p-6 flex-col items-center justify-center">
      {/* <section className="flex items-center justify-between w-full border-b border-nav-stroke px-8 py-4">
        <p className="font-medium text-lg">Dashboard {'>'} Posts</p>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full w-10 h-10 shadow-md"></div>
          <Button
            as="link"
            to="/dashboard/posts/create"
            size="lg"
            variant="primary"
          >
            Create Post
          </Button>
        </div>
      </section> */}

      <section className="w-full max-w-4xl bg-white rounded-2xl my-8 p-8 shadow-card-shadow hover:shadow-card-hover transition-shadow duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-2xl ">Manage Posts</h2>
          <Button
            as="link"
            to="/dashboard/posts/create"
            size="md"
            variant="primary"
          >
            Create Post
          </Button>
        </div>

        <div className="flex gap-6 mb-6 justify-between items-center">
          <div className="flex gap-2">
            <Select options={['All', 'Past-week', 'Past-month']} />
            <Select options={['Filter', 'Most recent', 'Oldest']} />
          </div>

          <div className="relative w-80">
            <Input id="searchPosts" placeholder="Search" variant="secondary" />
            <Button
              as="button"
              variant="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Search className="text-text-muted/80 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-filter-stroke">
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Title</th>
                <th className="text-left py-3 px-4 font-semibold">Stats</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Date Posted
                </th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-filter-stroke hover:bg-gray-50"
                >
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                        post.status === 'Active'
                          ? 'bg-accent-green'
                          : 'bg-gray-500'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4">{post.title}</td>
                  <td className="p-4">
                    {post.volunteers !== undefined && post.volunteers >= 0 && (
                      <span> {post.volunteers} interested volunteers</span>
                    )}
                  </td>
                  <td className="p-4 text-text-muted">{post.datePosted}</td>
                  <td className="p-4 text-center">
                    <Button
                      size="sm"
                      variant="icon"
                      className="flex items-center"
                    >
                      ...
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

export default ManagePostsPage;
