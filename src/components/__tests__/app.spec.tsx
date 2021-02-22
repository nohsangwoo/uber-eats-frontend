import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { isLoggedInVar } from '../../apollo';
import { App } from '../app';

// LoggedOutRouter 는 첫번째 인자의 경로에서 오고
// LoggedOutRouter는 logged-out이란 span tag로 감싸진 text이다
jest.mock('../../routers/logged-out-router', () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});
jest.mock('../../routers/logged-in-router', () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

// 첫번째 인자는 알아볼수있는 제목
// 작은테스트를 모아두는 틀같은거
describe('<App />', () => {
  // 첫번째 인자는 알아볼수있는 제목
  it('renders LoggedOutRouter', () => {
    //   render에서 제공하는 기능중 하나인 getByText 를 사용하려 뽑아옴
    const { getByText } = render(<App />);
    // render의 대상<App />에서  'logged-out'를 찾아 달라는 뜻
    getByText('logged-out');
  });
  it('renders LoggedInRouter', async () => {
    const { getByText } = render(<App />);

    // isLoggedInVar라는 변수가 <App에서 로그인 한 상태를 만들어주는데
    // 로긴상태가 돼야 테스팅이 진행가능하니 true로 mocking해줌
    //waitFor : 사용하는 state가 refresh하고 쓸 수 있도록 기다려 주는 것
    await waitFor(() => {
      isLoggedInVar(true);
    });
    getByText('logged-in');
  });
});
