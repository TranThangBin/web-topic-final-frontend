import { Link } from "react-router";

export function LoginPage() {
  return (
    <div>
      <form>
        <label>
          Username: <input type="text" name="username" id="username" />
        </label>
        <label>
          Password: <input type="password" name="password" id="password" />
        </label>
        <button type="submit">Login</button>
      </form>
      <Link to="/register">Don't have an account?</Link>
    </div>
  );
}

export function RegisterPage() {
  return (
    <div>
      <form>
        <label>
          Username: <input type="text" name="username" id="username" />
        </label>
        <label>
          Password: <input type="password" name="password" id="password" />
        </label>
        <label>
          Confirm password:{" "}
          <input
            type="confirmPassword"
            name="confirmPassword"
            id="confirmPassword"
          />
        </label>
        <button type="submit">Register</button>
      </form>
      <Link to="/">Already have an account?</Link>
    </div>
  );
}
