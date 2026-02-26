import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RegisterInput } from '../types/auth';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Turnstile from '../components/ui/Turnstile';


export const signupSchema = z.object({
  orgName: z
    .string()
    .trim()
    .min(2, 'Organization name must be at least 2 characters'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Please enter a valid email')),
  password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const { register: signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const onSignup: SubmitHandler<RegisterInput> = async (data) => {
     try {
      if (!turnstileToken) {
        setError("root", {
          type: "manual",
          message: "Please complete the CAPTCHA.",
        });
        return;
      }
      await signup({...data, turnstileToken });
      navigate('/signup-success', { state: { email: data.email } });
    } catch (err) {
      console.error(err); // add custom error message later
      setTurnstileToken(null);

      setError("root", {
      type: "server",
      message: "Unable to create account",
    });
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-full">
      <section className="flex flex-col gap-6 max-w-md w-full bg-white rounded-2xl p-8 shadow-card-shadow">
        <h1 className="mx-auto font-semibold text-3xl text-text-green">
          Signup
        </h1>

        <form onSubmit={handleSubmit(onSignup)} className="flex flex-col gap-4">
          <Input
            {...register('orgName')}
            type="text"
            name="orgName"
            id="orgName"
            label="Organization Name"
            placeholder="Enter your organization name"
            error={errors.orgName?.message}
          />
          <Input
            {...register('email')}
            type="email"
            name="email"
            id="email"
            label="Email"
            placeholder="Enter your email"
            error={errors.email?.message}
          />
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
            />
            <Button
              as="button"
              variant="icon"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-[39px] opacity-100 text-text-muted hover:text-text-base transition-colors"
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

          {errors.root && (
            <div className="text-red-500 text-sm text-center">
              {errors.root.message}
            </div>
          )}
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
            className="text-text-green hover:underline"
          >
            Login
          </Button>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
