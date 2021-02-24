import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from '../components/header';
import { Restaurants } from '../pages/client/restaurants';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { Search } from '../pages/client/search';
import { Category } from '../pages/client/category';
import { Restaurant } from '../pages/client/restaurant';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { AddRestaurant } from '../pages/owner/add-restaurants';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';
// switch는 하나의 route만 인식해서 변수처럼 component를 설정해줌
// key는 일종의 규칙임 array반환 형식으로 route를구성 한경우 key를 입력해줘야함
const clientRoutes = [
  {
    path: '/',
    component: <Restaurants />,
  },
  {
    path: '/search',
    component: <Search />,
  },
  {
    path: '/category/:slug',
    component: <Category />,
  },
  {
    path: '/restaurants/:id',
    component: <Restaurant />,
  },
];

// 공통적으로 사용되는   routes
const commonRoutes = [
  { path: '/confirm', component: <ConfirmEmail /> },
  { path: '/edit-profile', component: <EditProfile /> },
];

const restaurantRoutes = [
  { path: '/', component: <MyRestaurants /> },
  { path: '/add-restaurant', component: <AddRestaurant /> },
  { path: '/restaurants/:id', component: <MyRestaurant /> },
  { path: '/restaurants/:id/add-dish', component: <AddDish /> },
  { path: '/restaurants/:restaurantId/add-dish', component: <AddDish /> },
];

// ME_QUERY는 front-end에서 호출하기위한용도
// gql은 front-end와 backend를 연결해주는 apollographql 도구

export const LoggedInRouter = () => {
  // query문을 쉽게 사용할수있게 불러와주는 훅
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      // h-screen: 브라우저상에서 보이는 만큼의 높이
      // flex: display:flex설정
      // justify-center, items-center: 가로 정렬 세로정렬
      <div className="h-screen flex justify-center items-center">
        {/* tracking-wide: 자간 넓이 조절 */}
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      {/* switch밖에 있으니깐 어디서든 로그인된 상태에선 어떤 route이던지 항상 나타남 */}
      <Header />
      {/* router컨트롤 방법 */}
      <Switch>
        {data.me.role === 'Client' &&
          clientRoutes.map(route => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {data.me.role === 'Owner' &&
          restaurantRoutes.map(route => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map(route => (
          <Route key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))}
        {/* potato를입력하면 / 로 이동함 */}
        {/* <Redirect from="/potato" to="/" /> */}

        {/* 없는 경로를 입력하면 / 로 이동함 */}
        <Route>
          <NotFound />
        </Route>
        {/* <Redirect to="/" /> */}
      </Switch>
    </Router>
  );
};
