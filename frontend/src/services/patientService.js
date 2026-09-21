const STORAGE_KEY = "cura_patients";

const defaultPatients = [
  {
    id: 1,
    patientNumber: "CURA-0001",
    firstName: "Maria",
    middleName: "Reyes",
    lastName: "Santos",
    sex: "Female",
    birthDate: "1990-04-14",
    contactNumber: "09171234567",
    email: "maria@example.com",
    address: "Tagum City, Davao del Norte",
    bloodType: "O+",
    civilStatus: "Married",
    emergencyContact: "Juan Santos",
    emergencyNumber: "09181234567",
    status: "Active",
    lastVisit: "2026-09-18",
  },
  {
    id: 2,
    patientNumber: "CURA-0002",
    firstName: "John",
    middleName: "Flores",
    lastName: "Dela Cruz",
    sex: "Male",
    birthDate: "1987-08-21",
    contactNumber: "09192345678",
    email: "john@example.com",
    address: "Visayan Village, Tagum City",
    bloodType: "A+",
    civilStatus: "Single",
    emergencyContact: "Anna Dela Cruz",
    emergencyNumber: "09202345678",
    status: "Active",
    lastVisit: "2026-09-19",
  },
  {
    id: 3,
    patientNumber: "CURA-0003",
    firstName: "Angela",
    middleName: "Torres",
    lastName: "Reyes",
    sex: "Female",
    birthDate: "1998-12-03",
    contactNumber: "09213456789",
    email: "angela@example.com",
    address: "Apokon, Tagum City",
    bloodType: "B+",
    civilStatus: "Single",
    emergencyContact: "Mario Reyes",
    emergencyNumber: "09223456789",
    status: "Active",
    lastVisit: "2026-09-17",
  },
];

const loadPatients = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultPatients)
    );

    return defaultPatients;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return defaultPatients;
  }
};

const savePatients = (patients) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(patients)
  );
};

const patientService = {
  getAll() {
    return loadPatients();
  },

  create(patient) {
    const patients = loadPatients();

    const nextId =
      patients.length > 0
        ? Math.max(...patients.map((p) => p.id)) + 1
        : 1;

    const newPatient = {
      ...patient,
      id: nextId,
      patientNumber: `CURA-${String(nextId).padStart(4, "0")}`,
      status: "Active",
      lastVisit: "No visit yet",
    };

    const updated = [
      newPatient,
      ...patients,
    ];

    savePatients(updated);

    return newPatient;
  },

  update(id, data) {
    const patients = loadPatients();

    const updated = patients.map((patient) =>
      patient.id === id
        ? {
            ...patient,
            ...data,
          }
        : patient
    );

    savePatients(updated);

    return updated.find((patient) => patient.id === id);
  },

  delete(id) {
    const patients = loadPatients();

    const updated = patients.filter(
      (patient) => patient.id !== id
    );

    savePatients(updated);
  },
};

export default patientService;