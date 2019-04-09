### PrivateRoute

Protected routes are an important part of any web application. Here we provide a custom component that can be used to check Solid authentication for you.

The component will check to see if the user is logged in, using the withWebId component from the [@solid/react library](https://github.com/solid/react-components). If the user is not authenticated, they will be redirected to a route of your choosing, passed in via the props. If none is provided it will redirect to a /login route.

```javascript
<PrivateRoute component={Container} />
```

| Props     | Type   | Default | Description                                        |
| --------- | ------ | ------- | -------------------------------------------------- |
| component | Node   | null    | Component to render after check if user is logged. |
| redirect  | String | /login  | Redirect to login if user is not logged.           |
