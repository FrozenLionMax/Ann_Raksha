import { useEffect, useState } from "react";
import { getMyDonations } from "../services/donationService";

function MyDonations() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getMyDonations();
        setDonations(data.donations);
      } catch (error) {
        alert("Failed to fetch donations");
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        My Donations
      </h1>

      {donations.length === 0 ? (
        <p>No donations found</p>
      ) : (
        donations.map((donation) => (
          <div
            key={donation._id}
            className="border p-4 rounded mb-4"
          >
            <h2 className="text-xl font-semibold">
              {donation.foodTitle}
            </h2>

            <p>Quantity: {donation.quantity}</p>
            <p>Status: {donation.status}</p>
            <p>Urgency: {donation.urgencyLevel}</p>
            <p>Pickup: {donation.pickupAddress}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyDonations;