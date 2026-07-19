import React from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
} from "@mantine/core";
import {
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

const fieldStyles = {
  label: { color: "#CBD5E1", fontSize: 13, fontWeight: 500, marginBottom: 6 },
  input: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    "&::placeholder": {
      color: "#7C8AA0",
      opacity: 1,
    },
  },
};

function Login({ setIsLogin }) {
  return (
    <div className="w-full">

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to continue your career journey with Velora.
        </p>
      </div>

      {/* Form */}
      <div className="mt-8 space-y-4">

        <TextInput
          label="Email address"
          placeholder="john@example.com"
          leftSection={<Mail size={16} className="text-slate-500" />}
          radius="md"
          size="md"
          styles={fieldStyles}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          leftSection={<Lock size={16} className="text-slate-500" />}
          radius="md"
          size="md"
          styles={fieldStyles}
        />

        <div className="flex items-center justify-between pt-1">
          <Checkbox
            radius="sm"
            color="#C8A24A"
            label={<span className="text-sm text-slate-500">Remember me</span>}
          />

          <button
            type="button"
            className="text-sm text-[#C8A24A] hover:text-[#DDBB63] transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button
          fullWidth
          radius="md"
          size="md"
          rightSection={<ArrowRight size={16} />}
          className="!bg-[#C8A24A] hover:!bg-[#B8923F] !text-[#0B1220] !font-medium transition-colors"
        >
          Sign in
        </Button>

      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="font-medium text-[#C8A24A] hover:text-[#DDBB63] transition-colors"
        >
          Create account
        </button>
      </p>

    </div>
  );
}

export default Login;