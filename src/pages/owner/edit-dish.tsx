import React from 'react';
import { useParams } from 'react-router-dom';

interface IParams {
  dishId: string;
}

function EditDish() {
  const { dishId } = useParams<IParams>();
  console.log(dishId);
  return <div>edit dish</div>;
}

export default EditDish;
