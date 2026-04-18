import { useEffect, useState } from "react";
import {
  getAllDonations,
  claimDonation,
  completeDonation,
} from "../services/donationService";

function BrowseDonations() {
  const [donations, setDonations] = useState([]);

  const fetchDonations = async () => {
    try {
      const data = await getAllDonations();
      setDonations(data.donations);
    } catch (error) {
      alert("Failed to fetch donations");
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleClaim = async (id) => {
    try {
      await claimDonation(id);
      alert("Donation Claimed Successfully");
      fetchDonations();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Claim Failed"
      );
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeDonation(id);
      alert("Donation Marked Completed");
      fetchDonations();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Complete Failed"
      );
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Browse Donations
      </h1>

      {donations.length === 0 ? (
        <p>No donations available</p>
      ) : (
        donations.map((donation) => (
          <div
            key={donation._id}
            className="border p-5 rounded mb-4"
          >
            <h2 className="text-xl font-bold">
              {donation.foodTitle}
            </h2>

            <p>Type: {donation.foodType}</p>
            <p>Quantity: {donation.quantity}</p>
            <p>Serves: {donation.servesPeople}</p>
            <p>Status: {donation.status}</p>
            <p>Pickup: {donation.pickupAddress}</p>
            <p>Urgency: {donation.urgencyLevel}</p>

            {donation.status === "available" && (
              <button
                onClick={() => handleClaim(donation._id)}
                className="p-3 border rounded mt-4 mr-3"
              >
                Claim Donation
              </button>
            )}

            {donation.status === "claimed" && (
              <button
                onClick={() => handleComplete(donation._id)}
                className="p-3 border rounded mt-4"
              >
                Mark Complete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default BrowseDonations;