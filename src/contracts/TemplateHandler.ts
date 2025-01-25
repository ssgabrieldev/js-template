import IPromiseRes from "./IPromiseRes";

export type TPopulateData = {
  [key: string]: any;
};

export type TPSave = {
  filePath: string,
  data: TPopulateData
}

export abstract class TemplateHandler<TemplateFile> {
  protected abstract templateFile: TemplateFile;

  protected abstract populate(data: TPopulateData): IPromiseRes<boolean>;
  public abstract save({ filePath, data }: TPSave): IPromiseRes<boolean>;
}
