import { gql, useMutation } from '@apollo/client';
import React from 'react';
import Helmet from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import nuberLogo from '../images/logo.svg';
import { UserRole } from '../__generated__/globalTypes';
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../__generated__/createAccountMutation';
// 로그인시도해서 로그인 실패시 회원가입 화면 구현
export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    //getValues: form submit시 전송되는 값들 가지고있음
    getValues,
    // watch: 실시간으로 변화를 감지하여 변화가 있을때마다 register에 등록된 태그의 value를 가지고있음(name을 기준으로 구분함)
    watch,
    // form  submit시 나타나는 error
    errors,
    // handleSubmit: form submit이 성공 했을때와 실패했을때를 핸들링하기위한 함수
    handleSubmit,
    // formState: form의 현재 상태를 알려주는장치
    formState,
  } = useForm<ICreateAccountForm>({
    // onChange모드여야 input값의 변화가 있을때마다 form의 상태를 리렌더링 해줌
    mode: 'onChange',
    // 기본값을 설정하는 방법
    defaultValues: {
      role: UserRole.Client,
    },
  });

  // history를 사용하는 훅 원래는
  const history = useHistory();
  // mutation이 정상작동 하여 반환값을 가져왔을때의 핸들링
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    // 성공했으면 ok값이 true니깐 로그인 페이지로 넘어가서 로그인 진행
    if (ok) {
      // 로그인성공시 알람과함께 / router로 넘어감
      alert('Account Created! Log in now!');
      history.push('/');
    }
  };
  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
    // output DTO , input DTO순서
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role },
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" alt="logo" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Let's get started
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            ref={register({
              required: 'Email is required',
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            required
            type="email"
            placeholder="Email"
            className="input"
          />
          {/* 일반적인 에러의 핸들링 */}
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {/* 에러의 내용이 pattern과 관련이 있을때 핸들링 */}
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage={'Please enter a valid email'} />
          )}
          <input
            ref={register({ required: 'Password is required' })}
            required
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}

          <select
            name="role"
            ref={register({ required: true })}
            className="input"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={'Create Account'}
          />
          {/* create-account mutation실행시 에러가 존재하면 핸들링 */}
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?{' '}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};
