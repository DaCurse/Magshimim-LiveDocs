import React from 'react';
import { Document } from './components/Document';
import './css/app.css';

export function App() {
	return (
		<div className="App">
			<Document documentId={1} />
		</div>
	);
}
