import {request} from "substance";

class ServerXMLStore {

    constructor(data) {
        this.data = data
    }

    readXML(documentId, cb) {
        // let cached = localStorage.getItem(documentId)
        // if (cached) {
        //     return cb(null, cached)
        // }

        let serverURL = window.location.protocol + '//' + window.location.hostname + ':8080/publication/findByFileName/'+documentId+'.xml';

        console.log('read server URL: '+serverURL);
        // request('GET', 'http://localhost:8080/publication/findByFileName/'+documentId+'.xml', null, cb)
        request('GET', serverURL, null, cb)
        // cb(null, this.data[documentId])
    }

    writeXML(documentId, xml, cb) {
        // localStorage.setItem(documentId, xml);
        console.log('write server URL: '+serverURL);

        let serverURL = window.location.protocol + '//' + window.location.hostname + ':8080/publication/storeByFileName/'+documentId+'.xml';
        let data = { content: xml };

        request('PUT', serverURL, data, cb)
    }
}

export default ServerXMLStore
