import React, { useEffect, useState } from "react";

function App() {
  const [csrf, setCsrf] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getCSRF = () => {
    fetch("http://localhost:8000/api/csrf/", {
      credentials: "include",
    })
      .then((res) => {
        let csrfToken = res.headers.get("X-CSRFToken");
        setCsrf(csrfToken);
        console.log(csrfToken);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSession = () => {
    fetch("http://localhost:8000/api/session/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          getCSRF();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const whoami = () => {
    fetch("http://localhost:8000/api/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("You are logged in as: " + data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  };

  const isResponseOk = (response) => {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  };

  const login = (event) => {
    event.preventDefault();
    fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(true);
        setUsername("");
        setPassword("");
        setError("");
      })
      .catch((err) => {
        setError("Wrong username or password.");
      });
  };

  const logout = () => {
    fetch("http://localhost:8000/api/logout", {
      credentials: "include",
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(false);
        getCSRF();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getSession();
  }, []);

  if (isAuthenticated) {
    return (
      <div className="container mt-3">
        <h1>React Cookie Auth</h1>
        <br />
        <h2>Login</h2>
        <form onSubmit={login}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={username}
              onChange={handleUserNameChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <div>{error && <small className="text-danger">{error}</small>}</div>
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    );
  }
  return (
    <div className="container mt-3">
      <h1>React Cookie Auth</h1>
      <p>You are logged in!</p>
      <button className="btn btn-primary mr-2" onClick={whoami}>
        WhoAmI
      </button>
      <button className="btn btn-danger" onClick={logout}>
        Log out
      </button>
    </div>
  );
}

export default App;
