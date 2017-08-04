import { EditLinkTool, request } from 'substance'

class EditExtLinkTool extends EditLinkTool {

	constructor(parent, props = {}, options = {}) {
		super(parent, props, options)
		this.lexica = []
		this.getSources()	
	}
		
	render($$) {
    	let Input = this.getComponent('input')
	    let Button = this.getComponent('button')
//		let Select = this.getComponent('multi-select')
    	let commandState = this.props.commandState
	    let el = $$('div').addClass('sc-edit-link-tool')

    	// GUARD: Return if tool is disabled
	    //if (commandState.disabled) {
    	//  console.warn('Tried to render EditLinkTool while disabled.')
	    //  return el
	    //}

    	let urlPath = this.getUrlPath()
		
		this.select = $$('select').append($$('option')).on('change', this.onSelect).addClass('ext-link-select')
	   	for (let lex in this.lexica) {
			this.select.append($$('option').append(this.lexica[lex]))
		}
		el.append(
		    $$(Button, {
        		icon: 'delete',
		        theme: 'dark',
      		}).attr('title', this.getLabel('delete-link'))
		        .on('click', this.onDelete)
    	)
		
//		for(let lex in this.lexica) {
//			this.select.append($$('option').append(this.lexica[lex].lexiconSource.source))
//		}

	
		el.append(this.select)
	    return el
  	}

	getSources() {
		let serverURL = window.location.protocol + '//' + window.location.hostname + ':8080/markup/getByExtLinkId?extlinkid=' + this.props.node.id;
	    request('GET', serverURL, null, function (err, data) {
	         if (err) {
                console.error(err);
                this.setState({
                    error: new Error('Loading failed')
                });
                return
            }
            if (data) {
				for (let lex in data.keyWord.lexica) {
			//		this.select.append($$('option').append(data.keyWord.lexica[lex].lexiconSource.source))
					this.lexica.push(data.keyWord.lexica[lex].lexiconSource.source)
				}			
				this.rerender()
            
			}
        }.bind(this));
				
	}

	onSelect(e) {
		console.log(this.props.node.id + " selected: " + e.target.options[e.target.selectedIndex].value)
        window.parent.postMessage({
	        action: 'setSource',
			extLinkId: this.props.node.id,
			source: e.target.options[e.target.selectedIndex].value
        }, "*");

	}

}

EditExtLinkTool.urlPropertyPath = ['attributes', 'xlink:href']

export default EditExtLinkTool
