import { gql, useMutation } from '@apollo/client';
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PayPal } from '../../components/paypal';
import { useMe } from '../../hooks/useMe';
import {
  createPayment,
  createPaymentVariables,
} from '../../__generated__/createPayment';
const CREATE_PAYMENT_MUTATION = gql`
  mutation createPayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ok
      error
    }
  }
`;
interface IParams {
  restaurantId: string;
}
function Payment() {
  const { restaurantId } = useParams<IParams>();
  const notifyError = (text: string) => toast.error(`${text}`);
  const notifySuccess = (text: string) => toast.success(`${text}`);
  const notifyWarn = (text: string) => toast.warn(`${text}`);

  const onCompleted = (data: createPayment) => {
    if (data.createPayment.ok) {
      notifySuccess('Your restaurant is being promoted!');
    }
  };
  const [createPaymentMutation, { loading }] = useMutation<
    createPayment,
    createPaymentVariables
  >(CREATE_PAYMENT_MUTATION, {
    onCompleted,
  });
  const { data: userData } = useMe();

  // paypal 결제 성공시 동작
  const successFunction = useCallback(async (details, data) => {
    notifyWarn('Please wait for payment progress...');

    try {
      createPaymentMutation({
        variables: {
          input: {
            transactionId: data?.orderID,
            restaurantId: +restaurantId,
          },
        },
      });
    } catch (e) {
      notifyError(e.message);
    }
    return;
  }, []);

  const triggerPaypal = () => {
    if (userData?.me.email) {
      // @ts-ignore
      window.Paddle.Setup({ vendor: 31465 });
      // @ts-ignore
      window.Paddle.Checkout.open({
        product: 638793,
        email: userData.me.email,
        successCallback: (data: any) => {
          createPaymentMutation({
            variables: {
              input: {
                transactionId: data.checkout.id,
                restaurantId: +restaurantId,
              },
            },
          });
        },
      });
    }
  };

  // 결제

  const promotionPrice = 10;

  return (
    <div>
      <Helmet>
        <title>Buy Promotion | Uber Eats</title>
      </Helmet>
      <div className="flex flex-col text-center border-black border-2 mt-32 p-16">
        <div>Buy Promotion</div>
        <div>${`${promotionPrice}`}</div>
        <PayPal amount={promotionPrice} successFunction={successFunction} />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Payment;
