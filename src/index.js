function createsStackingContext(el, window) {
  const nodeName = el.nodeName;
  if (nodeName === "HTML") return true;
  const style = window.getComputedStyle(el);
  if (style.position === "absolute" || style.position === "relative") {
    if (style.zIndex && style.zIndex !== "auto") {
      return true;
    }
  }
  if (style.position === "fixed" || style.position === "sticky") {
    return true;
  }

  if (style.zIndex && style.zIndex !== "auto" && el.parentElement) {
    const parent = el.parentElement;
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.display !== "flex" && parentStyle.display !== "grid") {
      return false;
    }

    return true;
  }

  if (style.opacity !== "1" && style.opacity !== "") {
    return true;
  }

  if (style.mixBlendMode && style.mixBlendMode !== "normal") {
    return true;
  }

  const noneOrValueProperties = [
    "transform",
    "filter",
    "perspective",
    "clip-path",
    "mask",
    "mask-image",
    "mask-border",
  ];
  for (let i = 0; i < noneOrValueProperties.length; i++) {
    const property = noneOrValueProperties[i];
    if (style[property] && style[property] !== "none") {
      return true;
    }
  }

  if (style.isolation && style.isolation === "isolate") {
    return true;
  }

  // Cannot currently test the vendor prefixed values
  /* istanbul ignore next */
  if (
    style["-webkit-overflow-scrolling"] &&
    style["-webkit-overflow-scrolling"] === "touch"
  ) {
    return true;
  }

  return false;
}
function findStackingContexts(targetEl, inputWindow) {
  const windowObject = inputWindow || window;
  const contexts = [];

  let currentElement = targetEl.parentElement;

  while (currentElement) {
    if (createsStackingContext(currentElement, windowObject)) {
      contexts.push(currentElement);
    }
    currentElement = currentElement.parentElement;
  }
  return contexts;
}

module.exports = findStackingContexts;
