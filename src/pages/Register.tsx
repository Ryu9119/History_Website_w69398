import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerSchema, type RegisterFormData } from '../lib/auth-schemas';
import { authApi } from '../lib/auth-api';
import { cn } from '../lib/utils';
import Header from '../components/Header';

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    // Clear previous errors
    setErrors({});
    
    // Validate with schema.safeParse
    const validationResult = registerSchema.safeParse(data);
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
      await authApi.register(validationResult.data);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Đăng ký thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Đăng ký</h1>
            <p className="mt-2 text-muted-foreground">
              Tạo tài khoản mới để truy cập vào Thiên Sử Ký
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Họ tên
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={cn(
                  "w-full px-3 py-2 border rounded-md transition-colors",
                  "bg-background text-foreground border-border",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "placeholder:text-muted-foreground",
                  errors.name && "border-destructive focus:ring-destructive"
                )}
                placeholder="Nhập họ tên của bạn"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

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

            {/* Confirm Password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                id="confirmPassword"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                className={cn(
                  "w-full px-3 py-2 border rounded-md transition-colors",
                  "bg-background text-foreground border-border",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "placeholder:text-muted-foreground",
                  errors.confirmPassword && "border-destructive focus:ring-destructive"
                )}
                placeholder="Nhập lại mật khẩu"
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.confirmPassword}
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
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          {/* Login link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Đã có tài khoản?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
