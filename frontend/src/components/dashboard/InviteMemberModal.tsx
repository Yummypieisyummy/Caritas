import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { ModalProps } from '../../types/modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const inviteMemberSchema = z.object({
  name: z
    .string()
    .min(2, 'Full name is required')
    .regex(/^[a-zA-Z\s'-]+$/, 'Please enter a valid name'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Please enter a valid email')),
});

type InviteMemberForm = z.infer<typeof inviteMemberSchema>;

const InviteMemberModal = ({ isOpen, onClose }: ModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberForm>({
    resolver: zodResolver(inviteMemberSchema),
    mode: 'onBlur',
  });

  const onInvite: SubmitHandler<InviteMemberForm> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
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
            {...register('name')}
            variant="secondary"
            label="Full Name"
            id="name"
            error={errors.name?.message}
          ></Input>

          <Input
            {...register('email')}
            variant="secondary"
            label="Email Address"
            id="email"
            error={errors.email?.message}
          ></Input>

          <Select
            variant="gray"
            label="Role"
            id="role"
            options={['Member', 'Admin']}
          ></Select>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="secondary" type="submit" onClick={onClose}>
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
