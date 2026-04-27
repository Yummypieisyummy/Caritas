import { TeamInviteInput } from './team';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface InviteMemberModalProps extends ModalProps {
  onSubmit: (data: TeamInviteInput) => Promise<void>;
}
