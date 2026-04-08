import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner'; // Adjust path if needed
import ConfirmActionModal from '../components/dashboard/ConfirmActionModal';
import { Search, Ellipsis, Pencil, Trash2, PowerOff, Play } from 'lucide-react';
import { useOrgPosts } from '../hooks/useOrgPosts';
import { formatUIDate } from '../utils/formatDate';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostResponse } from '../types/posts';

const ManagePostsPage = () => {
  const { orgPosts, isPending, isError, updatePostStatus, deletePost } =
    useOrgPosts();
  const navigate = useNavigate();

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<PostResponse | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleStatusToggle = async (
    id: string,
    currentStatus: 'active' | 'closed',
  ) => {
    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      await updatePostStatus({ postId: id, newStatus });
      setOpenDropdownId(null);
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete.id);
      setPostToDelete(null);
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

  return (
    <main className="min-h-screen w-full flex p-6 flex-col items-center justify-center relative">
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Manage Posts</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage your organization's posts.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            as="link"
            to="/dashboard/posts/create"
            size="md"
            variant="primary"
          >
            Create Post
          </Button>
        </div>
      </div>

      <section className="w-full max-w-4xl bg-white rounded-2xl p-8 shadow-card-shadow">
        <div className="flex gap-6 mb-6 justify-between items-center">
          <div className="flex gap-2">
            <Select
              options={['All', 'Past-week', 'Past-month']}
              variant="gray"
            />
            <Select options={['Most recent', 'Oldest']} variant="gray" />
          </div>

          <div className="relative flex items-center w-80">
            <Input id="searchPosts" placeholder="Search" variant="secondary" />
            <Button as="button" variant="icon" className="absolute right-0">
              <Search className="text-text-muted/80 w-5 h-5" />
            </Button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-filter-stroke">
              <th className="text-left py-3 px-4 font-semibold min-w-25">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold">Title</th>
              <th className="text-left py-3 px-4 font-semibold">Stats</th>
              <th className="text-left py-3 px-4 font-semibold">Start Date</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* 1. LOADING STATE */}
            {isPending && (
              <tr>
                <td colSpan={5} className="py-12">
                  <div className="flex flex-col items-center justify-center text-text-muted gap-3">
                    <Spinner />
                    <span>Loading posts...</span>
                  </div>
                </td>
              </tr>
            )}

            {isError && !isPending && (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center text-red-500">
                    <span className="font-medium">Failed to load posts</span>
                    <span className="text-sm opacity-80 mt-1">
                      Please refresh the page to try again.
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {!isPending && !isError && orgPosts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-text-muted py-12">
                  No organization posts found.
                </td>
              </tr>
            )}

            {!isPending &&
              !isError &&
              orgPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-filter-stroke hover:bg-gray-50"
                >
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-medium capitalize ${
                        post.status === 'active'
                          ? 'bg-accent-green'
                          : 'bg-gray-500'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>

                  <td className="p-4 font-medium">{post.title}</td>

                  <td className="p-4">
                    {post.interested !== undefined && post.interested >= 0 && (
                      <span className="text-text-muted">
                        {post.interested} interested volunteers
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-text-muted">
                    {formatUIDate(post.date_start)}
                  </td>

                  <td className="p-4 text-center relative">
                    <Button
                      size="sm"
                      variant="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(
                          openDropdownId === post.id ? null : post.id,
                        );
                      }}
                    >
                      <Ellipsis
                        strokeWidth={1.5}
                        className="w-5 h-5 text-text-muted hover:text-text-base"
                      />
                    </Button>

                    {openDropdownId === post.id && (
                      <div className="absolute right-8 top-10 w-44 bg-white border border-filter-stroke rounded-xl shadow-lg z-10 py-2 flex flex-col">
                        <Button
                          variant="icon"
                          onClick={() =>
                            navigate(`/dashboard/posts/${post.id}/edit`)
                          }
                          className="w-full flex items-center justify-start gap-2"
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </Button>

                        <Button
                          variant="icon"
                          onClick={() =>
                            handleStatusToggle(post.id, post.status)
                          }
                          className="w-full flex items-center justify-start gap-2"
                        >
                          {post.status === 'active' ? (
                            <>
                              <PowerOff className="w-4 h-4 text-orange-500" />
                              Close Post
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 text-accent-green" />
                              Reactivate
                            </>
                          )}
                        </Button>

                        <Button
                          variant="icon"
                          onClick={() => {
                            setPostToDelete(post);
                            setOpenDropdownId(null);
                          }}
                          className="w-full flex items-center justify-start gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      <ConfirmActionModal
        isOpen={postToDelete !== null}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Post?"
        description={
          postToDelete
            ? `Are you sure you want to permanently delete "${postToDelete.title}"? This action cannot be undone.`
            : ''
        }
        confirmText="Yes, Delete"
        submittingText="Deleting..."
      />
    </main>
  );
};

export default ManagePostsPage;
