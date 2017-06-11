/**
 * Created by nathandunn on 6/10/17.
 */
import {AnnotationCommand, SelectionState} from "substance";

class MarkupApp {

    constructor() {

    }

    test() {
        alert('marking it up dog');
        let editorSession = window.app.state.documentSession;
        alert('has session: '+editorSession)
        let selectionState = editorSession.getSelectionState()

        let sel = editorSession.setSelection({
            type: 'property',
            path: ['p1', 'content'],
            startOffset: 5,
            endOffset:10
        });
        selectionState.setSelection(sel)

        let cmd = new ToggleStrongCommand()
        // let cmdState = cmd.getCommandState({
        //     selectionState: selectionState
        // })
        let res = cmd.execute({
            commandState: {
                mode: 'create'
            },
            editorSession: editorSession,
            selectionState: editorSession.getSelectionState()
        })


        alert('marked it');
    }

}

class ToggleStrongCommand extends AnnotationCommand {
    constructor() {
        super({ name: 'strong', nodeType: 'strong' })
    }
}

export default MarkupApp
