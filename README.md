## Solid React Components Library

React components for building your own [Solid](https://solid.inrupt.com/) applications. Part of the [React SDK for Solid](https://github.com/inrupt-inc/solid-react-sdk).

## Dependencies

The following is a list of some of the major dependencies of the solid-react-components library. These packages are all installed as part of the `npm install` step of setup.

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

| Props             | Type                                                                     | Default                                                                                                                                                                          | Description                               |
| ----------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| providers         | Array of Providers (label, image, value, register link, and description) | Solid and Inrupt Providers.                                                                                                                                                      |
| callback          | Function                                                                 | null                                                                                                                                                                             | Will call after login.                    |
| callbackUri       | String                                                                   | null                                                                                                                                                                             | URL to return to after a successful login |
| className         | String                                                                   | null                                                                                                                                                                             | Custom class for component.               |
| OnError           | Function                                                                 | null                                                                                                                                                                             | If an error occurs, this will fire.       |
| selectPlaceholder | String                                                                   | Select ID Provider                                                                                                                                                               |
| inputPlaceholder  | String                                                                   | WebID                                                                                                                                                                            |
| formButtonText    | String                                                                   | Log In                                                                                                                                                                           |
| btnTxtWebId       | String                                                                   | Log In with WebID                                                                                                                                                                |
| btnTxtProvider    | String                                                                   | Log In with Provider                                                                                                                                                             |
| errorsText        | Object                                                                   | `{ unknown: "Something is wrong, please try again...", webIdNotValid: "WebID is not valid" emptyProvider: "Solid Provider is required", emptyWebId: "Valid WebID is required" }` | An object with the error messages to show |

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

By wrapping your component definition with withWebId, the `webId` property will automatically be set on your component's instances whenever the login status changes.

We re-expose this component from [@solid/react](https://github.com/solid/react-components) library.

```javascript
const MyComponent = withWebId(props => <p>Hey user, your WebID is {props.webId}.</p>);
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

### FormModel

This component takes a FormModel (build using the Form Language and [UI ontology](https://www.w3.org/ns/ui#)). A properly formatted FormModel will render a form, complete with constraints. Some things are not yet supported, such as ui:arc links, ui:Choice, ui:Options, and more. This component is still being improved and worked on.

#### Supported Field Types:

##### Textbox

Textboxes are the default input type for each field in a shape, and represented in the FormModel by SingleLineTextFields. It can have common constraints like maxLength, as defined in the Form Language.

##### Textarea

A Textarea is represented in the FormModel by a MultiLineTextField, and similar to textbox has constraints defined by the Form Language.

##### Select / Dropdown

Dropdowns are displayed based on the Classifier field in the FormModel. Currently, the control will load a list of items from a Class, loading the subclasses as options in the dropdown. An example of this is the Types for Email and Phone number in the userprofile form mode.

##### Date / Time / DateTime picker

Using the react-datetime library, the appropriate picker is displayed according to the Form Model. There are several types of constraints, including max/minValue and a valid date range offset from "today".

##### Color Picker

Using the react-color library, a color picker is displayed when appropriate, saving the value as a six-digit RGB hex value.

##### Integer / Decimal / Float field

Numbers are represented in the form as a textbox with special custom constraints in place, enforcing that the textbox is an integer, float, or decimal depending on the Form Model definition.

##### Checkbox

A checkbox is rendered by a BooleanField in the Form Model, representing a binary yes/no choice. Tri-state checkboxes are not yet supported.

##### Email / Phone field

Email and Phone Number fields are custom textboxes, similar to the Number fields. They each take a regex pattern from the form model and apply it to the input field.

#### Validation

Validation is done using properties in the Form Model. An example of the types of validation that are enabled are:

- Required vs Optional fields.
- Repeatable fields, and the min/max number of times they can be repeated.
- Min and/or max length of strings.
- Length of numbers, and min/max number values.
- Regular expression patterns.

#### Labels

Currently, labels are assigned to a field by either:

- Adding a `ui:label` predicate to the FormModel
- If no label is found, the vocabulary is loaded and a `rdfs:label` predicate is searched for, to see if the vocabulary has a label to use
- If neither of the above works, the fallback is parsing the name of the predicate assigned to that field, e.g. if the predicate is `foaf:givenName`, the label would be `givenName`

#### Usage

The most basic usage only requires two parameters, modelPath and podPath, as demonstrated below. However, this will produce a very barebones and unstyled form. For a full list of parameters, see the table below.

```
<FormModel modelPath={formModelUrl} podPath={dataUrl}  />
```

| Props         | Type     | Default                                           | Description                                                                                                                        |
| ------------- | -------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| podPath       | string   | null                                              | Required. The URL representing the root subject to save the form data to, for example a WebID or file in the user's Pod.           |
| modelPath     | string   | null                                              | Required. The URL to the form model used to render the form.                                                                       |
| settings      | Object   | null                                              | Optional. An object (defined below) allowing custom overrides to the look and feel of the form.                                    |
| onSuccess     | Function | Function that writes a success message to console | Optional. Overrides the existing success callback and allows custom onSuccess functions.                                           |
| onError       | Function | Function that writes the error message to console | Optional. Overrides the existing error callback function.                                                                          |
| onInit        | Function | null                                              | Optional. Overrides the existing initialization callback, and fires after initialization is complete.                              |
| onSave        | Function | null                                              | Optional. A callback that executes when the save function is called.                                                               |
| onLoaded      | Function | null                                              | Optional. A callback that executes when the form is loaded. An example of what this can be used for is removing a loading spinner. |
| onAddNewField | Function | null                                              | Optional. A callback that executes after a new field is added to a multiple field.                                                 |
| onDelete      | Function | null                                              | Optional. A callback that executes after a field is removed/deleted.                                                               |
| autoSave      | Boolean  | false                                             | Optional. Determines of the form will autosave or have a save/cancel button. Default is save/cancel button.                        |

The settings parameter takes several subproperties:

| Key             | Type      | Default | Description                                                                                                                                                   |
| --------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| theme           | Object    | {}      | An object, defined below, that contains different class overrides for custom theming.                                                                         |
| languageTheme   | Object    | {}      | An object, defined below, that contains override text for the form buttons and controls.                                                                      |
| savingComponent | Component | null    | If provided, this component will display when autosave is triggered. An example of this is loading spinners and validatione errors for the autosave function. |

Theme object:

| Key           | Type   | Default | Description                                                                                                                |
| ------------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| input         | string |         | Custom class name for input fields in the form.                                                                            |
| select        | string |         | Custom class name for select fields in the form.                                                                           |
| deleteButton  | string |         | Custom class name for the delete button.                                                                                   |
| form          | string |         | Custom class name for the form.                                                                                            |
| multiple      | string |         | Custom class name for `<Mulitple>`                                                                                         |
| inputText     | string |         | Custom class name for `<Classifier>`, `<DatePicker>`, `<Decimal>`, `<Email>`, `<Float>`, `<Input>`, `<Integer>`, `<Phone>` |
| colorPicker   | string |         | Custom class name for the `<ColorPicker>`                                                                                  |
| inputTextArea | string |         | Custom class name for `<TextArea>`                                                                                         |

LanguageTheme object:

| Key                 | Type   | Default      | Description                                                        |
| ------------------- | ------ | ------------ | ------------------------------------------------------------------ |
| language            | string | 'en'         | String representing the language code to use for the translations. |
| saveBtn             | string | 'Save'       | String representing the save button text.                          |
| resetBtn            | string | 'Reset'      | String representing the reset button text.                         |
| addButtonText       | string | '+ Add new'  | String representing the add new item button text.                  |
| deleteButton        | string | 'Delete'     | String representing the delete button text.                        |
| dropdownDefaultText | string | '- Select -' | String representing the default text for a dropdown menu.          |

## Class List

Included in this library are a series of helper classes to make certain functionality easier for Solid developers. Each of these classes covers a specific functional area.

### Access Control List

The ACL helper class provides an interface for managing file and folder permissions for a Solid pod. This class contains functions to add or remove a permission from a resource, as well as functions to create a new Turtle file with specific permissions already applied.

Many of the functions in this class are expecting a custom Permissions object as a parameter. The Permissions object looks like this:

```javascript
type Permissions = {
  agents: null | String | Array,
  modes: Array<String>
};
```

### Application Permissions

The Application Permissions helper class is designed to help developers check application permissions. Some applications will need to have specific permissions to function properly.

For example, if an application wants to grant permissions to other users to edit a file, it will need the Control permission. The helper functions in this class will allow developers to check if their app has the proper permissions before attempting a call, and also allow the application to handle cases where additional permissions are needed.

### Notifications

The Notifications helper class is a large class, containing many functions that help with Inbox and Notification management.

Included in this helper class are functions that will allow a developer to discover global inboxes, create new inboxes, and delete old inboxes. It will also allow a developer an interface to send a notification to a specific inbox, or delete existing notifications for a user.

These notifications will be added to the inbox, using a common data structure. It is up to the application itself to decide what to do with these notifications.
