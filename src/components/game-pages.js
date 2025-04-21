import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";

function handleError(err, navigate) {
	if (err instanceof AxiosError) {
		if (err.status === 500) {
			console.error(err);
			alert("something went wrong");
			return;
		}

		alert(err.response.data.message);

		if (err.status === 401) {
			navigate("/");
		}

		return;
	}

	alert("something went wrong");
}

export function GameHomePage() {
	const navigate = useNavigate();
	const [games, setGames] = useState([]);

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_API_URL}/game/all`, {
				withCredentials: true,
			})
			.then((res) => {
				setGames(res.data);
			})
			.catch((err) => {
				handleError(err, navigate);
			});
	}, []);

	return (
		<div>
			<div className="tw:bg-gray-700 tw:text-white tw:flex tw:justify-end tw:px-16">
				<button
					className="tw:p-4 tw:text-xl tw:cursor-pointer"
					onClick={() => {
						axios
							.post(
								`${process.env.REACT_APP_API_URL}/auth/logout`,
								null,
								{ withCredentials: true },
							)
							.then(() => {
								navigate("/");
							})
							.catch((err) => {
								handleError(err, navigate);
							});
					}}
				>
					Logout
				</button>
			</div>
			<ul className="tw:grid tw:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] tw:m-4 tw:gap-4">
				<li className="tw:font-medium tw:grid-rows-[auto_1fr] tw:grid">
					<div className="tw:bg-black tw:py-2 tw:text-center tw:text-white">
						Add game
					</div>
					<div className="tw:border-4 tw:border-gray-700 tw:relative tw:p-8">
						<div className="tw:border-black tw:relative tw:h-full">
							<Link
								className="tw:absolute tw:w-full tw:h-full"
								to="/game/new"
							></Link>
							<div className="tw:absolute tw:h-full tw:w-1 tw:bg-gray-700 tw:left-1/2 tw:-translate-x-1/2"></div>
							<div className="tw:absolute tw:w-full tw:h-1 tw:bg-gray-700 tw:top-1/2 tw:-translate-y-1/2"></div>
						</div>
					</div>
				</li>
				{games.map((game) => {
					const searchParams = new URLSearchParams();
					searchParams.append("name", game.name);
					searchParams.append("description", game.description);
					searchParams.append("releaseDate", game.releaseDate);
					searchParams.append("author", game.author);
					searchParams.append("price", game.price);
					return (
						<li
							className="tw:grid tw:grid-cols-[auto_1fr] tw:gap-2 tw:bg-gray-700 tw:text-white tw:font-medium tw:text-lg"
							key={game.id}
						>
							<div className="tw:col-span-2 tw:bg-black tw:py-2 tw:text-center">
								{game.name}
							</div>
							<div className="tw:col-span-2 tw:bg-black tw:text-white tw:aspect-square tw:mx-4">
								<img
									src={game.image}
									alt={"image of " + game.name}
								/>
							</div>
							<div className="tw:pl-4">Description:</div>
							<div className="tw:pr-4">{game.description}</div>
							<div className="tw:pl-4">Release date:</div>
							<div className="tw:pr-4">
								{new Date(game.releaseDate).toDateString()}
							</div>
							<div className="tw:pl-4">Author:</div>
							<div className="tw:pr-4">{game.author}</div>
							<div className="tw:pl-4">Price:</div>
							<div className="tw:pr-4">{game.price}$</div>
							<div className="tw:col-span-2 tw:flex tw:flex-col">
								<Link
									className="tw:bg-yellow-400 tw:text-center tw:py-2"
									to={{
										pathname: "/game/" + game.id,
										search: searchParams.toString(),
									}}
								>
									Game detail
								</Link>
								<button className="tw:bg-red-400 tw:text-center tw:py-2 tw:cursor-pointer">
									Delete game
								</button>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export function GameAddPage() {
	const navigate = useNavigate();
	const categories = process.env.REACT_APP_CATEGORIES_PAIR?.split(",").map(
		(pair) => pair.split(":").at(0),
	);
	return (
		<div>
			<div className="tw:bg-gray-700 tw:text-white tw:flex tw:justify-end tw:px-16">
				<Link
					className="tw:p-4 tw:text-xl tw:cursor-pointer"
					to="/game"
				>
					Back to games
				</Link>
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const gameData = new FormData(e.currentTarget);
					axios
						.post(
							`${process.env.REACT_APP_API_URL}/game/new`,
							Object.fromEntries(gameData),
							{ withCredentials: true },
						)
						.then(() => {
							alert("Successfully added game!");
							e.currentTarget.reset();
						})
						.catch((err) => {
							handleError(err, navigate);
						});
				}}
			>
				<label>
					Category:{" "}
					<select name="category" id="category">
						<option value=""></option>
						{categories?.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</label>
				<label>
					Name: <input type="text" name="name" id="name" />
				</label>
				<label>
					Description:{" "}
					<input type="text" name="description" id="description" />
				</label>
				<label>
					Release date:{" "}
					<input type="date" name="releaseDate" id="releaseDate" />
				</label>
				<label>
					Author: <input type="text" name="author" id="author" />
				</label>
				<label>
					Price: <input type="number" name="price" id="price" />
				</label>
				<label>
					Image:{" "}
					<input
						type="file"
						accept="image/*"
						name="image"
						id="image"
					/>
				</label>
				<button type="submit">Add</button>
			</form>
		</div>
	);
}

export function GameDetailPage() {
	const { gameId } = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	return (
		<div>
			<Link to="/game">Go back</Link>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const gameData = new FormData(e.currentTarget);
					axios
						.patch(
							`${process.env.REACT_APP_API_URL}/game/update/${gameId}`,
							Object.fromEntries(gameData),
							{ withCredentials: true },
						)
						.then(() => {
							alert("Successfully updated game!");
							e.currentTarget.reset();
						})
						.catch((err) => {
							handleError(err, navigate);
						});
				}}
			>
				<label>
					Name:{" "}
					<input
						type="text"
						name="name"
						id="name"
						value={searchParams.get("name") || ""}
						onChange={(e) => {
							const newSearchParams = new URLSearchParams(
								searchParams,
							);
							newSearchParams.set("name", e.currentTarget.value);
							setSearchParams(newSearchParams, { replace: true });
						}}
					/>
				</label>
				<label>
					Description:{" "}
					<input
						type="text"
						name="description"
						id="description"
						value={searchParams.get("description") || ""}
						onChange={(e) => {
							const newSearchParams = new URLSearchParams(
								searchParams,
							);
							newSearchParams.set(
								"description",
								e.currentTarget.value,
							);
							setSearchParams(newSearchParams, { replace: true });
						}}
					/>
				</label>
				<label>
					Release date:{" "}
					<input
						type="date"
						name="releaseDate"
						id="releaseDate"
						value={searchParams.get("releaseDate") || ""}
						onChange={(e) => {
							const newSearchParams = new URLSearchParams(
								searchParams,
							);
							newSearchParams.set(
								"releaseDate",
								e.currentTarget.value,
							);
							setSearchParams(newSearchParams, { replace: true });
						}}
					/>
				</label>
				<label>
					Author:{" "}
					<input
						type="text"
						name="author"
						id="author"
						value={searchParams.get("author") || ""}
						onChange={(e) => {
							const newSearchParams = new URLSearchParams(
								searchParams,
							);
							newSearchParams.set(
								"author",
								e.currentTarget.value,
							);
							setSearchParams(newSearchParams, { replace: true });
						}}
					/>
				</label>
				<label>
					Price:{" "}
					<input
						type="number"
						name="price"
						id="price"
						value={searchParams.get("price") || ""}
						onChange={(e) => {
							const newSearchParams = new URLSearchParams(
								searchParams,
							);
							newSearchParams.set("price", e.currentTarget.value);
							setSearchParams(newSearchParams, { replace: true });
						}}
					/>
				</label>
				<label>
					Image:{" "}
					<input
						type="file"
						accept="image/*"
						name="image"
						id="image"
					/>
				</label>
				<button type="submit">Update</button>
			</form>
		</div>
	);
}
