import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios';
const LOGIN_URL='/auth';

const Login = () => {

	const { setAuth } = useAuth();

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";


	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('');
	const [pwd, setPwd] = useState('');
	const [errMsg, setErrMsg] = useState('');

	
	useEffect(() => {
		userRef.current.focus();
	}, [])

	useEffect(() => {
		setErrMsg('');
	}, [user, pwd])

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		try {
			const response = await axios.post(LOGIN_URL, 
				JSON.stringify({user, pwd}),
				{
					headers: { 'Content-Type': 'application/json'},
					withCredentials: true
				}
			);
			console.log(response)
			const accessToken = response?.data?.accessToken;
			const roles = response?.data?.roles;
			setAuth ({ user, pwd, roles, accessToken });
			setUser('');
			setPwd('');
			navigate(from, { replace: true });
		} catch (err) {
			if (!err?.response) {
				setErrMsg('No server Response')
			} else if (err.response?.status === 400) {
				setErrMsg('Missing Username or password')
			} else if (err.response?.status === 401) {
				setErrMsg('Unauthorized');
			} else {
				setErrMsg('Login Failed');
			}
			errRef.current.focus();
		}
		
	}

	return (
		<section>
			<p 
				ref={errRef}
				className={errMsg ? "errmsg" : "offscreen"}
				aria-live="assertive"
			>
				{errMsg}
			</p>
			<h1>Sign In</h1>
			<form onSubmit={handleSubmit}>
				{/* mathing input id attr */}
				<label htmlFor="username">Username:</label>
				<input 
					type="text"
					id="username"
					ref={userRef}
					autoComplete="off"
					onChange={(e) => setUser(e.target.value)}
					/* clear할때 있어야함 */
					value={user} 
					required
				/>
				<label htmlFor="password">Password:</label>
				<input 
					type="password"
					id="password"
					onChange={(e) => setPwd(e.target.value)}
					/* clear할때 있어야함 */
					value={pwd} 
					required
				/>
				<button>Sign IN</button>
			</form>
			<p>
				Need an Account? <br />
				<span className="line">
					<a href="#">Sign Up</a>
				</span>
			</p>
		</section>
  )
}

export default Login