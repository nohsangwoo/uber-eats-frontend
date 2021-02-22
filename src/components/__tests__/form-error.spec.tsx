import { getByRole, render } from '@testing-library/react';
import React from 'react';
import { FormError } from '../form-error';

describe('<FormError />', () => {
  it('renders OK with props', () => {
    //   form을 테스트 할껀데 그중 errorMessage라는 armguement만 검사하면됨
    // 그 인자값은 errorMessage 인데 test를 전달하고
    // getByText('test');로 test가 정상 출력하는지 검사함
    const { getByText } = render(<FormError errorMessage="test" />);
    getByText('test');
  });
});
