import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const AcceptInvite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('token');

  useEffect(() => {
    if (!inviteToken) return;

    navigate(`/signup?inviteToken=${encodeURIComponent(inviteToken)}`, {
      replace: true,
    });
  }, [inviteToken, navigate]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6">
      <section className="bg-white w-full max-w-md shadow-card-shadow rounded-2xl flex flex-col items-center text-center p-8 border border-transparent">
        {inviteToken ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Spinner />
            <h1 className="font-semibold text-3xl">Opening Invite</h1>
            <p className="text-text-muted text-sm">
              Redirecting you to account signup.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-semibold text-3xl">Invalid Invite</h1>
            <p className="text-text-muted text-sm">No token found.</p>
            <Button onClick={() => navigate('/signup')}>Go to Signup</Button>
          </div>
        )}
      </section>
    </main>
  );
};

export default AcceptInvite;
