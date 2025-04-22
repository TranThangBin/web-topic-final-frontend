import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { Background } from "./share";

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

function getExpectedId(lastId, categoryShort) {
	if (!lastId) {
		return "GAME" + categoryShort + "0001";
	}
	const newIdIdx = parseInt(lastId.slice(-4)) + 1;
	return "GAME" + categoryShort + newIdIdx.toString().padStart(4, "0");
}

export function GameHomePage() {
	const navigate = useNavigate();
	const formatter = Intl.DateTimeFormat("en-CA", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
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
		<div className="tw:relative tw:min-h-screen">
			<Background />
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
					<li className="tw:font-medium tw:grid-rows-[auto_1fr] tw:grid tw:min-h-96 tw:bg-gray-700">
						<div className="tw:bg-black tw:py-2 tw:text-center tw:text-white">
							Add game
						</div>
						<div className="tw:border-4 tw:border-gray-400 tw:relative tw:p-8">
							<div className="tw:border-black tw:relative tw:h-full">
								<div className="tw:absolute tw:h-full tw:w-1 tw:bg-white tw:left-1/2 tw:-translate-x-1/2"></div>
								<div className="tw:absolute tw:w-full tw:h-1 tw:bg-white tw:top-1/2 tw:-translate-y-1/2"></div>
								<Link
									className="tw:absolute tw:w-full tw:h-full"
									to={{
										pathname: "/game/new",
										search: `lastId=${games.at(-1)?.id || ""}`,
									}}
								></Link>
							</div>
						</div>
					</li>
					{games.map((game) => {
						const searchParams = new URLSearchParams();
						searchParams.append("name", game.name);
						searchParams.append(
							"description",
							game.description || "",
						);
						searchParams.append("releaseDate", game.releaseDate);
						searchParams.append("author", game.author);
						searchParams.append("price", game.price);
						searchParams.append("image", game.image);
						return (
							<li
								className="tw:grid tw:grid-cols-[auto_1fr] tw:gap-2 tw:bg-gray-700 tw:text-white tw:font-medium tw:text-lg"
								key={game.id}
							>
								<div className="tw:col-span-2 tw:bg-black tw:py-2 tw:text-center">
									{game.name}
								</div>
								<div className="tw:col-span-2 tw:bg-black tw:text-white tw:aspect-square tw:mx-4 tw:grid tw:place-items-center tw:overflow-hidden">
									<img
										src={`${process.env.REACT_APP_API_URL}/${game.image}`}
										alt={"image of " + game.name}
									/>
								</div>
								<div className="tw:pl-4">Description:</div>
								<div className="tw:pr-4">
									{game.description || ""}
								</div>
								<div className="tw:pl-4">Release date:</div>
								<div className="tw:pr-4">
									{formatter.format(
										new Date(game.releaseDate),
									)}
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
									<button
										onClick={() => {
											axios
												.delete(
													`${process.env.REACT_APP_API_URL}/game/delete/${game.id}`,
													{ withCredentials: true },
												)
												.then(() => {
													alert(
														"Successfully delete game",
													);
													setGames(
														games.filter(
															({ id }) =>
																id !== game.id,
														),
													);
												})
												.catch((err) => {
													handleError(err, navigate);
												});
										}}
										className="tw:bg-red-400 tw:text-center tw:py-2 tw:cursor-pointer"
									>
										Delete game
									</button>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}

export function GameAddPage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const formatter = new Intl.DateTimeFormat("en-CA", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});
	const [expectedId, setExpectedId] = useState("");
	const [image, setImage] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [releaseDate, setReleaseDate] = useState(null);
	const [author, setAuthor] = useState("");
	const [price, setPrice] = useState(0);
	const categories = new Map(
		process.env.REACT_APP_CATEGORIES_PAIR?.split(",").map((pair) =>
			pair.split(":"),
		),
	);
	return (
		<>
			<Background />
			<div>
				<div className="tw:bg-gray-700 tw:text-white tw:flex tw:justify-end tw:px-16">
					<Link
						className="tw:p-4 tw:text-xl tw:cursor-pointer"
						to="/game"
					>
						Back to games
					</Link>
				</div>
				<div className="tw:min-h-[calc(100vh-3.75rem)] tw:grid tw:place-items-center">
					<div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:border-2 tw:p-8 tw:bg-white">
						<div className="tw:grid tw:items-center tw:gap-4">
							<h1 className="tw:font-bold tw:text-center tw:text-5xl">
								Add game
							</h1>
							<label>
								Expected id:
								<input
									value={expectedId}
									className="tw:px-4 tw:py-1 tw:bg-gray-400 tw:border tw:border-black tw:w-full"
									type="text"
									disabled
								/>
							</label>
							<form
								className="tw:flex tw:flex-col tw:gap-4"
								onSubmit={(e) => {
									e.preventDefault();
									const gameData = new FormData(
										e.currentTarget,
									);
									console.log(
										Object.fromEntries(gameData.entries()),
									);
									axios
										.post(
											`${process.env.REACT_APP_API_URL}/game/new`,
											gameData,
											{ withCredentials: true },
										)
										.then(() => {
											alert("Successfully added game!");
											const newSearchParams =
												new URLSearchParams(
													searchParams,
												);
											newSearchParams.set(
												"lastId",
												expectedId,
											);
											setSearchParams(newSearchParams, {
												replace: true,
											});
										})
										.catch((err) => {
											handleError(err, navigate);
										});
								}}
							>
								<label>
									Category:{" "}
									<select
										onChange={(e) => {
											setExpectedId(
												getExpectedId(
													searchParams.get("lastId"),
													categories.get(
														e.currentTarget.value,
													),
												),
											);
										}}
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										name="category"
										id="category"
									>
										<option value=""></option>
										{Array.from(categories?.keys()).map(
											(category) => (
												<option
													key={category}
													value={category}
												>
													{category}
												</option>
											),
										)}
									</select>
								</label>
								<label>
									Name:{" "}
									<input
										value={name}
										onChange={(e) => {
											setName(e.currentTarget.value);
										}}
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="text"
										name="name"
										id="name"
									/>
								</label>
								<label>
									Description:{" "}
									<textarea
										value={description}
										onChange={(e) => {
											setDescription(
												e.currentTarget.value,
											);
										}}
										className="tw:resize-none tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="text"
										name="description"
										id="description"
									/>
								</label>
								<label>
									Release date:{" "}
									<input
										value={releaseDate || ""}
										onChange={(e) => {
											setReleaseDate(
												formatter.format(
													new Date(
														e.currentTarget.value,
													),
												),
											);
										}}
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="date"
										name="releaseDate"
										id="releaseDate"
									/>
								</label>
								<label>
									Author:{" "}
									<input
										value={author}
										onChange={(e) => {
											setAuthor(e.currentTarget.value);
										}}
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="text"
										name="author"
										id="author"
									/>
								</label>
								<label>
									Price:{" "}
									<input
										value={price}
										onChange={(e) => {
											setPrice(e.currentTarget.value);
										}}
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="number"
										name="price"
										id="price"
									/>
								</label>
								<label>
									Image:{" "}
									<input
										onChange={(ev) => {
											const reader = new FileReader();
											reader.onload = (e) => {
												setImage(
													e.currentTarget.result,
												);
											};
											reader.readAsDataURL(
												ev.currentTarget.files[0],
											);
										}}
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="file"
										accept="image/*"
										name="image"
										id="image"
									/>
								</label>
								<button
									className="tw:bg-green-400 tw:text-white tw:py-2 tw:cursor-pointer"
									type="submit"
								>
									Add
								</button>
							</form>
						</div>
						<div className="tw:grid tw:grid-cols-[auto_1fr] tw:gap-2 tw:bg-gray-700 tw:text-white tw:font-medium tw:text-lg tw:w-lg tw:pb-4">
							{" "}
							<div className="tw:col-span-2 tw:bg-black tw:py-2 tw:text-center">
								{name}
							</div>
							<div className="tw:col-span-2 tw:bg-black tw:text-white tw:aspect-square tw:mx-4 tw:grid tw:place-items-center">
								<img
									className="tw:w-full"
									src={image || null}
									alt={"image of " + name}
								/>
							</div>
							<div className="tw:pl-4">Description:</div>
							<div className="tw:pr-4">{description}</div>
							<div className="tw:pl-4">Release date:</div>
							<div className="tw:pr-4">
								{releaseDate
									? formatter.format(new Date(releaseDate))
									: ""}
							</div>
							<div className="tw:pl-4">Author:</div>
							<div className="tw:pr-4">{author}</div>
							<div className="tw:pl-4">Price:</div>
							<div className="tw:pr-4">{price}$</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export function GameDetailPage() {
	const { gameId } = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const formatter = new Intl.DateTimeFormat("en-CA", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});

	return (
		<>
			<Background />
			<div>
				<div className="tw:bg-gray-700 tw:text-white tw:flex tw:justify-end tw:px-16">
					<Link
						className="tw:p-4 tw:text-xl tw:cursor-pointer"
						to="/game"
					>
						Back to games
					</Link>
				</div>
				<div className="tw:min-h-[calc(100vh-3.75rem)] tw:grid tw:place-items-center">
					<div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:border-2 tw:p-8 tw:bg-white">
						<div className="tw:grid tw:grid-cols-[auto_1fr] tw:gap-2 tw:bg-gray-700 tw:text-white tw:font-medium tw:text-lg tw:w-lg tw:pb-4">
							{" "}
							<div className="tw:col-span-2 tw:bg-black tw:py-2 tw:text-center">
								{searchParams.get("name")}
							</div>
							<div className="tw:col-span-2 tw:bg-black tw:text-white tw:aspect-square tw:mx-4 tw:grid tw:place-items-center">
								<img
									className="tw:w-full"
									src={
										searchParams
											.get("image")
											.startsWith("data:image")
											? searchParams.get("image")
											: `${process.env.REACT_APP_API_URL}/${searchParams.get("image")}`
									}
									alt={"image of " + searchParams.get("name")}
								/>
							</div>
							<div className="tw:pl-4">Description:</div>
							<div className="tw:pr-4">
								{searchParams.get("description")}
							</div>
							<div className="tw:pl-4">Release date:</div>
							<div className="tw:pr-4">
								{formatter.format(
									new Date(searchParams.get("releaseDate")),
								)}
							</div>
							<div className="tw:pl-4">Author:</div>
							<div className="tw:pr-4">
								{searchParams.get("author")}
							</div>
							<div className="tw:pl-4">Price:</div>
							<div className="tw:pr-4">
								{searchParams.get("price")}$
							</div>
						</div>
						<div className="tw:grid tw:items-center">
							<h1 className="tw:font-bold tw:text-center tw:text-5xl">
								Update game
							</h1>
							<form
								className="tw:flex tw:flex-col tw:gap-4"
								onSubmit={(e) => {
									e.preventDefault();
									const gameData = new FormData(
										e.currentTarget,
									);
									axios
										.patch(
											`${process.env.REACT_APP_API_URL}/game/update/${gameId}`,
											gameData,
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
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="text"
										name="name"
										id="name"
										value={searchParams.get("name") || ""}
										onChange={(e) => {
											const newSearchParams =
												new URLSearchParams(
													searchParams,
												);
											newSearchParams.set(
												"name",
												e.currentTarget.value,
											);
											setSearchParams(newSearchParams, {
												replace: true,
											});
										}}
									/>
								</label>
								<label>
									Description:{" "}
									<input
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="text"
										name="description"
										id="description"
										value={
											searchParams.get("description") ||
											""
										}
										onChange={(e) => {
											const newSearchParams =
												new URLSearchParams(
													searchParams,
												);
											newSearchParams.set(
												"description",
												e.currentTarget.value,
											);
											setSearchParams(newSearchParams, {
												replace: true,
											});
										}}
									/>
								</label>
								<label>
									Release date:{" "}
									<input
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="date"
										name="releaseDate"
										id="releaseDate"
										value={
											formatter.format(
												new Date(
													searchParams.get(
														"releaseDate",
													),
												),
											) || ""
										}
										onChange={(e) => {
											const newSearchParams =
												new URLSearchParams(
													searchParams,
												);
											newSearchParams.set(
												"releaseDate",
												e.currentTarget.value,
											);
											setSearchParams(newSearchParams, {
												replace: true,
											});
										}}
									/>
								</label>
								<label>
									Author:{" "}
									<input
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="text"
										name="author"
										id="author"
										value={searchParams.get("author") || ""}
										onChange={(e) => {
											const newSearchParams =
												new URLSearchParams(
													searchParams,
												);
											newSearchParams.set(
												"author",
												e.currentTarget.value,
											);
											setSearchParams(newSearchParams, {
												replace: true,
											});
										}}
									/>
								</label>
								<label>
									Price:{" "}
									<input
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="number"
										name="price"
										id="price"
										value={searchParams.get("price") || ""}
										onChange={(e) => {
											const newSearchParams =
												new URLSearchParams(
													searchParams,
												);
											newSearchParams.set(
												"price",
												e.currentTarget.value,
											);
											setSearchParams(newSearchParams, {
												replace: true,
											});
										}}
									/>
								</label>
								<label>
									Image:{" "}
									<input
										onChange={(ev) => {
											const reader = new FileReader();
											reader.onload = (e) => {
												const newSearchParams =
													new URLSearchParams(
														searchParams,
													);
												newSearchParams.set(
													"image",
													e.currentTarget.result,
												);
												setSearchParams(
													newSearchParams,
													{ replace: true },
												);
											};
											reader.readAsDataURL(
												ev.currentTarget.files[0],
											);
										}}
										className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full"
										type="file"
										accept="image/*"
										name="image"
										id="image"
									/>
								</label>
								<button
									className="tw:bg-blue-400 tw:text-white tw:py-2 tw:cursor-pointer"
									type="submit"
								>
									Update
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
