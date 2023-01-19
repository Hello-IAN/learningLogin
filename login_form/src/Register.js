import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from './api/axios';

/* 소문자and대문자에따라오는소문자and숫자and-_3글자~23글자 */
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
/* 소문자or대문자or숫자or특문 8글자~24글자 */
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
	const userRef = useRef();
	/* 에러 발생하면 에러로 옮겨야함 */
	const errRef = useRef();

	/* 유저네임 기본값 상태 설정 */
	const [user, setUser] = useState('');
	const [validName, setVailedName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	/* 패스워드 상태 기본값 설정 */
	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	/* 값 매칭 상태 기본값 설정*/
	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	/* 에러 or 성공 기본값 상태 설정 */
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] =useState(false);

	/* 최초 로딩시 포커스 이동 */
	useEffect(() => {
		userRef.current.focus();
	},[])

	useEffect(() => {
		/* USER_REGEX로 유효 결과 확인 */
		const result = USER_REGEX.test(user);
		console.log(result);
		console.log(user);
		setVailedName(result);
	}, [user])
	
	useEffect(() => {
		/* PWD_REGEX로 유효 결과 확인 */
		/* 패스워드 매치되는지 확인 */
		const result = PWD_REGEX.test(pwd);
		console.log(result);
		console.log(pwd);
		setValidPwd(result);
		const match = pwd === matchPwd;
		setValidMatch(match);
	}, [pwd, matchPwd])

	useEffect(() => {
		/* 디펜던시 건 세 상황에 따라 에러발생하면 메세지 발생 후 초기화 */
		setErrMsg('');
	}, [user, pwd, matchPwd])

	const handleSubmit = async (e) => {
		e.preventDefault();
		const v1 = USER_REGEX.test(user);
		const v2 = PWD_REGEX.test(pwd);
		if (!v1 || !v2) {
			setErrMsg("invalid Entry");
			return ;
		}	
		try {
			const response = await axios.post(REGISTER_URL,
				JSON.stringify( { user, pwd } ),
				{
					headers: { 'Content-type':'application/json'},
					withCredentials: true
				}
			);
			console.log(response.data);
			console.log(response.accessToken);
			console.log(JSON.stringify(response));
			setSuccess(true);
			// clear input fields

		} catch (err) {
			if (!err?.response){
				setErrMsg('No Server Response');
			} else if (err.response?.status === 409) {
				setErrMsg('Username Taken');
			} else {
				setErrMsg('Registration Failed')
			}
			errRef.current.focus();
		}
	}
  	return (
		<>
		{success ? (
			<section>
				<h1>Success!</h1>
				<p>
					<a href="#">Sign in</a>
				</p>
			</section>
		) : (
		<section>
			{/* 에러메세지 있으면 errMsg 아니면 offscreen */}
			<p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
			<h1>REGISTER</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">
					UserName:
					{/* 벨리드면 체크 아님 숨김 */}
					<span className={validName ? "valid" : "hide"}>
						<FontAwesomeIcon icon={faCheck} />
					</span>
						{/* 벨리드네임 이거나 유저가 비어있음 숨김 */}
					<span className={validName || !user ? "hide" : "invalid"}>
						<FontAwesomeIcon icon={faTimes} />
					</span>
					</label>
				<input 
						type="text" 
						id="username"
						ref={userRef}
						autoComplete="off"
						onChange={(e) => setUser(e.target.value)}
						required
						aria-invalid={validName ? "false" : "true"}
						aria-describedby="uidnote"
						onFocus={() => setUserFocus(true)}
						onBlur={() => setUserFocus(false)}
				/>
				<p id="uidnote" 
					className={userFocus && user && 
					!validName ? "instructions" : "offscreen"}>
					<FontAwesomeIcon icon={faInfoCircle} />
					4 to 24 characters. <br />
					Must begin with a letter. <br />
					Letters, numbers, underscores, hyphens allowd.
				</p>
				<label htmlFor="password">
					Password:
					{/* 벨리드면 체크 아님 숨김 */}
					<span className={validPwd ? "valid" : "hide"}>
						<FontAwesomeIcon icon={faCheck} />
					</span>
					{/* 벨리드이거나 비번 비어있음 숨김 */}
					<span className={validPwd || !pwd ? "hide" : "invalid"}>
						<FontAwesomeIcon icon={faTimes} />
					</span>
				</label>
				<input 
						type="password" 
						id="passowrd"
						onChange={(e) => setPwd(e.target.value)}
						required
						aria-invalid={validPwd ? "false" : "true"}
						aria-describedby="pwdnote"
						onFocus={() => setPwdFocus(true)}
						onBlur={() => setPwdFocus(false)}
				/>
				<p id="pwdnote" 
				className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
				<FontAwesomeIcon icon={faInfoCircle} />
				8 to 24 characters. <br />
				Must include uppercase and lowercase letters, a number and a special character <br />
				Allowed special characters: <span aria-label="exclamation mark">!</span>
				<span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>
				<span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
				</p>
					
				<label htmlFor="confirm_pwd">
					Confirm Password:
					{/* 벨리드 && 매치면 체크 아님 숨김 */}
					<span className={validMatch && matchPwd ? "valid" : "hide"}>
						<FontAwesomeIcon icon={faCheck} />
					</span>
					{/* 벨리드이거나 비번 비어있음 숨김 */}
					<span className={validMatch || !matchPwd ? "hide" : "invalid"}>
						<FontAwesomeIcon icon={faTimes} />
					</span>
				</label>
				<input 
						type="password" 
						id="confirm_pwd"
						onChange={(e) => setMatchPwd(e.target.value)}
						required
						aria-invalid={validMatch ? "false" : "true"}
						aria-describedby="comfirmnote"
						onFocus={() => setMatchFocus(true)}
						onBlur={() => setMatchFocus(false)}
				/>
				<p id="pwdnote" 
				className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
				<FontAwesomeIcon icon={faInfoCircle} />
				Must match the Password first input field.
				</p>
				{/* 하나라도 조건 안맞으면 disable상태로 submit 못함 */}
				<button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
				<p>Already registered? <br />
					<span className="line">
						{/* put a router link */}
						<a href="#">Sign in</a>
					</span>
				</p>
			</form>	
		</section>
		)}</>
  )
}

export default Register