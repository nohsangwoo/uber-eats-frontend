import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import { useMe } from '../../hooks/useMe';
import {
  verifyEmail,
  verifyEmailVariables,
} from '../../__generated__/verifyEmail';

// VERIFY_EMAIL_MUTATION: frontend에서 useMutation을 사용하여 호출하기위한 변수
// gql: apollographql 과 frontend 그리고 백엔드를 연결해주기위한 도구
// verifyEmail: 실제로 사용 되는 백엔드 쿼리문 ( playground에서 사용하는 문법 그대로 사용함)
const VERIFY_EMAIL_MUTATION = gql`
  # 일단 apollographql로 인자를 전달한 후 backennd로 전송
  #  VerifyEmailInput! 이건  backend 애 정의된 input DTO 이름
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

// url로 전달된 쿼리형식 값을 뽑아올수있음 이걸 커스텀화 해서 사용도가능
// 일단은 그냥사용
// useLocation을 이용한 커스텀 훅 사용법
// const useGetCodeFromUrl = () => {
//   // useLocation:  react-router-dom에서 제공하는 훅,간단하게 location을 이 컴포넌트에서 사용할수있게 해줌
//   const location = useLocation();
//   //   URLSearchParams: 자바스크립트 함수임: url을 가지고 이것저것 추출하거나 제어할수있게 해줌
//   // 이것만 가지고는 암것도 못함
//   const URLSearchParamsFromLocation = new URLSearchParams(location.search);
//   //   get("code"): URLSearchParams로 작업이 끝났다면 get명령어로  code라는 이름을가진 값을 가져옴
//   const result = URLSearchParamsFromLocation.get('code');
//   return result;
// };

export const ConfirmEmail = () => {
  // output DTO, input DTO 를 typescript로 보호
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push('/');
    }
  };
  //   outputDTO , input DTO 순서의 typescript를 위한 DTO
  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      //  mutation이 성공했을때 핸들링하기위한 옵션
      onCompleted,
    }
  );

  //   hook은 밖에서 선언해야함 useEffect안에 또다른 훅을 선언 못함
  // 이걸 verifyEmail의 code값으로 넣어주면됨
  // 이렇게 하는방법도 있다
  // const getCodeFromUrlQeury = useGetCodeFromUrl();

  useEffect(() => {
    const [_, code] = window.location.href.split('code=');
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, [verifyEmail]);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Verify Email | Nuber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
