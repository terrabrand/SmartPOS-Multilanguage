
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  formatPrice: (amount: number) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, formatPrice }) => {
  return (
    <div 
      onClick={() => onAdd(product)}
      className="bg-white p-4 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group flex flex-col items-center text-center h-full border border-transparent hover:border-brand-yellow/30"
    >
      <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <h3 className="text-gray-800 font-bold text-lg mb-1">{product.name}</h3>
      <p className="text-gray-400 text-sm font-medium mb-3">{product.weight}</p>
      
      <div className="mt-auto text-brand-yellow font-bold text-xl">
        {formatPrice(product.price)}
      </div>
    </div>
  );
};

export default ProductCard;
