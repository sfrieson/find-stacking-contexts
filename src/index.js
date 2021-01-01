function createsStackingContext(el) {
  if (el.nodeName === "HTML") return true;
}
function findStackingContexts(targetEl) {
  const contexts = [];

  let currentElement = targetEl.parentElement;

  while (currentElement) {
    if (createsStackingContext(currentElement)) {
      contexts.push(currentElement);
    }
    currentElement = currentElement.parentElement;
  }
  return contexts;
}

module.exports = findStackingContexts;
