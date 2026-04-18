import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(
          localStorage.getItem("userInfo")
        );

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          config
        );

        setUser(response.data.user);
      } catch (error) {
        console.log(error);
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="p-10">
        <h1>Loading Profile...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="border px-5 py-2 rounded-xl"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <div>
            <p className="text-gray-500">
              Full Name
            </p>
            <h2 className="text-xl font-semibold">
              {user.name}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">
              Email
            </p>
            <h2 className="text-xl font-semibold">
              {user.email}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">
              Phone
            </p>
            <h2 className="text-xl font-semibold">
              {user.phone || "Not Added"}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">
              Role
            </p>
            <h2 className="text-xl font-semibold capitalize">
              {user.role}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">
              Organization
            </p>
            <h2 className="text-xl font-semibold">
              {user.organizationName || "Not Added"}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">
              Verification Status
            </p>
            <h2 className="text-xl font-semibold">
              {user.verificationStatus
                ? "Verified ✅"
                : "Pending ⏳"}
            </h2>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;