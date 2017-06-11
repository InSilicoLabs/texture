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

        request('GET', 'http://localhost:8080/publication/findByFileName/'+documentId+'.xml', null, cb)
        // cb(null, this.data[documentId])
    }

    writeXML(documentId, xml, cb) {
        // localStorage.setItem(documentId, xml);

        let data = { content: xml };
        let url = 'http://localhost:8080/publication/storeByFileName/'+documentId+'.xml';
        
        request('PUT', url, data, cb)
    }
}

export default ServerXMLStore
