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
  await templateHandler.populate({
    price: 1.2
  });

  console.log("==========================")

  await templateHandler.populate({
    price: 1.2
  });
}

main();
