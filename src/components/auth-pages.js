import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const loginData = new FormData(e.currentTarget);
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/auth/login`,
              Object.fromEntries(loginData),
              { withCredentials: true },
            );

            navigate("/game");
          } catch (err) {
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
        }}
      >
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
  const navigate = useNavigate();

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const registerData = new FormData(e.currentTarget);
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/auth/register`,
              Object.fromEntries(registerData),
            );

            navigate("/");
          } catch (err) {
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
        }}
      >
        <label>
          Username: <input type="text" name="username" id="username" />
        </label>
        <label>
          Password: <input type="password" name="password" id="password" />
        </label>
        <label>
          Confirm password:{" "}
          <input type="password" name="confirmPassword" id="confirmPassword" />
        </label>
        <button type="submit">Register</button>
      </form>
      <Link to="/">Already have an account?</Link>
    </div>
  );
}
