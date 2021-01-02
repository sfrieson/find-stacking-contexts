const { JSDOM } = require("jsdom");

const findStackingContexts = require("./");

describe("findStackingContexts", () => {
  it("returns the html node last", () => {
    const dom = new JSDOM('<html><body><div id="test-el"></div></body></html>');
    const testEl = dom.window.document.getElementById("test-el");

    const contexts = findStackingContexts(testEl, dom.window);

    expect(contexts).toBeInstanceOf(Array);
    expect(contexts).toHaveLength(1);
    expect(contexts[0].nodeName).toBe("HTML");
  });

  describe("developer experience", () => {
    afterEach(() => {
      delete global.window;
    });
    it("uses the global window object if one is not supplied", () => {
      const dom = new JSDOM(
        '<html><body><div id="test-el"></div></body></html>'
      );
      const testEl = dom.window.document.getElementById("test-el");

      global.window = dom.window;
      const contexts = findStackingContexts(testEl);

      // It returned successfully.
      expect(contexts).toHaveLength(1);
    });
  });

  describe("matching elements", () => {
    // Test cases taken from MDN
    // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context#The_stacking_context
    it("Root element of the document (<html>)", () => {
      const dom = new JSDOM(
        '<html><body><div id="test-el"></div></body></html>'
      );
      const testEl = dom.window.document.getElementById("test-el");

      const contexts = findStackingContexts(testEl, dom.window);

      expect(contexts).toBeInstanceOf(Array);
      expect(contexts).toHaveLength(1);
      expect(contexts[0].nodeName).toBe("HTML");
    });
    it("Element with a position value absolute or relative and z-index value other than auto.", () => {
      const absoluteWithNoZIndex = new JSDOM(
        `<div style="position: absolute;">
          <div id="test-el"></div>
        </div>`
      );
      const absoluteWithAutoZIndex = new JSDOM(
        `<div style="position: absolute; z-index: auto;">
          <div id="test-el"></div>
        </div>`
      );
      const absoluteWithZIndex = new JSDOM(
        `<div id="target" style="position: absolute; z-index: 1;">
          <div id="test-el"></div>
        </div>`
      );
      const relativeWithNoZIndex = new JSDOM(
        `<div style="position: relative;">
          <div id="test-el"></div>
        </div>`
      );
      const relativeWithAutoZIndex = new JSDOM(
        `<div style="position: relative; z-index: auto;">
          <div id="test-el"></div>
        </div>`
      );
      const relativeWithZIndex = new JSDOM(
        `<div id="target" style="position: relative; z-index: 1;">
          <div id="test-el"></div>
        </div>`
      );

      const expectNoContext = [
        absoluteWithNoZIndex,
        absoluteWithAutoZIndex,
        relativeWithNoZIndex,
        relativeWithAutoZIndex,
      ];

      const expectContext = [absoluteWithZIndex, relativeWithZIndex];

      expectNoContext.forEach((dom) => {
        const testEl = dom.window.document.getElementById("test-el");
        const contexts = findStackingContexts(testEl, dom.window);

        expect(contexts).toHaveLength(1);
      });

      expectContext.forEach((dom) => {
        const testEl = dom.window.document.getElementById("test-el");
        const contexts = findStackingContexts(testEl, dom.window);

        expect(contexts).toHaveLength(2);
        expect(contexts[0]).toHaveProperty("id", "target");
      });
    });
  });

  it("Element with a position value fixed or sticky (sticky for all mobile browsers, but not older desktop).", () => {
    const fixed = new JSDOM(
      `<div id="target" style="position: fixed;">
        <div id="test-el"></div>
      </div>`
    );
    const sticky = new JSDOM(
      `<div id="target" style="position: sticky;">
        <div id="test-el"></div>
      </div>`
    );

    const expectContext = [fixed, sticky];

    expectContext.forEach((dom) => {
      const testEl = dom.window.document.getElementById("test-el");
      const contexts = findStackingContexts(testEl, dom.window);

      expect(contexts).toHaveLength(2);
      expect(contexts[0]).toHaveProperty("id", "target");
    });
  });

  it("Element that is a child of a flex (flexbox) container, with z-index value other than auto.", () => {
    const childOfFlexWithNoZIndex = new JSDOM(`
      <div style="display: flex;">
        <div>
          <div id="test-el"></div>
        </div>
      </div>
    `);
    const childOfFlexWithAutoZIndex = new JSDOM(`
      <div style="display: flex;">
        <div style="z-index: auto;">
          <div id="test-el"></div>
        </div>
      </div>
    `);
    const childOfFlexWithZIndex = new JSDOM(`
      <div style="display: flex;">
        <div id="target" style="z-index: 1;">
          <div id="test-el"></div>
        </div>
      </div>
    `);

    const expectNoContexts = [
      childOfFlexWithNoZIndex,
      childOfFlexWithAutoZIndex,
    ];

    const expectContexts = [childOfFlexWithZIndex];

    expectNoContexts.forEach((dom) => {
      const testEl = dom.window.document.getElementById("test-el");
      const contexts = findStackingContexts(testEl, dom.window);

      expect(contexts).toHaveLength(1);
    });

    expectContexts.forEach((dom) => {
      const testEl = dom.window.document.getElementById("test-el");
      const contexts = findStackingContexts(testEl, dom.window);

      expect(contexts).toHaveLength(2);
      expect(contexts[0]).toHaveProperty("id", "target");
    });
  });

  it("Element that is a child of a grid (grid) container, with z-index value other than auto.", () => {
    const childOfGridWithNoZIndex = new JSDOM(`
      <div style="display: grid;">
        <div>
          <div id="test-el"></div>
        </div>
      </div>
    `);
    const childOfGridWithAutoZIndex = new JSDOM(`
      <div style="display: grid;">
        <div style="z-index: auto;">
          <div id="test-el"></div>
        </div>
      </div>
    `);
    const childOfGridWithZIndex = new JSDOM(`
      <div style="display: grid;">
        <div id="target" style="z-index: 1;">
          <div id="test-el"></div>
        </div>
      </div>
    `);

    const expectNoContexts = [
      childOfGridWithNoZIndex,
      childOfGridWithAutoZIndex,
    ];

    const expectContexts = [childOfGridWithZIndex];

    expectNoContexts.forEach((dom) => {
      const testEl = dom.window.document.getElementById("test-el");
      const contexts = findStackingContexts(testEl, dom.window);

      expect(contexts).toHaveLength(1);
    });

    expectContexts.forEach((dom) => {
      const testEl = dom.window.document.getElementById("test-el");
      const contexts = findStackingContexts(testEl, dom.window);

      expect(contexts).toHaveLength(2);
      expect(contexts[0]).toHaveProperty("id", "target");
    });
  });

  it("properly skips over invalid contexts", () => {
    const noValidPosition = new JSDOM(`
      <div id="target" style="z-index: 1;">
        <div id="test-el"></div>
      </div>
    `);

    const expectNoContexts = [noValidPosition];

    expectNoContexts.forEach((dom) => {
      const testEl = dom.window.document.getElementById("test-el");
      const contexts = findStackingContexts(testEl, dom.window);

      expect(contexts).toHaveLength(1);
    });
  });
});
