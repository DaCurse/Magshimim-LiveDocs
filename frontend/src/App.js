import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Document } from './components/Document';
import { Login } from './components/Login';
import { Register } from './components/Register';
import './css/app.css';

export function App() {
	const [jwt, setJwt] = useState(localStorage.getItem('jwt'));

	// Store jwt in localstorage
	useEffect(() => {
		if (jwt) {
			localStorage.setItem('jwt', jwt);
		}
	}, [jwt]);

	return (
		<div className="app">
			<h1>LiveDocs - Menu</h1>
			<Router>
				<div>
					<ul>
						{jwt ? (
							<nav>
								<li>
									<Link to="/document">Documents</Link>
								</li>
							</nav>
						) : (
							<nav>
								<li>
									<Link to="/register">Register</Link>
								</li>
								<li>
									<Link to="/login">Login</Link>
								</li>
							</nav>
						)}
					</ul>
				</div>
				<hr />
				<Switch>
					<Route exact path="/register">
						<Register />
					</Route>
					<Route exact path="/login">
						<Login setJwt={setJwt} />
					</Route>
					<Route exact path="/document">
						<Document jwt={jwt} />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}
