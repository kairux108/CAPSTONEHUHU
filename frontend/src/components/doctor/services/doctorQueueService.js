
import api from "../../../shared/services/api";

/*
|--------------------------------------------------------------------------
| CURA - Doctor Queue Service
|--------------------------------------------------------------------------
*/

const doctorQueueService = {
  getQueue({ page = 1, signal } = {}) {
    return api(
      `/doctor/queue?page=${encodeURIComponent(page)}`,
      {
        method: "GET",
        signal,
      }
    );
  },
};

export default doctorQueueService;
