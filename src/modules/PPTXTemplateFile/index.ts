import JSZip from "jszip";
import { DOMParser } from "xmldom";

import { readFileSync } from "fs";

import { APPLICATION_XML } from "../../consts";

type TPFilePath = {
  filePath: string
}

export default class PPTXTemplateFile {
  private jsZip = new JSZip();
  private domParser = new DOMParser();

  public async loadFile({ filePath }: TPFilePath) {
    try {
      const fileData = readFileSync(filePath);

      await this.jsZip.loadAsync(fileData);

      return [true, null];
    } catch (error) {
      console.error(error);

      return [null, error];
    }
  }

  public async getFileXML({ filePath }: TPFilePath) {
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
      console.error(error);

      return [null, error];
    }
  }
}
