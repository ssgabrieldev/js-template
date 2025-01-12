import IPromiseRes from "./IPromiseRes";

export type TPopulateData = {
  [key: string]: any;
};

export type TPSave = {
  file: string
}

export abstract class TemplateHandler<TemplateFile> {
  protected abstract templateFile: TemplateFile;

  public abstract populate(data: TPopulateData): IPromiseRes<boolean>;
  public abstract save({ file }: TPSave): IPromiseRes<boolean>;
}
