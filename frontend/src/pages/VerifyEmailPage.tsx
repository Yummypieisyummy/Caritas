import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const VerifyEmailPage = () => {
  // await verify endpoint call with attached email token, show spinner until complete
  // Success, failure views
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('verifying');
  const { verifyEmail } = useAuth();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const emailToken = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!emailToken) {
        setStatus('error');
        setErrorMessage('No verification token found');
        return;
      }

      try {
        setStatus('verifying');

        // The code pauses here until both the api call and 1 second delay are finished
        const minDelay = new Promise((resolve) => setTimeout(resolve, 1000));
        await Promise.all([verifyEmail(emailToken), minDelay]);
        setStatus('success');

        // redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(
          err.response?.data?.error ||
            'Verification failed. The link may be expired or invalid',
        );
      }
    };

    verify();
  }, [emailToken, verifyEmail]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section
        className={`bg-white w-full max-w-md shadow-card-shadow rounded-2xl flex flex-col items-center text-center p-8 ${status === 'error' && 'border-2 border-red-600'} ${status === 'success' && 'border-2 border-accent-green'}`}
      >
        {/* Verifying */}
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={54} className="animate-spin text-accent-green" />
            <h1 className="font-semibold text-3xl">Verifying Email</h1>
            <p className="text-text-muted text-sm">
              Please wait until verification is complete.
            </p>
          </div>
        )}
        {/* Success */}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-semibold text-3xl">Email Verified!</h1>
            <p className="text-text-muted text-sm">Redirecting to Login...</p>
          </div>
        )}
        {/* Error */}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-semibold text-3xl">Verification Failed</h1>
            <p className="text-text-muted text-sm">{errorMessage}</p>
            <Button
              variant="textOnly"
              size="sm"
              className="text-red-600 hover:underline"
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
