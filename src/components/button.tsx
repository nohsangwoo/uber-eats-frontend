import React from 'react';

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => (
  <button
    role="button"
    //pointer-events-none 아무런 event작동을 안하게 만듬
    //  여기선 canClick이 false이면 아무런 동작도 안하게 만들어주는것
    className={`text-lg font-medium focus:outline-none text-white py-4  transition-colors ${
      canClick
        ? 'bg-lime-600 hover:bg-lime-700'
        : 'bg-gray-300 pointer-events-none'
    }`}
  >
    {loading ? 'Loading...' : actionText}
  </button>
);
