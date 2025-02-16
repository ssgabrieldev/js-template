import { join } from "path";

import { PPTXTemplateFile } from ".";

describe("Template File PPTX", () => {
  const templatePath = join(__dirname, "..", "..", "..", "..", "assets", "template.pptx");

  it("should return a error when template not found", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: "foo.pptx"
    });
    const [result, error] = await Object(templateFilePPTX).loadFile();
  
    expect(result).toBe(null);
    expect(error).toBeTruthy();
  });
  
  it("should return true if template is loadded", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });
    const [result, error] = await Object(templateFilePPTX).loadFile();
  
    expect(result).toBe(true);
    expect(error).toBe(null);
  });

  it("should return a error if filePath not found", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });

    const [docXML, error] = await templateFilePPTX.getFileXML({
      filePath: "ppt/slides/slide10000.xml"
    });

    expect(docXML).toBe(null);
    expect(error).toBeTruthy();
  });

  it("should return a error if can't get XML", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });

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

  it("should getFileXML return same error as loadFile error", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });

    const errorLoadFile = new Error();

    (templateFilePPTX as any).loadFile = jest.fn(
      (templateFilePPTX as any).loadFile
    ).mockImplementationOnce(() => {
      return [null, errorLoadFile];
    });

    const [docXML, error] = await templateFilePPTX.getFileXML({
      filePath: "ppt/slides/slide1.xml"
    });

    expect(docXML).toBe(null);
    expect(error).toBe(error);

  });

  it("should return file XML", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });

    const [docXML, error] = await templateFilePPTX.getFileXML({
      filePath: "ppt/slides/slide1.xml"
    });

    expect(docXML).toBeTruthy();
    expect(error).toBe(null);
  });

  it("should return files", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });

    const [files, error] = await templateFilePPTX.getFiles();

    expect(files).toBeTruthy();
    expect(error).toBe(null);
  });

  it("should getFiles return same error as loadFile", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });

    const errorLoadFile = new Error();

    (templateFilePPTX as any).loadFile = jest.fn(
      (templateFilePPTX as any).loadFile
    ).mockImplementationOnce(() => {
      return [null, errorLoadFile];
    });

    const [files, error] = await templateFilePPTX.getFiles();

    expect(files).toBeNull();
    expect(error).toBe(errorLoadFile);
  });

  it("should getFiles return error", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });

    (templateFilePPTX as any).loadFile = jest.fn(
      (templateFilePPTX as any).loadFile
    ).mockImplementationOnce(() => {
      throw new Error();
    });

    const [files, error] = await templateFilePPTX.getFiles();

    expect(files).toBeNull();
    expect(error).toBeTruthy();
  });

  it ("should save file", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });

    const [result, error] = await templateFilePPTX.save({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "temp", "template.pptx")
    });

    expect(result).toBe(true);
    expect(error).toBeNull();
  });

  it ("should save return same error as loadFile", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: "foo.pptx"
    });

    const errorLoadFile = new Error();

    (templateFilePPTX as any).loadFile = jest.fn(
      (templateFilePPTX as any).loadFile
    ).mockImplementationOnce(() => {
      return [null, errorLoadFile];
    });

    const [result, error] = await templateFilePPTX.save({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "temp", "template.pptx")
    });

    expect(result).toBeNull();
    expect(error).toBe(errorLoadFile);
  });

  it ("should save return a error", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: "foo.pptx"
    });

    const randomError = new Error();

    (templateFilePPTX as any).loadFile = jest.fn(
      (templateFilePPTX as any).loadFile
    ).mockImplementationOnce(() => {
      throw randomError;
    });

    const [result, error] = await templateFilePPTX.save({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "temp", "template.pptx")
    });

    expect(result).toBeNull();
    expect(error).toBe(randomError);
  });
});
