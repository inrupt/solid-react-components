# Solid React Components Library

## 0.5.1 ( April 16, 2020 )

### Added
- The Form Model now has the ability to be displayed in read-only mode
- Read-only (or "View") version of each component

### Updated
- Form Model components were refactored:
  - Props passed into form components have been simplified and streamlined
  - Internal form componentry has been improved
  - Increased test coverage of internal form components
  - Added View mode, and View versions of form components
  - Added i18n support for form model components via new language prop
- Notifications are now fetched by relative path instead of assuming they are all .ttl files
- Code comments updated and improved throughout the codebase
- Upgraded react-router-dom to the latest version
- Created an ACLFactory for the access-control-list class, which initializes the ACL link dynamically from the headers instead of assuming a file location
- ShEx validation of a list of files was updated to more efficiently fetch files, and now returns an array of valid quads instead of a list of IRIs 

### Fixed
- Provider dropdown list will no longer pop up a keyboard on mobile devices
- Classifier component now properly uses the `ui:category` predicate instead of `ui:from`
- Form model component default values are now properly set, instead of defaulting to null or undefined
- Checkbox form component bug fixed where the checkbox was always initializing empty
- Error handling improved and fixed for the form model rendering process
- Date/Time picker component regular expression used for formatting time was updated, fixing a bug where times were not displayed
- Date/Time picker component bug fixed where min/max values were not working
- Fixed a bug in the File Uploader where it was generating CORS errors in some circumstances
- Fixed an issue where the autosave spinner wasn't displaying






## 0.5.0 ( December 18, 2019 )

### Added

- FormModel component:
  - New component that renders a form from a Form Model
  - New components added to support the form model. The following list of components are all compatible with the Form Model:
    - Textbox
    - TextArea
    - Date / DateTime / Time fields, using [react-datepicker](https://reactdatepicker.com/)
    - Dropdown
    - Checkbox (Boolean, not tri-state)
    - ColorPicker, using [react-color](https://casesandberg.github.io/react-color/)
    - Header (an `<h2>` tag rendered inside of the form)
    - Comment (a `<p>` tag rendered inside of the form)
    - Decimal / Float / Integer fields
    - Email field
    - Phone field
    - Multiple, a custom Form Model field that indicates the child element is repeatable
    - Group, an ordered set of fields that can be treated as a single sub-form

### Updated

- Notification class was updated to validate notifications when being read from an inbox. This way only compatible notifications are retrieved and the data is more predictable for display purposes
- Updated ACL class predicate from `acl:defaultForNew`, which is deprecated, to `acl:default`
- Renamed the rdf predicate prefix from `a` to `rdf` to align with standard convention

### Deprecated

- The ShExFormBuilder component is now deprecated in favor of the new FormModel component. The component remains in the library for now, but the documentation has been removed

## 0.4.4 ( August 14, 2019 )

### Added

- Access Control Library was added, which helps developers to manage file and folder permissions in a Solid Pod
- App Permissions Library to help manage application specific permissions
- New Notification Library:
  - Global Inbox Discovery helper
  - Inbox Creation tools - add a new inbox and delete an existing inbox
  - Send Notification to and delete Notifications from a particular inbox

## 0.4.3 ( June 18, 2019 )

### Added

- [Prettier](https://prettier.io/) support was added, as well as better ESLint rules

### Updated

- Autofill temporarily disabled in the ShexFormBuilder component to prevent issues with autosave and autofill competing with each other
- Many, many formatting changes across the site to comply with prettier and ESLint

### Fixed

- Adding a new email and phone number in the same session will no longer merge the fields together
- A conflict error is no longer shown when two people edit the form to the same value (since there is no conflict)

## 0.4.2 ( June 5, 2019 )

### Fixed

- Fixed a bug where a blank field was being seen as "undefined"

## 0.4.1 ( June 5, 2019 )

### Updated

- ShexFormBuilder
  - LiveUpdate added to ShexForm, so any changes to the form data outside of the current application will immediately be displayed in the form in real time
  - Conflict Resolution added. If two users are editing the same field at the same time, incoming changes will be displayed to the second editor, to inform them that another change has occurred
  - Form now autosaves. Triggered by the onBlur event, any changes to a field will be immediately and automatically saved, rather than relying on a button to save everything at once. This is an optional form state, and can be turned on or off
  - New error messages added to handle new error events, such as conflicts
  - Refactors to the ShexForm components to account for new functionality

## 0.4.0 ( May 22, 2019 )

### Added

- New component: ShexFormBuilder
  - Builds a form from a ShEx shape
  - Supports:
    - Textbox
    - Select
  - Validates form data onSubmit against the ShEx shape requirements
  - View [Readme](https://github.com/inrupt/solid-react-components#ShExFormBuilder) for usage details

## 0.3.2 ( April 3, 2019 )

### Fixed

- Uploader control now correctly allows dragging and dropping files

## 0.3.1 ( March 20, 2019 )

### Fixed

- Currently displayed error messages will now correctly update language when language is changed

## 0.3.0 ( March 5, 2019 )

### Updated

- Login component updated so the custom webID login is the default state
- Components error and text messages are now props that can be passed in and customized. This also enables applications to use internationalized strings, as it can be passed in dynamically from the parent application

### Fixed

- Webpack config updated to fix yarn demo build
- File Upload component will now create a new unique filename in the POD. This is to prevent naming collisions, which was causing some errors uploading files with the same name

## 0.2.3 ( February 19, 2019 )

### Updated

- Added validation to login form, to ensure webIDs are in a valid format

### Fixed

- Fixed allowed filetypes for upload in Windows/Chrome
- Removed queued files when an error occurs during an upload

## 0.2.2 ( February 13, 2019 )

### Fixed

- Fixed an issue with the uploader where an error in the file upload didn't cancel the progress status and loader image
- Added validation to the error handling for the uploader

## 0.2.1 ( February 12, 2019 )

### Added

- New component:
  - File Uploader

### Fixed

- Provider-Login Component
  - Error message when using a custom Provider, but without a WebID entered, correctly indicates that a WebID is required

## 0.1.0 ( January 30, 2019 )

**First Release**

### Added

- Create basic scaffolding for a React Library
- LDFlex dependency as the primary interface for most Linked Data operations
- [React Components for Solid](https://github.com/solid/react-components) dependency
- Initial set of components:
  - Private Route
  - Provider Login
  - Provider Select
- Higher Order Components
  - withAuthorization
- Test infrastructure
- Unit tests for each component
- Error exposure to the parent application
