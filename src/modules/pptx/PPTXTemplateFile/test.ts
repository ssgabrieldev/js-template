import { join } from "path";

import PPTXTemplateFile from ".";

describe("Template File PPTX", () => {
  it("should return a error when template not found", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: "foo.pptx"
    });
    const [result, error] = await templateFilePPTX.loadFile();

    expect(result).toBe(null);
    expect(error).toBeTruthy();
  });

  it("should return true if template is loadded", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "../../../../assets/template.pptx")
    });
    const [result, error] = await templateFilePPTX.loadFile();

    expect(result).toBe(true);
    expect(error).toBe(null);
  });

  it("should return a error if filePath not found", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "../../../../assets/template.pptx")
    });
    await templateFilePPTX.loadFile();

    const [docXML, error] = await templateFilePPTX.getFileXML({
      filePath: "ppt/slides/slide10000.xml"
    });

    expect(docXML).toBe(null);
    expect(error).toBeTruthy();
  });

  it("should return a error if can't get XML", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "../../../../assets/template.pptx")
    });
    await templateFilePPTX.loadFile();

    (templateFilePPTX as any).domParser.parseFromString = jest.fn(
      (templateFilePPTX as any).domParser.parseFromString
    ).mockImplementationOnce(() => {
      throw new Error();
    });

    const [docXML, error] = await templateFilePPTX.getFileXML({
      filePath: "ppt/slides/slide1.xml"
    });

    expect(docXML).toBe(null);
    expect(error).toBeTruthy();
  });

  it("should return file XML", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "../../../../assets/template.pptx")
    });
    await templateFilePPTX.loadFile();

    const [docXML, error] = await templateFilePPTX.getFileXML({
      filePath: "ppt/slides/slide1.xml"
    });

    expect(docXML).toBeTruthy();
    expect(error).toBe(null);
  });
});
