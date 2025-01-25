import { join } from "path";

import { PPTXTemplateHandler } from "./modules/pptx/PPTXTemplateHandler";
import { PPTXTemplateFile } from "./modules/pptx/PPTXTemplateFile";

const templateFile = new PPTXTemplateFile({
  filePath: join(__dirname, "../assets/template.pptx")
});
const templateHandler = new PPTXTemplateHandler({
  templateFile
});

async function main() {
  await templateHandler.save({
    filePath: join(__dirname, "../assets/temp/template.pptx"),
    data: {
      title: "Teste",
      name: "Paulo Gabriel Santana Silva"
    }
  })
}

main();
