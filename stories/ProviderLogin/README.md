### ProviderLogin

The ProviderLogin component is primarily a Login Form component. Using it in your application will provide a relatively unstyled login form, complete with a dropdown of potential Solid Providers for users to select from.

For now, the list of Providers is passed in as a parameter. In the future, this could include an option to fetch Providers from a registry. Without a Provider, the user will not be able to login, so this should help accelerate application development.

```javascript
<ProviderLogin />
```

| Props             | Type                                                                     | Default                                                                                                                                                                           | Description                               |
| ----------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| providers         | Array of Providers (label, image, value, register link, and description) | Solid and Inrupt Providers.                                                                                                                                                       |
| callback          | Function                                                                 | null                                                                                                                                                                              | Will call after login.                    |
| className         | String                                                                   | null                                                                                                                                                                              | Custom class for component.               |
| OnError           | Function                                                                 | null                                                                                                                                                                              | If an error occurs, this will fire.       |
| selectPlaceholder | String                                                                   | Select ID Provider                                                                                                                                                                |
| inputPlaholder    | String                                                                   | WebID                                                                                                                                                                             |
| formButtonText    | String                                                                   | Log In                                                                                                                                                                            |
| btnTxtWebId       | String                                                                   | Log In with WebID                                                                                                                                                                 |
| btnTxtProvider    | String                                                                   | Log In with Provider                                                                                                                                                              |
| errorsText        | Object  
