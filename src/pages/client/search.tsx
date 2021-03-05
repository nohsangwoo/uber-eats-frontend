import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  searchRestaurant,
  searchRestaurantVariables,
} from '../../__generated__/searchRestaurant';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;
interface IFormProps {
  searchTerm: string;
}

export const Search = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const history = useHistory();
  const onNextPageClick = () => setPage(current => current + 1);
  const onPrevPageClick = () => setPage(current => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();

  //   tuple(array)의 첫번째 인자가 trigger임
  //지정만해두면 자동으로 component가 불려올때 자동으로 쿼리가 실행되는것을
  // lazyQuery로 일단 막아둔다음에 ,첫번째 인자인 callQuery를 트리거로 삼아서
  // 해당 트리거를 작동할때 Query가 실행하도록 지정해둠
  const [callQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const [, query] = location.search.split('?term=');
    console.log(query);
    if (!query) {
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
  }, [history, location]);

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };
  console.log(data?.searchRestaurant?.restaurants?.length);
  return (
    <div>
      <Helmet>
        <title>
          {`${
            data?.searchRestaurant?.restaurants?.length !== 0
              ? 'Search'
              : 'Not Found '
          }`}{' '}
          | Uber Eats
        </title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          ref={register({ required: true, min: 3 })}
          name="searchTerm"
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="flex w-full justify-around  mx-auto overflow-auto">
            {data?.allCategories.categories?.map(category => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <div className="flex flex-col group items-center cursor-pointer">
                  <div
                    className=" w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                    style={{ backgroundImage: `url(${category.coverImg})` }}
                  ></div>
                  <span className="mt-1 text-sm text-center font-medium">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {Boolean(data?.searchRestaurant?.restaurants?.length) ? (
            <div>
              <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                {data?.searchRestaurant?.restaurants?.map(restaurant => (
                  <Restaurant
                    key={restaurant.id}
                    id={restaurant.id + ''}
                    coverImg={restaurant.coverImg}
                    name={restaurant.name}
                    categoryName={restaurant.category?.name}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
                {page > 1 ? (
                  <button
                    onClick={onPrevPageClick}
                    className="focus:outline-none font-medium text-2xl"
                  >
                    &larr;
                  </button>
                ) : (
                  <div></div>
                )}
                <span>
                  Page {page} of {data?.searchRestaurant?.totalPages}
                </span>
                {page !== data?.searchRestaurant?.totalPages ? (
                  <button
                    onClick={onNextPageClick}
                    className="focus:outline-none font-medium text-2xl"
                  >
                    &rarr;
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center max-w-md items-center mx-auto mt-48">
              <h2 className="font-semibold text-2xl mb-3">Page Not Found.</h2>
              <h4 className="font-medium text-base mb-5">
                The page you're looking for does not exist or has moved.
              </h4>
              <Link className="hover:underline text-lime-600" to="/">
                Go back home &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
