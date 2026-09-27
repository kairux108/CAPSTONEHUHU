import api from "./api";

const staffService = {
  /**
   * Get all staff members
   */
  getAll() {
    return api("/staff");
  },

  /**
   * Get one staff member
   */
  getById(id) {
    return api(`/staff/${id}`);
  },

  /**
   * Create staff account + profile
   */
  create(data) {
    return api("/staff", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update staff member
   */
  update(id, data) {
    return api(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Deactivate staff member
   */
  deactivate(id) {
    return api(`/staff/${id}`, {
      method: "DELETE",
    });
  },
};

export default staffService;