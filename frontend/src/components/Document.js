import React, { useEffect, useState } from 'react';
import '../css/document.css';
import { DocumentEditor } from './DocumentEditor';
import { WysiwygMenu } from './WysiwygMenu';

export function Document(props) {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState('');
	const [title, setTitle] = useState('');

	function loadDocument(id) {
		fetch(`/api/document/${id}`)
			.then((res) => res.json())
			.then((json) => {
				const { success, document, error } = json;
				if (success) {
					setContent(document.content);
					setTitle(document.title);
				} else {
					throw new Error(error);
				}
			})
			.catch((error) => setError(error))
			.finally(() => setLoading(false));
	}

	useEffect(() => loadDocument(props.documentId), []);

	const toRender = loading ? (
		<div>Loading...</div>
	) : error ? (
		<div class="error">{error}</div>
	) : (
		<div>
			<h2>Editing: {title}</h2>
			<WysiwygMenu />
			<DocumentEditor content={content} setContent={setContent} />
		</div>
	);

	return <div className="document">{toRender}</div>;
}
