import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { coockedOrders } from '../../__generated__/coockedOrders';
import { useHistory } from 'react-router-dom';
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder';

// 주문 상태를 실시간으로 불러옴
const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

//
const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  //   maps의 경우에는 이미 windows에 로드되어있기때문에 따로 초기화를 해줄 필요없음
  const [maps, setMaps] = useState<any>();
  // @ts-ignore
  const onSucces = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCoords({ lat: latitude, lng: longitude });
    console.log('현재 위치', latitude, longitude);
  };
  // @ts-ignore
  const onError = (error: PositionError) => {
    console.log(error);
  };
  useEffect(() => {
    // watchPosition()	사용자의 현재 위치를 가져오고 나서, 사용자의 움직임에 따라 지속적으로 위치 정보를 갱신함.
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log(status, results);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  //   버튼을 클릭하면 현재위치에서 해당 위치까지의 경로를 google map위에 그려줌
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        //   오른쪽버튼 누르고 go to definition에서 사용가능한 옵션 볼수있음
        // 그중 그려지는 선과관련된 옵션
        polylineOptions: {
          // 그려지는 경로의 색
          strokeColor: '#000',
          //   그려지는 경로의 투명도
          strokeOpacity: 1,
          //   그려지는 경로의 두께
          strokeWeight: 5,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          // 경로를 그릴때 시작되는 위치
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          //  목적지를 지정
          // 지금은 목적지를 임의로 보여주는것

          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.03,
              driverCoords.lng + 0.03
            ),
          },
          //   화면에 경로가 표시되는 형식을 지정
          //   BICYCLING, DRIVING,TRANSIT,TWO_WHEELER,WALKING같은 옵션이 있음
          travelMode: google.maps.TravelMode.DRIVING,
        },
        result => {
          //directionsService에서 알아낸 경로를 지도에 렌더링해줌(그려줌)
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  // 이렇게 해두면 subscription 됨
  // subsc
  const { data: coockedOrdersData } = useSubscription<coockedOrders>(
    COOCKED_ORDERS_SUBSCRIPTION
  );

  useEffect(() => {
    if (coockedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
    console.log('확인', coockedOrdersData?.cookedOrders.status);
  }, [coockedOrdersData?.cookedOrders.status]);

  const history = useHistory();
  // takeOrderMutation이 성공하면 반환받는 data를 기준으로 어떤 작업을 진행함
  const onCompleted = (data: takeOrder) => {
    // ok는 백엔드에서 mutation이 성공하면 true실패하면 false를 반환하는 값임
    if (data.takeOrder.ok) {
      // takeOrderMutation 성공시order라우터로  주문의 id를 같이 보냄
      history.push(`/orders/${coockedOrdersData?.cookedOrders.id}`);
    }
  };

  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    {
      onCompleted,
    }
  );
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: '50vh' }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          //   마우스 드래그로 지도를 조정 가능 여부
          draggable={true}
          defaultCenter={{
            lat: 36.58,
            lng: 125.95,
          }}
          bootstrapURLKeys={{
            key: String(process.env.REACT_APP_GOOGLE_MAP_KEY),
          }}
        ></GoogleMapReact>
      </div>
      <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {coockedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center  text-3xl font-medium">
              New Coocked Order
            </h1>
            <h1 className="text-center my-3 text-2xl font-medium">
              Pick it up soon @{' '}
              {coockedOrdersData?.cookedOrders.restaurant?.name}
            </h1>
            <button
              onClick={() =>
                triggerMutation(coockedOrdersData?.cookedOrders.id)
              }
              className="btn w-full  block  text-center mt-5"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center  text-3xl font-medium">
            No orders yet...
          </h1>
        )}
        {/* <button onClick={makeRoute}>Get route</button> */}
      </div>
    </div>
  );
};
