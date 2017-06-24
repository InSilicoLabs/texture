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

		document.getElementById('message').innerHTML = "Running markup..."
        // n.startsWith('article') // article junk
        // || n.startsWith('ext-link') // what we are tring to create
        // n.startsWith('body') // this is just the intro
        // || n.startsWith('heading') // this is the heading for each paragraph
        let numErrors = 0 ;
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
                    //found = p.content.indexOf(word,found);
                    //if(found>0){
                    //    console.log("looking for: "+word + " found "+(found>0));
                    //}
                    //while (found >= 0) {
					//
					// Escape string for regular expression
					var reWord = word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
					var re = new RegExp("\\W" + reWord + "\\W", "g");
					var hits;
					while(hits = re.exec(p.content)) {

                        let sel = documentSession.createSelection({
                            type: 'property',
                            path: [p.id, 'content'],
                            startOffset: hits.index + 1,
                            endOffset: hits.index + 1 + word.length
                        });
                        //let sel = documentSession.getSelection();
                        selectionState.setSelection(sel);
						let cmdState = cmd.getCommandState({
    						selectionState: selectionState,
						    documentSession: documentSession
						});
                        //try {
						if(cmdState.mode == "create") {
                            cmd.execute({
                                commandState: {
                                    mode: 'create'
                                },
                                documentSession: documentSession,
                                selectionState: documentSession.getSelectionState()
                            });                        
							console.log('Found ' + word);

						
						} else {
								console.log("Annotated words: " + p.content.substring(selectionState.getAnnotationsForType(cmd.getAnnotationType())[0].startOffset, selectionState.getAnnotationsForType(cmd.getAnnotationType())[0].endOffset));
                       // } catch (e) {
							if(cmdState.mode == "delete") {
								console.log('Error trying to annotate: '+ word + ' because it is already linked.');
							} else if(cmdState.mode == "expand") {
								console.log('Error trying to annotate: '+ word + ' because part of the word is already linked.');
							} else if(cmdState.mode == "truncate") {
 								console.log('Error trying to annotate: '+ word + ' because it is part of the linked word.');
							}
                            ++numErrors;
                        }

						//found = p.content.indexOf(word,found+1);
                        ++wordHits ;
                    }
                    if(wordHits>0){

                        ++totalWordsFound ;
                    }
                }
            }
        }
		document.getElementById('message').innerHTML = "Found " + totalWordsFound + " words"
        console.log('total found: '+totalWordsFound);
        console.log('total errors: '+numErrors);

        if (callback) callback();
    }

    getWords(callback) {
        let serverURL = window.location.protocol + '//' + window.location.hostname + ':8080/keyWordSet/sampleKeyWordSet';
        console.log('server URL: '+serverURL);
        request('GET', serverURL, null, function (err, data) {
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
        super({name: 'markup', nodeType: 'ext-link'})
    }
}

// ToggleStrongCommand.define({
//     attributes: { type: 'object', default: {} }
// });

// export default ToggleStrongCommand

export default MarkupApp