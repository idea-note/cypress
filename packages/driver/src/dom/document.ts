const $jquery = require('./jquery')

const docNode = window.Node.DOCUMENT_NODE

const isShadowRoot = (obj: HTMLElement | Document | ShadowRoot): obj is ShadowRoot => {
  return 'ShadowRoot' in window && obj instanceof (window as any).ShadowRoot
}

//TODO: make this not allow jquery
const isDocument = (obj: HTMLElement | Document): obj is Document => {
  try {
    if ($jquery.isJquery(obj)) {
      obj = obj[0]
    }

    return Boolean(obj && obj.nodeType === docNode)
  } catch (error) {
    return false
  }
}

// does this document have a currently active window (defaultView)
const hasActiveWindow = (doc) => {
  return !!doc.defaultView
}

const getDocumentFromElement = (el: HTMLElement): Document => {
  if (isDocument(el)) {
    return el
  }

  return el.ownerDocument!
}

const getDocumentOrShadowRootFromElement = (el: HTMLElement): Document | ShadowRoot => {
  if (isDocument(el)) {
    return el
  }

  if (isShadowRoot(el)) {
    return el
  }

  return (el.getRootNode() as ShadowRoot | null) || el.ownerDocument!
}

export {
  isDocument,

  hasActiveWindow,

  getDocumentFromElement,

  getDocumentOrShadowRootFromElement,
}
