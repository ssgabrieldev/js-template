import { TPopulateData } from "../../../contracts/TemplateHandler";

import IPromiseRes from "../../../contracts/IPromiseRes";

import { ErrorPlaceholderNotLoadded } from "../../error/ErrorPlaceholderNotLoadded";

import PPTXTemplateFile from "../PPTXTemplateFile";
import PPTXPlaceholder from "../PPTXPlaceholder";
import { ErrorCantGetFileXML } from "../../error/ErrorCantGetFileXML";

type TConstructor = {
  number: number,
  templateFile: PPTXTemplateFile
}

type TOpenedPlaceholder = {
  nodes: Node[];
  key: string;
}

export default class PPTXSlide {
  private templateFile: PPTXTemplateFile;
  private number: number;
  private xmlDocument: Node | null = null;
  private placeholders: PPTXPlaceholder[] = [];

  constructor({ number, templateFile }: TConstructor) {
    this.number = number;
    this.templateFile = templateFile;
  }

  private getFilePath() {
    return `ppt/slides/slide${this.number}.xml`;
  }

  private async getXMLDocument(): IPromiseRes<Node> {
    if (!this.xmlDocument) {
      const [xml, error] = await this.templateFile.getFileXML({
        filePath: this.getFilePath()
      });

      if (error) {
        return [null, error];
      }

      this.xmlDocument = xml;
    }

    return [this.xmlDocument, null];
  }

  private async loadPlaceholders(): IPromiseRes<PPTXPlaceholder[]> {
    const [xmlDocument, error] = await this.getXMLDocument();
    const placeholders: PPTXPlaceholder[] = [];
    const openedPlaceholder: TOpenedPlaceholder = {
      nodes: [],
      key: ""
    };

    if (error) {
      return [null, error];
    }

    if (!xmlDocument) {
      return [null, new ErrorCantGetFileXML({ file: this.getFilePath() })];
    }

    const stack = [...Array.from(xmlDocument.childNodes)];

    while (stack.length > 0) {
      const node = stack.pop();

      if (!node) {
        console.log("test")
        break;
      }

      if (node.hasChildNodes()) {
        stack.unshift(...Array.from(node.childNodes).reverse());
      } else {
        const nodeText = node.textContent;

        if (nodeText && nodeText.trim().length > 0) {

          const fullMatchRegex = /{([a-zA-Z0-9_]*?)}/g;
          if (nodeText.match(fullMatchRegex)) {
            const matchs = nodeText.matchAll(fullMatchRegex);

            for (const match of matchs) {
              const placeholder = new PPTXPlaceholder({
                key: match[0],
                nodes: [node],
              })
              placeholders.push(placeholder);
            }
          }

          const openingMatchRegex = /({[a-zA-Z0-9_]*?)$/g;
          const openingMatch = nodeText.match(openingMatchRegex);
          if (openingMatch) {
            openedPlaceholder.key += openingMatch[0];
            openedPlaceholder.nodes.push(node);
          } else if (openedPlaceholder.key != "") {
            const closeningMatchRegex = /^([a-zA-Z0-9_]*?})/g;
            const closeingMatch = nodeText.match(closeningMatchRegex);
            if (closeingMatch) {
              openedPlaceholder.key += closeingMatch[0];
              openedPlaceholder.nodes.push(node);

              const placeholder = new PPTXPlaceholder(openedPlaceholder);
              placeholders.push(placeholder);

              openedPlaceholder.key = "";
              openedPlaceholder.nodes = [];
            } else {
              openedPlaceholder.key += nodeText;
              openedPlaceholder.nodes.push(node);
            }
          }
        }
      }
    }

    this.placeholders = placeholders;

    return [this.placeholders, null];
  }

  public async populate(data: TPopulateData) {
    const [placeholders, error] = await this.loadPlaceholders();

    if (error) {
      return [null, error];
    }

    if (!placeholders) {
      return [null, new ErrorPlaceholderNotLoadded()];
    }

    for (const key of Object.keys(data)) {
      const placeholderKeyRegex = new RegExp(`{${key}}`);
      const placeholder = placeholders
        .find((placeholder) => placeholder.getKey().match(placeholderKeyRegex));

      if (!placeholder) {
        continue;
      }

      placeholder.populate(data[key]);
    }

    return [true, null];
  }
}
