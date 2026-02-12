import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ManagePosts = () => {
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
    <article className="w-full max-w-4xl bg-white rounded-2xl my-auto p-8 shadow-card-shadow hover:shadow-card-hover transition-shadow duration-300 ease-in-out">
      <h2 className="font-semibold text-2xl mb-6">Manage Posts</h2>

      <div className="flex gap-4 mb-6">
        <Select options={['All', 'Past-week', 'Past-month']} />
        <Select options={['Filter', 'Most recent', 'Oldest']} />
        <Input id="searchPosts" placeholder="Search" variant="secondary" />
      </div>

      <div className="">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-filter-stroke">
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Title</th>
              <th className="text-left py-3 px-4 font-semibold">Stats</th>
              <th className="text-left py-3 px-4 font-semibold">Date Posted</th>
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
                  {/* <button className="text-text-muted hover:text-text-primary text-lg">
                    ⋯
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default ManagePosts;
