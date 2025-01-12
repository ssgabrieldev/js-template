import { join } from "path";

import { ErrorSlideNotLoadded } from "../../error/ErrorSlideNotLoadded";

import { PPTXTemplateFile } from "../PPTXTemplateFile";

import { PPTXTemplateHandler } from ".";

describe("Template File PPTX", () => {
  it("should every thing to be ok", async () => {
    const templateFile = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const pptxTemplateHandler = new PPTXTemplateHandler({
      templateFile
    });

    const [result, error] = await pptxTemplateHandler.populate({
      price: 1.1
    });

    expect(result).toBe(true);
    expect(error).toBeNull();
  });

  it("should fail to load slides of invalid template", async () => {
    const templateFile = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template-error.pptx")
    });
    const pptxTemplateHandler = new PPTXTemplateHandler({
      templateFile
    });

    const [result, error] = await pptxTemplateHandler.populate({
      price: 1.1
    });

    expect(result).toBeNull();
    expect((error as NodeJS.ErrnoException).code).toBe("ENOENT");
  });

  it("should return ErrorSlideNotLoadded if slides are not loadded", async () => {
    const templateFile = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const pptxTemplateHandler = new PPTXTemplateHandler({
      templateFile
    });

    (pptxTemplateHandler as any).loadSlides = jest.fn(
      (pptxTemplateHandler as any).loadSlides
    ).mockImplementationOnce(() => {
      return [null, null];
    });

    const [result, error] = await pptxTemplateHandler.populate({
      price: 1.1
    });

    expect(result).toBeNull();
    expect(error).toBeInstanceOf(ErrorSlideNotLoadded);
  });

  it("should return same error of slide populate", async () => {
    const templateFile = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const pptxTemplateHandler = new PPTXTemplateHandler({
      templateFile
    });

    const populateError = new Error();

    (pptxTemplateHandler as any).getSlides = jest.fn(
      (pptxTemplateHandler as any).getSlides
    ).mockImplementationOnce(async () => {
      return [[{populate: async () => [null, populateError]}], null];
    });

    const [result, error] = await pptxTemplateHandler.populate({
      price: 1.1
    });

    expect(result).toBeNull();
    expect(error).toBe(populateError);
  });

  it("should return error", async () => {
    const templateFile = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const pptxTemplateHandler = new PPTXTemplateHandler({
      templateFile
    });
  
    (pptxTemplateHandler as any).getSlides = jest.fn(
      (pptxTemplateHandler as any).getSlides
    ).mockImplementationOnce(async () => {
      return [[{populate: () => {
        throw new Error()
      }}], null];
    });
  
    const [result, error] = await pptxTemplateHandler.populate({
      price: 1.1
    });
  
    expect(result).toBeNull();
    expect(error).toBeTruthy();
  });
});

