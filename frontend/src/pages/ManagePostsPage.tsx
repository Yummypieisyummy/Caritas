import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ConfirmActionModal from '../components/dashboard/ConfirmActionModal';
import { Search, Ellipsis, Pencil, Trash2, PowerOff, Play } from 'lucide-react';
import { useOrgPosts } from '../hooks/useOrgPosts';
import { formatUIDate } from '../utils/formatDate';
import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostResponse } from '../types/posts';

const ManagePostsPage = () => {
  const { orgPosts, status, updatePostStatus, deletePost } = useOrgPosts();
  const navigate = useNavigate();

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [postToDelete, setPostToDelete] = useState<PostResponse | null>(null);

  useEffect(() => {
    const closeActionsMenu = () => {
      setOpenDropdownId(null);
      setDropdownPosition(null);
    };

    window.addEventListener('click', closeActionsMenu);
    window.addEventListener('resize', closeActionsMenu);
    window.addEventListener('scroll', closeActionsMenu, true);

    return () => {
      window.removeEventListener('click', closeActionsMenu);
      window.removeEventListener('resize', closeActionsMenu);
      window.removeEventListener('scroll', closeActionsMenu, true);
    };
  }, []);

  const toggleActionsMenu = (
    event: MouseEvent<HTMLButtonElement>,
    postId: string,
  ) => {
    event.stopPropagation();

    if (openDropdownId === postId) {
      setOpenDropdownId(null);
      setDropdownPosition(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 176;
    const menuHeight = 144;
    const margin = 8;
    const top =
      rect.bottom + menuHeight + margin > window.innerHeight
        ? Math.max(margin, rect.top - menuHeight - margin)
        : rect.bottom + margin;
    const left = Math.min(
      Math.max(margin, rect.right - menuWidth),
      window.innerWidth - menuWidth - margin,
    );

    setDropdownPosition({ top, left });
    setOpenDropdownId(postId);
  };

  const handleStatusToggle = async (
    id: string,
    currentStatus: 'active' | 'closed',
  ) => {
    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      await updatePostStatus({ postId: id, newStatus });
      setOpenDropdownId(null);
      setDropdownPosition(null);
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
    <main className="relative flex min-h-screen w-full flex-col items-center p-4 sm:p-6">
      <div className="mb-6 flex w-full max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            className="w-full sm:w-auto"
          >
            Create Post
          </Button>
        </div>
      </div>

      <section className="w-full max-w-4xl rounded-2xl bg-white p-4 shadow-card-shadow sm:p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              options={['All', 'Past-week', 'Past-month']}
              variant="gray"
            />
            <Select options={['Most recent', 'Oldest']} variant="gray" />
          </div>

          <div className="relative flex w-full items-center lg:w-80">
            <Input id="searchPosts" placeholder="Search" variant="secondary" />
            <Button as="button" variant="icon" className="absolute right-0">
              <Search className="text-text-muted/80 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="app-scrollbar overflow-x-auto">
          <table className="w-full min-w-[42rem] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-filter-stroke">
                <th className="text-left py-3 px-4 font-semibold min-w-25">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold">Title</th>
                <th className="text-left py-3 px-4 font-semibold">Stats</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Start Date
                </th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {status === 'pending' && (
                <tr>
                  <td colSpan={5} className="py-12">
                    <div className="flex flex-col items-center justify-center text-text-muted gap-3">
                      <Spinner />
                      <span>Loading posts...</span>
                    </div>
                  </td>
                </tr>
              )}

              {status === 'error' && (
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

              {status === 'success' && orgPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-text-muted py-12">
                    No organization posts found.
                  </td>
                </tr>
              )}

              {status === 'success' &&
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
                      {post.interested !== undefined &&
                        post.interested >= 0 && (
                          <span className="text-text-muted">
                            {post.interested} interested volunteers
                          </span>
                        )}
                    </td>

                    <td className="p-4 text-text-muted">
                      {formatUIDate(post.date_start)}
                    </td>

                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        variant="icon"
                        onClick={(event) => toggleActionsMenu(event, post.id)}
                      >
                        <Ellipsis
                          strokeWidth={1.5}
                          className="w-5 h-5 text-text-muted hover:text-text-base"
                        />
                      </Button>

                      {openDropdownId === post.id && dropdownPosition && (
                        <div
                          className="fixed w-44 bg-white border border-filter-stroke rounded-xl shadow-lg z-50 py-2 flex flex-col"
                          style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                          }}
                          onClick={(event) => event.stopPropagation()}
                        >
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
                              setDropdownPosition(null);
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
        </div>
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
