import { AnnotationComponent } from 'substance'

class ExtLinkComponent extends AnnotationComponent {

/*	constructor(parent, props = {}, options = {}) {
		super(parent, props, options)

		let comp = this
		let hl = {}
		hl['paragraphs'] = []
		console.log(comp)
		while(comp) {
			if(comp.contentHighlights) {
					
				hl['paragraphs'].push(this.props.node.path[0])
				console.log("set hilite for " + this.props.node.path[0])
				comp.contentHighlights.set(hl)
				comp = null
			} else {
				comp = comp.getParent()
			}
		}
		
	
	}*/

  didMount() {
    super.didMount.apply(this, arguments)

    let node = this.props.node
    node.on('properties:changed', this.rerender, this)
  }

  dispose() {
    super.dispose.apply(this, arguments)

    let node = this.props.node
    node.off(this)
  }

  render($$) { // eslint-disable-line
    let node = this.props.node;
    let el = super.render.apply(this, arguments)
	if (node.id.length > 20) {
		el.addClass("ext-link-background")
	}
    el.tagName = 'a'
    //el.attr('href', node.attributes['xlink:href'])
	el.attr('href', '#')
	el.attr('onclick', 'window.parent.postMessage({action: "editMarkup", term: "' + this.props.node.id + '"}, "*")')
 

    return el
  }

	onHighlightedChanged() {
		this.el.removeClass('sm-highlighted')	
	}
}

export default ExtLinkComponent
