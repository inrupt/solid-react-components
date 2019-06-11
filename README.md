## Solid React Components Library

React components for building your own [Solid](https://solid.inrupt.com/") applications. Part of the [React SDK for Solid](https://github.com/inrupt-inc/solid-react-sdk).

## External Dependencies

1.  [solid-auth-client](https://github.com/solid/solid-auth-client) - Solid authentication library.
2.  [ldflex-for-solid](https://github.com/solid/query-ldflex) - Solid library to read and manipulate data.
3.  [solid-react](https://github.com/solid/react-components) - Basic React components for building Solid components and applications.
4.  [styled-components](https://github.com/styled-components/styled-components) - Allows components to be styled using CSS code.
5.  [react-select](https://github.com/JedWatson/react-select) - Select control for React
6.  [Enzyme](https://github.com/airbnb/enzyme) - JavaScript Testing utility for React
7.  [Jest](https://github.com/facebook/jest) - JavaScript testing

## Installation and usage

```javascript
 npm install @inrupt/solid-react-components
```

Then you can import components like this:

```javascript
import { ProviderLogin, withWebId } from '@inrupt/solid-react-components';
```

## What is a Component?

A component is a small, stand-alone piece of code that can be reused by many different applications. Most of the time, that means there will be a User Interface (UI) component and a Logic component.

In our library, a component consists of two major pieces: A _Container Component_ and a _UI Component_. The intention is to split out the logic and UI/Styling into separate components for better readability and to reduce the size of each piece of the component.

This pattern is typically referred to as _Presentational and Container Components_.

## What makes a good Component?

A good component is reusable. It should be versatile and support a range of applicable use cases. Typically, this means it contains its own data management and/or takes a set or props that are used internally.

A good component in our library is also not styled aggressively. Styling is limited to internal layout and structure. It will fit in any site or application's look and feel. For example, to provide a form layout without styling the inputs.

Many of our components include class names from our [Atomic Style Guide](http://design.inrupt.com), so including the style guide will apply the styling. This way, people who want the style guide can have it, but it's not required.

### What makes a bad Component?

A bad component is anything that breaks the above rules:

- If it's a one-time use thing that's too specific to the application.
- If it's too large (like a page).
- If it's too heavily styled.
- If it contains any proprietary information.

## Error Handling

Since our components are not styled and don't want to assume anything about the application they're used in, we didn't build an explicit error handling UI. No toast or popups are included here. Instead, we capture and surface error objects to the parent and let them bubble up to the application.

We have made a custom Error object type, extended from the standard [Error object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), called SolidError. It contains a message and a name. The message is a consumable error message to display, and the name is essentially the error or component that failed.

To see how to consume these error messages, please refer to the documentation at [generator-solid-react](https://github.com/Inrupt-inc/generator-solid-react).

## Component List

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
| errorsText        | Object                                                                   | `{ unknown: "Something is wrong, please try again...", webIdNotValid: "WeibID is not valid" emptyProvider: "Solid Provider is required", emptyWebId: "Valid WebID is required" }` | An object with the error messages to show |

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

### withWebId

In Solid, people are identified by a WebID, which is essentially a URL link that points to them and leads to their data.

By wrapping your component definition with withWebId, the WebID property will automatically be set on your component's instances whenever the login status changes.

We re-expose this component from [@solid/react](https://github.com/solid/react-components) library.

```javascript
const MyComponent = withWebId(props => <p>Hey user, your WebID is {props.webID}.</p>);
```

### withAuthorization

This component is a wrapper for withWebId. It provides additional functionality, such as discovering when a user is not authenticated and redirecting them to a custom route, or to /login, when the user is not authenticated.

```javascript
export default withAuthorization(WelcomeComponent, <Loader show={true} />);
```

### LogoutButton

This component uses solid-auth-client to provide a simple button that logs out the user. It is a simple helper component to integrate with solid-auth-client.

We re-expose this component from [@solid/react](https://github.com/solid/react-components) library.

```javascript
<LogoutButton />
```

### Uploader

This component allows you to upload files in your POD. This is using React render prop patterns.

The Uploader component contains the file uploading logic and Solid integration, but does not include the UI. You may pass in your own UI as demonstrated here:

```javascript
<Uploader
  {...{
    fileBase: 'https://example.org/public',
    render: props => <ProfileUploader {...{ ...props }} />
  }}
/>
```

| Props      | Type     | Default                                                                                                                                                                                | Description                                                                                                                |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| fileBase   | String   | null                                                                                                                                                                                   | The URL to the container where you want to upload the files                                                                |
| limitSize  | Integer  | null                                                                                                                                                                                   | File size limit                                                                                                            |
| accept     | String   | null                                                                                                                                                                                   | Allowed file formats. To specify more than one value, separate the extension name with a comma. Example: "jpg, png, jpeg". |
| onComplete | Function | null                                                                                                                                                                                   | Returns an array of successfully uploaded files                                                                            |
| onError    | Function | null                                                                                                                                                                                   | Returns any errors from upload process                                                                                     |
| onDrop     | Function | null                                                                                                                                                                                   | A callback function that fires when you drop a file                                                                        |
| onStart    | Function | null                                                                                                                                                                                   | A callback function that fires when upload start                                                                           |
| errorsText | Object   | `{ sizeLimit: 'File size exceeds the allowable limit', unsupported: 'Unsupported media type', maximumFiles:'Sorry, you have exceeded the maximum number of files allowed per upload'}` | An object with the error messages to show                                                                                  |

### ProfileUploader

Here's an example of a basic ProfileUploader component, demonstrating how to add your own Uploader UI

We currently re-expose withWebId and LogoutButton so you can use the basic components without installing other libraries.

### ShExFormBuilder

**Note**: This is an early preview build of a work-in-progress component and subject to large-scale changes in future releases.

This component allows you to create a fully functional form, complete with submit, cancel, and validation rules, from a [ShEx](http://shex.io/shex-primer/index.html) Shape.

#### Supported Field Types:

##### Textbox

Textboxes are the default input type for each field in a shape. In future versions, there will be a way to determine if you want a textbox vs a textarea based on properties such as maxlength.

##### Select / Dropdown

Dropdowns are displayed when the shape has a reference to another shape that is only a list of values. The values are displayed in the dropdown.

#### Validation

Validation is done using ShEx constraints. You can read more about these constraints on the [ShEx website](http://shex.io/). Examples include:

- Required vs Optional fields.
- Repeatable fields, and the min/max number of times they can be repeated.
- Min and/or max length of strings.
- Length of numbers, and min/max number values.
- Regular expression patterns.

#### Labels

Currently, labels are assigned to a field by either:

- Adding an rdfs:label annotation to the field in the ShEx shape (see [example shapes](https://shexshapes.inrupt.net/public/) for examples).
- Parsing the name of the predicate assigned to that field.

In the future, labels will be generated more dynamically.

#### Usage

```
<ShexFormBuilder documentUri={url} shexUri={}  />
```

| Props             | Type     | Default                                           | Description                                                                                                                                 |
| ----------------- | -------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| documentUri       | string   | null                                              | Required. The URL representing the root subject to save the form data to, for example a WebID or file in the user's Pod.                    |
| shexUri           | string   | null                                              | Required. The URL to the ShEx shape to use to render the form.                                                                              |
| rootShape         | string   | null                                              | Optional. The shape in the shexUri file to begin parsing. If a START shape is defined in the shape, this is not necessary.                  |
| theme             | Object   | null                                              | Optional. An object (defined below) allowing custom overrides to the look and feel of the form.                                             |
| languageTheme     | Object   | null                                              | Optional. An object (defined below) allowing customization of the text of the form. Can be used in combination with i18n in the parent app. |
| successCallback   | Function | Function that writes a success message to console | Optional. Overrides the existing success callback and allows custom success functions.                                                      |
| errorCallback     | Function | Function that writes the error message to console | Optional. Overrides the existing error callback function.                                                                                   |
| messageValidation | Object   | null                                              | An Object containing an array of error strings. The error strings will be used in most non-validation situations.                           |
| autoSaveMode      | Boolean  | false                                             | Optional. Determines of the form will autosave or have a save/cancel button. Default is save/cancel button.                                 |

Theme object:

| Key          | Type   | Default                            | Description                                      |
| ------------ | ------ | ---------------------------------- | ------------------------------------------------ |
| input        | string | solid-input-shex                   | Custom class name for input fields in the form.  |
| select       | string | solid-input-shex solid-select-shex | Custom class name for select fields in the form. |
| deleteButton | string | solid-button-shex                  | Custom class name for the delete button.         |
| form         | string | solid-shex-form                    | Custom class name for the form.                  |

LanguageTheme object:

| Key                 | Type   | Default      | Description                                                       |
| ------------------- | ------ | ------------ | ----------------------------------------------------------------- |
| language            | string | 'en'         | String representing the language code to use for the translations |
| saveBtn             | string | 'Save'       | String representing the save button text                          |
| resetBtn            | string | 'Reset'      | String representing the reset button text                         |
| addButtonText       | string | '+ Add new'  | String representing the add new item button text                  |
| deleteButton        | string | 'Delete'     | String representing the delete button text                        |
| dropdownDefaultText | string | '- Select -' | String representing the default text for a dropdown menu          |

##### Shapes

A set of example shapes can be found [here](https://shexshapes.inrupt.net/public/), which show various ShEx shapes.
