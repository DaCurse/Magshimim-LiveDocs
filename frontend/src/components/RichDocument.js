import React from 'react';
import '../css/richdocument.css';

class RichDocument extends React.Component {

    constructor(props) {
        super(props);

        this.document = React.createRef();

        this.onBlur = this.onBlur.bind(this);
        this.saveDocument = this.saveDocument.bind(this);

        this.state = {
            error: null,
            isLoaded: false,
            document: null,
            saveState: null,
            saveIntervalId: null
        };
    }

    // Fetch document if component renders
    componentDidMount() {
        fetch('/api/document/get/1')
        .then(res => res.json())
        .then(res => {
            this.setState({
                isLoaded: true,
                document: res.document,
                error: res.error
            });
        });

        // Save document every so often (30 seconds)
        this.setState({ 
            saveIntervalId: setInterval(this.saveDocument, 3e4)
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.saveIntervalId);
    }

    onBlur() {
        let doc = this.document.current;
        // Show placeholder
        if(doc.innerText.trim().length === 0) {
            doc.innerText = "";
        }

        // Update document on focus loss
        this.saveDocument(doc.innerHTML);
    }

    // Update document on server
    saveDocument(content) {
        fetch('/api/document/update/1', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content
            })
        })
        .then(res => res.json())
        .then(res => {
            if(!res.success) {
                this.setState({
                    error: 'Failed to save document'
                });
            }
        });
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
            <div className="document" contentEditable="true" placeholder="Write something...." ref={this.document}  onBlur={this.onBlur} 
                dangerouslySetInnerHTML={{__html: document.content}}></div>
            )}
        </div>
        );
    }
}

export default RichDocument;
