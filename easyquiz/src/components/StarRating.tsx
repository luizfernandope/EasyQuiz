'use client'; // Necessário para hooks

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating() {
  const [rating, setRating] = useState(0); // Nota atual
  const [hover, setHover] = useState(0);   // Nota ao passar o mouse

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                size={28}
                className={`cursor-pointer transition-colors ${
                  ratingValue <= (hover || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Sua nota: {rating > 0 ? `${rating}/5` : 'Nenhuma'}
      </p>
    </div>
  );
}