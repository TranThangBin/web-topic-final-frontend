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

function LogoutButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        axios
          .post(`${process.env.REACT_APP_API_URL}/auth/logout`, null, {
            withCredentials: true,
          })
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
  );
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
      <LogoutButton />
      <ul>
        {games.map((game) => {
          const searchParams = new URLSearchParams();
          searchParams.append("name", game.name);
          searchParams.append("description", game.description);
          searchParams.append("releaseDate", game.releaseDate);
          searchParams.append("author", game.author);
          searchParams.append("price", game.price);
          return (
            <li key={game.id}>
              <Link
                to={{
                  pathname: "/game/" + game.id,
                  search: searchParams.toString(),
                }}
              >
                {JSON.stringify(game)}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to="/game/new">Add game</Link>
    </div>
  );
}

export function GameAddPage() {
  const navigate = useNavigate();
  const categories = process.env.REACT_APP_CATEGORIES?.split(",");
  return (
    <div>
      <Link to="/game">Go back</Link>
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
          Description: <input type="text" name="description" id="description" />
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
          Image: <input type="file" accept="image/*" name="image" id="image" />
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
              const newSearchParams = new URLSearchParams(searchParams);
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
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("description", e.currentTarget.value);
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
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("releaseDate", e.currentTarget.value);
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
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("author", e.currentTarget.value);
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
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("price", e.currentTarget.value);
              setSearchParams(newSearchParams, { replace: true });
            }}
          />
        </label>
        <label>
          Image: <input type="file" accept="image/*" name="image" id="image" />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
