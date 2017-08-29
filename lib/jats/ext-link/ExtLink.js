import { Annotation, Fragmenter } from 'substance'

class ExtLink extends Annotation {}

ExtLink.type = 'ext-link'

ExtLink.define({
  attributes: {
    type: 'object', default: {'xlink:href': 'test', 'ext-link-type': 'uri', 'id': '', 'xmlns:xlink': 'http://www.w3.org/1999/xlink'}
  }
})

Object.defineProperties(ExtLink.prototype, {
  hrefLink: {
    get: function() {
      return this.attributes['xlink:href']
    },
    set: function(href) {
      this.attributes['xlink:href'] = href
    }
  }
})

// in presence of overlapping annotations will try to render this as one element
ExtLink.fragmentation = Fragmenter.SHOULD_NOT_SPLIT

export default ExtLink
