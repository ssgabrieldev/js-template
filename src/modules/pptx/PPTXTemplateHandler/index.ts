import IPromiseRes from "../../../contracts/IPromiseRes";
import { TemplateHandler, TPopulateData } from "../../../contracts/TemplateHandler";

import PPTXTemplateFile from "../PPTXTemplateFile";
import PPTXSlide from "../PPTXSlide";

type TContructor = {
  templateFile: PPTXTemplateFile;
};

export default class PPTXTemplateHandler extends TemplateHandler<PPTXTemplateFile> {
  protected templateFile;

  private slides: PPTXSlide[] = [];

  constructor({ templateFile }: TContructor) {
    super();

    this.templateFile = templateFile;
  }

  private async loadSlides() {
    const slides: PPTXSlide[] = [];

    Object.keys(this.templateFile.getFiles()).forEach((filePath) => {
      if (filePath.startsWith("ppt/slides/slide")) {
        const fileNameWithExtension = filePath.split("/").pop();
        const [fileName, _fileExtension] = fileNameWithExtension?.split(".") || [];
        const slideNumber = Number(fileName.replace("slide", ""));

        const slide = new PPTXSlide({
          number: slideNumber,
          templateFile: this.templateFile
        });

        slides.push(slide);
      }
    });

    this.slides = slides;
  }

  public async populate(data: TPopulateData): Promise<IPromiseRes> {
    try {
      const [_result, error] = await this.templateFile.loadFile();

      if (error) {
        throw error;
      }

      await this.loadSlides();

      for (const slide of this.slides) {
        await slide.populate(data);
      }

      return [true, null];
    } catch (error) {
      return [null, error];
    }
  }

  public getSlides() {
    return this.slides;
  }
}
