import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false); // Disable button while submitting
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop the page from reloading - default form action

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    console.log('Form Submitted:', email, password);

    try {
      setIsSubmitting(true);
      // Post to login endpoint
      navigate(-1); // Return to previous page on success
    } catch (err) {
      console.error(err); // add custom error message later
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-full">
      <section className="flex flex-col gap-6 w-120 bg-white rounded-2xl p-8 shadow-card-shadow">
        <h2 className="mx-auto font-semibold text-2xl text-text-green">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <Button
            disabled={isSubmitting}
            type="submit"
            as="button"
            variant="primary"
            size="lg"
            aria-label="Login"
            className="py-3 mt-8"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="flex items-center justify-center">
          <p className="text text-text-muted">Need an account?</p>
          <Button
            as="link"
            to="/signup"
            variant="textOnly"
            size="md"
            className="text-md"
          >
            Signup
          </Button>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
