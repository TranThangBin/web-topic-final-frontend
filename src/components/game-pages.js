import { useState } from "react";
import { useParams } from "react-router";

export function GameHomePage() {
  const [games, setGames] = useState([]);

  return (
    <div>
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game}</li>
        ))}
      </ul>
    </div>
  );
}

export function GameAddPage() {
  return (
    <div>
      <form>
        <label>
          Category:{" "}
          <select name="category" id="category">
            <option value=""></option>
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
  const [game, setGame] = useState({});

  return (
    <div>
      <div>{game}</div>
      <form>
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
