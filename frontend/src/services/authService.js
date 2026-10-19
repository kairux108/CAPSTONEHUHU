import api from "./api";

const authService = {
  login(credentials) {
    return api("/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify(credentials),
    });
  },

  getCurrentUser() {
    return api("/user");
  },
};

export default authService;