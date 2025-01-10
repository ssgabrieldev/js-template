type IPromiseRes<T> = Promise<[
  null | T,
  null | unknown
]>;

export default IPromiseRes;
