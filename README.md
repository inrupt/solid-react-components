## Solid React Components Library


Based on Facebook's <a href="https://github.com/facebookincubator/create-react-app" target="_blank">Create react app</a>.

A basic React components for building your owns Solid applications.

:construction_worker: Work in progress.

 ## Externals Libraries

 1. [solid-auth-client](https://github.com/solid/solid-auth-client)
 2. [ldflex-for-solid](https://github.com/solid/query-ldflex)
 3. [@solid-react](https://github.com/solid/react-components)
 4. [styled-components](https://github.com/styled-components/styled-components)
 5. [react-select](https://github.com/JedWatson/react-select)
 6. [Enzyme](https://github.com/airbnb/enzyme)
 7. [Jest](https://github.com/facebook/jest)


##Installation and usage

```javascript
 npm install @inrupt/solid-react-components
```

Then you can import components like this:

```javascript
import { ProviderLogin, withWebId } from '@inrupt/solid-react-components'
```

## Components

###ProviderLogin

This component will allow you to login into pods using a list of providers or your webId.

```javascript
  <ProviderLogin />
```

Props  | Type | Default | Description
------------- | ------------- | ------------- | -------------
providers  | Array of providers(label, image, value, register link and description) | Solid and Inrupt providers
callback  | Function | null | Will call after login
className  |  String | null | Custom class for component
OnError  | Function  | null | If something happens will fire
selectPlaceholder  | String  | Select ID Provider  |  
inputPlaholder  | String  |  WebID |  
formButtonText  |  String | Log In  |  
btnTxtWebId  |  String | Log In with WebId  |  
btnTxtProvider  |  String | Log In with Provider  |  

###PrivateRoute

Protected routes are an important part of any web application, we are using a custom component to redirect in cases that you are not logged. We are using withWebId from @solid/react library.

```javascript
  <PrivateRoute component={Container}/>
```

Props  | Type | Default | Description
------------- | ------------- | ------------- | -------------
component  | Node  |  null |  Component to render after check if user is logged.
redirect  | String  | /login  | Redirect to login if user is not logged.

###withWebId

In Solid, people are identified by a WebID, which is a URL that points to them and leads to their data.

By wrapping your component definition with withWebId, the webId property will automatically be set on your component's instances whenever the login status changes.

We are re-expose this component from [@solid/react](https://github.com/solid/react-components) library.

```javascript
const MyComponent = withWebId(props =>
  <p>Hey user, your WebID is {props.webID}.</p>);
```

###LogoutButton

We are re-expose this component from [@solid/react](https://github.com/solid/react-components).

```javascript
  <LogoutButton/>
```

We are re-expose withWebId and LogoutButton for now, the idea is that you can use the basic components without install another libraries.
