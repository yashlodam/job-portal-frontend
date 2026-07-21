import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
  Radio,
  Group,
} from "@mantine/core";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { registerUser } from "../Services/UserService";
import { notifications } from "@mantine/notifications";
import { CheckCircle2, CircleAlert } from "lucide-react";

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

  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "APPLICANT",
  });

  const validateForm = () => {
  const newErrors = {};
  
  if (!formData.name.trim()) {
    newErrors.name = "Full name is required";
  } else if (formData.name.length < 3) {
    newErrors.name = "Name must be at least 3 characters";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
  ) {
    newErrors.email = "Invalid email address";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  } 

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }
  if (!accepted) {
  newErrors.terms = "Please accept Terms & Conditions";
}

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const handleRegister = async () => {
  if (!validateForm()) {
        notifications.show({
          title: "Incomplete Form",
          message: "Please enter your email and password.",
          color: "yellow",
          radius: "md",
          autoClose: 2500,
        });
        return;
      }

  try {
    await registerUser(formData);

    notifications.show({
      title: "Welcome to Velora! 🎉",
      message:
        "Your account has been created successfully. Please sign in to continue.",
      color: "green",
      radius: "md",
      autoClose: 3000,
      icon: <CheckCircle2 size={18} />,
    });

    setTimeout(() => {
      setIsLogin(true);
    }, 1500);
  } catch (error) {
    notifications.show({
      title: "Registration Failed",
      message:
        error?.response?.data?.errorMessage ||
        "Unable to create your account. Please try again.",
      color: "red",
      radius: "md",
      autoClose: 4000,
      icon: <CircleAlert size={18} />,
    });
  }
};

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
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="John Doe"
          leftSection={<User size={16} className="text-slate-500" />}
          radius="md"
          size="md"
          styles={fieldStyles}
           error={errors.name}
        />

        <TextInput
          label="Email address"
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="john@example.com"
          leftSection={<Mail size={16} className="text-slate-500" />}
          radius="md"
          size="md"
          styles={fieldStyles}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Create a strong password"
          leftSection={<Lock size={16} className="text-slate-500" />}
          radius="md"
          size="md"
          styles={fieldStyles}
          error={errors.password}
        />

        <PasswordInput
          label="Confirm password"
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          placeholder="Confirm password"
          leftSection={<Lock size={16} className="text-slate-500" />}
          radius="md"
          size="md"
          styles={fieldStyles}
          error={errors.confirmPassword}
        />

        <Radio.Group
          label="You are?"
          value={formData.accountType}
          onChange={(value) => handleChange("accountType", value)}
        >
          <Group mt="xs">
            <Radio value="APPLICANT" label="Applicant" />
            <Radio value="EMPLOYER" label="Employer" />
          </Group>
        </Radio.Group>


        <Checkbox
          radius="sm"
          color="#C8A24A"
          checked={accepted}
  onChange={(event) => setAccepted(event.currentTarget.checked)}

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
        {errors.terms && (
  <p className="text-red-500 text-sm">{errors.terms}</p>
)}

        <Button
          fullWidth
          radius="md"
          size="md"
          rightSection={<ArrowRight size={16} />}
          className="!bg-[#C8A24A] hover:!bg-[#B8923F] !text-[#0B1220] !font-medium transition-colors"
          onClick={handleRegister}
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