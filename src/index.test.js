const { JSDOM } = require("jsdom");

const findStackingContexts = require("./");

describe("findStackingContexts", () => {
  // Test cases taken from MDN
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context#The_stacking_context
  it("returns the html node last", () => {
    const dom = new JSDOM('<html><body><div id="test-el"></div></body></html>');
    const testEl = dom.window.document.getElementById("test-el");

    const contexts = findStackingContexts(testEl);

    expect(contexts).toBeInstanceOf(Array);
    expect(contexts).toHaveLength(1);
    expect(contexts[0].nodeName).toBe("HTML");
  });
});
