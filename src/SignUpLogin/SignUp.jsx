import React from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
  Divider,
} from "@mantine/core";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

function SignUp({ setIsLogin }) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] p-8">

      {/* Header */}

      <div className="text-center">

        <h1 className="text-4xl font-bold text-white">
          Create Account
        </h1>

        <p className="mt-3 text-slate-400">
          Join Velora and discover your next career opportunity.
        </p>

      </div>

      <Divider
        my="xl"
        label="OR"
        labelPosition="center"
      />

      {/* Form */}

      <div className="space-y-5">

        <TextInput
          label="Full Name"
          placeholder="John Doe"
          leftSection={<User size={18} />}
          radius="xl"
          size="md"
        />

        <TextInput
          label="Email Address"
          placeholder="john@example.com"
          leftSection={<Mail size={18} />}
          radius="xl"
          size="md"
        />

        <PasswordInput
          label="Password"
          placeholder="Create a strong password"
          leftSection={<Lock size={18} />}
          radius="xl"
          size="md"
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm password"
          leftSection={<Lock size={18} />}
          radius="xl"
          size="md"
        />

        <Checkbox
          label={
            <span className="text-sm text-slate-400">
              I agree to the{" "}
              <button
                type="button"
                className="text-cyan-400 hover:underline"
              >
                Terms
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-cyan-400 hover:underline"
              >
                Privacy Policy
              </button>
            </span>
          }
        />

        <Button
          fullWidth
          radius="xl"
          size="lg"
          rightSection={<ArrowRight size={18} />}
          className="!bg-gradient-to-r !from-blue-600 !to-cyan-500 hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg"
        >
          Create Account
        </Button>

      </div>

      {/* Footer */}

      <p className="mt-8 text-center text-sm text-slate-400">

        Already have an account?{" "}

        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
        >
          Sign In
        </button>

      </p>

    </div>
  );
}

export default SignUp;