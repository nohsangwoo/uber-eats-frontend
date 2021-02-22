import { gql } from '@apollo/client';
import React from 'react';
import { RESTAURANT_FRAGMENT } from '../../fragments';

const MY_RESTAURANTS_QUERY = gql`
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
  return <h1>My restaurants</h1>;
};
