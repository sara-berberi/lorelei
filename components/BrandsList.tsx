'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BrandsListProps {
  locale: string;
}

export default function BrandsList({ locale }: BrandsListProps) {
  const t = useTranslations('brands');
  const router = useRouter();
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands');
        if (res.ok) {
          const data = await res.json();
          setBrands(data);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-400">{t('noBrands')}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {brands.map((brand) => (
        <Link
          key={brand}
          href={`/${locale}#products`}
          onClick={() => {
            // Store brand filter in sessionStorage to apply when navigating to products
            sessionStorage.setItem('selectedBrand', brand);
            // Scroll to products section
            setTimeout(() => {
              const productsSection = document.getElementById('products');
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }}
          className="group p-4 sm:p-6 border border-gray-200 hover:border-black transition-colors text-center"
        >
          <h3 className="text-sm sm:text-base font-medium group-hover:text-black transition-colors">
            {brand}
          </h3>
          <p className="text-xs text-gray-500 mt-2">{t('viewProducts')}</p>
        </Link>
      ))}
    </div>
  );
}

