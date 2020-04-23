import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import '../css/document.css';
import { DocumentEditor } from './DocumentEditor';
import { WysiwygMenu } from './WysiwygMenu';

const socket = io('192.168.14.56:8080', { path: '/live' });

export function Document(props) {
	const { jwt } = props;
	const [content, setContent] = useState('');
	const [title, setTitle] = useState('');
	const [id, setId] = useState(null);
	const idInput = useRef(null);
	const titleInput = useRef(null);

	function handleEditSubmit(e) {
		e.preventDefault();
		loadDocument(`/api/document/${parseInt(idInput.current.value)}`, {
			method: 'GET',
		});
	}

	function handleCreateSubmit(e) {
		e.preventDefault();
		const title = titleInput.current.value;
		loadDocument('/api/document', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title }),
		});
	}

	function loadDocument(path, options) {
		fetch(path, options)
			.then((res) => res.json())
			.then((json) => {
				const { success, document, error } = json;
				if (success) {
					setId(document.id);
					setContent(document.content);
					setTitle(document.title);
				} else {
					throw new Error(error);
				}
			})
			.catch((error) => alert(error));
	}

	// Join the document's room when you start editing
	useEffect(() => void socket.emit('join-document', { id, jwt }), [id]);

	return jwt ? (
		<div className="document">
			{id ? (
				<div>
					<h2>
						Editing: {title} (ID {id})
					</h2>
					<button onClick={() => setId(null)}>Stop Editing</button>
					<WysiwygMenu />
					<DocumentEditor
						stopEditing={() => setId(null)}
						content={content}
						setContent={setContent}
						jwt={jwt}
						socket={socket}
					/>
				</div>
			) : (
				<div>
					<form onSubmit={handleEditSubmit}>
						Edit Document:{' '}
						<input type="number" ref={idInput} placeholder="Enter id..." />
						<input type="submit" value="Edit" />
					</form>
					<form onSubmit={handleCreateSubmit}>
						Create Document:{' '}
						<input type="text" ref={titleInput} placeholder="Enter title..." />
						<input type="submit" value="Create" />
					</form>
				</div>
			)}
		</div>
	) : (
		<Redirect to="/" />
	);
}
