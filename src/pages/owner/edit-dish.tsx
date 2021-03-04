import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { DISH_FRAGMENT } from '../../fragments';
import { getDish, getDishVariables } from '../../__generated__/getDish';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

const GET_DISH_QUERY = gql`
  query getDish($input: GetDishInput!) {
    getDish(input: $input) {
      ok
      error
      dish {
        ...DishParts
      }
    }
  }
  ${DISH_FRAGMENT}
`;

interface IParams {
  dishId: string;
}

interface IFormProps {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

function EditDish() {
  const { dishId } = useParams<IParams>();
  const { data, loading } = useQuery<getDish, getDishVariables>(
    GET_DISH_QUERY,
    {
      variables: {
        input: {
          dishId: +dishId,
        },
      },
    }
  );
  const dish = data?.getDish?.dish;
  console.log(dish, loading);

  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
  } = useForm<IFormProps>({
    mode: 'onChange',
  });

  const onSubmit = async () => {
    const { file, name, price, description, ...rest } = getValues();
    const actualFile = file[0];
    const formBody = new FormData();
    formBody.append('file', actualFile);
    const { url: photo } = await (
      await fetch('http://localhost:4000/uploads/', {
        method: 'POST',
        body: formBody,
      })
    ).json();

    const optionObjects = optionsNumber.map(theId => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));
    // createDishMutation({
    //   variables: {
    //     input: {
    //       name,
    //       price: +price,
    //       photo,
    //       description,
    //       restaurantId: +restaurantId,
    //       options: optionObjects,
    //     },
    //   },
    // });
    // history.goBack();
  };
  useEffect(() => {
    let cleanUp = false;
    if (!cleanUp) {
      setValue(`name`, `${dish?.name}`);
      setValue(`price`, `${dish?.price}`);
      setValue(`description`, `${dish?.description}`);
    }
    return () => {
      cleanUp = true;
    };
  }, [dish?.name]);

  const [optionsNumber, setOptionsNumber] = useState<string[]>([]);

  useEffect(() => {
    let cleanUp = false;
    if (!cleanUp) {
      if (dish?.options?.length) {
        for (let i = 0; i < dish?.options?.length; i++) {
          setOptionsNumber(current => [uuidv4(), ...current]);
        }
      }
    }
    return () => {
      cleanUp = true;
    };
  }, [dish?.options?.length]);
  const onAddOptionClick = () => {
    setOptionsNumber(current => [uuidv4(), ...current]);
  };

  const onDeleteClick = (idToDelete: string) => {
    console.log(idToDelete);
    setOptionsNumber(current => current.filter(id => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, '');
    setValue(`${idToDelete}-optionExtra`, '');
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Edit Dish | Uber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Dish</h4>
      {loading ? (
        'lodaing...'
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
        >
          <input name="firstName" type="text" ref={register} />
          <button onClick={() => setValue('name', 'Bill')}>
            Set First Name Value
          </button>
          <input
            className="input"
            type="text"
            name="name"
            placeholder={dish?.name || 'name'}
            ref={register({ required: 'Name is required.' })}
          />
          <input
            className="input"
            type="number"
            name="price"
            min={0}
            placeholder="Price"
            ref={register({ required: 'Price is required.' })}
          />
          <input
            className="input"
            type="text"
            name="description"
            placeholder="Description"
            ref={register({ required: 'Description is required.' })}
          />

          <div>
            <input
              type="file"
              name="file"
              accept="image/*"
              ref={register({ required: true })}
            />
          </div>
          <div className="my-10">
            <h4 className="font-medium  mb-3 text-lg">Dish Options</h4>
            <span
              onClick={onAddOptionClick}
              className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-"
            >
              Add Dish Option
            </span>
            {optionsNumber.length !== 0 &&
              optionsNumber.map(id => (
                <div key={id} className="mt-5">
                  <input
                    ref={register}
                    name={`${id}-optionName`}
                    className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                    type="text"
                    placeholder="Option Name"
                  />
                  <input
                    ref={register}
                    name={`${id}-optionExtra`}
                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                    type="number"
                    min={0}
                    placeholder="Option Extra"
                  />
                  <span
                    className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5 bg-"
                    onClick={() => onDeleteClick(id)}
                  >
                    Delete Option
                  </span>
                </div>
              ))}
          </div>
          <Button
            loading={loading}
            canClick={formState.isValid}
            actionText="Create Dish"
          />
        </form>
      )}
    </div>
  );
}

export default EditDish;
