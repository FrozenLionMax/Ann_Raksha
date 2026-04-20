import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
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
      "ProtectedRoute parse error:",
      error
    );

    localStorage.removeItem("userInfo");
    userInfo = null;
  }

  return userInfo ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}