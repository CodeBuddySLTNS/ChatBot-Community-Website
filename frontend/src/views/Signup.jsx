import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ContextData } from "../App";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation } from "@tanstack/react-query";
import { useMainStore } from "../store";
import Joi from "joi";
import Axios from "../utils/Axios";
import Config from "../../config.json";

const schema = Joi.object({
  name: Joi.string().min(3).max(20).label("Name").required(),
  img: Joi.string().label("User Photo"),
  username: Joi.string().min(3).max(15).label("Username").required(),
  password: Joi.string().min(6).label("Password").required()
});

const Signup = () => {
  const { setActive } = useContext(ContextData);
  const [signupError, setSignupError] = useState(null);
  const setUser = useMainStore(state => state.setUser);
  const navigate = useNavigate();

  const postRequest = async payload => {
    const response = await Axios.post(`/signup`, payload);

    return response.data;
  };

  const {
    mutateAsync: signup,
    data: signupData,
    isPending,
    error
  } = useMutation({ mutationFn: postRequest });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: joiResolver(schema) });

  const onSubmit = data => {
    signup(data);
  };

  useEffect(() => {
    setActive({});
  }, []);

  useEffect(() => {
    if (signupData?.success) {
      setUser(signupData.response);
      localStorage.setItem("token", signupData.response.token);
      setTimeout(function () {
        navigate("/");
      }, 1000);
    }
  }, [signupData]);

  useEffect(() => {
    if (error) {
      setSignupError(error.response?.data);
    }
  }, [error]);

  return (
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Signup</h2>
        <label>
          Name:
          <input type="text" {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </label>
        <label>
          User Photo (imgur/optional):
          <input type="text" {...register("img")} />
          {errors.img && <p>{errors.img.message}</p>}
        </label>
        <label>
          Username:
          <input type="text" {...register("username")} />
          {errors.username && <p>{errors.username.message}</p>}
          {signupError?.errors?.username && <p>Username already exist.</p>}
        </label>
        <label>
          Password:
          <input type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </label>
        <button disabled={isPending}>
          {isPending ? "Signing in..." : "Signup"}
        </button>
        {signupError?.errors?.server && <p>Something went wrong.</p>}
        {error?.code === "ERR_NETWORK" && <p>Network timeout.</p>}
        <div className="option">
          <p>Already have an account? </p>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
