import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { Background, Dialog } from "./share";

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
	const formatter = Intl.DateTimeFormat("en-CA", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
	const [games, setGames] = useState([]);
	const [displayedGames, setDisplayedGames] = useState([]);
	const [category, setCategory] = useState("");
	const [searchName, setSearchName] = useState("");
	const [deleteDialog, setDeleteDialog] = useState({
		show: false,
		deleteId: "",
	});

	const categories = new Map(
		process.env.REACT_APP_CATEGORIES_PAIR?.split(",").map((pair) =>
			pair.split(":"),
		),
	);

	useEffect(() => {
		const url = new URL(`${process.env.REACT_APP_API_URL}/game/all`);
		url.searchParams.set("limit", 10);
		axios
			.get(url, {
				withCredentials: true,
			})
			.then((res) => {
				setGames(res.data);
			})
			.catch((err) => {
				handleError(err, navigate);
			});
	}, [navigate]);

	useEffect(() => {
		let newGameList = games;
		if (category !== "") {
			newGameList = newGameList.filter((game) =>
				game.id.includes(category),
			);
		}
		if (searchName !== "") {
			newGameList = newGameList.filter((game) =>
				game.name.toLowerCase().includes(searchName.toLowerCase()),
			);
		}
		setDisplayedGames(newGameList);
	}, [games, category, searchName]);

	return (
		<>
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
					<div className="tw:bg-gray-700 tw:text-white tw:flex tw:px-16 tw:py-4 tw:border-t-2 tw:border-t-white tw:gap-4 tw:items-end">
						<label>
							Category
							<select
								value={category}
								onChange={(e) => {
									setCategory(e.currentTarget.value);
								}}
								className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full tw:text-black"
							>
								<option value=""></option>
								{Array.from(categories?.entries()).map(
									([long, short]) => (
										<option key={short} value={short}>
											{long}
										</option>
									),
								)}
							</select>
						</label>
						<label>
							Search
							<input
								onChange={(e) => {
									setSearchName(e.currentTarget.value);
								}}
								value={searchName}
								className="tw:px-4 tw:py-1 tw:bg-gray-200 tw:border tw:border-black tw:w-full tw:text-black"
								type="text"
								name="search"
								id="search"
							/>
						</label>
						<button
							onClick={() => {
								setCategory("");
								setSearchName("");
							}}
							className="tw:border-white tw:border tw:px-3 tw:py-2 tw:cursor-pointer"
						>
							Clear filters
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
										to="/game/new"
									></Link>
								</div>
							</div>
						</li>
						{displayedGames.map((game) => {
							const searchParams = new URLSearchParams();
							searchParams.append("name", game.name);
							searchParams.append(
								"description",
								game.description || "",
							);
							searchParams.append(
								"releaseDate",
								game.releaseDate,
							);
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
												setDeleteDialog({
													show: true,
													deleteId: game.id,
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
						{searchName === "" && category === "" && (
							<li className="tw:font-medium tw:grid-rows-[auto_1fr] tw:grid tw:min-h-96 tw:bg-gray-700">
								<div className="tw:bg-black tw:py-2 tw:text-center tw:text-white">
									Load more
								</div>
								<div className="tw:border-4 tw:border-gray-400 tw:relative tw:p-8">
									<div className="tw:border-black tw:relative tw:h-full">
										<div className="tw:absolute tw:top-1/2 tw:left-1/2 tw:-translate-1/2 tw:flex tw:gap-10">
											<div className="tw:w-10 tw:aspect-square tw:bg-white tw:rounded-full"></div>
											<div className="tw:w-10 tw:aspect-square tw:bg-white tw:rounded-full"></div>
											<div className="tw:w-10 tw:aspect-square tw:bg-white tw:rounded-full"></div>
										</div>
										<button
											onClick={() => {
												const url = new URL(
													`${process.env.REACT_APP_API_URL}/game/all`,
												);
												url.searchParams.set(
													"limit",
													10,
												);
												url.searchParams.set(
													"skip",
													games.length,
												);
												axios
													.get(url, {
														withCredentials: true,
													})
													.then((res) => {
														setGames([
															...games,
															...res.data,
														]);
													})
													.catch((err) => {
														handleError(
															err,
															navigate,
														);
													});
											}}
											className="tw:absolute tw:w-full tw:h-full tw:cursor-pointer"
										></button>
									</div>
								</div>
							</li>
						)}
					</ul>
				</div>
			</div>
			<Dialog show={deleteDialog.show}>
				<div className="tw:bg-white tw:p-4 tw:grid tw:gap-4">
					<h2 className="tw:text-2xl tw:font-medium">
						Are you sure you want to delete this game #
						{deleteDialog.deleteId}
					</h2>
					<div className="tw:flex tw:gap-4 tw:text-white tw:justify-end">
						<button
							className="tw:cursor-pointer tw:px-3 tw:py-2 tw:bg-red-400"
							onClick={() => {
								axios
									.delete(
										`${process.env.REACT_APP_API_URL}/game/delete/${deleteDialog.deleteId}`,
										{
											withCredentials: true,
										},
									)
									.then(() => {
										alert("Successfully delete game");
										setGames(
											games.filter(
												({ id }) =>
													id !==
													deleteDialog.deleteId,
											),
										);
									})
									.catch((err) => {
										handleError(err, navigate);
									})
									.finally(() => {
										setDeleteDialog({
											show: false,
											deleteId: "",
										});
									});
							}}
						>
							Confirm
						</button>
						<button
							className="tw:cursor-pointer tw:px-3 tw:py-2 tw:bg-blue-400"
							onClick={() => {
								setDeleteDialog({
									show: false,
									deleteId: "",
								});
							}}
						>
							Cancel
						</button>
					</div>
				</div>
			</Dialog>
		</>
	);
}

export function GameAddPage() {
	const navigate = useNavigate();
	const formatter = new Intl.DateTimeFormat("en-CA", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});
	const [expectedId, setExpectedId] = useState("");
	const [category, setCategory] = useState("");
	const [image, setImage] = useState("");
	const [imageFile, setImageFile] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [releaseDate, setReleaseDate] = useState(null);
	const [author, setAuthor] = useState("");
	const [price, setPrice] = useState(0);
	const [addDialog, setAddDialog] = useState({
		show: false,
		formData: null,
	});
	const categories = new Map(
		process.env.REACT_APP_CATEGORIES_PAIR?.split(",").map((pair) =>
			pair.split(":"),
		),
	);
	useEffect(() => {
		if (category === "") {
			setExpectedId("");
			return;
		}
		const url = new URL(`${process.env.REACT_APP_API_URL}/game/newId`);
		url.searchParams.append("category", e.currentTarget.value);
		axios
			.get(url, {
				withCredentials: true,
			})
			.then((res) => {
				setExpectedId(res.data.id);
			})
			.catch((err) => {
				console.error(err);
				alert(
					"something went wrong when retrieving id from the server",
				);
			});
	}, [category]);
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
									setAddDialog({
										show: true,
										formData: new FormData(e.currentTarget),
									});
								}}
							>
								<label>
									Category:{" "}
									<select
										value={category}
										onChange={(e) => {
											setCategory(e.currentTarget.value);
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
											setImageFile(
												ev.currentTarget.value,
											);
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
										value={imageFile}
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
			<Dialog show={addDialog.show}>
				<div className="tw:bg-white tw:p-4 tw:grid tw:gap-4">
					<h2 className="tw:text-2xl tw:font-medium">
						Are you sure you want to add a game with these data
					</h2>
					<div className="tw:flex tw:gap-4 tw:text-white tw:justify-end">
						<button
							className="tw:cursor-pointer tw:px-3 tw:py-2 tw:bg-red-400"
							onClick={() => {
								axios
									.post(
										`${process.env.REACT_APP_API_URL}/game/new`,
										addDialog.formData,
										{ withCredentials: true },
									)
									.then(() => {
										alert("Successfully added game!");
										setCategory("");
										setImage("");
										setName("");
										setDescription("");
										setReleaseDate(null);
										setAuthor("");
										setPrice(0);
									})
									.catch((err) => {
										handleError(err, navigate);
									})
									.finally(() => {
										setAddDialog({
											show: false,
											formData: null,
										});
									});
							}}
						>
							Confirm
						</button>
						<button
							className="tw:cursor-pointer tw:px-3 tw:py-2 tw:bg-blue-400"
							onClick={() => {
								setAddDialog({
									show: false,
									formData: null,
								});
							}}
						>
							Cancel
						</button>
					</div>
				</div>
			</Dialog>
		</>
	);
}

export function GameDetailPage() {
	const { gameId } = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [updateDialog, setUpdateDialog] = useState({
		show: false,
		updateGameId: "",
		formData: null,
	});
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
									setUpdateDialog({
										show: true,
										updateGameId: gameId,
										formData: new FormData(e.currentTarget),
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
			<Dialog show={updateDialog.show}>
				<div className="tw:bg-white tw:p-4 tw:grid tw:gap-4">
					<h2 className="tw:text-2xl tw:font-medium">
						Are you sure you want to update this game with these
						data
					</h2>
					<div className="tw:flex tw:gap-4 tw:text-white tw:justify-end">
						<button
							className="tw:cursor-pointer tw:px-3 tw:py-2 tw:bg-red-400"
							onClick={() => {
								axios
									.patch(
										`${process.env.REACT_APP_API_URL}/game/update/${updateDialog.updateGameId}`,
										updateDialog.formData,
										{ withCredentials: true },
									)
									.then(() => {
										alert("Successfully updated game!");
									})
									.catch((err) => {
										if (
											err instanceof AxiosError &&
											err.response?.status === 304
										) {
											alert("Nothing has changed");
											return;
										}
										handleError(err, navigate);
									})
									.finally(() => {
										setUpdateDialog({
											show: false,
											formData: null,
											updateGameId: "",
										});
									});
							}}
						>
							Confirm
						</button>
						<button
							className="tw:cursor-pointer tw:px-3 tw:py-2 tw:bg-blue-400"
							onClick={() => {
								setUpdateDialog({
									show: false,
									formData: null,
									updateGameId: "",
								});
							}}
						>
							Cancel
						</button>
					</div>
				</div>
			</Dialog>
		</>
	);
}
