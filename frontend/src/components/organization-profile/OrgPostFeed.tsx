import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, HandHeart, XIcon } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Tag, { TagColor } from '../ui/Tag';
import { PostResponse } from '../../types/posts';
import { formatUIDate } from '../../utils/formatDate';

type OrgPostFeedProps = {
  posts: PostResponse[];
};

const POST_TYPE_LABELS: Record<PostResponse['post_type'], string> = {
  volunteer_request: 'Volunteer Request',
  volunteer_offer: 'Volunteer Offer',
  item_request: 'Item Request',
  item_offer: 'Item Offer',
};

const EVENT_TYPE_LABELS: Record<PostResponse['event_type'], string> = {
  'one-time': 'One-time',
  recurring: 'Recurring',
};

const POST_TYPE_OPTIONS = [
  'All post types',
  'Volunteer Request',
  'Volunteer Offer',
  'Item Request',
  'Item Offer',
];

const EVENT_TYPE_OPTIONS = ['All events', 'One-time', 'Recurring'];

const tagColors: TagColor[] = ['green', 'blue', 'orange', 'baise', 'purple'];

const getScheduleDisplay = (post: PostResponse) => {
  if (post.event_type === 'recurring' && post.days_of_week?.length) {
    return `Recurring: ${post.days_of_week.join(', ')}`;
  }

  return `Date: ${formatUIDate(post.date_start)}${
    post.date_end ? ` - ${formatUIDate(post.date_end)}` : ''
  }`;
};

const OrgPostFeed = ({ posts }: OrgPostFeedProps) => {
  const [postType, setPostType] = useState(POST_TYPE_OPTIONS[0]);
  const [eventType, setEventType] = useState(EVENT_TYPE_OPTIONS[0]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesPostType =
          postType === POST_TYPE_OPTIONS[0] ||
          POST_TYPE_LABELS[post.post_type] === postType;
        const matchesEventType =
          eventType === EVENT_TYPE_OPTIONS[0] ||
          EVENT_TYPE_LABELS[post.event_type] === eventType;

        return matchesPostType && matchesEventType;
      }),
    [eventType, postType, posts],
  );

  const clearFilters = () => {
    setPostType(POST_TYPE_OPTIONS[0]);
    setEventType(EVENT_TYPE_OPTIONS[0]);
  };

  return (
    <section className="rounded-xl bg-white p-5 shadow-card-shadow sm:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Active Posts</h2>
          <p className="mt-1 text-sm text-text-muted">
            {filteredPosts.length} of {posts.length} opportunities shown
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              aria-label="Filter by post type"
              options={POST_TYPE_OPTIONS}
              value={postType}
              onChange={(event) => setPostType(event.target.value)}
              variant="gray"
              className="min-w-40"
            />
            <Select
              aria-label="Filter by event type"
              options={EVENT_TYPE_OPTIONS}
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
              variant="gray"
              className="min-w-36"
            />
          </div>

          <Button
            as="button"
            variant="secondary"
            size="md"
            onClick={clearFilters}
            className="gap-2 whitespace-nowrap"
          >
            <XIcon className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-filter-stroke p-6 text-center text-text-muted">
          This organization does not have active posts right now.
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-filter-stroke p-6 text-center text-text-muted">
          No active posts match these filters.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPosts.map((post) => {
            const expanded = expandedPostId === post.id;
            const tags = post.requirements?.length
              ? post.requirements
              : [
                  POST_TYPE_LABELS[post.post_type],
                  EVENT_TYPE_LABELS[post.event_type],
                ];

            return (
              <article
                key={post.id}
                className="rounded-xl border border-filter-stroke bg-white p-5 shadow-sm"
              >
                <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words text-xl font-semibold">
                      {post.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-text-muted">
                      <span>{getScheduleDisplay(post)}</span>
                      <span aria-hidden="true">•</span>
                      <span>{post.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 3).map((tag, index) => (
                      <Tag
                        key={tag}
                        color={tagColors[index % tagColors.length]}
                      >
                        {tag}
                      </Tag>
                    ))}
                    {tags.length > 3 && (
                      <Tag color="baise">+{tags.length - 3}</Tag>
                    )}
                  </div>
                </header>

                <p className="mt-3 text-text-muted">{post.description}</p>

                {expanded && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-text-muted">
                    {post.additional_details && (
                      <p className="mb-3">{post.additional_details}</p>
                    )}
                    <p>
                      <span className="font-medium text-text-primary">
                        Contact:
                      </span>{' '}
                      {post.contact_email} | {post.contact_phone}
                    </p>
                  </div>
                )}

                <footer className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <HandHeart className="h-4 w-4 text-accent-green" />
                    <span>Interested: {post.interested || 0} people</span>
                  </div>

                  <Button
                    as="button"
                    variant="textOnly"
                    size="sm"
                    onClick={() => setExpandedPostId(expanded ? null : post.id)}
                    className="self-start gap-1 text-text-muted sm:self-auto"
                  >
                    {expanded ? 'Show Less' : 'Show More'}
                    {expanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default OrgPostFeed;
