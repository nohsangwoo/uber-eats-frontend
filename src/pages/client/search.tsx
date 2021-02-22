import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useLocation } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import {
  searchRestaurant,
  searchRestaurantVariables,
} from '../../__generated__/searchRestaurant';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        # id
        # name
        # coverImg
        # category {
        #   name
        # }
        # address
        # isPromoted
        #  위의것을 RESTAURANT_FRAGMENT로부터 온 것으로 대체
        ...RestaurantParts
      }
    }
  }
  #   RESTAURANT_FRAGMENT를 사용하겠다는 선언
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const location = useLocation();
  const history = useHistory();
  //   tuple(array)의 첫번째 인자가 trigger임
  //   조건에따라 callQuery를 특정 조건에서 input인자와 불러오면 그때 실행됨
  //   이때 callQuery부분은 사용자가 원하는 이름으로 지정가는
  const [callQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    let cleanUp = false;
    if (!cleanUp) {
      const [_, query] = location.search.split('?term=');
      // defensive programming
      // console.log('query?존재?', query);
      if (!query) {
        // replace는 history기록에 남지 않음
        // push는 history 기록에 남아서 되돌아갈수있음
        return history.replace('/');
      }
      // 여기서 callQuery가 불리우는 조건은 전달받은 검색어(term)이 존재할때만 쿼리가 실행됨
      callQuery({
        variables: {
          input: {
            page: 1,
            query,
          },
        },
      });
    }
    return () => {
      cleanUp = true;
    };
  }, [history, location, callQuery]);

  console.log(loading, data, called);
  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <h1>Search page</h1>
    </div>
  );
};
