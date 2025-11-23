'use client';

import { useCart } from '@/contexts/CartContext';
import { useTranslations } from 'next-intl';

export default function CartButton() {
  const { getTotalItems, setIsOpen } = useCart();
  const t = useTranslations('cart');
  const itemCount = getTotalItems();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label={t('cart')}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}

