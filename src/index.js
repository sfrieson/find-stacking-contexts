function createsStackingContext(el, window) {
  const nodeName = el.nodeName;
  if (nodeName === "HTML") return true;
  const style = window.getComputedStyle(el);
  if (style.position === "absolute" || style.position === "relative") {
    if (!style.zIndex || style.zIndex === "auto") {
      return false;
    }
    return true;
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
