import api from "./api";

const patientService = {
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

    return api(
      `/patients${query ? `?${query}` : ""}`
    );
  },

  getById(id) {
    return api(`/patients/${id}`);
  },

  create(data) {
    return api("/patients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return api(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

export default patientService;