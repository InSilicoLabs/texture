import { EditLinkTool, request } from 'substance'

class EditExtLinkTool extends EditLinkTool {
	
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
		this.lexica = []
		this.getSources()
		console.log(this.lexica)
		let select = $$('select')
		for (let lex in this.lexica) {
			console.log(lex.lexiconSource.source)
			select.append($$('option').append(lex.lexiconSource.source))
		}
	    el.append(
			select,	
		    $$(Button, {
        		icon: 'delete',
		        theme: 'dark',
      		}).attr('title', this.getLabel('delete-link'))
		        .on('click', this.onDelete)
    	)
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
            	for (let l in data.keyWord.lexica) {
            		this.lexica.push(data[l].value)
				}
				return this.lexica
            }
        });

				
	}

}

EditExtLinkTool.urlPropertyPath = ['attributes', 'xlink:href']

export default EditExtLinkTool
