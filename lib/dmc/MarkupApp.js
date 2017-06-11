/**
 * Created by nathandunn on 6/10/17.
 */
import {AnnotationCommand, SelectionState, request} from "substance";

class MarkupApp {


    getWords(cb){
        request('GET', 'http://localhost:8080/keyWordSet/sampleKeyWordSet', null,  function(err,data){
            if (err) {
                console.error(err);
                this.setState({
                    error: new Error('Loading failed')
                });
                return
            }
            if(data){
                let words = [];
                for(let d in data){
                    words.push(data[d].value);
                }
                alert('finished processing with words: '+words.length)
                this.render(words,cb);
            }
        });
    }

    render(words,cb) {

        // let words = ['organism','unc-5','elegans','epidermal'];
        alert('rendering with words: '+words.length);

        let cmd = new ToggleStrongCommand();
        let documentSession = window.app.state.documentSession;
        let selectionState = documentSession.getSelectionState();
        let nodes = window.doc.getNodes();

        // n.startsWith('article') // article junk
        // || n.startsWith('ext-link') // what we are tring to create
        // n.startsWith('body') // this is just the intro
    // || n.startsWith('heading') // this is the heading for each paragraph
        for(let n in nodes){
            // console.log(n);
            if( n.startsWith('paragraph')
            ){
                let p = window.doc.get(n);
                // just find the first one
                for(let w in words){
                    let word = words[w]

                    let found = p.content.indexOf(word);
                    if(found>=0){
                        documentSession.setSelection({
                            type: 'property',
                            path: [p.id, 'content'],
                            startOffset: found,
                            endOffset: found + word.length
                        });
                        let sel = documentSession.getSelection();
                        selectionState.setSelection(sel);
                        let res = cmd.execute({
                            commandState: {
                                mode: 'create'
                            },
                            documentSession: documentSession,
                            selectionState: documentSession.getSelectionState()
                        });
                    }
                }
            }
        }
        cb;
    }

}

class ToggleStrongCommand extends AnnotationCommand {

    // type = 'bold';
    // tagName = 'bold';


    constructor() {
        // super({name: 'bold', nodeType: 'bold'})
        super({name: 'ext-link', nodeType: 'ext-link'})
    }
}

// ToggleStrongCommand.define({
//     attributes: { type: 'object', default: {} }
// });

// export default ToggleStrongCommand

export default MarkupApp
