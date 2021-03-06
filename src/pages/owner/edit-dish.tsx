import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { DISH_FRAGMENT } from '../../fragments';
import { getDish, getDishVariables } from '../../__generated__/getDish';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import Options from '../../components/options';
import { editDish, editDishVariables } from '../../__generated__/editDish';

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

const EDIT_DISH_MUTATION = gql`
  mutation editDish($input: EditDishInput!) {
    editDish(input: $input) {
      ok
      error
    }
  }
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
  const onCompleted = (data: editDish) => {
    if (data.editDish.ok) {
      alert(`success to editing dish`);
    }
  };

  const [createPaymentMutation, { loading: mutationLoading }] = useMutation<
    editDish,
    editDishVariables
  >(EDIT_DISH_MUTATION, {
    onCompleted,
  });
  const { dishId } = useParams<IParams>();
  const [checked, setCheck] = useState(false);
  const [optionsNumber, setOptionsNumber] = useState<string[]>([]);
  const history = useHistory();

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
  // console.log(dish, loading);

  const {
    register,
    handleSubmit,
    // formState,
    getValues,
    setValue,
  } = useForm<IFormProps>({
    mode: 'onTouched',
  });

  const onSubmit = async () => {
    const { name, price, description, ...rest } = getValues();
    const optionObjects = optionsNumber.map(theId => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));

    console.log(optionObjects);

    createPaymentMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          dishId: +dishId,
          options: optionObjects,
        },
      },
    });
    history.goBack();
  };
  useEffect(() => {
    let cleanUp = false;
    if (!cleanUp) {
      setValue(`name`, `${dish?.name}`);
      setValue(`price`, `${dish?.price}`);
      setValue(`description`, `${dish?.description}`);
      if (dish?.options?.length) {
        for (let i = 0; i < dish?.options?.length; i++) {
          const newId = uuidv4();
          setOptionsNumber(current => [newId, ...current]);
        }
      }

      if (!checked) {
      }

      setCheck(true);

      /*
      dish?.options?.forEach((ele, index) => {
        console.log(ele, 'ele');
        setValue(`${optionsNumber[index]}-optionName`, `${ele?.name}`);
        setValue(`${optionsNumber[index]}-optionExtra`, `${ele?.extra}`);
      });
    */
    }
    return () => {
      cleanUp = true;
    };
  }, [
    dish?.name,
    dish?.price,
    dish?.description,
    setValue,
    dish?.options?.length,
    dish?.options,
  ]);

  const onAddOptionClick = () => {
    setOptionsNumber(current => [uuidv4(), ...current]);
  };

  const onDeleteClick = (idToDelete: string) => {
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

          <div className="my-10">
            <h4 className="font-medium  mb-3 text-lg">Dish Options</h4>
            <span
              onClick={onAddOptionClick}
              className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-"
            >
              Add Dish Option
            </span>

            <Options
              optionsNumber={optionsNumber}
              register={register}
              onDeleteClick={onDeleteClick}
              options={dish?.options}
            />
          </div>

          <Button
            loading={loading}
            canClick={!mutationLoading}
            actionText={mutationLoading ? 'loading...' : 'Edit Dish'}
            getValues={getValues}
          />
        </form>
      )}
    </div>
  );
}

export default EditDish;
