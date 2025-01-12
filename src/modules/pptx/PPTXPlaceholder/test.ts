import { PPTXPlaceholder } from ".";

describe("PPTXPlaceholder", () => {
  it("should getKey return key", () => {
    const key = "foo";
    const pptxPlaceholder = new PPTXPlaceholder({ key, "nodes": [] });

    expect(pptxPlaceholder.getKey()).toBe(key);
  });

  it("should populate replace placeholders when is in oly one node", () => {
    const value = "test";
    const key = "{fooo}";
    const nodes = [{ textContent: key }] as Node[];
    const pptxPlaceholder = new PPTXPlaceholder({ key, nodes });

    pptxPlaceholder.populate(value);
    expect(nodes[0].textContent).toBe(value);
  });

  it("should populate replace placeholders when is in two nodes", () => {
    const value = "test";
    const key = "{fooo}";
    const nodes = [
      { textContent: "{fo" },
      { textContent: "oo}" }
    ] as Node[];
    const pptxPlaceholder = new PPTXPlaceholder({ key, nodes });

    pptxPlaceholder.populate(value);
    expect(nodes[0].textContent).toBe(value);
    expect(nodes[1].textContent).toBe("");

  });

  it("should populate replace placeholders when is in trhee or more nodes", () => {
    const value = "test";
    const key = "{fooo}";
    const nodes = [
      { textContent: "{fo" },
      { textContent: "oo" },
      { textContent: "o}" }
    ] as Node[];
    const pptxPlaceholder = new PPTXPlaceholder({ key, nodes });

    pptxPlaceholder.populate(value);
    expect(nodes[0].textContent).toBe(value);
    expect(nodes[1].textContent).toBe("");
    expect(nodes[2].textContent).toBe("");
  });
});
