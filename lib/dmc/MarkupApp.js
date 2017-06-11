/**
 * Created by nathandunn on 6/10/17.
 */
import {AnnotationCommand, request, SelectionState} from "substance";

class MarkupApp {

    constructor() {
        this.words = [];
    }


    render(data, callback) {

        // let words = ['organism','unc-5','elegans','epidermal'];
        // alert('rendering with dat: ' + JSON.stringify(data));
        // alert('rendering with words: ' + data.length);

        let cmd = new ToggleStrongCommand();
        let documentSession = window.app.state.documentSession;
        let selectionState = documentSession.getSelectionState();
        let nodes = window.doc.getNodes();


        // n.startsWith('article') // article junk
        // || n.startsWith('ext-link') // what we are tring to create
        // n.startsWith('body') // this is just the intro
        // || n.startsWith('heading') // this is the heading for each paragraph
        let totalWordsFound = 0;
        for (let n in nodes) {
            // console.log(n);
            if (n.startsWith('paragraph')
            ) {
                let p = window.doc.get(n);
                // just find the first one
                for (let w in data) {
                    let wordHits = 0;
                    let word = data[w];
                    let found = 0;
                    found = p.content.indexOf(word,found);
                    if(found>0){
                        console.log("looking for: "+word + " found "+(found>0));
                    }
                    while (found >= 0) {
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
                        found = p.content.indexOf(word,found+1);
                        ++wordHits ;
                    }
                    if(wordHits>0){
                        console.log(word + ' found: '+wordHits);
                        ++totalWordsFound ;
                    }
                }
            }
        }

        console.log('total found: '+totalWordsFound);

        if (callback) callback();
    }

    getWords(callback) {
        request('GET', 'http://localhost:8080/keyWordSet/sampleKeyWordSet', null, function (err, data) {
            if (err) {
                console.error(err);
                this.setState({
                    error: new Error('Loading failed')
                });
                return
            }
            if (data) {
                this.words = [];
                for (let d in data) {
                    this.words.push(data[d].value);
                }
                console.log('finished processing with words: ' + this.words.length);
                // this.render(this.words, cb);
                if (callback) callback(this.words);

                return this.words;
            }
        });
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
