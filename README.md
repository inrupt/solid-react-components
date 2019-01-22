## Solid React Components Library


Based on Facebook's <a href="https://github.com/facebookincubator/create-react-app" target="_blank">Create react app</a>.

A basic React components for building your owns Solid applications.

 ## External Dependencies

 1. [solid-auth-client](https://github.com/solid/solid-auth-client) - Solid authentication library
 2. [ldflex-for-solid](https://github.com/solid/query-ldflex) - Solid library to read and manipulate data
 3. [@solid-react](https://github.com/solid/react-components) - 
 4. [styled-components](https://github.com/styled-components/styled-components)
 5. [react-select](https://github.com/JedWatson/react-select)
 6. [Enzyme](https://github.com/airbnb/enzyme)
 7. [Jest](https://github.com/facebook/jest)


## Installation and usage

```javascript
 npm install @inrupt/solid-react-components
```

Then you can import components like this:

```javascript
import { ProviderLogin, withWebId } from '@inrupt/solid-react-components'
```

## What is a Component?
A component is a small, stand-alone piece of code that can be reused by many different applications. Most of the time, that means there will be a UI component and a Logic component.

### What comprises a Component?
A Component in our library consists of two major pieces: A Container component and a UI Component. The intention is to split out the logic and UI/Styling into separate components for more readability and reducing the size of each piece of the component.

This pattern is typically referred to as Presentational and Container Components.

## What makes a good Component?
A good component is something that is reusable and you can imagine many people using. Typically, this means it either contains it's own data management and/or takes a set or props that are used internally. 

In terms of styling, a good component in our library is also not styled aggressively, so it will fit in any site or application's look and feel. At most it would be styled only for internal layout and structure. For example, a form layout, but without styling the inputs.

Many of our components will also include class names from the style guide, so including the style guide will add the styling in for you. This way, people who want the style guide can have it, but it's something you have to use either.

### What makes a bad Component?
A bad component is anything that breaks the above rules. 
* If it's a one-time use thing that's too specific to the application
* If it's too large (like a page)
* If it's too heavily styled
* If it contains any proprietary information

## Components

### ProviderLogin

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

### PrivateRoute

Protected routes are an important part of any web application, we are using a custom component to redirect in cases that you are not logged. We are using withWebId from @solid/react library.

```javascript
  <PrivateRoute component={Container}/>
```

Props  | Type | Default | Description
------------- | ------------- | ------------- | -------------
component  | Node  |  null |  Component to render after check if user is logged.
redirect  | String  | /login  | Redirect to login if user is not logged.

### withWebId

In Solid, people are identified by a WebID, which is a URL that points to them and leads to their data.

By wrapping your component definition with withWebId, the webId property will automatically be set on your component's instances whenever the login status changes.

We are re-expose this component from [@solid/react](https://github.com/solid/react-components) library.

```javascript
const MyComponent = withWebId(props =>
  <p>Hey user, your WebID is {props.webID}.</p>);
```

### LogoutButton

We are re-expose this component from [@solid/react](https://github.com/solid/react-components).

```javascript
  <LogoutButton/>
```

We are re-expose withWebId and LogoutButton for now, the idea is that you can use the basic components without install another libraries.
