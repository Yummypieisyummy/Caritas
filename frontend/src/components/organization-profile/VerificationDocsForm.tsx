import { useFormContext } from 'react-hook-form';
import { FileText } from 'lucide-react';
import Input from '../ui/Input';
import { SetupVerificationFormValues } from '../../schemas/orgProfileSchema';

const VerificationDocsForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SetupVerificationFormValues>();

  return (
    <section className="rounded-2xl bg-white p-8 shadow-card-shadow">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent-green" />
          <h2 className="text-xl font-semibold">Verification Documents</h2>
        </div>
        <p className="mt-1 text-sm text-text-muted">
          Upload your 501(c)(3) determination letter or provide a secure link
          for manual review.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Input
          {...register('documents')}
          id="documents"
          data-testid="verification-document-upload"
          type="file"
          accept="image/*,application/pdf"
          label="Verification File"
          variant="secondary"
          size="sm"
          error={errors.documents?.message?.toString()}
        />

        <Input
          {...register('documents_link')}
          id="documents_link"
          type="url"
          label="Verification Link"
          placeholder="https://example.org/verification-document"
          variant="secondary"
          size="sm"
          error={errors.documents_link?.message}
        />
      </div>
    </section>
  );
};

export default VerificationDocsForm;
