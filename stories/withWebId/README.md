### withWebId

In Solid, people are identified by a WebID, which is essentially a URL link that points to them and leads to their data.

By wrapping your component definition with withWebId, the WebID property will automatically be set on your component's instances whenever the login status changes.

We re-expose this component from [@solid/react](https://github.com/solid/react-components) library.

```javascript
const MyComponent = withWebId(props => <p>Hey user, your WebID is {props.webID}.</p>);
```
