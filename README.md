<div>
  
# Uber Eats Frontend
- https://github.com/nohsangwoo/uber-eats-backend 와 연동됩니다(BackEnd).
- 
</div>

# 구현 내용 및 컨셉

|                        Users                        |                Restaurants                |
| :-------------------------------------------------: | :---------------------------------------: |
|                ✔ User Authentication                |             ✔ Restaurant CRUD             |
|                ✔ Email Verification                 |                ✔ Dish CRUD                |
|                   ✔ Photo Upload                    |     ✔ Realtime Order<br>Notification      |
| ✔ User / Delivery Man/ <br>Restaurant Owner Profile |   ✔ Premium Feature<br>(Online Payment)   |
|                                                     | ✔ Sales Dashboard<br>(Data Visualization) |

| Nest Concepts |            Feature            |
| :-----------: | :---------------------------: |
|   ✔ Modules   | ✔ Online Payments<br>(paddle) |
|   ✔ Guards    |         ✔ Google Maps         |
| ✔ MiddleWares |        ✔ Unit Testing         |
| ✔ Decorators  |     ✔ End to End Testing      |
|               |        ✔ Tailwind CSS         |
|               |     ✔ JWT Authentication      |

# 사용된 기술

- React JS
- typescript(for javascript)
- apollo-graphql(for graphql)
- google maps API(for map)
- victory(for graph)
- tailwind css(for css)
- Cypress(for E2E testing)
- Jest(for unit testing)
- websocket(for realtime subscription)

# 주요 기능

1. realtime 상호작용 (apollo subscription을 이용한 Websocket 접근)
   ![1-main-page](./README_IMAGE/main_function.gif)

   - Description
     apollo subscription을 사용하여 websocket에 접근,
     delivery, Restaurant Owner, User(화면에 나열된 스크린 순서)가 서로 realtime으로 상호작용하는 기능

   - setting up
     https://www.apollographql.com/docs/react/data/subscriptions/#setting-up-the-transport 참고

   - subscription 사용예
     (dashboard.tsx 참고)

   - subscribeToMore
     subscriptoion은 변화가 있을때만 감지된 데이터를 가져와 알려줌
     즉 기본적으론 일반 Query문을 사용하여 데이터를 가져와 화면에 렌더링 하고
     subscriptoion으로 "변경이 감지된 데이터"만 가져와 기존의 쿼리데이터에서 변경된 부분을 수동으로 업데이트하여 렌더링해야하는 불편함이 있다.
     apollo에서 위 번거로운 작업을 한번에 해결해주는 기능인 subscribeToMore을 제공함
     subscribeToMore은 useQuery에서 제공되는 기능중 하나
   - subscribeToMore 사용예
     (order.tsx)

   즉 useQuery와 useSubscription을 각각 나눠 사용 하는 대신에
   query로 부터 data를 가져오면 subscribeToMore 할거임

- https://www.apollographql.com/docs/react/data/subscriptions/#subscribing-to-updates-for-a-query 참고

2. pagination 기능(페이지당 3개내용)
   ![2-pagenation](./README_IMAGE/pagination.gif)

# 고도화 작업중

# category 구현

페이지는 존재하나...아직 내용이 없음

# edit-dish 구현(owner권한)

uuid 적용

<!-- ![2-description_page](./README_IMAGE/dudungdeungjang.png)
![3-description_page](./README_IMAGE/customScrollBar.png) -->
