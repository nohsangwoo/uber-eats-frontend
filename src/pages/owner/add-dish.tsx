import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import {
  createDish,
  createDishVariables,
} from '../../__generated__/createDish';
import { MY_RESTAURANT_QUERY } from './my-restaurant';

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  // 어떤값이든 extra형식으로 받을수있게 typescript에서 escape하는 방법
  [key: string]: string;
}

export const AddDish = () => {
  const { id: restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    //   mutation완료 후 MY_RESTAURANT_QUERY를 DB에서 불러와 케쉬를 업데이트 해줌
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
  } = useForm<IForm>({
    mode: 'onChange',
  });
  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    // dish의 options에는 name과 extra가 배열 오브젝트로 존재하니 해당 형식에 맞춰 배열 오브젝트를 생성해줌

    const optionObjects = optionsNumber.map(theId => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));

    const variables = {
      input: {
        name,
        price: +price,
        description,
        restaurantId: +restaurantId,
        options: optionObjects,
      },
    };

    createDishMutation({
      variables: variables,
    });
    history.goBack();
  };
  // useState의 type은 숫자 배열 형식ex [0,1,2....]
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  // 옵션 추가버튼 클릭시 작동
  const onAddOptionClick = () => {
    // setOptionsNumber 현재 날짜 및 시간을 기준으로 맨 앞에 배열을 추가하고, 그 뒤에 이전 OptionsNumber내용을 나열함
    // 날짜로 정하는 unique한 방식이 마음에 안들면 uuid를 이용해도됨
    setOptionsNumber(current => [Date.now(), ...current]);
  };

  // delete버튼 클릭할때
  const onDeleteClick = (idToDelete: number) => {
    // 해당 함수로 전달된 arguement와 일치하는 id를 제외한 나머지를 덮어씌움
    setOptionsNumber(current => current.filter(id => id !== idToDelete));
    // input을 사라지게 제어하는 것
    // 제어하고 싶은 대상(input의 name)을 첫번째 인자로
    // 두번째 인자는 어떤 상태로 만들것인지? 여기선 ""상태로  빈값을 돌려줘서 삭제함
    setValue(`${idToDelete}-optionName`, '');
    setValue(`${idToDelete}-optionExtra`, '');
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
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
    </div>
  );
};
