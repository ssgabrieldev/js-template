import { Placeholder } from "../../../contracts/Placeholder";

type TContructor = {
  key: string;
  nodes: Node[];
}

export default class PPTXPlaceholder extends Placeholder {
  protected key;
  private nodes;

  constructor({ key, nodes }: TContructor) {
    super();

    this.key = key;
    this.nodes = nodes.map((node, index) => {
      const nodeText = node.textContent;

      if (!nodeText || nodes.length == 1) {
        return node;
      }

      if (index == 0 && nodes.length > 1) {
        node.textContent = nodeText.replace(/{([A-z0-9_]*?)$/g, this.key);
      }

      if (index != 0) {
        const closingTagRegex = /^([A-z0-9_]*?})/;
        const matchClosingTag = nodeText.match(closingTagRegex);

        if (matchClosingTag) {
          node.textContent = nodeText.replace(closingTagRegex, "");
        } else {
          node.textContent = "";
        }
      }

      return node;
    });
  }

  public populate(data: string): void {
    if (this.nodes.length > 0) {
      this.nodes.forEach((node) => {
        if (node.textContent) {
          node.textContent = node.textContent.replaceAll(this.key, data);
        }
      });
    }
  }

  public getKey() {
    return this.key;
  }
}
