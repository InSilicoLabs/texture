import { Annotation, Fragmenter } from 'substance'

class ExtLink extends Annotation {}

ExtLink.type = 'ext-link'

ExtLink.define({
  attributes: {
    type: 'object', default: {'xlink:href': '', 'ext-link-type': 'uri', 'id': '', 'xmlns:xlink': 'http://www.w3.org/1999/xlink'}
  }
})

// in presence of overlapping annotations will try to render this as one element
ExtLink.fragmentation = Fragmenter.SHOULD_NOT_SPLIT

export default ExtLink
