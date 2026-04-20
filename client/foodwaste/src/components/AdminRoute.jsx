import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({
  children,
}) {
  let userInfo = null;

  try {
    const storedUser =
      localStorage.getItem("userInfo");

    if (
      storedUser &&
      storedUser !== "undefined" &&
      storedUser !== "null"
    ) {
      userInfo = JSON.parse(storedUser);
    }
  } catch (error) {
    console.log(
      "AdminRoute parse error:",
      error
    );

    localStorage.removeItem("userInfo");
    userInfo = null;
  }

  if (!userInfo) {
    return (
      <Navigate to="/login" replace />
    );
  }

  if (userInfo.role !== "admin") {
    return (
      <Navigate to="/dashboard" replace />
    );
  }

  return children;
}