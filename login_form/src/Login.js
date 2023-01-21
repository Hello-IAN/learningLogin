import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from './context/AuthProvider';

import axios from './api/axios';
const LOGIN_URL='/auth';

const Login = () => {

	const { setAuth } = useContext(AuthContext);
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('');
	const [pwd, setPwd] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	
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
					headers: { 'Content-Type':'apllication/json'},
					withCredentials: true
				}
			);
			console.log(JSON.stringify(response?.data));
			const accessToken = response?.data?.accessToken;
			const roles = response?.data?.roles;
			setAuth ({user, pwd, roles, accessToken});
			setUser('');
			setPwd('');
			setSuccess(true);
		} catch (err) {
			if (!err?.response) {
				setErrMsg('No server Response')
			} else if (err.ressponse?.status === 400) {
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
		<>
			{success ? (
				<section>
					<h1>You are logged in!</h1>
					<br />
					<p> 
						<a href="#">go to home</a>
					</p>
				</section>
			) : (
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
  		)}
  	</>
  )
}

export default Login