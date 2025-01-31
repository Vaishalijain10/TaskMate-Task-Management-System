import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/NewLogo.png";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import ProfileViewAndEdit from "./ProfileViewAndEdit";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [showProfile, setShowProfile] = useState(false);
  let logoutTimer;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    toast.success("Logged out!");
    navigate("/");
  };

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(handleLogout, 20 * 60 * 1000); // 20 minutes
  };

  useEffect(() => {
    if (token && userId) {
      resetLogoutTimer(); // Start the logout timer

      // Reset timer on user activity
      window.addEventListener("mousemove", resetLogoutTimer);
      window.addEventListener("keydown", resetLogoutTimer);

      // Logout when the tab is closed
      window.addEventListener("beforeunload", handleLogout);

      return () => {
        clearTimeout(logoutTimer);
        window.removeEventListener("mousemove", resetLogoutTimer);
        window.removeEventListener("keydown", resetLogoutTimer);
        window.removeEventListener("beforeunload", handleLogout);
      };
    }
  }, [handleLogout, logoutTimer, resetLogoutTimer, token, userId]);

  return (
    <>
      <nav className="bg-[#A9C46C] text-white p-4 flex justify-between fixed top-0 left-0 w-full h-16 shadow-md">
        <div className="p-4 flex items-center gap-4">
          <img
            src={logo}
            alt="Logo"
            className="h-[50px] w-[50px] rounded-full shadow-sm"
          />
          <Link
            to="/home"
            className="text-lg font-bold text-black tracking-widest"
          >
            TaskMate - Motivate, Collaborate, and Create!
          </Link>
        </div>

        {token && userId && (
          <div className="mr-3 flex items-center gap-4">
            <button
              onClick={() => setShowProfile(true)}
              className="bg-green-500 px-3 py-2 rounded hover:bg-green-700"
            >
              <FaUserAlt className="h-6" />
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-2 rounded hover:bg-red-700"
            >
              <RiLogoutCircleRLine className="h-6" />
            </button>
          </div>
        )}
      </nav>

      {showProfile && userId && (
        <ProfileViewAndEdit
          userId={userId}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
};

export default Navbar;
