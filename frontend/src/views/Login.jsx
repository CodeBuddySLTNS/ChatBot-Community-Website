import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ContextData } from "../App";
import { useMainStore } from "../store";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import Axios from "../utils/Axios";
import Config from "../../config.json";

const schema = Joi.object({
  username: Joi.string()
    .label("Username")
    .required()
    .messages({ "any.required": "Username is required." }),
  password: Joi.string()
    .label("Password")
    .required()
    .messages({ "any.required": "Password is required." })
});

const Login = () => {
  const { setActive } = useContext(ContextData);
  const [loginError, setLoginError] = useState(null);
  const setUser = useMainStore(state => state.setUser);
  const navigate = useNavigate();

  const postRequest = async payload => {
    const response = await Axios.post(`/login`, payload);

    return response.data;
  };

  const {
    mutateAsync: login,
    data: loginData,
    isPending,
    error
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
      setUser(loginData.response);
      localStorage.setItem("token", loginData.response.token);
      navigate("/");
    }
  }, [loginData]);

  useEffect(() => {
    if (error) {
      setLoginError(error.response?.data);
    }
  }, [error]);

  return (
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>
        <label>
          Username:
          <input {...register("username")} type="text" />
          {errors.username && <p>{errors.username.message}</p>}
          {loginError?.errors?.username && <p>User not found.</p>}
        </label>
        <label>
          Password:
          <input {...register("password")} type="password" />
          {errors.password && <p>{errors.password.message}</p>}
          {loginError?.errors?.password && <p>Incorrect password.</p>}
        </label>
        <div className="remember">
          <input type="checkbox" />
          Remember me
        </div>
        <button disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </button>
        {loginError?.errors?.server && <p>Something went wrong.</p>}
        {error?.code === "ERR_NETWORK" && <p>Network timeout.</p>}
        <div className="option">
          <p>Don't have an account? </p>
          <Link to="/signup">Signup</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
