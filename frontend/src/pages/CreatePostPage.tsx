import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOrgPosts } from '../hooks/useOrgPosts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvailableTags } from '../hooks/useAvailableTags';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const POST_TYPES = [
  'Volunteer Request',
  'Volunteer Offer',
  'Item Request',
  'Item Offer',
];

const REQUIREMENT_TAGS = [
  'Requires Credentials',
  'Orientation Needed',
  "Requires Driver's License",
  'Food Handling Certification',
];

const FOCUS_TAGS = [
  'Food Pantry',
  'Tutoring / Mentoring',
  'Elder Care',
  'Donations',
];

const postSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  postType: z.enum(
    ['Volunteer Request', 'Volunteer Offer', 'Item Request', 'Item Offer'],

    { message: 'Please select a post type' },
  ),
  eventType: z.enum(['one-time', 'recurring']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  recurringDays: z.array(z.string()).optional(),
  address: z.string().min(5, 'Address is required'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Please enter a valid email')),
  phoneNumber: z
    .string()
    .regex(/^[\d\s()+-]{10,}$/, 'Please enter a valid phone number'),
  additionalDetails: z.string().optional(),
});

type PostForm = z.infer<typeof postSchema>;

const CreatePostPage = () => {
  const { createPost } = useOrgPosts();
  const { tags, status: tagsStatus } = useAvailableTags();
  const navigate = useNavigate();

  const [eventType, setEventType] = useState<'one-time' | 'recurring'>(
    'one-time',
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const requirementTags = tags.filter((tag) =>
    REQUIREMENT_TAGS.includes(tag.name),
  );
  const focusTags = tags.filter((tag) => FOCUS_TAGS.includes(tag.name));

  const {
    register,
    handleSubmit,
    // setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    mode: 'onBlur',
    defaultValues: {
      eventType: 'one-time',
    },
  });

  const handleEventTypeChange = (type: 'one-time' | 'recurring') => {
    setEventType(type);
    setValue('eventType', type);

    if (type === 'one-time') {
      setSelectedDays([]);
      setValue('recurringDays', []);
    }
  };

  const handleDayToggle = (day: string) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updatedDays);
    setValue('recurringDays', updatedDays);
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((currentTagIds) =>
      currentTagIds.includes(tagId)
        ? currentTagIds.filter((currentTagId) => currentTagId !== tagId)
        : [...currentTagIds, tagId],
    );
  };

  const onSubmit: SubmitHandler<PostForm> = async (data) => {
    try {
      await createPost({
        ...data,
        tagIds: selectedTagIds,
      });
      navigate('/dashboard/posts');
    } catch (err) {
      console.error(err);
      // add error message somewhere if submission fails
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-6">
      <section className="w-full max-w-4xl bg-white rounded-2xl p-8 my-8 shadow-card-shadow">
        <h2 className="font-semibold text-2xl mb-6">Create New Post</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            {...register('title')}
            id="title"
            name="title"
            label="Title"
            variant="primary"
            placeholder="Enter post title"
            error={errors.title?.message}
          />

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              name="description"
              className="border-2 border-nav-stroke rounded-2xl px-4 py-2.5 w-full transition-all duration-200 focus:border-accent-green focus:shadow-sm placeholder:text-text-muted placeholder:text-sm hover:border-filter-stroke resize-none bg-white outline-none"
              rows={5}
              placeholder="Enter post description"
            />
            {errors.description && (
              <span className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </span>
            )}
          </div>

          <Select
            {...register('postType')}
            label="Post Type"
            variant="form"
            options={POST_TYPES}
            placeholder="Select post type"
            error={errors.postType?.message}
          />

          {/* Event Type Selection */}
          <div className="flex flex-col gap-3">
            <label className="font-medium">Event Schedule</label>
            <div className="bg-text-muted/15 p-1 rounded-xl flex w-fit gap-1">
              {/* One-time Button */}
              <button
                type="button"
                onClick={() => handleEventTypeChange('one-time')}
                className={`
                  px-6 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200
                  ${
                    eventType === 'one-time'
                      ? 'bg-accent-green text-white'
                      : 'text-text-muted hover:text-text-base'
                  }
                `}
              >
                One-time event
              </button>

              {/* Recurring Button */}
              <button
                type="button"
                onClick={() => handleEventTypeChange('recurring')}
                className={`
                  px-6 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200
                  ${
                    eventType === 'recurring'
                      ? 'bg-accent-green text-white'
                      : 'text-text-muted hover:text-text-base'
                  }
                `}
              >
                Recurring event
              </button>
            </div>
            {/* Hidden to validate react form */}
            <input type="hidden" {...register('eventType')} value={eventType} />
          </div>

          {/* Date Selection */}
          <div className="flex gap-4">
            <Input
              {...register('startDate')}
              id="startDate"
              name="startDate"
              label={eventType === 'one-time' ? 'Event Date' : 'Start Date'}
              type="date"
              variant="primary"
              error={errors.startDate?.message}
            />
            {eventType === 'recurring' && (
              <Input
                {...register('endDate')}
                id="endDate"
                name="endDate"
                label="End Date (Optional)"
                type="date"
                variant="primary"
                error={errors.endDate?.message}
              />
            )}
          </div>

          {/* Recurring Days Selection */}
          {eventType === 'recurring' && (
            <div className="flex flex-col gap-3">
              <label className="font-medium">Select Days</label>
              <div className="grid grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 accent-accent-green cursor-pointer"
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
              {errors.recurringDays && (
                <span className="text-sm text-red-500">
                  {errors.recurringDays.message}
                </span>
              )}
            </div>
          )}

          <Input
            {...register('address')}
            id="address"
            name="address"
            label="Address"
            variant="primary"
            placeholder="Enter address"
            error={errors.address?.message}
          />

          {(tagsStatus === 'pending' || tags.length > 0) && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-medium">
                  Optional Tags
                </label>
                <p className="text-sm text-text-muted">
                  Add requirements or focus areas so people can find this post.
                </p>
              </div>
              {tagsStatus === 'pending' ? (
                <p className="text-sm text-text-muted">Loading tags...</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {requirementTags.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">
                        Requirements
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {requirementTags.map((tag) => (
                          <label
                            key={tag.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTagIds.includes(tag.id)}
                              onChange={() => handleTagToggle(tag.id)}
                              className="w-4 h-4 accent-accent-green cursor-pointer"
                            />
                            <span className="text-sm">{tag.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {focusTags.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">
                        Focus Area
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {focusTags.map((tag) => (
                          <label
                            key={tag.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTagIds.includes(tag.id)}
                              onChange={() => handleTagToggle(tag.id)}
                              className="w-4 h-4 accent-accent-green cursor-pointer"
                            />
                            <span className="text-sm">{tag.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <Input
            {...register('email')}
            id="email"
            name="email"
            label="Contact Email"
            type="email"
            variant="primary"
            placeholder="Enter contact email"
            error={errors.email?.message}
          />

          <Input
            {...register('phoneNumber')}
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            variant="primary"
            placeholder="Enter phone number"
            error={errors.phoneNumber?.message}
          />

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="additionalDetails" className="font-medium">
              Additional Details (Optional)
            </label>
            <textarea
              {...register('additionalDetails')}
              id="additionalDetails"
              name="additionalDetails"
              className="border-2 border-nav-stroke rounded-2xl px-4 py-2.5 w-full transition-all duration-200 focus:border-accent-green focus:shadow-sm placeholder:text-text-muted placeholder:text-sm hover:border-filter-stroke resize-none bg-white outline-none"
              rows={4}
              placeholder="Enter any additional details"
            />
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <Button as="link" to="/dashboard/posts" variant="secondary">
              Cancel
            </Button>
            <Button
              as="button"
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreatePostPage;
