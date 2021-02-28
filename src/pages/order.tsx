import { gql, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { FULL_ORDER_FRAGMENT } from '../fragments';
import { useMe } from '../hooks/useMe';
import { getOrder, getOrderVariables } from '../__generated__/getOrder';
import { orderUpdates } from '../__generated__/orderUpdates';

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;
// Restaurant route가 전달받는 param은 id:string이다
interface IParams {
  id: string;
}

export const Order = () => {
  const { data: userData } = useMe();
  const params = useParams<IParams>();
  // query에 변화가 있을때 감지되는 subscribeToMore 구현
  // useEffect에서 구현됨
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER,
    {
      variables: {
        input: {
          id: +params.id,
        },
      },
    }
  );

  useEffect(() => {
    let cleanUp = false;
    if (!cleanUp) {
      if (data?.getOrder.ok) {
        subscribeToMore({
          // 해당 쿼리를 subscription하고있는 subscriptionquery를 지정
          document: ORDER_SUBSCRIPTION,
          // 해당 subscription의 input Variables
          variables: {
            input: {
              id: +params.id,
            },
          },
          // updateQuery는 이전의query 결과(prev)와 새로운 subscriptionData가 필요한 함수
          updateQuery: (
            prev,
            {
              subscriptionData: { data },
            }: // subscriptionData안 data의 type지정 output DTO
            // 이것을 설정안하면 typescript가 불평을한다 왜냐하면
            // query랑 subscription이랑 output형태가 같은줄로 알고있기에
            // 다르다고 명시해줌
            { subscriptionData: { data: orderUpdates } }
          ) => {
            // 변화된 데이터가 없다면(subscription이 변화된것이 없다고 인식하고있을때 ) 이전 결과(useQuery)를 return해줌
            if (!data) return prev;
            // 변화가 감지되면(subscription동작)
            // data가 존재하는 경우에는, 기존의 것과 새로운 data가 같이 있어야함
            return {
              // 반환 형식을 useQuery와 subsciprion을 섞어서 반환해야하기때문에 이런식으로 지정
              // 먼저 useQuery내용을 spread한다음 그다음 subscription내용을 overwride해줌
              //  useQuery의 getOrder는 ok,error,order의 반환값을 가지고있고
              //  subsciption의 getOrder는 order의 내용만 가지고 있으니 이런 형식으로 만들어준것
              getOrder: {
                ...prev.getOrder,
                order: {
                  ...data.orderUpdates,
                },
              },
            };
          },
        });
      }
    }
    return () => {
      cleanUp = true;
    };
  }, [data]);

  // const { data: subscriptionData } = useSubscription<
  //   orderUpdates,
  //   orderUpdatesVariables
  // >(ORDER_SUBSCRIPTION, {
  //   variables: {
  //     input: {
  //       id: +params.id,
  //     },
  //   },
  // });
  // console.log(subscriptionData);

  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id} || Nuber Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:{' '}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Deliver To:{' '}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:{' '}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || 'Not yet.'}
            </span>
          </div>
          {userData?.me.role === 'Client' && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === 'Owner' && (
            <>
              {data?.getOrder.order?.status === 'Pending' && (
                <button className="btn">Accept Order</button>
              )}
              {data?.getOrder.order?.status === 'Cooking' && (
                <button className="btn">Order Cooked</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
