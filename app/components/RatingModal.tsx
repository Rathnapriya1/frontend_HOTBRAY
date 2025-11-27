'use client'

import { Star, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface RatingModalProps {
  ratingModal: boolean;
  setRatingModal: (value: boolean | null) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ ratingModal, setRatingModal }) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');

  const handleSubmit = async () => {
    if (rating <= 0 || rating > 5) {
      return toast('Please select a rating');
    }
    if (review.length < 5) {
      return toast('Write a short review');
    }
    setRatingModal(null);
  };

  return (
    <div className='fixed inset-0 z-120 flex items-center justify-center bg-black/10'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-96 relative'>
        <button
          onClick={() => setRatingModal(null)}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
        >
          <XIcon size={20} />
        </button>

        <h2 className='text-xl font-medium text-slate-600 mb-4'>Rate Product</h2>

        <div className='flex items-center justify-center mb-4'>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`size-8 cursor-pointer ${
                rating > i ? 'text-blue-500 fill-current' : 'text-gray-300'
              }`}
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>

        <textarea
          className='w-full p-2 border border-gray-300 text-black rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
          placeholder='Write your review'
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button
          onClick={() =>
            toast.promise(handleSubmit(), { loading: 'Submitting...' })
          }
          className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition'
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default RatingModal;
