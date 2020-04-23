import React, { useRef } from 'react';

export function Register() {
	const usernameInput = useRef(null);
	const passwordInput = useRef(null);

	function handleSubmit(e) {
		e.preventDefault();
		const username = usernameInput.current.value;
		const password = passwordInput.current.value;
		fetch('/api/user/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		})
			.then((res) => res.json())
			.then((json) => alert('Registered! Please login now.'))
			.catch((err) => alert(err));
		e.target.reset();
	}

	return (
		<div className="register">
			<h3>Register</h3>
			<form onSubmit={handleSubmit}>
				Username:{' '}
				<input type="text" ref={usernameInput} placeholder="Username..." />
				<br />
				Password:{' '}
				<input type="password" ref={passwordInput} placeholder="Password..." />
				<br />
				<input type="submit" value="Register" />
			</form>
		</div>
	);
}
