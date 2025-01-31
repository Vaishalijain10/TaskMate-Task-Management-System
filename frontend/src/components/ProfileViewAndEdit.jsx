import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { editUserDetails, getUserDetails } from "../services/authService";

const ProfileViewAndEdit = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",

    profilePhoto: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Fetching user details...");
      const res = await getUserDetails(userId);
      if (res.status) {
        setUser(res.user);
        setFormData({
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          email: res.user.email,
          phoneNumber: res.user.phoneNumber,
          profilePhoto: res.user.profilePhoto,
        });
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await editUserDetails(userId, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
    });

    if (res.status) {
      setUser({ ...user, ...formData });
      setEditMode(false);
    }
    setLoading(false);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="fixed inset-0 grid place-items-center bg-black bg-opacity-80 h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]  max-h-[68vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Profile Details</h2>

        <form className="space-y-4">
          {/* Profile Photo */}
          <div className="flex justify-center">
            <img
              src={formData.profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full border"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full p-2 border bg-gray-200 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>
        </form>

        <div className="mt-4 flex justify-between">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ProfileViewAndEdit.propTypes = {
  userId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfileViewAndEdit;
