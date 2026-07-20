import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../services/authService";
import { FiUser, FiMail, FiPhone, FiCalendar, FiClock, FiActivity, FiUserCheck } from "react-icons/fi";

const Profile = () => {
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getCurrentUser();
                setProfile(data.data);
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <FiUser size={36} className="text-teal-600 opacity-50" />
                <p className="text-gray-500 text-sm">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-red-600 text-sm">Failed to load profile.</p>
            </div>
        );
    }

    const ProfileItem = ({ icon, label, value }) => (
        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-teal-600 shadow-sm flex-shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    {label}
                </p>
                <p className="text-gray-800 font-medium">{value || "Not provided"}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-500">Manage your personal information and settings.</p>
                </div>
                <button
                    onClick={logout}
                    className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar Card */}
                <div className="md:col-span-1">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-teal-100 border-4 border-white shadow-md flex items-center justify-center mb-4">
                            <span className="text-3xl font-bold text-teal-700">
                                {profile.first_name?.charAt(0).toUpperCase()}
                                {profile.last_name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {profile.first_name} {profile.last_name}
                        </h2>
                        <div className="flex items-center justify-center gap-1.5 text-sm text-teal-600 font-medium bg-teal-50 px-3 py-1 rounded-full mb-6">
                            <FiUserCheck size={14} />
                            {profile.account_status}
                        </div>
                        <p className="text-xs text-gray-400">
                            Member since {new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                        </p>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FiActivity className="text-teal-600" />
                            Personal Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ProfileItem
                                icon={<FiUser size={18} />}
                                label="Full Name"
                                value={`${profile.first_name} ${profile.last_name}`}
                            />
                            <ProfileItem
                                icon={<FiMail size={18} />}
                                label="Email Address"
                                value={profile.email}
                            />
                            <ProfileItem
                                icon={<FiPhone size={18} />}
                                label="Phone Number"
                                value={profile.phone}
                            />
                            <ProfileItem
                                icon={<FiUser size={18} />}
                                label="Gender"
                                value={profile.gender}
                            />
                            <ProfileItem
                                icon={<FiCalendar size={18} />}
                                label="Date of Birth"
                                value={
                                    profile.date_of_birth
                                        ? new Date(profile.date_of_birth).toLocaleDateString("en-US", {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : null
                                }
                            />
                            <ProfileItem
                                icon={<FiClock size={18} />}
                                label="Last Login"
                                value={
                                    profile.last_login
                                        ? new Date(profile.last_login).toLocaleString("en-US", {
                                              day: "numeric",
                                              month: "short",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "Never"
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;