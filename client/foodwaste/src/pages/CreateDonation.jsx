import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonation } from "../services/donationService";

function CreateDonation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodTitle: "",
    foodType: "",
    quantity: "",
    servesPeople: "",
    cookedTime: "",
    expiryTime: "",
    pickupAddress: "",
    urgencyLevel: "normal"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createDonation(formData);

      alert("Donation Created Successfully");

      navigate("/dashboard");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Donation Creation Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 shadow-lg rounded-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Donation
        </h1>

        <input
          type="text"
          name="foodTitle"
          placeholder="Food Title"
          value={formData.foodTitle}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="text"
          name="foodType"
          placeholder="Food Type"
          value={formData.foodType}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="number"
          name="servesPeople"
          placeholder="Serves People"
          value={formData.servesPeople}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="text"
          name="cookedTime"
          placeholder="Cooked Time"
          value={formData.cookedTime}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="text"
          name="expiryTime"
          placeholder="Expiry Time"
          value={formData.expiryTime}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="text"
          name="pickupAddress"
          placeholder="Pickup Address"
          value={formData.pickupAddress}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full p-3 border rounded font-semibold"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
}

export default CreateDonation;