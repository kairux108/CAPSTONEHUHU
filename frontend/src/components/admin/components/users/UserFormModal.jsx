import { Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";

const UserFormModal = ({ open, user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    status: "active",
    position: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(user);

  useEffect(() => {
    if (!open) return;

    setForm({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "staff",
      status: user?.status || "active",
      position: user?.staff_profile?.position || "",
    });

    setError("");
    setShowPassword(false);
  }, [open, user]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "role" && value !== "staff" ? { position: "" } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (form.role === "staff" && !form.position.trim()) {
      setError("Position is required for staff.");
      return;
    }

    if ((!isEditing || form.password) && form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setSaving(true);

      const data = { ...form };

      if (isEditing && !data.password) delete data.password;
      if (data.role !== "staff") delete data.position;

      await onSave(data);
    } catch (error) {
      setError(error.message || "Unable to save user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="user-modal-backdrop" onMouseDown={onClose}>
      <div
        className="user-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="user-modal-header">
          <div>
            <h2>{isEditing ? "Edit User" : "Add User"}</h2>
            <p>
              {isEditing
                ? "Update the selected user account."
                : "Create a new CURA system account."}
            </p>
          </div>

          <button type="button" className="user-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="user-modal-error">{error}</div>}

          <div className="user-form-grid">

            <label className="user-form-field user-form-full">
              <span>Full Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </label>
            <label className="user-form-field user-form-full">
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </label>
            <label className="user-form-field">
              <span>Role</span>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="doctor">Doctor</option>
              </select>
            </label>
            <label className="user-form-field">
              <span>Status</span>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            {form.role === "staff" && (
              <label className="user-form-field user-form-full">
                <span>Position</span>
                <input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="Example: Receptionist, Nurse, Clinic Assistant"
                />
              </label>
            )}

            <label className="user-form-field user-form-full">
              <span>
                Password
                {isEditing && <small> Optional when editing</small>}
              </span>

              <div className="user-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    isEditing
                      ? "Leave blank to keep current password"
                      : "Minimum 8 characters"
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

          </div>

          <div className="user-modal-actions">
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserFormModal;