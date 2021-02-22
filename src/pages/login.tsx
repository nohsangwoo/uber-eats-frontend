import { gql, useMutation } from '@apollo/client';
import React from 'react';
import Helmet from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import { LOCALSTORAGE_TOKEN } from '../constants';
import nuberLogo from '../images/logo.svg';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';

export const LOGIN_MUTATION = gql`
  # $$ 은 apollo를 위해 변수라고 정의해주는것
  # PotatoMutation은 frontend에서만 사용되는 함수명
  # (apollo를 위한 함수명이고 아폴로로 변수를 전달하고 아폴로는 실행되는 쿼리문으로 해당 변수를 또 전달해줌)
  mutation loginMutation($loginInput: LoginInput!) {
    # 이부분은 playground에서 사용하는 쿼리문을 사용할때처럼 작성하면됨
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

// for typescript
interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  // register: 그냥 inpuit의 ref에 넣어줌
  // watch: 실시간으로 변화를 감지하는 기능
  // getValues:말그대로 값을 가져와주는 기능인듯
  // handleSubmit: submit제어
  // error: 정상작동 안될때의 내용을 가지고있음
  // useForm은 email과 password을 포함하는 타입
  // formState: 말그대로  form 의 현재 상태를 나타내줌
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    // input때마다 항상 변화해 준다는것
    mode: 'onChange',
  });

  // mutation이 성공시 제어하는 방법
  const onCompleted = (data: loginMutation) => {
    const {
      // data는 login 이란 이름의 mutation의 반환값인  error, ok, token 을 가지고있으니 이것을 destruture해준다
      login: { ok, token },
    } = data;
    if (ok && token) {
      // 로그인 mutaion이 성공하면 ok 와 token의 값이 존재하는데
      // LOCALSTORAGE_TOKEN은 key, token은 value인 object형식으로 localStorage에 저장
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      // 로그인 성공했을때 global state인 isLoggedInVar를 true 로 설정하여
      // router가 logged-inrouter.tsx를 가리키게 함
      isLoggedInVar(true);
    }
  };

  // useMutation: mutation문을 사용할때 불러오는 훅
  // [loginMutation, { loading, error, data }] 첫번째 인자와 두번째 인자의 정보
  // mutation의 정보는 LOGIN_MUTATION에서 불러오고 해당 mutation을 직접 사용하게되는건 loginMutation
  // laading: mutation이 실행되고있음을 나타냄, error는 실행도중 에러 내용표시, data는 실행되고난후 되돌려주는 data를 말함
  // 반환받는 return DTO정보
  // loginMutationVariables : 전달하는 input DTO정보
  //  data의 별명을 loginMutationResult 로 함 as같은거임
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    // onCompleted : mutation 성공시 핸들링
    // onError: mutation 실패시 핸들링
    onCompleted,
  });
  const onSubmit = () => {
    // mutation이 실행중일때는 작동하지 않도록 해주는 안전장치
    if (!loading) {
      // form에서 입력받은 email과 password의 값을 뽑아옴
      const { email, password } = getValues();
      // loginMutation은 LOGIN_MUTATION안에 정의된 apollo를 위한 PotatoMutation함수로 변수를 전달하고  mutaion을 실행시킴
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    // h-screen: height를 스크린의 크기만큼 채운다
    // flex: display:flex속성선언
    // items-center justify-center: 각각 align-items:center와 justify-contents:center 정용한것
    // bg-gray-800 배경색을 800만큼의 농도로 지정
    // mt-10 lg:mt-28 : 기본 margin-top의 값은2.5rem이고 큰 스크린에서(스크린의 크기가 1024px이상이면) margin-top 값은7rem이다
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      {/* width:100% 이고, max-width:작은 스크린사이즈다(이건 640px 마우스 호버하면 의미가 뜬다) */}
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        {/* width:13rem, margin-bottom:2.5rem; */}
        <img src={nuberLogo} className="w-52 mb-10" alt="logo_image" />
        {/* bg-white: 배경색 white */}
        {/* w-full: 가로크기 최대로(width:100%같은느낌인듯) */}
        {/* px(=padding horizontal, padding x 축) */}
        {/* py(padding y축) */}
        {/* pl = padding left, pr = padding right, pt = padding top , pb = padding bottom */}
        {/* w-30: width:30% */}
        {/*  w-full max-w-lg  widht:100%이고 width의 최대크기를 지정된 셋팅값중 lg만큼 */}
        {/* rounded : border-radius 정의 */}

        {/* flex-col : flex-direction:column */}
        {/* mt:margin-top */}
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          // grid단별 gap(차이?)를 3만큼 준다
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            // required옵션 및 규칙
            // react단에서도 한번더 required로 보호해줌
            ref={register({
              required: 'Email is required',
              // https://emailregex.com/ 에서 뽑아온 이메일 정규표현식
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            // 만약 name을 주지 않으면 useForm이 input을 찾지 못함
            name="email"
            // html에서도 한번더 보호해줌
            required
            type="email"
            placeholder="Email"
            // focus input을 클릭한 상태일때 옵션
            // shadow-inner 그림자 안쪽에 주는 옵션
            className="input"
          />

          {/* 에러가 pattern관련된 에러라면 따로 핸들링해줌 */}
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage={'Please enter a valid email'} />
          )}
          {/* error의 이유를 화면에표시*/}
          {/* 이메일입력 관련 일반적인 에러가 생겼을때 핸들링 (message 내용을 그냥 표시)*/}

          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            // ex) 비밀번호의 길이는 최소한 10자 이상이어야한다
            // ref={register({ required: 'Password is required', minLength: 10 })}
            ref={register({ required: 'Password is required' })}
            required
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />

          {/* 비밀번호 입력 관련 일반적인 에러가 생겼을때 핸들링 (message 내용을 그냥 표시) */}
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {/*별도의 특별한 에러종류를 골라서 핸들링 하고싶을때 ("minLength관련한 에러가 뜰때 핸들링 ")*/}
          <Button
            //  form의 현재 상태가 유효한지? 정상작동이 됐는지를 실시간으로 전달
            canClick={formState.isValid}
            loading={loading}
            actionText={'Log in'}
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Nuber?{' '}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
