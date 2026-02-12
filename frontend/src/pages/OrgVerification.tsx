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

const OrgVerification = () => {
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
          Org Verification
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            {...register('primaryContact')}
            id="primaryContact"
            name="primaryContact"
            label="Primary Contact Person"
            placeholder="Enter the name of your primary contact person"
            error={errors.primaryContact?.message}
          ></Input>
          <Input
            {...register('phoneNumber')}
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter your organization's phone number"
            error={errors.phoneNumber?.message}
          ></Input>
          <Input
            {...register('yearEstablished')}
            id="yearEstablished"
            name="yearEstablished"
            label="Year Established"
            placeholder="Enter the year your organization was established"
            error={errors.yearEstablished?.message}
          ></Input>

          <FileInput id="test" label="Upload Documentation"></FileInput>

          {/* footer */}
          <Button
            disabled={isSubmitting}
            as="button"
            size="lg"
            variant="primary"
            type="submit"
            className="mt-6 w-full disabled:hover:opacity-100"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </section>
    </main>
  );
};

export default OrgVerification;
