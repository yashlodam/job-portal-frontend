import axios from "axios";

const BASE_URL = "http://localhost:8080/users";

export const registerUser = async (user) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/register`,
      user
    );

    console.log("User registered successfully", response.data);

    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);

    if (error.response) {
      // Server responded with an error
      throw error.response.data;
    } else if (error.request) {
      // Request was sent but no response received
      throw {
        message: "No response from server. Please try again later.",
      };
    } else {
      // Something else happened
      throw {
        message: error.message,
      };
    }
  }
};


export const loginUser = async (login) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      login
    );

    console.log("Login successful", response.data);

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);

    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw {
        message: "No response from server. Please try again later.",
      };
    } else {
      throw {
        message: error.message,
      };
    }
  }
};