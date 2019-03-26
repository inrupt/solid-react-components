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
