import React from 'react';
import io from 'socket.io-client';
import '../css/richdocument.css';

class RichDocument extends React.Component {

    constructor(props) {
        super(props);

        this.document = React.createRef();

        this.onBlur = this.onBlur.bind(this);
        this.onInput = this.onInput.bind(this);
        this.getDocument = this.getDocument.bind(this);

        this.state = {
            error: null,
            isLoaded: false,
            document: null,
        };
    }

    // Fetch document if component renders
    componentDidMount() {
        // Socket.io setup
        this.socket = io('localhost:8080', {
            path: '/live'
        });
        this.socket.on('document-updated', this.liveUpdate.bind(this));

        this.getDocument();
    }

    onBlur() {
        let doc = this.document.current;
        // Show placeholder
        if (doc.innerText.trim().length === 0) {
            doc.innerText = "";
        }
    }

    // Send content changes to WebSocket server
    onInput(event) {
        event = event.nativeEvent;
        let change = event.data;
        let type = event.inputType;
        let position = this.getCaretOffset(event.target);
        let document = {
            content: event.target.innerHTML,
            id: this.state.document.id
        }

        this.socket.emit('update-document', {
            change,
            type,
            position,
            document
        });
    }

    // WebSocket update handler
    liveUpdate(data) {
        let document = this.document.current;
        let content = document.innerHTML;
        let newContent;

        switch (data.type) {
            case 'insertText':
                newContent = content.slice(0, data.position - 1) + data.change + content.slice(data.position - 1);
                break;
            case 'deleteContentBackward':
                newContent = content.slice(0, data.position) + content.slice(data.position + 1);
                break;
            default:
                newContent = content;
        }

        document.innerHTML = newContent;
    }

    // Fetch document
    getDocument() {
        fetch('/api/document/get/1')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    isLoaded: true,
                    document: res.document,
                    error: res.error
                });
            });
    }

    // Get cursor position in an input
    getCaretOffset(element) {
        let caretOffset = 0;
        let doc = element.ownerDocument || element.document;
        let win = doc.defaultView || doc.parentWindow;
        let sel;
        if (typeof win.getSelection !== undefined) {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                let range = win.getSelection().getRangeAt(0);
                let preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type !== "Control") {
            let textRange = sel.createRange();
            let preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }

    render() {
        const { error, isLoaded, document } = this.state;
        return (
        <div className="RichDocument">
            {(!isLoaded) ? (
            <div>Loading document...</div> 
            ) : (error) ? (
                <div class="error">{error ? `Error: ${error}` : ''}</div>
            ) : (
            <div className="document" contentEditable="true" placeholder="Write something...." ref={this.document}  
                onBlur={this.onBlur}
                onInput={this.onInput}
                dangerouslySetInnerHTML={{__html: document.content}}></div>
            )}
        </div>
        );
    }
}

export default RichDocument;
