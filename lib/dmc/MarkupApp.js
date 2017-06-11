/**
 * Created by nathandunn on 6/10/17.
 */
import {AnnotationCommand, SelectionState} from "substance";

class MarkupApp {

    constructor() {

    }

    test() {
        let documentSession = window.app.state.documentSession;
        let selectionState = documentSession.getSelectionState();

        let sel = documentSession.setSelection({
            type: 'property',
            path: ['paragraph-1', 'content'],
            startOffset: 1,
            endOffset:6
        });
        sel = documentSession.getSelection();
        // if(true) return;
        // alert(sel);
        selectionState.setSelection(sel)
        // selectionState.setSelection(sel)
        let cmd = new ToggleStrongCommand()
        // let cmd = new BoldCommand()
        let cmdState = cmd.getCommandState({
            selectionState: selectionState
        })
        alert('turn on break: ' + cmdState.mode)
        // t.equal(cmdState.mode, 'create', "Mode should be correct.")
        // t.end()

        let res = cmd.execute({
            commandState: {
                mode: 'create'
            },
            documentSession: documentSession,
            selectionState: documentSession.getSelectionState()
        });
        let newAnno = res.anno;
        alert(newAnno)

        alert('marked it');
    }

}

class ToggleStrongCommand extends AnnotationCommand {

    // type = 'bold';
    // tagName = 'bold';


    constructor() {
        super({ name: 'bold', nodeType: 'bold' })
    }
}

// ToggleStrongCommand.define({
//     attributes: { type: 'object', default: {} }
// });

// export default ToggleStrongCommand

export default MarkupApp
