import api from "../../../shared/services/api";

const queueService = {
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

    return api(`/queue${query ? `?${query}` : ""}`);
  },

  getById(id) {
    return api(`/queue/${id}`);
  },

  create(data) {
    return api("/queue", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return api(`/queue/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

export default queueService;