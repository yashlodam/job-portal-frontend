import React from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
  Divider,
} from "@mantine/core";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

function Login({ setIsLogin }) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] p-8">

      {/* Header */}

      <div className="text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">

          <Eye className="text-white" size={28} />

        </div>

        <h1 className="mt-6 text-4xl font-bold text-white">
          Welcome Back
        </h1>

        <p className="mt-3 text-slate-400">
          Sign in to continue your career journey with Velora.
        </p>

      </div>

      {/* Google Login */}

      <div className="mt-8">

        <Button
          fullWidth
          variant="default"
          radius="xl"
          size="lg"
          leftSection={<FcGoogle size={22} />}
          className="!bg-white/5 !border-white/10 hover:!bg-white/10 transition-all"
        >
          Continue with Google
        </Button>

      </div>

      <Divider
        my="xl"
        label="OR"
        labelPosition="center"
      />

      {/* Form */}

      <div className="space-y-5">

        <TextInput
          label="Email Address"
          placeholder="john@example.com"
          radius="xl"
          size="md"
          leftSection={<Mail size={18} />}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          radius="xl"
          size="md"
          leftSection={<Lock size={18} />}
        />

        <div className="flex items-center justify-between">

          <Checkbox
            label="Remember me"
          />

          <button
            type="button"
            className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
          >
            Forgot Password?
          </button>

        </div>

        <Button
          fullWidth
          radius="xl"
          size="lg"
          rightSection={<ArrowRight size={18} />}
          className="!bg-gradient-to-r !from-blue-600 !to-cyan-500 hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg"
        >
          Sign In
        </Button>

      </div>

      {/* Footer */}

      <p className="mt-8 text-center text-sm text-slate-400">

        Don't have an account?{" "}

        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
        >
          Create Account
        </button>

      </p>

    </div>
  );
}

export default Login;