import DiffMatchPatch from 'diff-match-patch';
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import '../css/richdocument.css';
import {
	getCaretPosition,
	getCurrentLine,
	setCaretPosition,
} from '../util/contenteditable';

const socket = io('localhost:8080', { path: '/live' });

export function RichDocument(props) {
	const { documentId } = props;
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState('');
	const [title, setTitle] = useState('');
	const [editQueue, setEditQueue] = useState([]);
	const document = useRef(null);
	const dmp = new DiffMatchPatch();

	function handleBlur(e) {
		const elem = e.target;
		if (elem.innerText.trim().length === '') {
			elem.innerText = '';
		}
	}

	function handleInput(e) {
		const elem = document.current;
		socket.emit('make-patch', {
			patch: dmp.patch_make(content, elem.innerHTML),
		});
		const caretPosition = getCaretPosition(elem);
		setContent(elem.innerHTML);
		const line = getCurrentLine(elem);
		setTimeout(() => setCaretPosition(elem, line, caretPosition));
	}

	function handleLiveUpdate(data) {
		const patched = dmp.patch_apply(data.patch, document.current.innerHTML);
		setContent(patched[0]);
	}

	function loadDocument(id) {
		return fetch(`/api/document/${id}`)
			.then((res) => res.json())
			.then((json) => {
				if (json.success) {
					setContent(json.document.content);
					setTitle(json.document.title);
				} else {
					throw new Error(json.error);
				}
			})
			.catch((error) => setError(error))
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		loadDocument(documentId);
		socket.on('apply-patch', handleLiveUpdate);
	}, []);

	return (
		<div className="RichDocument">
			{loading ? (
				<div>Loading document...</div>
			) : error ? (
				<div class="error">{error.toString()}</div>
			) : (
				<div
					className="document"
					contentEditable="true"
					placeholder="Write something...."
					ref={document}
					onBlur={handleBlur}
					onInput={handleInput}
					dangerouslySetInnerHTML={{ __html: content || '<div><br/></div>' }}
				></div>
			)}
		</div>
	);
}
