const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

let unauthorizedHandler;

export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = undefined;
    }
  };
}

const api = async (endpoint, options = {}) => {
  const { auth = true, headers: requestHeaders, ...fetchOptions } = options;
  const token = auth ? localStorage.getItem("cura_token") : null;
  const headers = {
    Accept: "application/json",
    ...(fetchOptions.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...requestHeaders,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new ApiError(
          "The server returned an invalid response.",
          { status: response.status }
        );
      }
    }
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem("cura_token");
      localStorage.removeItem("cura_user");
      unauthorizedHandler?.();
    }

    throw new ApiError(
      data?.message ||
        "Something went wrong while communicating with the server.",
      {
        status: response.status,
        errors: data?.errors,
      }
    );
  }

  return data;
};

export default api;
