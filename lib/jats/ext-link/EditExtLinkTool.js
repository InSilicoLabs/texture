import { EditLinkTool } from 'substance'

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

	    el.append(
			$$('select').append(
				$$('option').append('wormbase'), $$('option').append('flybase')),
//					{value: 'lex-1', label: 'wormbase'},
//					{value: 'lex-2', label: 'flybase'},
//					{value: 'lex-3', label: 'sgdbase'},
//					{value: 'lex-4', label: 'rdg'},
//					{value: 'lex-5', label: 'mgi'},
//					{value: 'lex-6', label: 'zfin'},
//					{value: 'lex-7', label: 'pombase'}
//				]),
		
		    $$(Button, {
        		icon: 'delete',
		        theme: 'dark',
      		}).attr('title', this.getLabel('delete-link'))
		        .on('click', this.onDelete)
    	)
	    return el
  	}

}

EditExtLinkTool.urlPropertyPath = ['attributes', 'xlink:href']

export default EditExtLinkTool
