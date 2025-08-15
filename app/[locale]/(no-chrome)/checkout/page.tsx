/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-01-05 17:16:02
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-03-31 04:00:20
 * @FilePath: /lulab_website_next_js/app/[locale]/(no-chrome)/checkout/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const channel = searchParams?.get('channel');
    fetch("/api/stripe/checkout_sessions", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelCode: channel || 'default'
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [searchParams]);

  const options = { clientSecret };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCancel = () => {
    router.back(); // 返回上一页
  };

  return (
    <div className="container mx-auto px-4">
      <div id="checkout" className={isMobile ? 'pt-2' : 'pt-8'}>
        <div className="mb-1">  {/* 将mb-2改为mb-1，进一步减小底部边距使按钮向上移 */}
          <div className="flex justify-start mb-2"> {/* 将mb-4改为mb-2，减小按钮下方的间距 */}
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={options}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}
