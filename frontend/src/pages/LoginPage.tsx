import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoginInput } from '../types/auth';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Please enter a valid email')),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onLogin: SubmitHandler<LoginInput> = async (data) => {
    try {
      await login(data);
      navigate('/organization/setup'); // For first time login (verification form not submitted), navigate to setup page, else navigate to org dashboard
    } catch (err) {
      console.error(err); // add custom error message later, should show if account is unverified when trying to login, prompting to resend verification
      setError('root', {
        message: 'Invalid email or password',
      });
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-full">
      <section className="flex flex-col gap-6 max-w-md w-full bg-white rounded-2xl p-8 shadow-card-shadow">
        <h1 className="mx-auto font-semibold text-3xl text-text-green">
          Login
        </h1>

        <form onSubmit={handleSubmit(onLogin)} className="flex flex-col gap-4">
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
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-[39px] opacity-100 text-text-muted hover:text-text-base transition-colors"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </Button>
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
            aria-label="Login"
            className="py-3 mt-6 disabled:hover:opacity-100"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="flex items-center justify-center">
          <p className="text-text-muted">Need an account?</p>
          <Button
            as="link"
            to="/signup"
            variant="textOnly"
            size="md"
            className="text-text-green hover:underline"
          >
            Signup
          </Button>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
