const Notification = require("../models/Notification");

const createNotification = async (
  userId,
  title,
  description,
  type = "general"
) => {
  try {
    await Notification.create({
      userId,
      title,
      description,
      type,
    });
  } catch (error) {
    console.log("Notification Error:", error);
  }
};

module.exports = {
  createNotification,
};