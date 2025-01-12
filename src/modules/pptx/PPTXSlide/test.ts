import { join } from "path";

import { ErrorPlaceholderNotLoadded } from "../../error/ErrorPlaceholderNotLoadded";
import { ErrorCantGetFileXML } from "../../error/ErrorCantGetFileXML";

import { PPTXTemplateFile } from "../PPTXTemplateFile";

import { PPTXSlide } from ".";


describe("Slide", () => {
  it("should populate works", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const slide = new PPTXSlide({
      number: 1,
      templateFile: templateFilePPTX
    });
  
    const [result, error] = await slide.populate({
      foo: "bar"
    });
  
    expect(result).toBe(true);
    expect(error).toBeNull();
  });
  
  it("should populate return same error as loadPlaceholders", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const slide = new PPTXSlide({
      number: 1,
      templateFile: templateFilePPTX
    });
  
    const errorLoadPlaceholders = new Error();
  
    (slide as any).loadPlaceholders = jest.fn(
      (slide as any).loadPlaceholders
    ).mockImplementationOnce(async () => [null, errorLoadPlaceholders]);
  
    const [result, error] = await slide.populate({
      foo: "bar"
    });
  
    expect(result).toBeNull();
    expect(error).toBe(errorLoadPlaceholders);
  });
  
  it("should populate return ErrorPlaceholderNotLoadded", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const slide = new PPTXSlide({
      number: 1,
      templateFile: templateFilePPTX
    });
  
    (slide as any).loadPlaceholders = jest.fn(
      (slide as any).loadPlaceholders
    ).mockImplementationOnce(async () => [null, null]);
  
    const [result, error] = await slide.populate({
      foo: "bar"
    });
  
    expect(result).toBeNull();
    expect(error).toBeInstanceOf(ErrorPlaceholderNotLoadded);
  });
  
  it("should populate not fail if dont match any placeholder", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const slide = new PPTXSlide({
      number: 1,
      templateFile: templateFilePPTX
    });
  
    const [result, error] = await slide.populate({
      foo: "bar"
    });
  
    expect(result).toBe(true);
    expect(error).toBeNull();
  });
  
  it("should populate return ErrorCantGetFileXML", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const slide = new PPTXSlide({
      number: 100,
      templateFile: templateFilePPTX
    });
  
    const [result1, error1] = await slide.populate({
      foo: "bar"
    });
  
    (slide as any).getXMLDocument = jest.fn(
      (slide as any).getXMLDocument
    ).mockImplementationOnce(async () => [null, null]);
  
    const [result2, error2] = await slide.populate({
      foo: "bar"
    });
  
    expect(result1).toBeNull();
    expect(result2).toBeNull();
    expect(error1).toBeInstanceOf(ErrorCantGetFileXML);
    expect(error2).toBeInstanceOf(ErrorCantGetFileXML);
  });

  it("should populate not fail if slide is empty", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const slide = new PPTXSlide({
      number: 1,
      templateFile: templateFilePPTX
    });

    (slide as any).getXMLDocument = jest.fn(
      (slide as any).getXMLDocument
    ).mockImplementationOnce(async () => [{childNodes: [null]}, null]);

    const [result, error] = await slide.populate({
      foo: "bar"
    });

    expect(result).toBe(true);
    expect(error).toBe(null);
  });
});
