import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import '../css/richdocument.css';

export function RichDocument(props) {
	const { documentId } = props;
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [documentData, setDocumentData] = useState({});
	const [socket, setSocket] = useState(null);
	const document = useRef(null);

	function handleBlur(e) {
		const elem = e.target;
		if (elem.innerText.trim().length === '') {
			elem.innerText = '';
		}
	}

	function handleInput() {}

	function handleLiveUpdate(data) {}

	function getDocument() {
		return fetch(`/api/document/get/${documentId}`)
			.then((res) => res.json())
			.then((json) => {
				if (json.success) {
					setDocumentData(json.document);
				} else throw new Error(json.error);
			})
			.catch((error) => setError(error))
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		getDocument();
		setSocket(io('localhost:8080', { path: '/live' }));
		if (socket) {
			socket.on('document-updated', handleLiveUpdate);
		}
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
					dangerouslySetInnerHTML={{ __html: documentData.content }}
				></div>
			)}
		</div>
	);
}
