import IPromiseRes from "./IPromiseRes";

export default abstract class TemplateHandler<TemplateFile> {
  protected abstract templateFile: TemplateFile;

  public abstract populate(): Promise<IPromiseRes>;
}
