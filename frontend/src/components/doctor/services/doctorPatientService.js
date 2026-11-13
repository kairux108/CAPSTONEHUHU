
import api from "../../../shared/services/api";

/*
|--------------------------------------------------------------------------
| CURA - Doctor Patient Service
|--------------------------------------------------------------------------
|
| Retrieves patients assigned to the authenticated
| doctor through the doctor-specific Laravel API.
|
| Does not use the clinic-wide /patients endpoint.
|
*/

const doctorPatientService = {
  getAll(params = {}, signal) {
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
      `/doctor/patients${query ? `?${query}` : ""}`,
      {
        method: "GET",
        signal,
      }
    );
  },
};

export default doctorPatientService;
