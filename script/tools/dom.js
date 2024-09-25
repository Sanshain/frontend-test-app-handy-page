//@ts-check

/**
 * @param {Element} parent
 * @param {keyof HTMLElementTagNameMap} tagname
 * @param {Record<string, string | boolean>} attrs
 */
export function applyElement(parent, tagname, attrs) {
    const elem = parent.appendChild(document.createElement(tagname));
    Object.keys(attrs).forEach(key => {
        elem[key] = attrs[key];     // elem.setAttribute(key, attrs[key])
    })
    return elem
}