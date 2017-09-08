import { AnnotationTool } from 'substance'
import extend from 'lodash/extend'

class ExtLinkTool extends AnnotationTool {

	executeCommand(props) {
	    let info = this.context.commandManager.executeCommand(this.getCommandName(), extend({
	      mode: this.props.mode
	    }, props))
		let keyWord = {}
		keyWord.value = this.context.doc.get(info.anno.path[0]).content.substring(info.anno.startOffset, info.anno.endOffset)
		let link = {start: info.anno.startOffset, end: info.anno.endOffset, path: info.anno.path[0], extLinkId: info.anno.id, keyWord: keyWord}
		window.parent.postMessage({action: "createMarkup", term: link}, "*")

	}
}

export default ExtLinkTool
