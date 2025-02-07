import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ContextData } from "../App";
import { usePost } from "../hooks/Requests";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import Axios from "axios";
import Config from "../../config.json";

const schema = Joi.object({
  username: Joi.string().required().messages({ 'any.required': 'Username is required.' }),
  password: Joi.string().required().messages({ 'any.required': "Password is required." })
});

const Login = () => {
  const { setUserData, setActive } = useContext(ContextData);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const postRequest = async payload => {
    const serverOrigin = Config.production ? Config.server : Config.devServer;
    const token = localStorage.getItem("token");
    const { data } = await Axios.post(`${serverOrigin}/login`, payload, {
      headers: {
        Authentication: `Bearer ${token}`
      }
    });

    return data;
  };

  const { loading, data, error, postData } = usePost("/login");
  const {
    mutateAsync: login,
    data: loginData,
    isPending,
    error: loginError
  } = useMutation({
    mutationFn: postRequest
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: joiResolver(schema) });

  const onSubmit = credentials => {
    try {
      // postData(credentials);
      login(credentials);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setActive({});
  }, []);

  useEffect(() => {
    if (loginData?.success) {
      setUserData(loginData.response);
      localStorage.setItem("token", loginData.response.token);
      navigate("/");
    }
  }, [data]);

  return (
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>
        <label>
          Username:
          <input {...register("username")} type="text" />
          {errors.username && <p>{errors.username.message}</p>}
          {loginData?.response?.error?.username && <p>User not found.</p>}
        </label>
        <label>
          Password:
          <input {...register("password")} type="password" />
          {errors.password && <p>{errors.password.message}</p>}
          {loginData?.response?.error?.password && <p>Incorrect password.</p>}
        </label>
        <div className="remember">
          <input type="checkbox" />
          Remember me
        </div>
        <button>{isPending ? "Logging in..." : "Login"}</button>
        {loginError && <p>Something went wrong.</p>}
        <div className="option">
          <p>Don't have an account? </p>
          <Link to="/signup">Signup</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
