const API_URL = "http://127.0.0.1:8000/api";

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("cura_token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong while communicating with the server."
    );
  }

  return data;
};

export default api;