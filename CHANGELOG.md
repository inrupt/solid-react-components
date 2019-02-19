# Solid React Components Library

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
