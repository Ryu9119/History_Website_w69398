import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold text-card-foreground">Thanh toán thành công</h1>
      <p className="mt-2 text-muted-foreground">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ để xác nhận đơn.</p>
      <div className="mt-6 flex gap-3">
        <Link to="/products" className="px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Tiếp tục mua sắm</Link>
        <Link to="/" className="px-4 py-2 rounded-md border border-border">Về trang chủ</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;



