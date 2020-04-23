import DiffMatchPatch from 'diff-match-patch';
import React, { useEffect, useRef } from 'react';
import '../css/document-editor.css';
import {
	getCaretPosition,
	getCurrentLine,
	setCaretPosition,
} from '../util/editor';

export function DocumentEditor(props) {
	const { content, setContent, jwt, socket } = props;
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
			jwt,
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

	useEffect(() => {
		socket.on('apply-patch', handleLiveUpdate);
		socket.on('live-error', (data) => alert(data.msg));
	}, []);

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
