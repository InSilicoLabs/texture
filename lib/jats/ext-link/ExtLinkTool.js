import { AnnotationTool } from 'substance'
import extend from 'lodash/extend'

class ExtLinkTool extends AnnotationTool {

	executeCommand(props) {
	    let info = this.context.commandManager.executeCommand(this.getCommandName(), extend({
	      mode: this.props.mode
	    }, props))
		window.parent.postMessage({action: "editMarkup", term: info.anno.id}, "*")

	}
}

export default ExtLinkTool
