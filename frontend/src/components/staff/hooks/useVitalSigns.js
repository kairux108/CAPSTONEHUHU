import { useCallback, useState } from "react";
import vitalSignService from "../services/vitalSignService";

const useVitalSigns = () => {
  const [vitalSigns, setVitalSigns] = useState([]);
  const [selectedVitalSign, setSelectedVitalSign] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const loadVitalSigns = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const data = await vitalSignService.getAll(params);

      setVitalSigns(data.vital_signs || []);
      setPagination(
        data.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
        }
      );

      return data;
    } catch (error) {
      console.error("Failed to load vital signs:", error);
      setError(error.message || "Unable to load vital signs.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadVitalSign = useCallback(async (id) => {
    try {
      setLoading(true);
      setError("");

      const data = await vitalSignService.getById(id);
      const vitalSign = data.vital_sign || data;

      setSelectedVitalSign(vitalSign);

      return vitalSign;
    } catch (error) {
      console.error("Failed to load vital sign:", error);
      setError(error.message || "Unable to load vital sign.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createVitalSign = async (formData) => {
    try {
      setSaving(true);
      setError("");

      const data = await vitalSignService.create(formData);
      const vitalSign = data.vital_sign || data;

      setSelectedVitalSign(vitalSign);

      setVitalSigns((current) => [
        vitalSign,
        ...current.filter((item) => item.id !== vitalSign.id),
      ]);

      return vitalSign;
    } catch (error) {
      console.error("Failed to record vital signs:", error);
      setError(error.message || "Unable to record vital signs.");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateVitalSign = async (id, formData) => {
    try {
      setSaving(true);
      setError("");

      const data = await vitalSignService.update(id, formData);
      const vitalSign = data.vital_sign || data;

      setSelectedVitalSign(vitalSign);

      setVitalSigns((current) =>
        current.map((item) =>
          item.id === vitalSign.id ? vitalSign : item
        )
      );

      return vitalSign;
    } catch (error) {
      console.error("Failed to update vital signs:", error);
      setError(error.message || "Unable to update vital signs.");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  return {
    vitalSigns,
    selectedVitalSign,
    setSelectedVitalSign,

    loading,
    saving,
    error,
    pagination,

    loadVitalSigns,
    loadVitalSign,
    createVitalSign,
    updateVitalSign,
    clearError,
  };
};

export default useVitalSigns;