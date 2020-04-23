import React from 'react';
import '../css/wysiwyg.css';
import { WysiwygButton } from './WysiwygButton';

export function WysiwygMenu() {
	return (
		<div className="wysiwyg">
			<WysiwygButton command="bold">
				<strong>Bold</strong>
			</WysiwygButton>
			<WysiwygButton command="italic">
				<em>Italics</em>
			</WysiwygButton>
			<WysiwygButton command="underline">
				<u>Underline</u>
			</WysiwygButton>
			<WysiwygButton command="foreColor" prompt="Enter color hex code: ">
				<font color="red">Color</font>
			</WysiwygButton>
			<WysiwygButton command="createLink" prompt="Enter a URL: ">
				<a href="#">Link</a>
			</WysiwygButton>
			<WysiwygButton command="fontName" prompt="Enter a font name: ">
				<span style={{ fontFamily: 'Comic Sans MS' }}>Font</span>
			</WysiwygButton>
			<WysiwygButton command="removeFormat">Remove Style</WysiwygButton>
		</div>
	);
}
