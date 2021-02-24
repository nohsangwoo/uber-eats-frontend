# 14 FRONTEND SETUP

- npx create-react-app uber-eats-frontend --template=typescript

# 14.1 Tailwind css

https://tailwindcss.com/

- npm install tailwindcss
- vsc extensions Tailwind css intelliSense
  (Tailwind css 자동완성기능)
  node -v 12이상에서만 작동함

# 14.2 Tailwind css part2

- npm install @types/react
  업데이트 해줘야 에러 안남
  (react 17.x.x버젼 올라온지 얼마안나온 시기 기준(2021-02-13))

- custom css 방법
  Tailwind css - class형식으로 나만의 css를 만들어서 사용하고싶을때 설정방법

- post process 라이브러리 적용해야함
  npm install postcss@latest autoprefixer@latest

- autoprefixer 모든 브라우저에서 호환 가능한 세팅을 자동으로 해줌
  (-moz-border-radius,-ms-border-radius같은거...)

- postcss.config.js 파일 작성후
  Tailwind 프레임워크를 확장하기 위한 설정

```
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

(npx tailwindcss init)

- vsc extensions Tailwind css intelliSense에서 tailwind.config.js을 자동으로 찾음

tailwind를 커스터마이즈하기위해 tailwind config파일이 필요하고
tailwind를 일반 css파일로 빌드하기 위해 postcss config파일이 필요함
그리고 tailwind를 이 프로젝트의 css에 include하는것

- 마지막에 package.json설정
  "tailwind:build": "tailwind build ./src/styles/tailwind.css -o ./src/styles/styles.css",
  만약 나만의css설정을 하고싶으면 tailwind.css에 custom css내용을 넣고 npm run tailwind:build 해주면됨

- "start": "npm run tailwind:build & react-scripts start",
  custom css 변경(추가 또는 삭제 및 수정)이 이루어진경우 tailwind css를 새로build하기위한 장치
- tailwind css autocomplete 적용법

  1. setting.json에 추가

  ```
  "css.validate": false,
  "tailwindCSS.experimental.classRegex": [],
  "tailwindCSS.emmetCompletions": true
  ```

  2. HTML CSS Support - CSS Intellisense for HTML 설치

# 14.3 Apollo Setup

- 참고
  https://www.apollographql.com/docs/react/get-started/
  npm install @apollo/client graphql
  apollo/client graphql설정해줌 (백엔드graphql와 쉽게 통신하게 해주는 툴)

# 14.4 React Router Dom

- 참조
  https://reactrouter.com/web/guides/quick-start
- npm install react-router-dom

# 15 AUTHENTICATION

# 15.0 Local Only Fields

apollo에서 local storage처럼 사용할수있는 방법

apollo.ts에서 typePolicies안에 read()함수를 이용하여 설정
ex)...

```
typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            // read는 field의 값을 반환하는 함수
            read() {
              return false;
            },
          },
        },
      },
    },
```

이런식
이걸 다른곳에서

```
const IS_LOGGED_IN = gql`
  query isLoggedIn {
    isLoggedIn @client
  }
`;
```

이렇게 정의하고(사용준비)
사용하는 컴포넌트안에서

```
const { data } = useQuery(IS_LOGGED_IN);
<!-- expecte "data" value is "false" -->
console.log(date);
```

이렇게 사용

- reactive variables
  (참고)
  https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/
  원래는 위의 방법을 사요하여 read and modify를 해야하지만
  이 신기술을 사용하면 어디서든 쉽게 읽거나 수정할수있음

<!-- 저장소 정의하고 값을 읽거나 수정 하는 방법 -->

불러올때도 hooks로 대체
ex)..
const isLoggedIn = useReactiveVar(inLoggedInVar);

# npm install apollo-link-logger (적용필요)

로거 적용법 참조
https://github.com/blackxored/apollo-link-logger

적용하려면 apollilink 사용해야함
npm install apollo-link-state --save

https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/apollo-link-logger
여기서 apollolink있는지 확인후 있으면 설치
(근데 없으니깐)
react-app-env.d.ts에 해당 라이브러리를
declare module "apollo-link-logger"
이렇게 추가

<!-- 적용예시 -->

https://codesandbox.io/s/73fco?file=/src/index.js:1215-1220

# persist (적용필요)

- npm install apollo3-cache-persist  
  설치 후 참조
- https://www.apollographql.com/docs/react/caching/advanced-topics/#cache-persistence
- https://stackoverflow.com/questions/59211666/how-to-use-localstorage-with-apollo-client-and-reactjs
  두번째 참조

# 15.1 React Hook Form

- npm install react-hook-form
- form 에관한 라이브러리
  https://react-hook-form.com/

- register
  그냥 inpuit의 ref에 넣어줌

# 15.2 React Hook Form part Two

- useForm에서 타입스크립트 적용법 및 frontend의 error 핸들링

```예시
import React from 'react';
import { useForm } from 'react-hook-form';

//for typescript
interface IForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  // register: 그냥 inpuit의 ref에 넣어줌
  // watch: submit했을때의 제어되는 값을 가지고있음 (일종의 logger기능)
  // handleSubmit: submit제어
  // error: 정상작동 안될때의 내용을 가지고있음

  const { register, watch, handleSubmit, errors } = useForm<IForm>();
  const onSubmit = () => {
    // email만 보고싶다면 watch("email") 이렇게 사용
    console.log(watch());
  };
  const onInvalid = () => {
    console.log('cant create account');
  };
  console.log(errors);
  return (
    <div>
      <h1>Logged Out</h1>
      {/* form의 onSubmit은 handleSubmit을 통해 관리됨*/}
      {/* 이때 첫번째 인자는 유효할때 불려오는 함수 두번째 인자는 유효하지 않을때 불려오는 함수 */}
      {/* 유효할때는 onSubmit함수를 불러오고 유효하지 않을때는 onInvalid함수 불러옴*/}
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          {/* useForm()사용때 name,type 필수 */}
          <input
            ref={register({
              // required옵션 및 규칙
              required: 'This is required',
              // handleSubmit에서  onInvalid 가 불려오는 조건(유효성 검사)
              // regular expression(정규표현식)으로 검증하는 방법
              pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
              // 또는 valitate방식으로 검증가능
              //validate:(email:string)=> email.includes("@gmail.com")
            })}
            name="email"
            type="email"
            placeholder="email"
          />
          {/* error의 이유를 화면에표시*/}
          {errors.email?.message && (
            <span className="font-bold text-red-600">
              {errors.email?.message}
            </span>
          )}
          {/* error의 이유가 정규표현식에 부합하지 않아서 생기는 에러일때 표시하는 화면 */}
          {errors.email?.type === 'pattern' && (
            <span className="font-bold text-red-600">Only gmail allowed</span>
          )}
        </div>
        <div>
          <input
            ref={register({ required: true })}
            name="password"
            type="password"
            required
            placeholder="password"
          />
        </div>
        <button className="bg-yellow-300 text-white">Submit</button>
      </form>
    </div>
  );
};

```

# 15.3 Roouter and @types

- npm install @types/react-router-dom
  이걸 설치하면 typescript가 react-router-dom을 import할때 불평이없음
  근데 만약 추가하려는 라이브러리가 typescript랑 호환이 안된다면
  react-app-env.d.ts에 해당 라이브러리를
  (예시) declare module "react-router-dom" <== 이와같이 해준다
  다만 이렇게 예외처리하면 typescript보호를 받지못해서 추천하지않음

- switch 오직 한 route만 임포트할수 있게 도와주는 장치(정확한 주소를 입력해야함)

# 15.4 Form design

tailwind css 듀토리얼

# 15.5 Form Login

- ring
  부트스트랩처럼 정해진 css프리셋이 있고 그걸 ring으로 불러오는것뿐임

# 15.6 Login mutation part

- react component에 type을 정의하는 방법
  form-error.tsx참고

- apollo codegen 설치
  <!-- golobal하게 설치하고 또한 project에도 설치하기 -->

  $ npm install -g apollo && $ npm install apollo

  https://github.com/apollographql/apollo-tooling

# 15.7 apollo codegen

back-end에서 mutations, query responses, input type을 자동완성해줌 (개꿀)
뮤테이션의 타입, 쿼리날렸을대 반환되는 값의 타입, 전달하는 인자 타입등읠 다 알려줌

(DTO가 schema가 됐고, schema가 front-end를 위한 typescript가 된것임)

즉 백엔드로 정확하게 어떤타입을 보내야하는지 백엔드로부터 어떤 타입이 되돌아오는지 이 apollo codegen tool로 알수있음

이걸 위해서
apollo.config.js 를 root경로에 생성해주고 옵션설정해줘야함

```
module.exports = {
  client: {
    includes: ["./src/**/*.tsx"],
    tagName: "gql",
    service: {
      name: "nuber-eats-backend",
      url: "http://localhost:4000/graphql",
    },
  },
};
```

아폴로는 frontend파일을 보면서 gql태그가 보이면 해당관련된 내용의 typescript definition을 보여줌
즉 내가 작성한 gql태그를 내가 볼수있게 정리해주는 것 뿐

```
<!-- 각각의 파일옆에 폴더를 만들어서 mutation dto를 위한 typescript interface를 만듬 -->
apollo client:codegen --target=typescript
```

- package.json에 추가

```
<!-- src/하위경로에 __generated폴더안에 생성된 파일을 모아줌 -->
"apollo:codegen": "apollo client:codegen src/__generated__ --target=typescript --outputFlat",
```

이걸 실행하면 front-end를 위한 일종의 dto파일을 생성해줌 해당 파일에서 생성된 interface를 끌어와 mutation을 typescript로 보호해주면됨

# 15.8 Login Mutation

front-end에서 apollo로 전달하고 apollo에서 backend로 전달하는 인자를 위한 DTO 설정

- onComplete 사용법 Mutation사용시 컨트롤 가능한 옵션

# 15.9 Login Mutation part Two codegen마무리

codegen실행시 변경전의 내용을 그대로 가지고있는 경우가있어서
이전에 생성된 **generated**폴더를 지우고 새로운 **generated** 폴더를 만들어 codegen으로 생성된 파일을 저장하게 만들고싶음
근데 리눅스랑 맥은 같은 명령어 사용하는데 윈도우는 명령어가 달라서 crossplatform(양쪽에서 둘다 사용가능한 방식)방식으로 지우고 다시 생성할꺼임

- npm i rimraf
  https://www.npmjs.com/package/rimraf 참고

# 15.10 UI Clonning

- svg이미지 불러오는법
- UI디자인은 모바일 디자인부터 적용

- sm: small screen , md: medium screen, lg:large screen을 의미

<!-- transition duration-500 ease-in-out  -->

# 15.11 UI Clonning part Two

- extends tailwind colors..
  https://tailwindcss.com/docs/customizing-colors#color-palette-reference 참고
  formState.isValid의 값을 실시간으로 변화하는걸 감지하고싶다면
  formState.isValid의 감지는 mode를 onChange나 onBlur로 바꿔줘야 실시간으로 감지해서 현상태를 알려줌
  mode 설명
  onChange: input값이 입력될때마다 감지
  onSubmit(default): submit event가 일어날 때 감지
  onBlur: 포인터의 초점이 input박스 안에 있다가 밖으로 나올떄 감지

# 15.12 Create Account Mutation

- react helmet 라우트별 타이틀을 변경시켜주는 라이브러리
  npm install react helmet
- typescript를 위해서 @types/react-helmet 설치
  npm install @types/react-helmet

# 15.13 Create Account Mutation part two

- email regular expression
  이메일 정규표현식 가져오기
  https://emailregex.com/ 참조
  위 사이트에서 Javascript 버젼을 이 프로젝트의 이메일 input의 pattern에 적용

# 15.14 Saving the Token

- npm install react-helmet-async
  react-app-env.d.ts에 declare module 'react-helmet-async'; 설정

로그인 성공하면 token값을 기억하고 로그인상태를 유지하고싶음 그러려면 localstorage에서 token값을뽑아와
isLoggedInVar, authTokenVar 라는 두개의 reactive variables을 정의한다
로그인 상태를 true, false로만 나타내는 isLoggedInVar
토큰값을 기억하는 authTokenVar를 정의하고 사용한다
이것은 유연하고 실시간으로 사용할수있는 global state이다.
localstorage는 실시간으로 사용하기엔 조금 무리가 있음

# npm 자동 업데이트

일반적으로 npm 패키지 처럼 설치하면 됩니다. 다만 global로 설치를 하는 것이 패키지 목적에 더 부합할 것 같습니다.

- $ npm install -g npm-check-updates
  사용법
  ncu를 CLI로 입력을 하면 실제 package.json이 업데이트가 되는 것이 아니라 업데이트 되는 항목을 보여줍니다.
  ncu -u를 CLI로 입력을 하면 package.json의 dependencies와 devDependencies에 있는 각 패키지들이 최신버전으로 변경이 됩니다. 이때 실제로 node_modules폴더에 패키지가 변경되는 것이 아니므로 npm install을 실행해서 실제로 패키지를 변경해 주면 됩니다.

-$ ncu -u
-$ npm install

출처: https://uxgjs.tistory.com/58 [UX 공작소]

# 15.15 Using the Token

1. 첫페이지는 로그인페이지
2. 로그인에 실패하면 create-account 페이지로 가서 계정생성 하는 mutation실행
3. 로그인에 성공하면 토큰을 localstorage에 저장하고
4. https header에 x-jwt라는 키의 값으로 저장한다
   (apolo.ts에서 setContext설정)
5. 그리고 키값을 기준으로

# 15.16 Routers and 404s

지금까진 정해진 라우터 이외의 곳을가면 "/"경로로 가버렸는데
이제 정해지지 않은 경로로 가면 404페이지를 로드한다

# 15.17~18 Header part (navigation)

- header route 항시 뜨게 하는방법
- fontawesome 적용법
  https://fontawesome.com/how-to-use/on-the-web/using-with/react 참고
  https://github.com/FortAwesome/react-fontawesome

```
npm i --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/react-fontawesome
```

https://fontawesome.com/icons 에서 아이콘을 확인한다음
fa+아이콘이름 으로 불러오면됨
ex)...

```
<FontAwesomeIcon icon={faUser} className="text-xl" />
```

- custom query hoos
  (/hooks/useMe.tsx)
  커스텀 훅을 따로 만들어서 query문을 불러올때 어디선가 처음 불러올때만 백엔드랑 연동하여 불러오고 cache에 저장한다
  이후 똑같은 커스텀훅을 사용하여 query값을 불러올때 cache에 저장된 값을 가져온다

# 16 USER PAGES

- router의 switch는 한개의 route만 실행하겠다는 의미임
  (중복되는 경로가 있다면 정확하게 입력된 한개의 경로만 실행하겠다.)

# 16.0 Verifying Email part One

- URLSearchParams
  https://developer.mozilla.org/ko/docs/Web/API/URLSearchParamsx 참조
  URL로 이루어진 쿼리문자열어 대하여 일적 작업을 도와주는 유틸리티
  search, get, getAll 등등...
  컴포넌트에서 파라미터를 전달받은게 아니라면 이렇게 사용함

```
// url로 전달된 쿼리형식 값을 뽑아올수있음 이걸 커스텀화 해서 사용도가능
// 일단은 그냥사용
const useGetCodeFromUrl = () => {
  // useLocation:  react-router-dom에서 제공하는 훅,간단하게 location을 이 컴포넌트에서 사용할수있게 해줌
  const location = useLocation();
  //   URLSearchParams: 자바스크립트 함수임: url을 가지고 이것저것 추출하거나 제어할수있게 해줌
  // 이것만 가지고는 암것도 못함
  const URLSearchParamsFromLocation = new URLSearchParams(location.search);
  //   get("code"): URLSearchParams로 작업이 끝났다면 get명령어로  code라는 이름을가진 값을 가져옴
  const result = URLSearchParamsFromLocation.get('code');
  return result;
};

```

# 16.1 Verifying Email part Two

- 현재 cache에 저장된 me정보를 덮어씌우는 방법
  https://www.apollographql.com/docs/react/caching/cache-interaction/#writequery-and-writefragment 참고

- cache정보 찾기
  크롬브라우저에서 apollo extension에서 cache탭에 들어가면 cache된 정보 나옴

confirm-email.tsx 참고

# 16.2 Edit Profile part One

- useHistory() 훅 사용법

# 16.3 Edit Profile part Two

- edit profile 적용
- form 적용

# 16.4 writeFragment vs Refetch

- refetch
  useQuery에 있는 기능인데 이것을 call하면 query를 다시 fetch해줌(새로고침같은 개념인듯)

  const { data: userData, refetch } = useMe();
  이렇게 useQuery훅에서 뽑아오고

await refetch()이렇게 사용하면됨

# 17 RESTAURANTS

# 17.0 Restaurants Query

- 모든 레스토랑과 음식들, 모든 카테고리를 불러오는 쿼리를 작성

# 17.1 Categories Style

- 레스토랑 페이지 css 작업
- 카테고리 이미지는 uber-eats 홈페이지에서 따옴(어차피 상업용이 아니니깐)

# 17.2 Restaurants List

- tailwind css group-hove사용법 상위 클래스 어떤부분에 마우스가 올려졌을때 hover가 작동할지 지정

```ex)
<div className="flex flex-col group items-center cursor-pointer">
  <div
    className=" w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
    style={{ backgroundImage: `url(${category.coverImg})` }}
  ></div>
  <span className="mt-1 text-sm text-center font-medium">
    {category.name}
  </span>
</div>
```

- grid 사용법

```
<div className="grid mt-10 grid-cols-3 gap-x-5 gap-y-10">
```

- 배경이미지 넣기

```
<div
  // 레스토랑의 이미지가 있다면 이미지를 표현
  // 다만 기본 배경색은 bg-red-500
  style={{ backgroundImage: `url(${restaurant.coverImg})` }}
  className="bg-red-500 bg-cover bg-center mb-3 py-28"
></div>
```

# 17.3 Restaurants Pagination

- restaurant 모듈화
- pagenation 기능

# 17.4 Search part One

- useHistory()을 시영히야 특정 url로 props를 같이 보내는 방법
  useHistory는 어디론가 갈수있음

```
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    console.log(getValues());
    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };
```

이때 props로 보내는 방법은 search 방법과 state 방법이있는데

- search로 보내면 사용자에게 url로 노출이됨

```
search: `?term=${searchTerm}`,

```

- state로 보내면 사용자에게 노출 안됨

```
state: {
  searchTerm,
},
```

- useLocation()을 사용하여 전달받은 props를 끌어옴

# 17.5 Search part Two (lazy query - 조건에 따라 쿼리가 실행되게 설정)

- history.push와 history.replace의 차이
  // replace는 history기록에 남지 않음
  // push는 history 기록에 남아서 되돌아갈수있음

- gql에서 불러올수 있는query fragment (재사용용)
  같은 query 를 여러곳에서 재사용할것 같을때 쿼리문을 저장해놨다가 불러와서 사용하는 개념
  이 fragment를 사용하려면 apollo.config.js의 설정
  ```
   includes: ['./src/**/*.{tsx,ts}'],
  ```
- useLazyQuery

# 17.6 Category

- useParams 사용법

# 17.7 Code Challenge

- search 화면과 category화면 구현하기

# 17.8 Restaurant part One

- 메인페이지에서 나열된(검색된) 레스토랑 리스트중 하나를 클릭하면 해당 레스토랑 페이지로 이동함
- 한개의 restaurant를 id로 검색해서 정보를 출력하는 component

# 17.9 Restaurant part Two

- restaurant route를 대충 구상

# 18 TESTING REACT COMPONENTS

# 18.0 Tests Setup

- npm test -- --coverage --watchAll=false
  에러있지만 상관없음
  모든 부분의 coverage를 확인해서 보여줌
- jest가 특정 폴더에서만 테스트 파일을 찾을수 있게 설정(package.json 설정)
  collectCoverageFrom 사용
  https://jestjs.io/docs/en/configuration.html#collectcoveragefrom-array 참고

```
 "jest": {
    "collectCoverageFrom": [
      "./src/components/**/*.tsx",
      "./src/pages/**/*.tsx",
      "./src/routers/**/*.tsx"
    ]
  }
```

https://create-react-app.dev/docs/running-tests#coverage-reporting 참고

- setting up on package.json

# 18.1 Test filename conventions

```
1. __test__ 폴더안에 js파일을 만든다
2. file이름.test.js
3. file이름.spec.js

```

위 규칙대로 파일을 생성하면 jest가 자동으로 감지해서 테스트 파일인지 알아챔

테스트 코드 짜는법

- npm run test
  테스트 명령어

# 18.2 testing library

- 실제로 구현하는 세부적인 implementation을 테스팅하는게 아니라
  유저입장에서 눈에 보이는 부분을 테스팅 하는것

# 18.3 FormError and Restaurant Tests

- link로 감싸져있는경우의 검사방법
  restaurant.spec.tsx 참고

# 18.4 Testing Header and 404

# 18.5 mock apollo client

https://www.npmjs.com/package/mock-apollo-client 참고

# 18.8 CreateAccount Tests part One

# 18.9 CreateAccount Tests part Two

# 18.11 finish

# 19 E2E REACT TESTING

# 19.0 Installing Cypress

https://www.cypress.io/ 참고
설치가 좀 오래걸림

설치 후

- npx cypress open
  cypress.json 라는 파일과 cypress폴더가 root경로에 생길꺼임

직접 테스트를 만들기위해서 cypress/integration/examples폴더를 지워줌

- cypress 폴더안에 typescript를 구성하기위해 tsconfig.json 셋업을 해줌
  옵션내용

```
{
  "compilerOptions": {
    <!-- js파일을 포함하고있는지 여부 -->
    "allowJs": true,
    <!-- cypress가 설치된 경로 -->
    "baseUrl": "../node_modules",
    "types": ["cypress"],
    "outDir": "#"
  },
  <!-- 모든 폴더, 모든 파일 , 모든 extension -->
  "include": ["./**/*.*"]
}

```

첫번째 테스트 파일을 생성
테스트를 실행하기전 npm run start해줘야함

# 19.1

매번 테스트시 localhost:3000으로 가라고 명령하지 않기위해서
cypress.json의 옵션에 baseUrl추가

```
{
  "baseUrl": "http://localhost:3000"
}
```

- 테스트 코드를 작성할때 dom element를 불러오는 방식을 명확하게 변경
  https://testing-library.com/docs/cypress-testing-library/intro/ 참고
  npm i @testing-library/cypress --save-dev
  설치후 cypress/tsconfig.js 에도 적용해야함
  또한 cypress/support/commands.js 에도 적용

-------------------error------------------- Timed out retrying: Expected container to be an Element, a Document or a DocumentFragment but got Window. -------------------end of error -----------------

- element 불러오시기 전에 .get('body') 중간에 넣어줌
  https://github.com/testing-library/cypress-testing-library/issues/142 참조

예를들면

```
cy.visit('/')
.get('body') .findByRole('button')
.should('not.have.class', 'pointer-events-none');
```

# 19.2 Login E2E

Access to localstorage on cypress

# 20.0 Order Dashboard Routes

- 새로운 router컨트롤 패턴

# 20.1 Create Restaurant part One

# 20.2 File Upload part One

- file upload on nestjs way
  https://docs.nestjs.com/techniques/file-upload 참고
  이것은 multer와 연계하여 사용됨
  https://www.npmjs.com/package/multer 참고

# 20.5 Cache Optimization part One

- 음식점을 생성하고 이전 페이지로 돌아가면 음식점은 DB상에 추가됐지만
  클라이언트상의 캐쉬에는 업데이트 되지 않은 상태이니깐
  수동으로 음식점 생성 작업 이후 클라이언트쪽의 캐쉬에 업데이트된 음식점 정보를 업데이트 해줌
- 또는 regetchQueries 옵션을 이용한다.
  (mutation 작업이후 쿼리를 다시 불러와서 클라이언트상의 캐쉬를 업데이트 하는방법)
  (하지만 이 작업은 DB를 한번 더 건드는 작업이기에 앱의 사용량이 높으면 높을수록 DB에 걸리는 부하가 많음)
  또한 오버페칭의 문제도 있음

```예시
 const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    // refetchQueries: 이걸로 작업하면 자동으로 MY_RESTAURANTS_QUERY를 실행하여 클라이언트의 캐쉬를 업데이트 해준다
    <!-- MY_RESTAURANTS_QUERY: 클라이언트쪽 캐쉬를 업데이트할 쿼리 내용  -->
    refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });
```

- writeQuery 사용법
  https://www.apollographql.com/docs/react/caching/cache-interaction/ 참고

```
 const client = useApolloClient();
  useEffect(() => {
    setTimeout(() => {
      // 이전에 저장된 쿼리 캐쉬를 읽어오는 것
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      console.log(queryResult);

      // 그리고 캐쉬를 오버라이딩 해줌
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          // 이전에 존재했던 쿼리를 먼저spread하고
          // 그다음 새로 업데이트한 쿼리 내용을 덮어씌움
          ...queryResult,
          restaurants: [1, 2, 3, 4],
        },
      });
    }, 8000);
  }, []);
```

# 20.6 Cache Optimization part Two

- 20.5는 되는지 테스트 20.6은 실제 적용

# 20.7 Restaurant Dashboard part One

- Owner가 자신의 레스토랑중 하나를 클릭했을때
  클릭한 레스토랑정보를 불러오는 쿼리와함께 이동하는 route생성

# 20.8 Create Dish part One

- owner가 restaurant를 불러올때 메뉴도 같이 불러온다
- create menu 기능 만들기

# 20.9 Create Dish part Two

- create dish 마무리
