import api from "../../../shared/services/api";

const vitalSignService = {
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
      `/vital-signs${query ? `?${query}` : ""}`
    );
  },

  getById(id) {
    return api(`/vital-signs/${id}`);
  },

  create(data) {
    return api("/vital-signs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return api(`/vital-signs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

export default vitalSignService;