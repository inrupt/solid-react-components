import React, { Component } from "react";
import { lookup, extension } from "mime-types";
import auth from "solid-auth-client";
import { UploadedFiles, SolidError } from "@entities";

type Props = {
  fileBase: String,
  limitFiles: number,
  render: Node,
  onComplete?: (files: Array<UploadedFiles>) => void,
  onDrop?: (files: Array<UploadedFiles>) => void,
  onError?: (error: SolidError) => void,
  onStart?: () => void,
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
    window.addEventListener("dragover", (event: React.EventHandler) => {
      this.overrideEvent(event);
    });
    window.addEventListener("drop", (event: React.EventHandler) => {
      this.overrideEvent(event);
    });
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
    // When files updates means that we have a new files to upload
    if (this.state.files !== prevState.files && this.state.files.length > 0) {
      this.upload();
    }
    // we check if all files was uploaded and fire onComplete props
    if (
      this.state.uploadedFiles.length > 0 &&
      prevState.uploadedFiles !== this.state.uploadedFiles
    ) {
      this.onComplete(this.state.uploadedFiles);
    }
  }
  /**
   * Upload files to Solid Pod using fetch from solid-auth-client
   * @params{Object} options
   */
  upload = async (options: Object) => {
    const { fileBase, onError } = this.props;
    const { files } = this.state;
    let suffix = "";

    // We read each file and upload to pod using Base64
    files.forEach(file => {
      const reader = new FileReader();

      reader.onload = async f => {
        try {
          // Get image Base64 string
          const data = f.target.result;
          // Check if file has extension and add suffix string
          if (file.type && file.type !== "") {
            if (file.type !== lookup(file.name)) {
              suffix = `_. ${extension(file.type)}`;
            }
          } else {
            const error = {
              type: "file",
              statusText: "Unsupported Media Type",
              code: 415
            };
            throw error;
          }
          // Get destination file url
          const destinationUri = `${fileBase}/${encodeURIComponent(
            file.name
          )}${suffix}`;

          // Send file on Base64 to server using fetch from solid-auth-client
          const response = await auth.fetch(destinationUri, {
            method: "PUT",
            force: true,
            headers: {
              "content-type": file.type,
              credentials: "include"
            },
            body: data
          });
          // Is all is fine we add new files into uploadedFiles array
          if (response.ok) {
            const newUploadedFiles = [
              ...this.state.uploadedFiles,
              { uri: destinationUri, name: file.name }
            ];

            return this.setState({ uploadedFiles: newUploadedFiles });
          }
          // If something come bad throw error
          throw response;
        } catch (error) {
          onError(error, file);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };
  /**
   * will fire when all files was uploaded
   * @params {Array<UpoadFiles>} uploadFiles
   */
  onComplete = (uploadedFiles: Array<UploadedFiles>) => {
    if (this.state.uploadedFiles.length === this.state.files.length) {
      this.setState({ inProgress: false });

      if (this.props.onComplete) {
        this.props.onComplete(uploadedFiles);
      }
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
        event.dataTransfer.types[this.positionFile] === "Files")
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
    this.overrideEvent(event);
    this.counter = 0;

    let files = [];

    if (
      this.props.limitFiles &&
      event.dataTransfer.items.length > this.props.limitFiles
    ) {
      const error = {
        type: "file",
        statusText: "Sorry you exceed files allowed per upload",
        code: 400
      };

      return this.props.onError(error, []);
    }

    if (event.dataTransfer.items) {
      files = event.dataTransfer.files.map(file => file);
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
    // If onStart callback come will fire it.
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
          type="file"
          className="file-uploader--input"
          onChange={this.onFileChanged}
          style={{ display: "none" }}
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

export default Uploader;
