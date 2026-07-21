import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { notifications } from "@mantine/notifications";
import { resetPassword, sendOtp, verifyOtp } from "../Services/UserService";



function ResetPassword() {
  const navigate = useNavigate();

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // SEND OTP
  const handleSendOtp = async () => {
    if (!formData.email) {
      notifications.show({
        color: "red",
        title: "Email Required",
        message: "Please enter your email.",
      });
      return;
    }

    try {
      setLoading(true);

      await sendOtp(formData.email);

      notifications.show({
        color: "green",
        title: "OTP Sent",
        message: "Please check your email.",
      });

      setOtpSent(true);
    } catch (e) {
      notifications.show({
        color: "red",
        title: "Failed",
        message: e.message || "Unable to send OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      notifications.show({
        color: "red",
        title: "Password Mismatch",
        message: "Passwords do not match.",
      });
      return;
    }

    try {
      setLoading(true);

      await verifyOtp(formData.email, formData.otp);

      await resetPassword(
        formData.email,
        formData.newPassword
      );

      notifications.show({
        color: "green",
        title: "Success",
        message: "Password updated successfully.",
      });

      navigate("/auth");
    } catch (e) {
      notifications.show({
        color: "red",
        title: "Reset Failed",
        message: e.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#111827] flex items-center justify-center px-6">

    {/* Background Glow */}
    <div className="absolute -top-32 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
    <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />

    <div
      className="
      relative
      w-full
      max-w-lg
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-2xl
      shadow-[0_25px_80px_rgba(0,0,0,0.45)]
      overflow-hidden
      "
    >
      {/* Top Gradient */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500" />

      <div className="p-10">

        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-600/40">
            <ShieldCheck size={38} className="text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-7 text-center text-4xl font-bold text-white">
          Reset Password
        </h1>

        <p className="mt-3 text-center text-slate-300">
          Securely recover access to your Velora account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          {/* Email */}
          <div>
            <label className="text-sm text-slate-300 mb-2 block">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={otpSent}
              onChange={handleChange}
              placeholder="john@gmail.com"
              className="
              w-full
              rounded-xl
              bg-white/10
              border
              border-white/10
              px-5
              py-4
              text-white
              placeholder:text-slate-400
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/20
              disabled:opacity-60
              "
            />
          </div>

          {!otpSent ? (

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="
              w-full
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              py-4
              text-white
              font-semibold
              transition
              hover:scale-[1.02]
              hover:shadow-xl
              hover:shadow-blue-500/30
              disabled:opacity-70
              "
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          ) : (

            <>

              {/* OTP */}

              <div>

                <label className="text-sm text-slate-300 mb-2 block">
                  Verification Code
                </label>

                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="123456"
                  maxLength={6}
                  className="
                  w-full
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                  px-5
                  py-4
                  text-white
                  text-center
                  tracking-[10px]
                  text-2xl
                  placeholder:text-slate-500
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/20
                  "
                />

              </div>

              {/* Password */}

              <div className="relative">

                <label className="text-sm text-slate-300 mb-2 block">
                  New Password
                </label>

                <Lock
                  size={18}
                  className="absolute left-4 top-[52px] text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="
                  w-full
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                  pl-12
                  pr-12
                  py-4
                  text-white
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/20
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[52px] text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {/* Confirm */}

              <div className="relative">

                <label className="text-sm text-slate-300 mb-2 block">
                  Confirm Password
                </label>

                <Lock
                  size={18}
                  className="absolute left-4 top-[52px] text-slate-400"
                />

                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="
                  w-full
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                  pl-12
                  pr-12
                  py-4
                  text-white
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/20
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-[52px] text-slate-400 hover:text-white"
                >
                  {showConfirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              <button
                disabled={loading}
                className="
                w-full
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                py-4
                font-semibold
                text-white
                transition
                hover:scale-[1.02]
                hover:shadow-xl
                hover:shadow-blue-500/30
                disabled:opacity-70
                "
              >
                {loading ? "Updating Password..." : "Reset Password"}
              </button>

            </>

          )}

        </form>

        <div className="mt-8 flex justify-center">

          <Link
            to="/auth"
            className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>

        </div>

      </div>
    </div>
  </div>

  );
}

export default ResetPassword;