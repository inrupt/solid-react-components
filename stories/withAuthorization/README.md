### withAuthorization

This component is a wrapper for withWebId. It provides additional functionality, such as discovering when a user is not authenticated and redirecting them to a custom route, or to /login, when the user is not authenticated.

```javascript
export default withAuthorization(WelcomeComponent, <Loader show={true} />);
```
