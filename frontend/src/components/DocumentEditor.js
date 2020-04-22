import DiffMatchPatch from 'diff-match-patch';
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import '../css/document-editor.css';
import {
	fixContent,
	getCaretPosition,
	getCurrentLine,
	setCaretPosition,
} from '../util/editor';

const socket = io('192.168.14.56:8080', { path: '/live' });

export function DocumentEditor(props) {
	const { documentId } = props;
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState('');
	const [title, setTitle] = useState('');
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
		const elem = document.current;

		let caretPosition, line;
		try {
			caretPosition = getCaretPosition(elem);
			line = getCurrentLine(elem);
		} catch (ignored) {}

		const patched = dmp.patch_apply(data.patch, elem.innerHTML);
		setContent(patched[0]);

		if (caretPosition != null) {
			setCaretPosition(elem, line, caretPosition);
		}
	}

	function loadDocument(id) {
		return fetch(`/api/document/${id}`)
			.then((res) => res.json())
			.then((json) => {
				const { success, document, error } = json;
				if (success) {
					setContent(fixContent(document.content));
					setTitle(document.title);
				} else {
					throw new Error(error);
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
		<div className="document-editor">
			{loading ? (
				<div>Loading document...</div>
			) : error ? (
				<div class="error">{error.toString()}</div>
			) : (
				<div
					className="editor"
					contentEditable="true"
					placeholder="Write something...."
					ref={document}
					onBlur={handleBlur}
					onInput={handleInput}
					dangerouslySetInnerHTML={{ __html: content }}
				></div>
			)}
		</div>
	);
}
