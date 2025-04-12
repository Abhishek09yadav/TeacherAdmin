"use client";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaRegTired } from "react-icons/fa";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance
            .post("/auth/login", { email: username, password })
            .then((response) => {
                if (response.data) {
                    if (response.data.user.role === "admin") {
                        console.log(response.data);
                        localStorage.setItem(
                            "teacher-admin-username",
                            response.data.user._id
                        );
                        window.location.href = "/";
                    } else {
                        console.log(response.data);
                        toast.error(
                            "You are not authorized to access this page. Only admins can log in."
                        );
                    }
                } else {
                    toast.error("Invalid username or password");
                }
            })

            .catch((error) => {
                console.error("Error logging in:", error.response.data.error);
                toast.error(`${error.response.data.error}`);
            });
        // if (username === "admin" && password === "admin@123") {
        //   localStorage.setItem("teacher-admin-username", username);
        //   // router.push("/");
        //   window.location.href = "/";

        // } else {
        //   alert("Invalid username or password");
        // }
    };
    useEffect(() => {
        axiosInstance
            .get("/")
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login Admin</h2>
          {loading ? (
            <p className="text-center items-center justify-center flex flex-col">
              <FiLoader className="text-center text-4xl text-blue-500 mt-4 animate-spin" />
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email:
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4 text-right">
                <button
                  type="button"
                  onClick={() =>
                    router.push("/teachers/reset-password?redirectToLogin=true")
                  }
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
              >
                Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
};

export default Login;
