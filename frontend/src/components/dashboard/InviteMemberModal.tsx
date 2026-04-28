import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { InviteMemberModalProps } from '../../types/modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Please enter a valid email')),
  role: z.enum(['admin', 'member']),
});

type InviteMemberForm = z.infer<typeof inviteMemberSchema>;

const InviteMemberModal = ({
  isOpen,
  onClose,
  onSubmit,
}: InviteMemberModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberForm>({
    resolver: zodResolver(inviteMemberSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  const onInvite: SubmitHandler<InviteMemberForm> = async (data) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (err) {
      console.error('Failed to invite member', err);
      setError('root', {
        message: 'Unable to send this invitation. Please try again.',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col justify-center gap-6">
        <div className="mb-2">
          <h2 className="font-semibold text-xl mb-1">Invite Member</h2>
          <p className="text-sm text-text-muted">
            Send an invitation to join your organization.
          </p>
        </div>

        <form onSubmit={handleSubmit(onInvite)} className="flex flex-col gap-4">
          <Input
            {...register('email')}
            variant="secondary"
            label="Email Address"
            id="email"
            error={errors.email?.message}
          />

          <Select
            {...register('role')}
            variant="gray"
            label="Role"
            id="role"
            options={['member', 'admin']}
            error={errors.role?.message}
            className="capitalize"
          />

          {errors.root?.message && (
            <span className="text-sm text-red-500">{errors.root.message}</span>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default InviteMemberModal;
