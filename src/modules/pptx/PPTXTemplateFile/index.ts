import JSZip from "jszip";
import { DOMParser } from "xmldom";
import { XMLSerializer } from "xmldom";


import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";

import { TemplateFile, TPSave } from "../../../contracts/TemplateFile";
import IPromiseRes from "../../../contracts/IPromiseRes";

import { ErrorCantGetFileXML } from "../../error/ErrorCantGetFileXML";

import { APPLICATION_XML } from "../../../consts";

type TPFilePath = {
  filePath: string
};

type TPWriteXML = {
  filePath: string,
  content: Node
};

export class PPTXTemplateFile implements TemplateFile {
  private filePath: string;

  private jsZip = new JSZip();
  private domParser = new DOMParser();
  private xmlSelializer = new XMLSerializer();

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
        return [null, new ErrorCantGetFileXML({ file: filePath })];
      }
    } catch (error) {
      return [null, error];
    }
  }

  public async getFiles(): IPromiseRes<typeof this.jsZip.files> {
    try {
      const [_, error] = await this.loadFile();

      if (error) {
        return [null, error];
      }

      return [this.jsZip.files, null];
    } catch (error) {
      return [null, error];
    }
  }

  public async writeXML({filePath, content}: TPWriteXML) {
    this.jsZip.file(filePath, this.xmlSelializer.serializeToString(content));
  }

  public async save({ filePath }: TPSave): IPromiseRes<boolean> {
    try {
      const [_result, error] = await this.loadFile();

      if (error) {
        return [null, error];
      }

      const dirPath = dirname(filePath);
      mkdirSync(dirPath, { recursive: true });

      const fileBuffer = await this.jsZip.generateAsync({ type: "nodebuffer" });
      writeFileSync(filePath, fileBuffer);

      return [true, null];
    } catch (error) {
      return [null, error];
    }
  }
}
