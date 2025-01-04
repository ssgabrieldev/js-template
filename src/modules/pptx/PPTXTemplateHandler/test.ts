import { join } from "path";
import PPTXTemplateHandler from ".";
import PPTXTemplateFile from "../PPTXTemplateFile";

describe("Template File PPTX", () => {
  const templateFile = new PPTXTemplateFile({
    filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
  });
  const pptxTemplateHandler = new PPTXTemplateHandler({
    templateFile
  });

  it("should return slides", async () => {
    await pptxTemplateHandler.populate();
  });
});

