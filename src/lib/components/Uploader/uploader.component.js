import React, { Component } from 'react';
import { SolidError } from '@utils';
import { lookup, extension } from 'mime-types';
import auth from 'solid-auth-client';
import { UploadedFiles, SolidError as SolidErrorEntity } from '@entities';

type Props = {
  fileBase: String,
  accept: String,
  limitSize: number,
  limitFiles: number,
  render: Node,
  errorsText: Object,
  onComplete?: (files: Array<UploadedFiles>) => void,
  onDrop?: (files: Array<UploadedFiles>) => void,
  onError?: (error: SolidErrorEntity) => void,
  onStart?: () => void
};

class Uploader extends Component<Props> {
  counter: number;
  positionFile: number;

  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      files: [],
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
    // When the 'files' prop changes, that means we have new files to upload.
    if (this.state.files !== prevState.files && this.state.files.length > 0) {
      this.upload();
    }
    // We check if all files were uploaded, then fire the onComplete handler
    if (
      this.state.uploadedFiles.length > 0 &&
      prevState.uploadedFiles !== this.state.uploadedFiles
    ) {
      this.onComplete(this.state.uploadedFiles);
    }
  }
  validateAcceptFiles = (accept: String, type: String) => {
    const extensions = accept.split(',');

    return extensions.find(ext => extension(type.trim()) === ext);
  };
  removeFileOnError = (file: File) => {
    const updatedFiles = this.state.files.filter(f => f.name !== file.name);

    this.setState({ files: updatedFiles, inProgress: false });
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
  upload = async (options: Object) => {
    const { fileBase, onError, limitSize, accept, errorsText } = this.props;
    const { files } = this.state;

    // We read each file and upload to POD using Base64
    for await (const file of files) {
      const reader = new FileReader();
      let suffix = false;

      reader.onload = async f => {
        try {
          // Get image Base64 string
          const data = f.target.result;

          if (limitSize && file.size > limitSize) {
            throw new SolidError(errorsText.sizeLimit, 'file', 400);
          }

          // Check if file has extension and add suffix string
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

          const newFileName = this.renameFile(file, suffix);

          // Get destination file url
          const destinationUri = `${fileBase}/${encodeURIComponent(
            newFileName
          )}`;

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
            const newUploadedFiles = [
              ...this.state.uploadedFiles,
              { uri: destinationUri, name: newFileName }
            ];
            // Remove uploaded file from files state
            const newFiles = this.state.files.filter(f => f.name !== file.name);
            // Add uploaded files to state and remove files uploaded
            return this.setState({
              uploadedFiles: newUploadedFiles,
              files: newFiles
            });
          }
          // If something went wrong, throw an error
          throw response;
        } catch (error) {
          onError && onError(error, file);
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
  onComplete = (uploadedFiles: Array<UploadedFiles>) => {
    this.setState({ inProgress: false });
    if (this.props.onComplete) {
      this.props.onComplete(uploadedFiles);
    }
  };
  onDragEnter = (event: React.DragEvent) => {
    this.overrideEvent(event);
    // Counter drag events
    this.counter += 1;

    if (
      (event.dataTransfer.items &&
        event.dataTransfer.items[this.positionFile]) ||
      (event.dataTransfer.types &&
        event.dataTransfer.types[this.positionFile] === 'Files')
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
    const { errorsText } = this.props;
    this.overrideEvent(event);
    this.counter = 0;

    let files = [];

    if (
      this.props.limitFiles &&
      event.dataTransfer.items.length > this.props.limitFiles
    ) {
      const error = new SolidError(errorsText.maximumFiles, 'file', 400);

      return this.props.onError(error, []);
    }

    if (event.dataTransfer.items) {
      for (const file of event.dataTransfer.files) {
        files = [...files, file];
      }
    }

    if (this.props.onDrop) {
      this.props.onDrop(files);
    }

    this.onStart();
    this.setState({ files });
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
    // When upload start this event will fire.
    if (this.props.onStart) {
      this.props.onStart();
    }
    if (!this.state.inProgress) {
      this.setState({ inProgress: true });
    }
  };
  onFileChanged = (event: React.onFileChanged) => {
    if (event.target.files && event.target.files[this.positionFile]) {
      this.onStart();
      this.setState({ files: [...this.state.files, ...event.target.files] });
    }
  };
  overrideEvent = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  props: Props;

  render() {
    const { onDragLeave, onDragEnter, onClickFile, onDrop } = this;

    return (
      <div>
        <input
          ref={this.fileInput}
          type='file'
          className='file-uploader--input'
          onChange={this.onFileChanged}
          style={{ display: 'none' }}
        />
        {this.props.render({
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
    maximumFiles:
      'Sorry, you have exceeded the maximum number of files allowed per upload'
  }
};

export default Uploader;
