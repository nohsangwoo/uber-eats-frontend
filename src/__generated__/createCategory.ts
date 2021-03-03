/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateCategoryInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createCategory
// ====================================================

export interface createCategory_createCategory {
  __typename: "CreateCategoryOutput";
  error: string | null;
  ok: boolean;
}

export interface createCategory {
  createCategory: createCategory_createCategory;
}

export interface createCategoryVariables {
  input: CreateCategoryInput;
}
