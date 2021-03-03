import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useHistory } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurants } from '../../__generated__/myRestaurants';

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);
  const CONSTANTS = {
    RESTAURANT: 'RESTAURANT',
    CATEGORIES: 'CATEGORIES',
  };
  const history = useHistory();

  const moveRoute = (CONSTANT: string) => {
    console.log('gggg', CONSTANT);
    if (CONSTANT === CONSTANTS.RESTAURANT) {
      history.push('/add-restaurant');
    } else if (CONSTANT === CONSTANTS.CATEGORIES) {
      history.push('/add-category');
    }
  };
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="max-w-screen-2xl mx-auto mt-32">
        <h2 className="flex felx-row justify-center w-full text-4xl font-medium mb-10 border-t-4 border-b-4 border-black py-2">
          My Restaurants
        </h2>

        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no restaurants</h4>
            <div>Create one &rarr;</div>
          </>
        ) : (
          <>
            <div className="flex flex-row justify-around border-t-2 border-black">
              <div
                onClick={() => {
                  moveRoute(CONSTANTS.RESTAURANT);
                }}
                className="transition-all w-full text-xl mb-5 cursor-pointer hover:border-black border-2"
              >
                <h4 className="">Create more restaurants</h4>
                <div className="text-lime-600 hover:underline">
                  Create one &rarr;
                </div>
              </div>
              <div
                onClick={() => {
                  moveRoute(CONSTANTS.CATEGORIES);
                }}
                className="transition-all w-full text-xl mb-5 cursor-pointer hover:border-black border-2"
              >
                <h4 className="">Create more categories</h4>
                <div className="text-lime-600 hover:underline">
                  Create one &rarr;
                </div>
              </div>
            </div>

            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurants.restaurants.map(restaurant => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ''}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
