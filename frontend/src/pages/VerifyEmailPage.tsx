import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const VerifyEmailPage = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailToken = searchParams.get('token');

  const { isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ['verifyEmail', emailToken],
    queryFn: async () => {
      if (!emailToken) throw new Error('No verification token found');

      const minDelay = new Promise((resolve) => setTimeout(resolve, 1000));
      await Promise.all([verifyEmail(emailToken), minDelay]);

      return true;
    },
    enabled: !!emailToken,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Navigate side-effect on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login', {
          state: { message: 'Email verified! You can now log in.' },
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6">
      <section
        className={`bg-white w-full max-w-md shadow-card-shadow rounded-2xl flex flex-col items-center text-center p-8 transition-colors duration-300
          ${isError ? 'border-2 border-red-600' : ''} 
          ${isSuccess ? 'border-2 border-accent-green' : 'border border-transparent'}`}
      >
        {!emailToken && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-semibold text-3xl">Invalid Link</h1>
            <p className="text-text-muted text-sm">No token found.</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4">
            <Spinner />
            <h1 className="font-semibold text-3xl">Verifying Email</h1>
            <p className="text-text-muted text-sm">
              Please wait until verification is complete.
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-semibold text-3xl text-accent-green">
              Email Verified!
            </h1>
            <p className="text-text-muted text-sm">Redirecting to Login...</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-semibold text-3xl">Verification Failed</h1>
            <p className="text-text-muted text-sm">
              {(error as any)?.response?.data?.error ||
                error?.message ||
                'The link may be expired or invalid.'}
            </p>
            <Button
              variant="textOnly"
              size="sm"
              className="text-red-600 hover:underline mt-2"
            >
              Click to resend
            </Button>
          </div>
        )}
      </section>
    </main>
  );
};

export default VerifyEmailPage;
