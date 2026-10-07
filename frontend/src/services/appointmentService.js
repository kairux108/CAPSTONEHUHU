import api from "./api";

const appointmentService = {
  getAll(params = {}) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== ""
      )
    );

    const query = new URLSearchParams(cleanParams).toString();

    return api(`/appointments${query ? `?${query}` : ""}`);
  },

  getById(id) {
    return api(`/appointments/${id}`);
  },

  create(data) {
    return api("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return api(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  checkIn(id) {
    return api(`/appointments/${id}/check-in`, {
      method: "PATCH",
    });
  },
};

export default appointmentService;