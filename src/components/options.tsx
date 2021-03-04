import React from 'react';
interface OptionsProps {
  optionsNumber: string[];
  register?: any;
  onDeleteClick: any;
  options: any;
}
const Options: React.FC<OptionsProps> = ({
  optionsNumber,
  register,
  onDeleteClick,
  options,
}) => {
  console.log('안에서', options[0]);
  return (
    <div>
      {optionsNumber.length !== 0 &&
        optionsNumber.map((id, index) => (
          <div key={id} className="mt-5">
            <input
              ref={register}
              name={`${id}-optionName`}
              className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
              type="text"
              placeholder={options[index]?.name ?? 'name'}
              value={options[index]?.name || ''}
            />
            <input
              ref={register}
              name={`${id}-optionExtra`}
              className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
              type="number"
              min={0}
              placeholder={options[index]?.extra ?? 'extra'}
              value={options[index]?.extra || ''}
            />
            <span
              className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5 bg-"
              onClick={() => onDeleteClick(id)}
            >
              Delete Option
            </span>
          </div>
        ))}
    </div>
  );
};

export default Options;
