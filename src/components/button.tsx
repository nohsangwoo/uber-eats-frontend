import React, { useEffect } from 'react';

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
  getValues?: any;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
  getValues,
}) => {
  useEffect(() => {
    console.log(canClick);
    // console.log(getValues);
  }, [canClick]);
  return (
    <button
      role="button"
      className={`text-lg font-medium focus:outline-none text-white py-4  transition-colors ${
        canClick
          ? 'bg-lime-600 hover:bg-lime-700'
          : 'bg-gray-300 pointer-events-none'
      }`}
    >
      {loading ? 'Loading...' : actionText}
    </button>
  );
};
