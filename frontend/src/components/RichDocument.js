import React from 'react';
import '../css/richdocument.css';

class RichDocument extends React.Component {

    constructor(props) {
        super(props);
        this.document = React.createRef();
        this.showPlaceholder = this.showPlaceholder.bind(this);
    }

    showPlaceholder() {
        let doc = this.document.current;
        if(doc.innerText.trim().length === 0) {
            doc.innerText = "";
        }
    }

    render() {
        return (
        <div className="RichDocument">
            <div className="document" contentEditable="true" placeholder="Write something...." ref={this.document}  onBlur={this.showPlaceholder}></div>
        </div>
        );
    }
}

export default RichDocument;
