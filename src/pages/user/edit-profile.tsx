import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { useMe } from '../../hooks/useMe';
import {
  editProfile,
  editProfileVariables,
} from '../../__generated__/editProfile';

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  // 캐쉬에 user정보를 업데이트 할껀데 그러려면 apolloClient를 쉽게 제어할수있는 훅을 가져옴
  const client = useApolloClient();

  // mutation이 성공적으로 끝났다면 data를 받환 받는다 (backend 설정을 그리해둠)
  const onCompleted = (data: editProfile) => {
    // 반환받은 값에서 ok가 제대로 true상태로 반환됐다면 edit 된 user정보를 cache에도 업데이트 해줌
    const {
      editProfile: { ok },
    } = data;
    // ok:true이;고 userData도 존재한다면
    if (ok && userData) {
      // userData에서 email:(prevEmail이라고 뽑아온 email값을 별명으로 정함), id를 뽑아옴
      const {
        me: { email: prevEmail, id },
      } = userData;
      // 그리고 form으로 전송된 input값들을 뽑아옴(email: newEmail이라고 별명을 지음)
      const { email: newEmail } = getValues();
      // 이전 email과 새로 전달받은 email의 값이 같지 않다면 cache에 덮어씌움
      if (prevEmail !== newEmail) {
        client.writeFragment({
          // id는 고유하니 그대로 사용하고 단지 사용되는 패턴은 (User:id 패턴임)
          id: `User:${id}`,
          // 일종의 보일러 플레이트임 아래와 같은 형식으로 기입
          fragment: gql`
            # 첫번째 이름인 EditedUser은 자유롭게 정의가능한 fragment이름
            # User는 백엔드에서 존재하는 테이블 이름
            # 이건 실제 작동이안이라 이렇게 하겠다는 정의 임
            fragment EditedUser on User {
              verified
              email
            }
          `,

          // 이부분은 실제로 cache에 덮어씌우는 기능을 함
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };

  //loading : mutation이 시 실행중인지 아닌지 표시해줌
  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    // mutation이 성공했을때 핸들링
    onCompleted,
  });

  // <IFormProps> form에서 input 으로 전달하는 인자들
  // handleSubmit:  submit 기능을 핸들링
  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    // input값이 변할때마다 감지하겠다
    mode: 'onChange',
    defaultValues: {
      // email input의 기본 value는 userData?.me.email이다
      email: userData?.me.email,
    },
  });

  // submit 핸들링
  const onSubmit = () => {
    // onSubmit작동시 전달되는 input값들
    // register에 등록된 name을 기준으로 값을 찾아옴
    const { email, password } = getValues();

    // mutation실행하는 방법
    editProfile({
      variables: {
        input: {
          // 이메일을 업데이트
          email,
          // 비밀번호가 빈칸이 아니라면 비밀번호를 포함하여 업데이트
          ...(password !== '' && { password }),
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          ref={register({
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          ref={register}
          name="password"
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};
