import React from 'react';

//이 컴포넌트는 errorMessage라는 인자를 전달받으며 전달받는 인자중
// errorMessage는 string 타입이다.
interface IFormErrorProps {
  errorMessage: string;
}

// 컴포넌트의 이름은 FormError이고 export되어 끌어다 사용가능하며
// FormError라는 이름의 컴포넌트는 React.FC<IFormErrorProps>형식이다(FC: functional component의 약어)
// 이 컴포넌트는 IFormErrorProps의 형식으로 인자를 전달 받는다
export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span role="alert" className="font-medium text-red-500">
    {errorMessage}
  </span>
);
