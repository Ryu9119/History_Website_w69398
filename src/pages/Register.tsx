import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerSchema, type RegisterFormData } from '../lib/auth-schemas';
import { authApi } from '../lib/auth-api';
import { cn } from '../lib/utils';
import Header from '../components/Header';

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await authApi.register(data);
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
                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
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
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
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
                <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
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
                <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
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
