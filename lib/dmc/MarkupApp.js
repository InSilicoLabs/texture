/**
 * Created by nathandunn on 6/10/17.
 */
import {AnnotationCommand, request, SelectionState} from "substance";

class MarkupApp {


    constructor(xmlId) {
        this.words = [];
        this.xmlId = xmlId;

        // window.addEventListener("message", receiveMessage, false);
        //
        // function receiveMessage(event)
        // {
        //     if (event.origin !== "http://example.org:8080")
        //         return;
        //
        //     // ...
        // }
        // function receiveMessage(event)
        // {
        //     // alert(event);
        //     // Do we trust the sender of this message?  (might be
        //     // different from what we originally opened, for example).
        //     // if (event.origin !== "http://example.com")
        //     //     return;
        //
        //     // event.source is popup
        //     // event.data is "hi there yourself!  the secret response is: rheeeeet!"
        // }
        // window.addEventListener("message", receiveMessage, false);
    }


    render(data, callback) {

        // let words = ['organism','unc-5','elegans','epidermal'];
        // alert('rendering with dat: ' + JSON.stringify(data));
        // alert('rendering with words: ' + data.length);

        let cmd = new ToggleStrongCommand();
        let documentSession = window.app.state.documentSession;
        let selectionState = documentSession.getSelectionState();
        let nodes = window.doc.getNodes();


        document.getElementById('message').innerHTML = "Running markup...";
        // n.startsWith('article') // article junk
        // || n.startsWith('ext-link') // what we are tring to create
        // n.startsWith('body') // this is just the intro
        // || n.startsWith('heading') // this is the heading for each paragraph
        let numErrors = 0;
        let totalWordsFound = 0;
        let wordsFound = [];
        let totalWordHits = 0;

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
                    var reWord = word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                    var re = new RegExp("\\W" + reWord + "\\W", "g");
                    var hits;
                    while (hits = re.exec(p.content)) {

                        let sel = documentSession.createSelection({
                            type: 'property',
                            path: [p.id, 'content'],
                            startOffset: hits.index + 1,
                            endOffset: hits.index + 1 + word.length
                        });
                        selectionState.setSelection(sel);
                        let cmdState = cmd.getCommandState({
                            selectionState: selectionState,
                            documentSession: documentSession
                        });
                        if (cmdState.mode == "create") {
                            cmd.execute({
                                commandState: {
                                    mode: 'create'
                                },
                                documentSession: documentSession,
                                selectionState: documentSession.getSelectionState()
                            });
                            console.log('Found' + word);
                        } else {
                            console.log("Annotated words: " + p.content.substring(selectionState.getAnnotationsForType(cmd.getAnnotationType())[0].startOffset, selectionState.getAnnotationsForType(cmd.getAnnotationType())[0].endOffset));
                            if (cmdState.mode == "delete") {
                                console.log('Error trying to annotate: ' + word + ' because it is already linked.');
                            } else if (cmdState.mode == "expand") {
                                console.log('Error trying to annotate: ' + word + ' because part of the word is already linked.');
                            } else if (cmdState.mode == "truncate") {
                                console.log('Error trying to annotate: ' + word + ' because it is part of the linked word.');
                            }
                            ++numErrors;
                        }

                        //found = p.content.indexOf(word,found+1);
                        ++wordHits;
                    }
                    if (wordHits > 0) {
                        ++totalWordsFound;
                        totalWordHits += wordHits;
                        wordsFound[word] = wordHits;
                        document.getElementById('message').innerHTML = "Searching: found " + totalWordsFound + " words, hits: " + totalWordHits;
                    }
                }
            }
        }
        let finalMessage = "Total words " + totalWordsFound + " Total links: " + totalWordHits;
        let detailButton = "  &nbsp;&nbsp;<button style='display: inline;' type='button' onclick='var e = document.getElementById(\"hitDetails\"); e.style.display = (e.style.display == \"block\") ? \"none\" : \"block\";'>Toggle details</button>";
        // finalMessage += "<ul>";
        finalMessage += detailButton;
        finalMessage += "<hr/>";
        finalMessage += "<div id='hitDetails' style='display: block;'>";
        for (let word in wordsFound) {
            finalMessage += "<div style='font-size: smaller;display: inline;font-family: Courier;'>" + word;
            if (wordsFound[word] > 1) {
                finalMessage += " (" + wordsFound[word] + ")";
            }
            finalMessage += "; </div> ";
        }
        finalMessage += "</div>";


        // finalMessage += "</ul>";
        document.getElementById('message').innerHTML = finalMessage;
        console.log('total found: ' + totalWordsFound);
        console.log('total errors: ' + numErrors);

        if (callback) callback();
    }

    searchWords(termData, callback) {
        // alert('searching with hits: '+termData.length);
        console.log('searching with hits: ' + termData.length);
        console.log(termData);
        // for(t in terms){
        //     console.log(terms[t].value);
        // }
        // let words = ['organism','unc-5','elegans','epidermal'];
        // alert('rendering with dat: ' + JSON.stringify(data));
        // alert('rendering with words: ' + data.length);

        let cmd = new ToggleStrongCommand();
        let documentSession = window.app.state.documentSession;
        let selectionState = documentSession.getSelectionState();
        let nodes = window.doc.getNodes();

        document.getElementById('message').innerHTML = "Running markup...";
        // n.startsWith('article') // article junk
        // || n.startsWith('ext-link') // what we are tring to create
        // n.startsWith('body') // this is just the intro
        // || n.startsWith('heading') // this is the heading for each paragraph
        let numErrors = 0;
        let totalWordsFound = 0;
        let wordsFound = [];
        let totalWordHits = 0;

        window.parent.postMessage({
            action: 'clearWords',
            words: termData,
            xmlId: xmlId
        }, "*");

        for (let node in nodes) {
            // console.log(n);
            if (node.startsWith('paragraph') ) {
                let paragraphNode = window.doc.get(node);
                // just find the first one
                for (let w in termData) {
                    let wordHits = 0;
                    let term = termData[w];
                    let found = 0;
                    let reWord = term.value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                    let re = new RegExp("\\W" + reWord + "\\W", "g");
                    let hits;
                    while (hits = re.exec(paragraphNode.content)) {

                        let sel = documentSession.createSelection({
                            type: 'property',
                            path: [paragraphNode.id, 'content'],
                            startOffset: hits.index + 1,
                            endOffset: hits.index + 1 + term.value.length
                        });
                        selectionState.setSelection(sel);
                        let cmdState = cmd.getCommandState({
                            selectionState: selectionState,
                            documentSession: documentSession
                        });
                        if (cmdState.mode == "create") {
                            cmd.execute({
                                commandState: {
                                    mode: 'create'
                                },
                                documentSession: documentSession,
                                selectionState: documentSession.getSelectionState()
                            });
                            console.log('Found 1: ' + hits);
                            console.log('Found 2: ' + JSON.stringify(term));

                            window.parent.postMessage({
                                action: 'saveLink',
                                hit: hits,
                                term: term,
                                xmlId: xmlId
                            }, "*");
                            console.log('Posted for Found 2: '+xmlId)

                        } else {
                            console.log("Annotated words: " + paragraphNode.content.substring(selectionState.getAnnotationsForType(cmd.getAnnotationType())[0].startOffset, selectionState.getAnnotationsForType(cmd.getAnnotationType())[0].endOffset));
                            if (cmdState.mode == "delete") {
                                console.log('Error trying to annotate: ' + term.value + ' because it is already linked.');
                            } else if (cmdState.mode == "expand") {
                                console.log('Error trying to annotate: ' + term.value + ' because part of the word is already linked.');
                            } else if (cmdState.mode == "truncate") {
                                console.log('Error trying to annotate: ' + term.value + ' because it is part of the linked word.');
                            }
                            ++numErrors;
                        }

                        //found = p.content.indexOf(word,found+1);
                        ++wordHits;
                    }
                    if (wordHits > 0) {
                        ++totalWordsFound;
                        totalWordHits += wordHits;
                        wordsFound[term.value] = wordHits;
                        document.getElementById('message').innerHTML = "Searching: found " + totalWordsFound + " words, hits: " + totalWordHits;
                    }
                }
            }
        }
        let finalMessage = "Total words " + totalWordsFound + " Total links: " + totalWordHits;
        let detailButton = "  &nbsp;&nbsp;<button style='display: inline;' type='button' onclick='var e = document.getElementById(\"hitDetails\"); e.style.display = (e.style.display == \"block\") ? \"none\" : \"block\";'>Toggle details</button>";
        // finalMessage += "<ul>";
        finalMessage += detailButton;
        finalMessage += "<hr/>";
        finalMessage += "<div id='hitDetails' style='display: block;'>";
        for (let word in wordsFound) {
            finalMessage += "<div style='font-size: smaller;display: inline;font-family: Courier;'>" + word;
            if (wordsFound[word] > 1) {
                finalMessage += " (" + wordsFound[word] + ")";
            }
            finalMessage += "; </div> ";
        }
        finalMessage += "</div>";


        // finalMessage += "</ul>";
        document.getElementById('message').innerHTML = finalMessage;
        console.log('total found: ' + totalWordsFound);
        console.log('total errors: ' + numErrors);

        if (callback) callback();
    }

    getWords(callback) {
        let serverURL = window.location.protocol + '//' + window.location.hostname + ':8080/keyWordSet/sampleKeyWordSet';
        console.log('server URL: ' + serverURL);
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
