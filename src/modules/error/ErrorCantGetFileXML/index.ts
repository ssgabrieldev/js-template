type TContructorParams = {
  file: string
}

export class ErrorCantGetFileXML extends Error {
  constructor({ file }: TContructorParams) {
    super();

    this.message = `Can't get file ${file} XML`;
  }
}
