import React, { useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';

export function Login(props) {
	const { setJwt } = props;
	const [loggedIn, setLoggedIn] = useState(false);
	const usernameInput = useRef(null);
	const passwordInput = useRef(null);

	function handleSubmit(e) {
		e.preventDefault();
		const username = usernameInput.current.value;
		const password = passwordInput.current.value;
		fetch('/api/user/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		})
			.then((res) => res.json())
			.then((json) => {
				const { success, jwt, error } = json;
				if (success) {
					setJwt(jwt);
					setLoggedIn(true);
				} else {
					throw new Error(error);
				}
			})
			.catch((err) => alert(err));
	}

	return loggedIn ? (
		<Redirect to="/document" />
	) : (
		<div className="login">
			<h3>Login</h3>
			<form onSubmit={handleSubmit}>
				Username:{' '}
				<input type="text" ref={usernameInput} placeholder="Username..." />
				<br />
				Password:{' '}
				<input type="password" ref={passwordInput} placeholder="Password..." />
				<br />
				<input type="submit" value="Login" />
			</form>
		</div>
	);
}
