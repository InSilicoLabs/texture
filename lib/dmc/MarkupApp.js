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

        let startRange = 10 + Math.random() * 20;
        let endRange = 100 - Math.random() * 20;

        let sel = documentSession.setSelection({
            type: 'property',
            path: ['paragraph-1', 'content'],
            startOffset: startRange,
            endOffset: endRange
        });
        // alert(startRange + ' ' + endRange);
        sel = documentSession.getSelection();
        selectionState.setSelection(sel);
        let cmd = new ToggleStrongCommand();
        let cmdState = cmd.getCommandState({
            selectionState: selectionState
        });
        // alert('turn on break: ' + cmdState.mode + ' for '+cmd);
        // t.equal(cmdState.mode, 'create', "Mode should be correct.")
        // t.end()

        let create = Math.random()>0.5;
        let res = cmd.execute({
            commandState: {
                // mode: create ? 'create' : 'delete'
                mode: 'create'
            },
            documentSession: documentSession,
            selectionState: documentSession.getSelectionState()
        });
        let newAnno = res.anno;
        // alert('marked it');
    }

}

class ToggleStrongCommand extends AnnotationCommand {

    // type = 'bold';
    // tagName = 'bold';


    constructor() {
        super({name: 'bold', nodeType: 'bold'})
    }
}

// ToggleStrongCommand.define({
//     attributes: { type: 'object', default: {} }
// });

// export default ToggleStrongCommand

export default MarkupApp
