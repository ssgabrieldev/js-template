import { join } from "path";

import PPTXTemplateHandler from "./modules/pptx/PPTXTemplateHandler";
import PPTXTemplateFile from "./modules/pptx/PPTXTemplateFile";

const templateFile = new PPTXTemplateFile({
  filePath: join(__dirname, "../assets/template.pptx")
});
const templateHandler = new PPTXTemplateHandler({
  templateFile
});

async function main() {
  await templateHandler.populate();

  const slides = templateHandler.getSlides();

  for (const slide of slides) {
    const [placeholders, error] = await slide.getPlaceHolders();

    if (error) {
      return console.error(error);
    }

    // console.log(placeholders)
  }
}

main();
