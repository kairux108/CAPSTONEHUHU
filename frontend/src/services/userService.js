import api from "./api";

const userService = {
  getAll() {
    return api("/users");
  },

  getById(id) {
    return api(`/users/${id}`);
  },

  create(data) {
    return api("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return api(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  remove(id) {
    return api(`/users/${id}`, {
      method: "DELETE",
    });
  },
};

export default userService;