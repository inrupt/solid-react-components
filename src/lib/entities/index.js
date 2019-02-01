export type Provider = {
  description: String,
	image: String,
	label: String,
	value: String
};

export type SelectOptions = {
	label: string,
	value: string
};

export type UploadedFiles = {
  uri: String,
	name: String
};

export type SolidError = {
  type: String,
  statusText: String,
  code: number
};
