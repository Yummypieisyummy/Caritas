import Button from '../components/ui/Button';
import { CircleCheck } from 'lucide-react';
import { useLocation, Navigate } from 'react-router-dom';

const SignupSuccessPage = () => {
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/signup" replace></Navigate>; // If user tries to access signup-success page without an email, redirect to signup
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section className="bg-white w-full max-w-md shadow-card-shadow rounded-2xl flex flex-col items-center text-center p-8 hover:shadow-card-hover transition-shadow duration-300 ease-in-out">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-text-muted/5">
            <CircleCheck
              size={64}
              className="text-accent-green drop-shadow-lg"
            />
          </div>
          <h1 className="font-semibold text-3xl">Account Created!</h1>
        </div>

        {/* Body Section */}
        <div className="flex flex-col gap-4 mb-8">
          <p className="text-text-muted">
            Your organization's account has been successfully created. We've
            sent a verification link to:
          </p>
          <div className="font-medium bg-text-muted/5 py-2 px-4 rounded-xl self-center">
            {email}
          </div>
          <p className="text-text-muted text-sm">
            Please verify your email to access your account.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col w-full gap-4">
          <Button as="link" to="/login" size="lg">
            Go to Login
          </Button>
          <div className="flex flex-col items-center gap-2 pt-2 border-t border-text-muted/10">
            <p className="text-sm text-text-muted">Didn't receive the email?</p>
            <Button
              variant="textOnly"
              size="sm"
              className="text-text-green hover:underline"
            >
              Click to resend
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignupSuccessPage;
