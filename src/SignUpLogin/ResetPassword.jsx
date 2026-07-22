import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Lock,
    Mail,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft,
    Pencil,
} from "lucide-react";
import { notifications } from "@mantine/notifications";
import { resetPassword, sendOtp, verifyOtp } from "../Services/UserService";

const MIN_PASSWORD_LENGTH = 8;
const RESEND_COOLDOWN_SECONDS = 30;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ResetPassword() {
    const navigate = useNavigate();

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [verifyRequest, setVerifyRequest] = useState({
        email: "",
        otp: " "
    })

    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleVerifyRequest = (e) => {
        setVerifyRequest((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Cooldown ticks down once a second while active.
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((s) => s - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // SEND OTP (also used for resend)
    const handleSendOtp = async () => {
        if (!formData.email) {
            notifications.show({
                color: "red",
                title: "Email required",
                message: "Enter your email address.",
            });
            return;
        }

        if (!EMAIL_PATTERN.test(formData.email)) {
            notifications.show({
                color: "red",
                title: "Invalid email",
                message: "Enter a valid email address.",
            });
            return;
        }

        try {
            setLoading(true);

            await sendOtp(formData.email);

            notifications.show({
                color: "green",
                title: "Code sent",
                message: "Check your inbox for the verification code.",
            });

            setOtpSent(true);
            setResendCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (e) {
            notifications.show({
                color: "red",
                title: "Couldn't send code",
                message: e.message || "Unable to send the verification code.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Let the user fix a mistyped email instead of being locked in.
    const handleChangeEmail = () => {
        setOtpSent(false);
        setResendCooldown(0);
        setFormData((prev) => ({ ...prev, otp: "", newPassword: "", confirmPassword: "" }));
    };

    // RESET PASSWORD
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.otp) {
            notifications.show({
                color: "red",
                title: "Code required",
                message: "Enter the verification code sent to your email.",
            });
            return;
        }

        if (formData.newPassword.length < MIN_PASSWORD_LENGTH) {
            notifications.show({
                color: "red",
                title: "Password too short",
                message: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
            });
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            notifications.show({
                color: "red",
                title: "Passwords don't match",
                message: "Make sure both passwords are identical.",
            });
            return;
        }

        try {
            setLoading(true);
            const verifyRequest = {
                email: formData.email,
                otp: formData.otp
            };
            const resetRequest = {
                email: formData.email,
                newPassword: formData.newPassword
            };



            await verifyOtp(verifyRequest);
            await resetPassword(resetRequest);

            notifications.show({
                color: "green",
                title: "Password updated",
                message: "Your password has been reset. Sign in with your new password.",
            });

            navigate("/auth");
        } catch (e) {
            notifications.show({
                color: "red",
                title: "Reset failed",
                message: e.message || "Something went wrong.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0B1220] flex items-center justify-center px-6 py-10 font-[Inter,sans-serif]">

            {/* Ambient glow — same gold accent as the sign-up flow, kept consistent across the auth experience */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-blue-400 blur-[120px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-green-200 blur-[120px]"
            />

            <div className="relative w-full max-w-lg rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] overflow-hidden">

                {/* Top accent */}
                <div className="h-1.5 bg-[#C8A24A]" />

                <div className="p-8 sm:p-10">

                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C8A24A] shadow-lg shadow-[#C8A24A]/20">
                            <ShieldCheck size={30} className="text-[#0B1220]" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="mt-6 text-center font-serif text-3xl text-white">
                        Reset your password
                    </h1>

                    <p className="mt-2 text-center text-sm text-slate-400">
                        Securely recover access to your Velora account.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-9 space-y-6" noValidate>

                        {/* Email */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label htmlFor="email" className="text-sm text-slate-300">
                                    Email address
                                </label>
                                {otpSent && (
                                    <button
                                        type="button"
                                        onClick={handleChangeEmail}
                                        className="flex items-center gap-1 text-xs font-medium text-[#C8A24A] hover:text-[#dab868] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A24A]/60 rounded"
                                    >
                                        <Pencil size={12} />
                                        Change
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    disabled={otpSent}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-[#C8A24A] focus:ring-4 focus:ring-[#C8A24A]/20 disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {!otpSent ? (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="
w-full
rounded-xl
border
border-blue-500/30
bg-gradient-to-r
from-blue-600
via-blue-500
to-cyan-500
py-4
font-semibold
text-white
transition-all
duration-300
hover:shadow-[0_0_35px_rgba(59,130,246,0.45)]
hover:scale-[1.02]
active:scale-100
disabled:cursor-not-allowed
disabled:opacity-60
 font-semibold text-white transition hover:bg-[#dab868] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Sending code…" : "Send verification code"}
                            </button>
                        ) : (
                            <>
                                {/* OTP */}
                                <div>
                                    <label htmlFor="otp" className=" mb-2 block text-sm text-slate-300">
                                        Verification code
                                    </label>

                                    <input
                                        id="otp"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        name="otp"
                                        autoComplete="one-time-code"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        placeholder="123456"
                                        maxLength={6}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 py-4 text-center text-2xl tracking-[10px] text-white placeholder:text-slate-600 outline-none transition focus:border-[#C8A24A] focus:ring-4 focus:ring-[#C8A24A]/20"
                                    />

                                    <div className="mt-2 text-center">
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={resendCooldown > 0 || loading}
                                            className="text-xs font-medium text-slate-400 transition hover:text-[#C8A24A] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {resendCooldown > 0
                                                ? `Resend code in ${resendCooldown}s`
                                                : "Resend code"}
                                        </button>
                                    </div>
                                </div>

                                {/* New password */}
                                <div>
                                    <label htmlFor="newPassword" className="mb-2 block text-sm text-slate-300">
                                        New password
                                    </label>

                                    <div className="relative">
                                        <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            id="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            autoComplete="new-password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-[#C8A24A] focus:ring-4 focus:ring-[#C8A24A]/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A24A]/60 rounded"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <p className="mt-1.5 text-xs text-slate-500">
                                        At least {MIN_PASSWORD_LENGTH} characters.
                                    </p>
                                </div>

                                {/* Confirm password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="mb-2 block text-sm text-slate-300">
                                        Confirm password
                                    </label>

                                    <div className="relative">
                                        <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            id="confirmPassword"
                                            type={showConfirm ? "text" : "password"}
                                            name="confirmPassword"
                                            autoComplete="new-password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm password"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-[#C8A24A] focus:ring-4 focus:ring-[#C8A24A]/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            aria-label={showConfirm ? "Hide password" : "Show password"}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A24A]/60 rounded"
                                        >
                                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-[#C8A24A] py-4 font-semibold text-[#0B1220] transition hover:bg-[#dab868] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "Updating password…" : "Reset password"}
                                </button>
                            </>
                        )}
                    </form>

                    <div className="mt-8 flex justify-center">
                        <Link
                            to="/auth"
                            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-[#C8A24A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A24A]/60 rounded"
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ResetPassword;