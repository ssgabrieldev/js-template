import { XMLSerializer } from "xmldom";

import PPTXTemplateFile from "../PPTXTemplateFile";

type TConstructor = {
  number: number,
  templateFile: PPTXTemplateFile
}

export default class PPTXSlide {
  private templateFile: PPTXTemplateFile;
  private number: number;
  private xmlDocument: Node | null = null;
  private xmlSerializer = new XMLSerializer();

  constructor({ number, templateFile }: TConstructor) {
    this.number = number;
    this.templateFile = templateFile;
  }

  private async getXMLDocument(): Promise<[Node | null, unknown | null]> {
    if (!this.xmlDocument) {
      const [xml, error] = await this.templateFile.getFileXML({
        filePath: `ppt/slides/slide${this.number}.xml`
      });

      if (error || !xml) {
        return [null, error];
      }

      this.xmlDocument = xml;
    }

    return [this.xmlDocument, null];
  }

  public async getPlaceHolders() {
    const [xmlDocument, error] = await this.getXMLDocument();

    if (error || !xmlDocument) {
      return [null, error];
    }

    const stack = [...Array.from(xmlDocument.childNodes)];
    const nodesWithContent: Node[] = [];

    while (stack.length > 0) {
      const node = stack.pop();

      if (node?.hasChildNodes()) {
        stack.push(...Array.from(node.childNodes));
      } else {
        nodesWithContent.push(node!);
      }
    }

    const placeHolders: string[] = [];

    nodesWithContent.forEach((nodeWithContent, index) => {
      const nodeText = nodeWithContent?.textContent;

      const fullMatchRegex = /{(.*?)}/g;
      if (nodeText?.match(fullMatchRegex)) {
        const matchs = nodeText?.matchAll(fullMatchRegex);

        for (const match of matchs) {
          placeHolders.push(match[0]);
        }
      }

      const berrindMatchRegex = /^(\w*?})/g;
      if (nodeText?.match(berrindMatchRegex)) {
        const matchs = [...nodeText?.matchAll(berrindMatchRegex)];

        matchs.forEach((match) => {
          let offset = 1;
          let nodeWithOpenningTag = nodesWithContent[index + offset];

          do {
            if (nodeWithOpenningTag.textContent?.length || 0 > 0) {
              placeHolders.push(nodeWithOpenningTag.textContent!);
            }

            offset++;

            nodeWithOpenningTag = nodesWithContent[index + offset];
          } while (
            !!nodeWithOpenningTag
            && !nodeWithOpenningTag.textContent?.match(/({#?\w*?)$/g)
          )

          placeHolders.push(match[0]);
        });
      }
    });


    console.log(placeHolders)
    return [placeHolders, null];
  }
}
