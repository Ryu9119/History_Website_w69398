import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginSchema, type LoginFormData } from '../lib/auth-schemas';
import { authApi } from '../lib/auth-api';
import { cn } from '../lib/utils';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    // Clear previous errors
    setErrors({});
    
    // Validate with schema.safeParse
    const validationResult = loginSchema.safeParse(data);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.login(validationResult.data);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Đăng nhập</h1>
            <p className="mt-2 text-muted-foreground">
              Đăng nhập vào tài khoản Thiên Sử Ký của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(
                  "w-full px-3 py-2 border rounded-md transition-colors",
                  "bg-background text-foreground border-border",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "placeholder:text-muted-foreground",
                  errors.email && "border-destructive focus:ring-destructive"
                )}
                placeholder="Nhập email của bạn"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Mật khẩu
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={cn(
                  "w-full px-3 py-2 border rounded-md transition-colors",
                  "bg-background text-foreground border-border",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "placeholder:text-muted-foreground",
                  errors.password && "border-destructive focus:ring-destructive"
                )}
                placeholder="Nhập mật khẩu"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-3 px-4 rounded-md font-medium transition-colors",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 focus:bg-primary/90",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Register link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Đăng ký
              </button>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-2">Demo Credentials:</h3>
            <p className="text-xs text-muted-foreground">
              Email: <code className="bg-background px-1 rounded">test@example.com</code><br />
              Password: <code className="bg-background px-1 rounded">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
