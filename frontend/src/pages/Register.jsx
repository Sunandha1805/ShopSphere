import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
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
            await registerUser(formData);
            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Progress: count how many fields have a value
    const filledCount = Object.values(formData).filter((v) => v.trim()).length;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-100 px-4 py-10 font-[Inter,sans-serif]">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-teal-100 overflow-hidden">

                {/* Header */}
                <div className="relative bg-gradient-to-br from-teal-600 to-cyan-600 px-10 py-9 text-center overflow-hidden">
                    {/* Decorative circles */}
                    <span className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
                    <span className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

                    <p className="relative text-xs font-bold tracking-widest text-white/80 uppercase mb-2">
                        ShopSphere
                    </p>
                    <h1 className="relative text-3xl font-extrabold text-white tracking-tight">
                        Create account
                    </h1>
                    <p className="relative mt-1.5 text-sm text-white/70">
                        Join thousands of happy shoppers
                    </p>
                </div>

                {/* Body */}
                <div className="px-10 py-9">

                    {/* Progress bar */}
                    <div className="flex gap-1.5 mb-7">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                                    filledCount > i ? "bg-teal-500" : "bg-gray-200"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* First & Last Name — side by side */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="register-first-name"
                                    className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide"
                                >
                                    First Name
                                </label>
                                <input
                                    id="register-first-name"
                                    type="text"
                                    name="first_name"
                                    placeholder="Jane"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="register-last-name"
                                    className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide"
                                >
                                    Last Name
                                </label>
                                <input
                                    id="register-last-name"
                                    type="text"
                                    name="last_name"
                                    placeholder="Doe"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="register-email"
                                className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide"
                            >
                                Email Address
                            </label>
                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="register-password"
                                className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide"
                            >
                                Password
                            </label>
                            <input
                                id="register-password"
                                type="password"
                                name="password"
                                placeholder="Min. 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            id="register-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-xl text-sm tracking-wide transition-all duration-200 shadow-lg shadow-teal-500/30 disabled:shadow-none disabled:cursor-not-allowed mt-1"
                        >
                            {loading ? "Creating Account…" : "Register"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                            Already a member?
                        </span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-teal-600 font-bold hover:text-teal-700 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;