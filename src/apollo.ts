import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  createHttpLink,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { LOCALSTORAGE_TOKEN } from './constants';
//  reactive variables를 정의 하고 기본값도 지정함
// token은 localstarage에서 LOCALSTORAGE_TOKEN라는 이름의 key에서 value를 가져오는데 값이 존재하지 않으면 null값이 넣어짐
const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
// token값이 있으면 true를 없으면 false를 저장하는 isLoggedInVar  reactive variables를 정의
export const isLoggedInVar = makeVar(Boolean(token));
// 초기값은 token으로 설정하는(토큰값을 기억함) authTokenVar reactive variables를 정의
export const authTokenVar = makeVar(token);

// 웹소켓을 위한 설정
const wsLink = new WebSocketLink({
  // 웹소켓을 적용할, 돌아가고 있는 graphql 백엔드의 주소
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    // 전달받는 params가 있는지 확인후 가져옴
    // ws버젼 http headers 가져오는 방법
    connectionParams: {
      'x-jwt': authTokenVar() || '',
    },
  },
});

const httpLink = createHttpLink({
  // 일반적인 http서버를 적용할, 돌아가고 있는 graphql 백엔드의 주소
  uri: 'http://localhost:4000/graphql',
});
// http headers로 토큰 보낼수있음
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // authTokenVar의 값이 없으면 ""을 반환하고 있으면 authTokenVar()값 반환
      'x-jwt': authTokenVar() || '',
    },
  };
});

//splitLink는 split함수의 반환이 true이면 wsLink를 가지고 false를 반환하면 httpLink를 가짐
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  // 모든 request마다 splitLink의 내용이 적용됨
  link: splitLink,
  cache: new InMemoryCache({
    // 타입정책 , 그냥 보일러 플레이트
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            // read는 field의 값을 반환하는 함수
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
