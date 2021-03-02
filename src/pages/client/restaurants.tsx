import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from '../../__generated__/restaurantsPageQuery';

// 두개의 쿼리를 동시에 실행시킴
// 모든 카테고리를 불러오는 것과
// 레스토랑을 불러오는것
const RESTAURANTS_QUERY = gql`
  # 여기서 입력되는 RestaurantsInput type은 백엔드에서 설정한 DTO임
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        # id
        # name
        # coverImg
        # slug
        # restaurantCount
        ...CategoryParts
      }
    }
    # 모든 음식점 가져오기
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

// useForm 을 위한 form에서 사용되는 input들 (사용되는 input들의 name)
interface IFormProps {
  searchTerm: string;
}

// 모든레스토랑과 음식 , 카테고리를 가져오기 위한 화면
export const Restaurants = () => {
  const [page, setPage] = useState(1);
  // output DTO, input DTO 순서
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
    // RESTAURANTS_QUERY로 전달하는 input arguement는 input{page:1} 이다
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  //   인자로 전달할 페이지
  const onNextPageClick = () => setPage(current => current + 1);
  const onPrevPageClick = () => setPage(current => current - 1);
  // register 사용하는 input에 등록하여 name으로 제어
  // handleSubmit : submit을 핸들링
  // getValue: Submit할때 input등을 이용하여 백엔드로 전달되는 값들
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    console.log(getValues());
    // url을 용하여 props를 url로 보내는방법
    history.push({
      pathname: '/search',
      // search로 보내면 사용자에게 url로 노출이됨
      search: `?term=${searchTerm}`,
      // state로 보내면 사용자에게 노출 안됨
      // state: {
      //   searchTerm,
      // },
    });
  };
  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
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
          <div className="flex justify-around max-w-sm mx-auto ">
            {/* 이건 카테고리 결과값을 반복하여 화면에 출력하는부분 */}
            {data?.allCategories.categories?.map(category => (
              // 카테고리를 클릭하면  parameter 방식으로 props를 함께 특정 router로 보내기
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
          {/* 레스토랑의 결과값이 존재한다면 화면에 출력*/}
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map(restaurant => (
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
            {/* pagination control */}
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
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
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
      )}
    </div>
  );
};
