import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import {
  createCategory,
  createCategoryVariables,
} from '../../__generated__/createCategory';

const CREATE_CATEGORY_MUTATION = gql`
  mutation createCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      error
      ok
    }
  }
`;

interface IFormProps {
  name: string;
  coverImg: string;
}
function AddCategory() {
  const [imageUrl, setImageUrl] = useState('');
  const history = useHistory();
  //   const client = useApolloClient();
  //   const history = useHistory();
  //   const [imageUrl, setImageUrl] = useState('');
  const onCompleted = (data: createCategory) => {
    // const {
    //   createCategory: { ok, error },
    // } = data;

    history.push('/');
  };

  const { register, getValues, formState, handleSubmit } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const [createCategoryMutation, { data }] = useMutation<
    createCategory,
    createCategoryVariables
  >(CREATE_CATEGORY_MUTATION, {
    onCompleted,
  });

  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { name, coverImg } = getValues();

      setImageUrl(coverImg);
      console.log(name, coverImg);
      createCategoryMutation({
        variables: {
          input: {
            name,
            coverImg,
          },
        },
      });
    } catch (e) {}
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Category | Uber Eats</title>
      </Helmet>

      <h4 className="font-semibold text-2xl mb-3">Add Category</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="category Name"
          ref={register({ required: 'Name is required.' })}
        />

        <input
          className="input"
          type="text"
          name="coverImg"
          placeholder="cover image url"
          ref={register({ required: 'coverImg is required.' })}
        />

        <Button
          canClick={formState.isValid}
          loading={uploading}
          actionText="Create Category"
        />
        {data?.createCategory?.error && (
          <FormError errorMessage={data.createCategory.error} />
        )}
      </form>
    </div>
  );
}

export default AddCategory;
