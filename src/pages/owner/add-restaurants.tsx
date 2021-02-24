import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import {
  createRestaurant,
  createRestaurantVariables,
} from '../../__generated__/createRestaurant';
import { useHistory } from 'react-router-dom';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState('');
  // createRestaurantMutation이 정상적으로 끝마쳤을때 작동하는 함수
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      setUploading(false);
      // 새로 만들어진 restaurant정보를 client쪽 캐쉬에 업데이트(오버라이딩) 하기위한 작업
      // 이전에 저장된 MY_RESTAURANTS_QUERY 캐쉬를 불러온다(모든 쿼리는 사용후 클라이언트 캐쉬에 저장됨)
      // Owner 유저는 로그인 후 MY_RESTAURANTS_QUERY의 내용을 실행할 수 밖에없는 상태라 캐쉬에 이전의 MY_RESTAURANTS_QUERY내용이 분명히 들어가있음
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      // 덮어씌우는 실제작업
      client.writeQuery({
        // 캐쉬에 덮어씌우는 쿼리 대상은 MY_RESTAURANTS_QUERY 이다
        query: MY_RESTAURANTS_QUERY,
        data: {
          // 덮어씌우는 형식은 캐쉬에 저장된 형식임
          // myRestaurants라는 key에 저장된 오브젝트 형식으로 캐쉬에 저장됐으니
          // 덮어씌움(오버라이딩)할때도 같은 형태로 덮의씌워야함
          myRestaurants: {
            // 먼저 캐쉬에 저장 돼있던 내용을 먼저 spread해준다
            ...queryResult.myRestaurants,
            // 새로 덮어씌울(mutation의 입력값)내용을 덮어씌운다
            // console.log로 이전 캐쉬내용 형태를 분석한다음 그대로 덮어씌울 내용은 덮어씌워주고
            // 냅둘 부분은 냅두고...
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: 'Category',
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: 'Restaurant',
              },
              // 오브젝트의 restaurants부분을 캐쉬의 이전내용을 끌어와 덮어씌운다
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      // 쿼리 성공이후 "/" 로 이동
      history.push('/');
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    // refetchQueries: 이걸로 작업하면 자동으로 MY_RESTAURANTS_QUERY를 실행하여 클라이언트의 캐쉬를 업데이트 해준다
    // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });
  const { register, getValues, formState, handleSubmit } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const [uploading, setUploading] = useState(false);

  //   submit시 작동하는 코드
  const onSubmit = async () => {
    try {
      setUploading(true);
      // submit시 전달되는 변수들을 뽑아옴
      const { file, name, categoryName, address } = getValues();

      //백엔드를 거쳐 AWS S3에 파일을 보내는 작업
      // 보일러플레이트임
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: coverImg } = await (
        await fetch('http://localhost:4000/uploads/', {
          method: 'POST',
          body: formBody,
        })
      ).json();

      // 이미지 url을 useState에 저장
      setImageUrl(coverImg);
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      });
    } catch (e) {}
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
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
          type="text"
          name="address"
          placeholder="Address"
          ref={register({ required: 'Address is required.' })}
        />
        <input
          className="input"
          type="text"
          name="categoryName"
          placeholder="Category Name"
          ref={register({ required: 'Category Name is required.' })}
        />
        <div>
          <input
            type="file"
            name="file"
            accept="image/*"
            ref={register({ required: true })}
          />
        </div>
        <Button
          loading={uploading}
          canClick={formState.isValid}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
