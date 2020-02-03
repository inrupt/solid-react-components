import React, { Component } from 'react';
import { lookup, extension } from 'mime-types';
import auth from 'solid-auth-client';
import { SolidError } from '@utils';
import { UploadedFiles, SolidError as SolidErrorEntity } from '@entities';

type Props = {
  fileBase: String,
  accept: String,
  limitSize: number,
  limitFiles: number,
  render: Node,
  errorsText?: Object,
  onComplete: (files: Array<UploadedFiles>) => void,
  onDrop: (files: Array<UploadedFiles>) => void,
  onError: (error: SolidErrorEntity) => void,
  onStart: () => void
};

class Uploader extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      recentlyUploadedFiles: [],
      uploadedFiles: []
    };
    this.fileInput = React.createRef();
    this.positionFile = 0;
  }

  componentDidMount() {
    window.addEventListener('dragover', (event: React.EventHandler) => {
      this.overrideEvent(event);
    });
    window.addEventListener('drop', (event: React.EventHandler) => {
      this.overrideEvent(event);
    });
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
    const { uploadedFiles, recentlyUploadedFiles } = this.state;
    // We check if all files were uploaded, then fire the onComplete handler
    if (uploadedFiles.length > 0 && prevState.uploadedFiles !== uploadedFiles) {
      this.onComplete(recentlyUploadedFiles, uploadedFiles);
    }
  }

  componentWillUnmount(): void {
    /**
     * Remove subscribe after component Unmount
     */
    window.removeEventListener('dragover', this.overrideEvent);
    window.removeEventListener('drop', this.overrideEvent);
  }

  validateAcceptFiles = (accept: String, type: String) => {
    const extensions = accept.split(',');

    return extensions.find(ext => extension(type.trim()) === ext);
  };

  removeFileOnError = () => {
    this.setState({ inProgress: false });
  };

  renameFile = (file: Object, suffix: String) => {
    const randomSuffix = Date.parse(new Date());
    const ext = extension(file.type);
    const name = file.name.substr(0, file.name.lastIndexOf(`.${ext}`));

    return `${name}_${randomSuffix}_.${suffix || ext}`;
  };

  /**
   * Upload files to Solid POD using fetch from solid-auth-client
   * @params{Object} options
   */
  upload = async files => {
    const { fileBase, onError, limitSize, accept, errorsText } = this.props;
    let currentFiles = [];

    // We read each file and upload to POD using Base64
    for await (const file of files) {
      const reader = new FileReader();
      let suffix = false;

      /* eslint no-loop-func: 0 */
      reader.onload = async f => {
        try {
          // Get image Base64 string
          const data = f.target.result;

          if (limitSize && file.size > limitSize) {
            throw new SolidError(errorsText.sizeLimit, 'file', 400);
          }

          // Check if file has extension and add suffix string
          if (accept !== '*/*') {
            if (file.type && file.type !== '') {
              if (file.type !== lookup(file.name)) {
                suffix = `${extension(file.type)}`;
              }
            } else {
              throw new SolidError(errorsText.unsupported, 'file', 415);
            }

            if (accept && !this.validateAcceptFiles(accept, file.type)) {
              throw new SolidError(errorsText.unsupported, 'file', 415);
            }
          }

          const newFileName = this.renameFile(file, suffix);

          // Get destination file url
          const destinationUri = `${fileBase}/${encodeURIComponent(newFileName)}`;

          // Send file on Base64 to server using fetch from solid-auth-client
          const response = await auth.fetch(destinationUri, {
            method: 'PUT',
            force: true,
            headers: {
              'content-type': file.type,
              credentials: 'include'
            },
            body: data
          });
          // If everything is fine, we add new files into the uploadedFiles array
          if (response.ok) {
            const { uploadedFiles } = this.state;
            const currentFile = { uri: destinationUri, name: newFileName };
            const newUploadedFiles = [...uploadedFiles, currentFile];

            // Add uploaded files to state and remove files uploaded
            currentFiles = [...currentFiles, currentFile];

            return this.setState({
              recentlyUploadedFiles: currentFiles,
              uploadedFiles: newUploadedFiles
            });
          }
          // If something went wrong, throw an error
          throw response;
        } catch (error) {
          if (onError) onError(error, file);
          this.removeFileOnError(file);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  /**
   * This will fire when all files have been uploaded
   * @params {Array<UpoadFiles>} uploadFiles
   */
  onComplete = (
    recentlyUploadedFiles: Array<UploadedFiles>,
    uploadedFiles: Array<UploadedFiles>
  ) => {
    const { onComplete } = this.props;
    this.setState({ inProgress: false });
    if (onComplete) {
      onComplete(recentlyUploadedFiles, uploadedFiles);
    }
  };

  onDragEnter = (event: React.DragEvent) => {
    this.overrideEvent(event);
    // Counter drag events
    this.counter += 1;

    if (
      (event.dataTransfer.items && event.dataTransfer.items[this.positionFile]) ||
      (event.dataTransfer.types && event.dataTransfer.types[this.positionFile] === 'Files')
    ) {
      this.setState({ dragging: true });
    }
  };

  onDragLeave = (event: React.DragEvent) => {
    this.overrideEvent(event);
    this.counter -= 1;

    if (this.counter === 0) {
      this.setState({ dragging: false });
    }
  };

  onDrop = async (event: React.DragEvent) => {
    const { errorsText, limitFiles, onError, onDrop } = this.props;
    this.overrideEvent(event);
    this.counter = 0;

    let files = [];

    if (limitFiles && event.dataTransfer.items.length > limitFiles) {
      const error = new SolidError(errorsText.maximumFiles, 'file', 400);

      return onError(error, []);
    }

    if (event.dataTransfer.items) {
      for (const file of event.dataTransfer.files) {
        files = [...files, file];
      }
    }

    if (onDrop) onDrop(files);

    this.onStart();
    this.setState({ files });

    this.upload(files);
  };

  onClickFile = () => {
    if (this.fileInput) {
      this.fileInput.current.click();
    }
  };

  /**
   * Will call when file start to upload.
   */
  onStart = () => {
    const { onStart } = this.props;
    const { inProgress } = this.state;
    // When upload start this event will fire.
    if (onStart) {
      onStart();
    }
    if (!inProgress) {
      this.setState({ inProgress: true });
    }
  };

  onFileChanged = (event: React.onFileChanged) => {
    if (event.target.files && event.target.files[this.positionFile]) {
      this.onStart();

      this.upload(event.target.files);
    }
  };

  overrideEvent = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  counter: number;

  positionFile: number;

  props: Props;

  render() {
    const { onDragLeave, onDragEnter, onClickFile, onDrop } = this;
    const { render } = this.props;
    return (
      <div>
        <input
          ref={this.fileInput}
          type="file"
          className="file-uploader--input"
          onChange={this.onFileChanged}
          style={{ display: 'none' }}
          data-testid="input-file"
        />
        {render({
          ...this.state,
          overrideEventDefaults: this.overrideEventDefaults,
          onDragLeave,
          onDragEnter,
          onClickFile,
          onDrop
        })}
      </div>
    );
  }
}

Uploader.defaultProps = {
  errorsText: {
    sizeLimit: 'File size exceeds the allowable limit',
    unsupported: 'Unsupported media type',
    maximumFiles: 'Sorry, you have exceeded the maximum number of files allowed per upload'
  }
};

export default Uploader;
