import JSZip from "jszip";
import { DOMParser } from "xmldom";

import { readFileSync } from "fs";

import { APPLICATION_XML } from "../../../consts";

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

  public async loadFile() {
    try {
      const fileData = readFileSync(this.filePath);

      await this.jsZip.loadAsync(fileData);

      return [true, null];
    } catch (error) {
      return [null, error];
    }
  }

  public async getFileXML({ filePath }: TPFilePath): Promise<[Node | null, null | unknown]> {
    try {
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

  public getFiles() {
    return this.jsZip.files;
  }
}
