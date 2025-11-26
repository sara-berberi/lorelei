'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface FilterOptions {
  categories: string[];
  brands: string[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

interface ProductFiltersProps {
  onFilterChange: (filters: {
    category: string;
    brand: string;
    size: string;
    minPrice: string;
    maxPrice: string;
  }) => void;
  initialFilters?: {
    category?: string;
    brand?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function ProductFilters({ onFilterChange, initialFilters }: ProductFiltersProps) {
  const t = useTranslations('filters');
  const tCategories = useTranslations('categories');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    brands: [],
    sizes: [],
    priceRange: { min: 0, max: 0 },
  });
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilters?.category || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(initialFilters?.brand || 'all');
  const [selectedSize, setSelectedSize] = useState<string>(initialFilters?.size || 'all');
  const [minPrice, setMinPrice] = useState<string>(initialFilters?.minPrice || '');
  const [maxPrice, setMaxPrice] = useState<string>(initialFilters?.maxPrice || '');

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await fetch('/api/products/filters');
        if (res.ok) {
          const data = await res.json();
          setFilterOptions(data);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilterOptions();
  }, []);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      brand: selectedBrand,
      size: selectedSize,
      minPrice,
      maxPrice,
    });
  }, [selectedCategory, selectedBrand, selectedSize, minPrice, maxPrice, onFilterChange]);

  const handleClearAll = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedSize('all');
    setMinPrice('');
    setMaxPrice('');
  };

  const getCategoryTranslation = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'Tops': 'tops',
      'Bottoms': 'bottoms',
      'Dresses': 'dresses',
      'Coats & Puffers': 'coatsPuffers',
      'Nightwear': 'nightwear',
      'Shoes': 'shoes',
    };
    const key = categoryMap[category] || category.toLowerCase();
    try {
      return tCategories(key);
    } catch {
      return category;
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="text-sm text-gray-400">Loading filters...</div>
      </div>
    );
  }

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedSize !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '';

  return (
    <div className="mb-8 border-b border-gray-200 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">{t('title')}</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-600 hover:text-black underline"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category Filter */}
        {filterOptions.categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">{t('category')}</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black text-sm"
            >
              <option value="all">{t('allCategories')}</option>
              {filterOptions.categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryTranslation(category)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Brand Filter */}
        {filterOptions.brands.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">{t('brand')}</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black text-sm"
            >
              <option value="all">{t('allBrands')}</option>
              {filterOptions.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Size Filter */}
        {filterOptions.sizes.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">{t('size')}</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black text-sm"
            >
              <option value="all">{t('allSizes')}</option>
              {filterOptions.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('price')}</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t('minPrice')}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black text-sm"
            />
            <input
              type="number"
              placeholder={t('maxPrice')}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

