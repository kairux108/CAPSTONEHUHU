import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  UsersRound,
  FileText,
  Check,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    let userData;

    if (email === "staff@cura.com") {
      userData = {
        name: "CURA Staff",
        email,
        role: "Staff",
      };
    } else {
      userData = {
        name: "CURA Doctor",
        email,
        role: "Doctor",
      };
    }

    login(userData);

    if (userData.role === "Doctor") {
      navigate("/doctor/dashboard");
    } else {
      navigate("/staff/dashboard");
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#edf7fd] px-5 py-10">
      {/* ABSTRACT BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[220px] -top-[290px] h-[650px] w-[850px] rotate-[-13deg] rounded-[48%] bg-[#dceffc]" />

        <div className="absolute left-[22%] top-[-245px] h-[360px] w-[700px] rotate-[-5deg] rounded-[45%] bg-white/60" />

        <div className="absolute -right-[120px] -top-[150px] h-[390px] w-[390px] rounded-full bg-[#cce7fa]" />

        <div className="absolute right-[-300px] top-[160px] h-[520px] w-[720px] rotate-[-28deg] rounded-[48%] bg-white/55" />

        <div className="absolute -bottom-[300px] -left-[210px] h-[570px] w-[570px] rounded-full bg-[#7edfd8]" />

        <div className="absolute -bottom-[310px] right-[-110px] h-[540px] w-[650px] rotate-[-24deg] rounded-[42%] bg-[#cfeafb]" />
      </div>

      {/* MAIN COMPOSITION */}
      <div className="relative z-10 flex w-full max-w-[1040px] items-center justify-center">
        {/* LEFT CARD */}
        <section className="relative h-[585px] w-[660px] shrink-0 overflow-hidden rounded-[26px] bg-white shadow-[0_25px_65px_rgba(35,73,107,0.14)]">
          {/* Doctor image */}
          <div className="absolute inset-y-0 right-0 w-[52%] overflow-hidden">
            <img
              src="/images/cura-doctor.png"
              alt="CURA healthcare professional"
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/45 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-white/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full w-[55%] flex-col px-[34px] py-[34px]">
            {/* CURA brand */}
            <div className="flex items-center gap-3">
              <div className="grid h-[28px] w-[28px] place-items-center text-[30px] font-black leading-none text-[#3485ed]">
                +
              </div>

              <div>
                <h1 className="text-[19px] font-extrabold leading-none tracking-[0.02em] text-[#0b3357]">
                  CURA
                </h1>

                <p className="mt-[4px] text-[8px] font-semibold tracking-[0.04em] text-[#8197aa]">
                  HEALTHCARE MADE SMARTER
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="mt-[34px]">
              <h2 className="text-[28px] font-extrabold leading-[1.18] tracking-[-0.035em] text-[#0c3457]">
                Smarter Healthcare.
                <br />
                <span className="text-[#3185e8]">
                  Better Coordination.
                </span>
              </h2>

              <p className="mt-[13px] max-w-[300px] text-[13px] leading-[21px] text-[#4c657c]">
                We care for every Tagumenos — connecting patients,
                healthcare providers, and facilities for a healthier tomorrow.
              </p>
            </div>

            {/* Features */}
            <div className="mt-[27px] space-y-[13px]">
              <FeatureItem
                icon={<UsersRound size={13} />}
                text="Efficient Patient Care"
                color="blue"
              />

              <FeatureItem
                icon={<FileText size={13} />}
                text="Centralized Health Records"
                color="teal"
              />

              <FeatureItem
                icon={<Check size={14} />}
                text="A More Connected Community"
                color="blue"
              />
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-[#dce5ec] pt-[13px]">
              <p className="text-[11px] leading-none text-[#5e7488]">
                <strong className="font-extrabold text-[#0b3357]">
                  We care
                </strong>{" "}
                for every Tagumenos.
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT LOGIN CARD */}
        <section className="relative z-20 -ml-[35px] h-[560px] w-[420px] shrink-0 rounded-[25px] bg-white px-[33px] py-[30px] shadow-[0_28px_65px_rgba(38,70,99,0.16)]">
          {/* Create account */}
          <div className="flex items-center justify-end gap-[4px] text-[11px]">
            <span className="text-[#8196aa]">
              New here?
            </span>

            <button
              type="button"
              className="border-0 bg-transparent font-semibold text-[#1670ef] hover:underline"
            >
              Create an account
            </button>
          </div>

          {/* Header */}
          <div className="mt-[24px]">
            <h2 className="text-[25px] font-extrabold leading-none tracking-[-0.035em] text-[#0c3457]">
              Welcome Back
            </h2>

            <p className="mt-[8px] text-[12px] text-[#7890a5]">
              Sign in to continue to CURA
            </p>
          </div>

          {/* LOGIN FORM */}
          <form
            className="mt-[22px]"
            onSubmit={handleSubmit}
          >
            {/* EMAIL */}
            <div>
              <label className="mb-[6px] block text-[11px] font-bold text-[#173854]">
                Email or Username
              </label>

              <div className="flex h-[41px] items-center gap-[10px] rounded-[9px] border border-[#d8e3eb] bg-[#fbfcfd] px-[13px] focus-within:border-[#65a6ed] focus-within:ring-2 focus-within:ring-blue-100">
                <Mail
                  size={14}
                  className="shrink-0 text-[#7e99af]"
                />

                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border-0 bg-transparent text-[12px] text-[#27465f] outline-none placeholder:text-[#879cad]"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mt-[14px]">
              <label className="mb-[6px] block text-[11px] font-bold text-[#173854]">
                Password
              </label>

              <div className="flex h-[41px] items-center gap-[10px] rounded-[9px] border border-[#d8e3eb] bg-[#fbfcfd] px-[13px] focus-within:border-[#65a6ed] focus-within:ring-2 focus-within:ring-blue-100">
                <LockKeyhole
                  size={14}
                  className="shrink-0 text-[#7e99af]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full border-0 bg-transparent text-[12px] text-[#27465f] outline-none placeholder:text-[#879cad]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="border-0 bg-transparent text-[#7893a8] hover:text-[#3185e8]"
                >
                  {showPassword ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="mt-[13px] flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-[7px] text-[11px] text-[#71879b]">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-[13px] w-[13px] accent-[#3388ed]"
                />

                Remember me
              </label>

              <button
                type="button"
                className="border-0 bg-transparent text-[11px] font-semibold text-[#176df0] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-[11px] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[10px] text-red-600">
                {error}
              </div>
            )}

            {/* SIGN IN */}
            <button
              type="submit"
              className="mt-[18px] flex h-[41px] w-full items-center justify-center gap-[10px] rounded-full border-0 bg-gradient-to-r from-[#3188ee] to-[#16b9ae] text-[12px] font-bold text-white shadow-[0_10px_24px_rgba(47,134,233,0.22)] transition duration-200 hover:-translate-y-[1px]"
            >
              Sign In
              <ArrowRight size={13} />
            </button>

            {/* Divider */}
            <div className="my-[18px] flex items-center gap-[10px]">
              <div className="h-px flex-1 bg-[#dce5ec]" />

              <span className="text-[10px] text-[#8396a8]">
                or continue with
              </span>

              <div className="h-px flex-1 bg-[#dce5ec]" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-[9px]">
              <button
                type="button"
                className="flex h-[34px] items-center justify-center gap-[7px] rounded-[8px] border border-[#d8e2ea] bg-white text-[11px] font-semibold text-[#183956] hover:bg-slate-50"
              >
                <span className="font-black text-[#4285f4]">
                  G
                </span>
                Google
              </button>

              <button
                type="button"
                className="flex h-[34px] items-center justify-center gap-[7px] rounded-[8px] border border-[#d8e2ea] bg-white text-[11px] font-semibold text-[#183956] hover:bg-slate-50"
              >
                <MicrosoftLogo />
                Microsoft
              </button>
            </div>

            {/* Security */}
            <div className="mt-[18px] flex items-start gap-[8px]">
              <ShieldCheck
                size={14}
                className="mt-[1px] shrink-0 text-[#13b7a6]"
              />

              <div>
                <strong className="block text-[10px] font-extrabold leading-none text-[#183956]">
                  Secure. Private. Compliant.
                </strong>

                <p className="mt-[3px] text-[9px] leading-[13px] text-[#8497a8]">
                  Your data is protected with industry-standard security.
                </p>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

const FeatureItem = ({
  icon,
  text,
  color,
}) => {
  return (
    <div className="flex items-center gap-[12px]">
      <div
        className={`
          grid
          h-[29px]
          w-[29px]
          shrink-0
          place-items-center
          rounded-full
          bg-white
          shadow-[0_5px_15px_rgba(35,74,107,0.10)]

          ${
            color === "teal"
              ? "text-[#15bfb2]"
              : "text-[#3185ed]"
          }
        `}
      >
        {icon}
      </div>

      <span className="text-[11px] font-bold text-[#163956]">
        {text}
      </span>
    </div>
  );
};

const MicrosoftLogo = () => {
  return (
    <div className="grid grid-cols-2 gap-[1px]">
      <span className="h-[6px] w-[6px] bg-[#f35325]" />
      <span className="h-[6px] w-[6px] bg-[#81bc06]" />
      <span className="h-[6px] w-[6px] bg-[#05a6f0]" />
      <span className="h-[6px] w-[6px] bg-[#ffba08]" />
    </div>
  );
};

export default Login;