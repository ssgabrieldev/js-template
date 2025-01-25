import IPromiseRes from "../../../contracts/IPromiseRes";
import { TemplateHandler, TPopulateData, TPSave } from "../../../contracts/TemplateHandler";

import { ErrorSlideNotLoadded } from "../../error/ErrorSlideNotLoadded";

import { PPTXTemplateFile } from "../PPTXTemplateFile";
import { PPTXSlide } from "../PPTXSlide";

type TContructor = {
  templateFile: PPTXTemplateFile;
};

export class PPTXTemplateHandler extends TemplateHandler<PPTXTemplateFile> {
  protected templateFile;

  private slides: PPTXSlide[] | null = null;

  constructor({ templateFile }: TContructor) {
    super();

    this.templateFile = templateFile;
  }

  private async loadSlides(): IPromiseRes<typeof this.slides> {
    const slides: PPTXSlide[] = [];
    const [pptxXMLFiles, error] = await this.templateFile.getFiles();

    if (error) {
      return [null, error];
    }

    Object.keys(pptxXMLFiles!).forEach((filePath) => {
      if (filePath.startsWith("ppt/slides/slide")) {
        const fileNameWithExtension = filePath.split("/").pop();
        if (fileNameWithExtension) {
          const [fileName, _fileExtension] = fileNameWithExtension?.split(".");
          const slideNumber = Number(fileName.replace("slide", ""));

          const slide = new PPTXSlide({
            number: slideNumber,
            templateFile: this.templateFile
          });

          slides.push(slide);
        }
      }
    });

    this.slides = slides;

    return [slides, null];
  }

  private async getSlides(): IPromiseRes<PPTXSlide[]> {
    if (!this.slides) {
      const [slides, error] = await this.loadSlides();

      if (error) {
        return [null, error];
      }

      this.slides = slides;
    }

    return [this.slides, null];
  }

  protected async populate(data: TPopulateData): IPromiseRes<boolean> {
    try {
      const [slides, error] = await this.getSlides();

      if (error) {
        return [null, error];
      }

      if (!slides) {
        return [null, new ErrorSlideNotLoadded()];
      }

      for (const slide of slides) {
        const [_, error] = await slide.populate(data);

        if (error) {
          return [null, error];
        }
      }

      return [true, null];
    } catch (error) {
      return [null, error];
    }
  }

  public async save({ filePath, data }: TPSave): IPromiseRes<boolean> {
    try {
      const [_resultPopulate, errorPopulate] = await this.populate(data);

      if (errorPopulate) {
        return [null, errorPopulate];
      }

      const [_resultSave, error] = await this.templateFile.save({ filePath });

      if (error) {
        return [null, error];
      }

      return [true, null];
    } catch(error) {
      return [null, error];
    }
  }
}
