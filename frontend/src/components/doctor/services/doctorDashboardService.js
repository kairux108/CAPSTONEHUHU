
import api from "../../../shared/services/api";

const doctorDashboardService = {
  getDashboard(options = {}) {
    return api("/doctor/dashboard", options);
  },
};

export default doctorDashboardService;
