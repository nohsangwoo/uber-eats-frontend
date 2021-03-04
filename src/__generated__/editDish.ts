/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditDishInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editDish
// ====================================================

export interface editDish_editDish {
  __typename: "EditDishOutput";
  ok: boolean;
  error: string | null;
}

export interface editDish {
  editDish: editDish_editDish;
}

export interface editDishVariables {
  input: EditDishInput;
}
