import React from 'react';
import '../css/document.css';
import { DocumentEditor } from './DocumentEditor';
import { Wysiwyg } from './Wysiwyg';

export function Document(props) {
	return (
		<div className="document">
			<Wysiwyg />
			<DocumentEditor documentId={props.documentId} />
		</div>
	);
}
