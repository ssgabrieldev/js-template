import IPromiseRes from "./IPromiseRes";

export type TPSave = {
  filePath: string
};

export abstract class TemplateFile {
  public abstract save({ filePath }: TPSave): IPromiseRes<boolean>;
}
