import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import FileInput from '../components/ui/FileInput';

const verificationSchema = z.object({
  primaryContact: z
    .string()
    .min(2, 'Contact name is required')
    .regex(/^[a-zA-Z\s'-]+$/, 'Please enter a valid name'),
  phoneNumber: z
    .string()
    .regex(/^[\d\s()+-]{10,}$/, 'Please enter a valid phone number'),
  yearEstablished: z
    .string()
    .regex(/^(19|20)\d{2}$/, 'Please enter a valid year (1900-2099)'),
});

type VerificationForm = z.infer<typeof verificationSchema>;

const SetupVerificationPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<VerificationForm> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-full">
      <section className="flex flex-col gap-6 max-w-md w-full bg-white rounded-2xl p-8 shadow-card-shadow hover:shadow-card-hover transition-shadow duration-300 ease-in-out">
        <h1 className="text-3xl text-text-green font-semibold mb-6 mx-auto">
          Organization Verification
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            {...register('primaryContact')}
            id="primaryContact"
            name="primaryContact"
            label="Primary Contact Person"
            placeholder="John Doe"
            error={errors.primaryContact?.message}
          />

          <Input
            {...register('phoneNumber')}
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="(555) 123-4567"
            error={errors.phoneNumber?.message}
          />

          <Input
            {...register('yearEstablished')}
            id="yearEstablished"
            name="yearEstablished"
            label="Year Established"
            placeholder="2000"
            error={errors.yearEstablished?.message}
          />

          <FileInput
            id="taxExempt"
            label="Tax Exempt Status Document"
            accept=".pdf,.doc,.docx"
          />

          <FileInput
            id="proofIncorporation"
            label="Proof of Incorporation"
            accept=".pdf,.doc,.docx"
          />

          <Button
            as="button"
            type="submit"
            size="md"
            disabled={isSubmitting}
            className="w-full mt-4"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </form>
      </section>
    </main>
  );
};

export default SetupVerificationPage;
