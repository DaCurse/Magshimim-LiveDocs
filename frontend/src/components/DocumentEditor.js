import DiffMatchPatch from 'diff-match-patch';
import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../css/document-editor.css';
import {
	getCaretPosition,
	getCurrentLine,
	setCaretPosition,
} from '../util/editor';

const socket = io('192.168.14.56:8080', { path: '/live' });

export function DocumentEditor(props) {
	const content = props.content;
	const setContent = props.setContent;
	const editor = useRef(null);
	const dmp = new DiffMatchPatch();

	function handleBlur(e) {
		const elem = e.target;
		if (elem.innerText.trim().length === '') {
			elem.innerText = '';
		}
	}

	function handleInput(e) {
		const elem = editor.current;

		socket.emit('make-patch', {
			patch: dmp.patch_make(content, elem.innerHTML),
		});

		const caretPosition = getCaretPosition(elem);
		setContent(elem.innerHTML);
		const line = getCurrentLine(elem);
		setTimeout(() => setCaretPosition(elem, line, caretPosition));
	}

	function handleLiveUpdate(data) {
		const elem = editor.current;

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

	useEffect(() => void socket.on('apply-patch', handleLiveUpdate), []);

	return (
		<div className="document-editor">
			<div
				className="editor"
				contentEditable="true"
				placeholder="Write something...."
				ref={editor}
				onBlur={handleBlur}
				onInput={handleInput}
				dangerouslySetInnerHTML={{ __html: content }}
			></div>
		</div>
	);
}
