import React from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
} from "@mantine/core";
import {
  User,
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

function SignUp({ setIsLogin }) {
  return (
    <div className="w-full">

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-white">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Join Velora and discover your next career opportunity.
        </p>
      </div>

      {/* Form */}
      <div className="mt-8 space-y-4">

        <TextInput
          label="Full name"
          placeholder="John Doe"
          leftSection={<User size={16} className="text-slate-500" />}
          radius="md"
          size="md"
          styles={fieldStyles}
        />

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
          placeholder="Create a strong password"
          leftSection={<Lock size={16} className="text-slate-500" />}
          radius="md"
          size="md"
          styles={fieldStyles}
        />

        <PasswordInput
          label="Confirm password"
          placeholder="Confirm password"
          leftSection={<Lock size={16} className="text-slate-500" />}
          radius="md"
          size="md"
          styles={fieldStyles}
        />

        <Checkbox
          radius="sm"
          color="#C8A24A"
          label={
            <span className="text-sm text-slate-500">
              I agree to the{" "}
              <button
                type="button"
                className="text-[#C8A24A] hover:underline"
              >
                Terms
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-[#C8A24A] hover:underline"
              >
                Privacy Policy
              </button>
            </span>
          }
        />

        <Button
          fullWidth
          radius="md"
          size="md"
          rightSection={<ArrowRight size={16} />}
          className="!bg-[#C8A24A] hover:!bg-[#B8923F] !text-[#0B1220] !font-medium transition-colors"
        >
          Create account
        </Button>

      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="font-medium text-[#C8A24A] hover:text-[#DDBB63] transition-colors"
        >
          Sign in
        </button>
      </p>

    </div>
  );
}

export default SignUp;