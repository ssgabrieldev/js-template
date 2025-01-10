import JSZip from "jszip";
import { DOMParser } from "xmldom";

import { readFileSync } from "fs";

import { APPLICATION_XML } from "../../../consts";
import IPromiseRes from "../../../contracts/IPromiseRes";

type TPFilePath = {
  filePath: string
}

export default class PPTXTemplateFile {
  private filePath: string;

  private jsZip = new JSZip();
  private domParser = new DOMParser();

  constructor({ filePath }: TPFilePath) {
    this.filePath = filePath;
  }

  private async loadFile(): IPromiseRes<boolean> {
    try {
      if (Object.keys(this.jsZip.files).length == 0) {
        const fileData = readFileSync(this.filePath);

        await this.jsZip.loadAsync(fileData);
      }

      return [true, null];
    } catch (error) {
      return [null, error];
    }
  }

  public async getFileXML({ filePath }: TPFilePath): IPromiseRes<Node> {
    try {
      const [_, error] = await this.loadFile();

      if (error) {
        return [null, error];
      }

      const xmlString = await this.jsZip.file(filePath)?.async("string");

      if (xmlString) {
        const xmlDoc = this.domParser.parseFromString(
          xmlString,
          APPLICATION_XML
        );

        return [xmlDoc, null];
      } else {
        throw new Error(`JSZip ERROR: File ${filePath} not loaded`);
      }
    } catch (error) {
      return [null, error];
    }
  }

  public async getFiles(): IPromiseRes<typeof this.jsZip.files> {
    try {
      const [_, error] = await this.loadFile();

      if (error) {
        return [null, error as Error];
      }

      return [this.jsZip.files, null];
    } catch (error) {
      return [null, error as Error];
    }
  }
}
