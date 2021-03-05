/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: searchRestaurant
// ====================================================

export interface searchRestaurant_allCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface searchRestaurant_allCategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: searchRestaurant_allCategories_categories[] | null;
}

export interface searchRestaurant_searchRestaurant_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface searchRestaurant_searchRestaurant_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: searchRestaurant_searchRestaurant_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface searchRestaurant_searchRestaurant {
  __typename: "SearchRestaurantOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  restaurants: searchRestaurant_searchRestaurant_restaurants[] | null;
}

export interface searchRestaurant {
  allCategories: searchRestaurant_allCategories;
  searchRestaurant: searchRestaurant_searchRestaurant;
}

export interface searchRestaurantVariables {
  input: SearchRestaurantInput;
}
