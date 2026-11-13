
import api from "../../../shared/services/api";

/*
|--------------------------------------------------------------------------
| CURA - Doctor Queue Service
|--------------------------------------------------------------------------
*/

const doctorQueueService = {
  // Retrieve the authenticated doctor's queue.
  getQueue({ page = 1, signal } = {}) {
    return api(
      `/doctor/queue?page=${encodeURIComponent(page)}`,
      {
        method: "GET",
        signal,
      }
    );
  },

  // Call the next eligible waiting patient.
  // The backend determines which patient to call.
  callNextPatient() {
    return api("/doctor/queue/call-next", {
      method: "POST",
    });
  },
};

export default doctorQueueService;
