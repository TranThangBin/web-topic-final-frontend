import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router";
import Gopher from "../assets/square-gopher.png";
import GopherAndGame from "../assets/gopherandgame.png";
import { Background } from "./share";

function handleError(err) {
	if (err instanceof AxiosError) {
		if (err.status === 500) {
			console.error(err);
			alert("something went wrong");
			return;
		}

		alert(err.response.data.message);
		return;
	}

	alert("something went wrong");
}

export function LoginPage() {
	const navigate = useNavigate();

	return (
		<>
			<Background />
			<div className="tw:min-h-screen tw:grid tw:place-items-center">
				<div className="tw:grid tw:grid-cols-2 tw:border-2 tw:border-black tw:mx-8 tw:min-h-1/2 tw:bg-white">
					<div className="tw:text-lg tw:grid tw:content-center tw:px-4">
						<h1 className="tw:font-bold tw:text-center tw:text-5xl">
							Login
						</h1>
						<form
							className="tw:flex tw:flex-col tw:gap-4"
							onSubmit={(e) => {
								e.preventDefault();
								const loginData = new FormData(e.currentTarget);
								axios
									.post(
										`${process.env.REACT_APP_API_URL}/auth/login`,
										Object.fromEntries(loginData),
										{ withCredentials: true },
									)
									.then(() => {
										navigate("/game");
									})
									.catch(handleError);
							}}
						>
							<label>
								Username:{" "}
								<input
									className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
									type="text"
									name="username"
									id="username"
								/>
							</label>
							<label>
								Password:{" "}
								<input
									className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
									type="password"
									name="password"
									id="password"
								/>
							</label>
							<button
								className="tw:cursor-pointer tw:px-3 tw:py-2 tw:bg-blue-400 tw:text-white tw:border tw:border-black"
								type="submit"
							>
								Login
							</button>
						</form>
						<Link
							className="tw:text-blue-400 tw:text-right tw:underline"
							to="/register"
						>
							Don't have an account?
						</Link>
					</div>
					<img
						className="tw:min-h-full"
						src={Gopher}
						alt="Go gopher"
					/>
				</div>
			</div>
		</>
	);
}

export function RegisterPage() {
	const navigate = useNavigate();

	return (
		<>
			<Background />
			<div className="tw:min-h-screen tw:grid tw:place-items-center">
				<div className="tw:grid tw:grid-cols-[auto_1fr] tw:border-2 tw:border-black tw:mx-8 tw:min-h-1/2 tw:bg-white">
					<img
						className="tw:min-h-full tw:max-w-2xl"
						src={GopherAndGame}
						alt="Go gopher"
					/>
					<div className="tw:text-lg tw:grid tw:content-center tw:px-4">
						<h1 className="tw:font-bold tw:text-center tw:text-5xl">
							Register
						</h1>
						<form
							className="tw:flex tw:flex-col tw:gap-4"
							onSubmit={async (e) => {
								e.preventDefault();
								const registerData = new FormData(
									e.currentTarget,
								);
								await axios
									.post(
										`${process.env.REACT_APP_API_URL}/auth/register`,
										Object.fromEntries(registerData),
									)
									.then(() => {
										navigate("/");
									})
									.catch(handleError);
							}}
						>
							<label>
								Username:{" "}
								<input
									className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
									type="text"
									name="username"
									id="username"
								/>
							</label>
							<label>
								Password:{" "}
								<input
									className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
									type="password"
									name="password"
									id="password"
								/>
							</label>
							<label>
								Confirm password:{" "}
								<input
									className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
									type="password"
									name="confirmPassword"
									id="confirmPassword"
								/>
							</label>
							<button
								className="tw:cursor-pointer tw:px-3 tw:py-2 tw:bg-green-400 tw:text-white tw:border tw:border-black"
								type="submit"
							>
								Register
							</button>
						</form>
						<Link
							className="tw:text-blue-400 tw:text-right tw:underline"
							to="/"
						>
							Already have an account?
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
