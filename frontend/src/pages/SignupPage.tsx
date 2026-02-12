import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Turnstile from '../components/ui/Turnstile';


const SignupPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false); // Disable button while submitting
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const orgNameRef = useRef<HTMLInputElement | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop the page from reloading - default form action

    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();
    const orgName = orgNameRef.current?.value.trim();

    if (!email || !password || !orgName || !turnstileToken) {
      // set error message later and provide feedback for invalid fields
      return;
    }

    const input = {
      email,
      password,
      orgName,
      turnstileToken,
    };

    try {
      setIsSubmitting(true);
      await register(input);
      navigate('/signup-success', { state: { email: input.email } });
    } catch (err) {
      console.error(err); // add custom error message later
      setTurnstileToken(null); //if an error, user must re verify they are not a bot
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-full">
      <section className="flex flex-col gap-6 w-120 bg-white rounded-2xl p-8 shadow-card-shadow">
        <h2 className="mx-auto font-semibold text-3xl text-text-green">
          Signup
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <Input
            ref={orgNameRef}
            type="text"
            name="orgName"
            id="orgName"
            label="Organization Name"
            placeholder="Enter your organization name"
          />
          <Input
            ref={emailRef}
            type="email"
            name="email"
            id="email"
            label="Email"
            placeholder="Enter your email"
          />
          <div className="relative">
            <Input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              label="Password"
              placeholder="Enter your password"
            />
            <Button
              as="button"
              variant="icon"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 opacity-100 text-text-muted hover:text-text-base transition-colors"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </Button>
          </div>

           <div className="mt-2">
            <Turnstile onToken={setTurnstileToken} />
          </div>

          <Button
            disabled={isSubmitting}
            type="submit"
            as="button"
            variant="primary"
            size="lg"
            aria-label="Signup"
            className="py-3 mt-6 disabled:hover:opacity-100"
          >
            {isSubmitting ? 'Creating Account...' : 'Signup'}
          </Button>
        </form>

        <div className="flex items-center justify-center">
          <p className="text text-text-muted">Already have an account?</p>
          <Button
            as="link"
            to="/login"
            variant="textOnly"
            size="md"
            className="text-text-green font-medium hover:underline"
          >
            Login
          </Button>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
