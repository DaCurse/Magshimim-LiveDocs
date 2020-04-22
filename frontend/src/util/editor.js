export function getCaretPosition(elem) {
	var sel = document.getSelection();
	sel.modify('extend', 'backward', 'paragraphboundary');
	var pos = sel.toString().length;
	if (sel.anchorNode !== undefined) {
		sel.collapseToEnd();
	}

	return pos;
}

export function createRange(node, chars, range) {
	if (!range) {
		range = document.createRange();
		range.selectNode(node);
		range.setStart(node, 0);
	}

	if (chars === 0) {
		range.setEnd(node, chars);
	} else if (node && chars > 0) {
		if (node.nodeType === Node.TEXT_NODE) {
			if (node.textContent.length < chars) {
				chars -= node.textContent.length;
			} else {
				range.setEnd(node, chars);
				chars = 0;
			}
		} else {
			for (let lp = 0; lp < node.childNodes.length; lp++) {
				range = createRange(node.childNodes[lp], chars, range);

				if (chars === 0) {
					break;
				}
			}
		}
	}

	return range;
}

export function setCaretPosition(elem, line, pos) {
	if (pos >= 0) {
		const selection = window.getSelection();
		const range = createRange(elem.childNodes[line], pos);

		if (range) {
			range.collapse(false);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
}

export function getOffset(elem) {
	const rect = elem.getBoundingClientRect();
	return {
		top: rect.top + window.scrollY,
		left: rect.left + window.scrollX,
	};
}

export function getCurrentLine(elem) {
	const lineHeight = parseInt(getComputedStyle(elem).lineHeight);
	const elemOffset = getOffset(elem);
	const backup = window.getSelection();
	const sel = window.getSelection();
	sel.modify('extend', 'forward', 'character');

	const range = sel.getRangeAt(0);
	const rects = range.getClientRects();
	let top;

	if (rects[0]) {
		top = rects[0].top + document.body.scrollTop;
	} else if (rects[1]) {
		top = rects[1].top + document.body.scrollTop;
	} else {
		const tmpCaretFinder = document.createElement('canvas');
		tmpCaretFinder.id = 'temp-caret-finder';
		range.insertNode(tmpCaretFinder);
		top = getOffset(tmpCaretFinder).top;
	}

	backup.modify('move', 'backward', 'character');
	return Math.max(0, Math.floor((top - elemOffset.top) / lineHeight));
}

// Fix content to make sure each newline is wrapped by a div
export function fixContent(content) {
	const defaultContent = '<div><br/></div>';
	const dummy = document.createElement('div');
	dummy.innerHTML = content;
	if (dummy.innerText.trim().length === 0) {
		return defaultContent;
	} else if (dummy.childNodes[0] instanceof Text) {
		return `<div>${dummy.childNodes[0].textContent}</div>`;
	}
	return content;
}
