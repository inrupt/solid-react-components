## Solid React Components Library

Based on Facebook's <a href="https://github.com/facebookincubator/create-react-app" target="_blank">Create React App</a>.

Basic React components for building your own <a href="https://solid.inrupt.com/" target="_blank">Solid</a> applications.

 ## External Dependencies

 1. [solid-auth-client](https://github.com/solid/solid-auth-client) - Solid authentication library.
 2. [ldflex-for-solid](https://github.com/solid/query-ldflex) - Solid library to read and manipulate data.
 3. [solid-react](https://github.com/solid/react-components) - Basic React components for building Solid components and applications.
 4. [styled-components](https://github.com/styled-components/styled-components) - Allows components to be styled using CSS code.
 5. [react-select](https://github.com/JedWatson/react-select) - Select control for React
 6. [Enzyme](https://github.com/airbnb/enzyme) - JavaScript Testing utility for React
 7. [Jest](https://github.com/facebook/jest) - JavaScript testing


## Installation and usage

```javascript
 npm install @inrupt/solid-react-components
```

Then you can import components like this:

```javascript
import { ProviderLogin, withWebId } from '@inrupt/solid-react-components'
```

## What is a Component?
A component is a small, stand-alone piece of code that can be reused by many different applications. Most of the time, that means there will be a User Interface (UI) component and a Logic component.

### What comprises a Component?
A Component in our library consists of two major pieces: A Container component and a UI Component. The intention is to split out the logic and UI/Styling into separate components for more readability and reducing the size of each piece of the component.

This pattern is typically referred to as Presentational and Container Components.

## What makes a good Component?
A good component is reusable and that many people could use. Typically, this means it contains it's own data management and/or takes a set or props that are used internally. 

In terms of styling, a good component in our library is also not styled aggressively, so it will fit in any site or application's look and feel. At most it is styled only for internal layout and structure. For example, a form layout but without styling the inputs.

Many of our components include class names from the style guide, so including the style guide will apply the styling. This way, people who want the style guide can have it, but it's not compulsory.

### What makes a bad Component?
A bad component is anything that breaks the above rules:
* If it's a one-time use thing that's too specific to the application.
* If it's too large (like a page).
* If it's too heavily styled.
* If it contains any proprietary information.

## Components

### ProviderLogin

This component allows you to login into Pods using a list of providers or your WebID.

```javascript
  <ProviderLogin />
```

Props  | Type | Default | Description
------------- | ------------- | ------------- | -------------
providers  | Array of Providers (label, image, value, register link, and description) | Solid and Inrupt Providers.
callback  | Function | null | Will call after login.
className  |  String | null | Custom class for component.
OnError  | Function  | null | If an error occurs, this will fire.
selectPlaceholder  | String  | Select ID Provider  |  
inputPlaholder  | String  |  WebID |  
formButtonText  |  String | Log In  |  
btnTxtWebId  |  String | Log In with WebID |  
btnTxtProvider  |  String | Log In with Provider  |  

### PrivateRoute

Protected routes are an important part of any web application. We are using a custom component, from the from @solid/react library, to redirect in cases where you are not logged.

```javascript
  <PrivateRoute component={Container}/>
```

Props  | Type | Default | Description
------------- | ------------- | ------------- | -------------
component  | Node  |  null |  Component to render after check if user is logged.
redirect  | String  | /login  | Redirect to login if user is not logged.

### withWebId

In Solid, people are identified by a WebID, which is a URL that points to them and leads to their data.

By wrapping your component definition with withWebId, the WebID property will automatically be set on your component's instances whenever the login status changes.

We re-expose this component from [@solid/react](https://github.com/solid/react-components) library.

```javascript
const MyComponent = withWebId(props =>
  <p>Hey user, your WebID is {props.webID}.</p>);
```

### LogoutButton

We re-expose this component from [@solid/react](https://github.com/solid/react-components) library.

```javascript
  <LogoutButton/>
```

We currently re-expose withWebId and LogoutButton so you can use the basic components without installing other libraries.
