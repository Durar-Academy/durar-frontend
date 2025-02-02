"use client";

import axios from "axios";

import { storeAuthData, retrieveAuthData } from "./storage";
import { refreshAccessToken } from "./auth";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10_000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const [accessToken] = retrieveAuthData();
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.config) {
      console.error("Request configuration not found:", error);
      return Promise.reject(error);
    }

    const originalConfig = error.config;

    if (originalConfig.retried === undefined) originalConfig.retried = false;

    if (error.response) {
      if (error.response.status === 401 && !originalConfig.retried) {
        originalConfig.retried = true;

        const [, refreshToken] = retrieveAuthData();

        if (!refreshToken) {
          console.error("No refresh token found.");
          window.location.href = "/auth";
          return Promise.reject(error);
        }

        try {
          const response = await refreshAccessToken({ refreshToken });

          if (!response.success) throw new Error("Unable to refresh Access Token.");

          storeAuthData(response.data.accessToken, refreshToken);
          return axiosInstance(originalConfig);
        } catch (error) {
          console.error("Refresh Token Error:", error);
          window.location.href = "/auth";
          return Promise.reject(error);
        }
      }
    }

    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error("Forbidden: You do not have permission to access this resource.");
          break;
        case 500:
          console.error("Server Error: Something went wrong on the server.");
          break;
        default:
          console.error("An error occurred:", error.message);
      }
    } else if (error.request) {
      console.error("Network Error: No response received from the server.");
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (!error.config) {
//       return Promise.reject(error);
//     }

//     const originalConfig = error.config;
//     if (originalConfig.retried === undefined) originalConfig.retried = false;

//     if (error.response?.status === 401 && !originalConfig.retried) {
//       originalConfig.retried = true;

//       try {
//         // Just call refresh endpoint - cookies handled automatically
//         const response = await refreshAccessToken();
//         if (!response.success) throw new Error("Unable to refresh Access Token.");

//         return axiosInstance(originalConfig);
//       } catch (error) {
//         window.location.href = "/auth";
//         return Promise.reject(error);
//       }
//     }

//     // Error handling
//     if (error.response) {
//       const messages = {
//         403: "Forbidden: You do not have permission to access this resource.",
//         500: "Server Error: Something went wrong on the server.",
//       };
//       console.error(messages[error.response.status] || `An error occurred: ${error.message}`);
//     } else if (error.request) {
//       console.error("Network Error: No response received from the server.");
//     } else {
//       console.error("Error:", error.message);
//     }

//     return Promise.reject(error);
//   }
// );
