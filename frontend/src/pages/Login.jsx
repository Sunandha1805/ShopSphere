import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await loginUser(formData);
            console.log(data);
            login(data.data, data.token);
            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-100 px-4 py-10 font-[Inter,sans-serif]">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-teal-100 overflow-hidden">

                {/* Header */}
                <div className="relative bg-gradient-to-br from-teal-600 to-cyan-600 px-10 py-9 text-center overflow-hidden">
                    {/* Decorative circles */}
                    <span className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
                    <span className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

                    <p className="relative text-xs font-bold tracking-widest text-white/80 uppercase mb-2">
                        ShopSphere
                    </p>
                    <h1 className="relative text-3xl font-extrabold text-white tracking-tight">
                        Welcome back
                    </h1>
                    <p className="relative mt-1.5 text-sm text-white/70">
                        Sign in to continue shopping
                    </p>
                </div>

                {/* Body */}
                <div className="px-10 py-9">

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="login-email"
                                className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide"
                            >
                                Email Address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="login-password"
                                className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide"
                            >
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-xl text-sm tracking-wide transition-all duration-200 shadow-lg shadow-teal-500/30 disabled:shadow-none disabled:cursor-not-allowed mt-1"
                        >
                            {loading ? "Signing in…" : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                            New to ShopSphere?
                        </span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-teal-600 font-bold hover:text-teal-700 transition-colors"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;