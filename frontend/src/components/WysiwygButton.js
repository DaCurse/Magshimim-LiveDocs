import React from 'react';

export function WysiwygButton(props) {
	const { command, children, prompt } = props;

	function handleClick() {
		if (prompt) {
			const value = window.prompt(prompt);
			document.execCommand(command, false, value);
		} else {
			document.execCommand(command);
		}
	}

	return (
		<button className="wysiwyg-button" onClick={handleClick}>
			{children}
		</button>
	);
}
