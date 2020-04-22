import React from 'react';
import { RichDocument } from './components/RichDocument';
import './css/app.css';

export function App() {
	return (
		<div className="App">
			<RichDocument documentId={1}></RichDocument>
		</div>
	);
}
