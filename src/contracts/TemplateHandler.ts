import IPromiseRes from "./IPromiseRes";

export type TPopulateData = {
  [key: string]: any;
};

export abstract class TemplateHandler<TemplateFile> {
  protected abstract templateFile: TemplateFile;

  public abstract populate(data: TPopulateData): IPromiseRes<boolean>;
}
