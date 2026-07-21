import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import { loginUser } from "../Services/UserService";
import { useNavigate } from "react-router-dom";

const fieldStyles = {
  label: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 6,
  },
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
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
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
      const response = await loginUser(formData);

      // Save JWT (change key according to your backend response)
      if (response.jwt) {
        localStorage.setItem("token", response.jwt);
      }

      notifications.show({
        title: `Welcome back, ${response.user?.name || "User"} 👋`,
        message: "You have successfully signed in.",
        color: "green",
        radius: "md",
        autoClose: 3000,
        icon: <CheckCircle2 size={18} />,
      });

      

      // TODO:
      navigate("/");
    } catch (error) {
      notifications.show({
        title: "Sign in Failed",
        message:
          error?.errorMessage ||
          error?.message ||
          "Invalid email or password. Please try again.",
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
          value={formData.email}
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
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Enter your password"
          leftSection={<Lock size={16} className="text-slate-500" />}
          radius="md"
          size="md"
          styles={fieldStyles}
          error={errors.password}
        />

        <div className="flex items-center justify-between pt-1">
          <Checkbox
            radius="sm"
            color="#C8A24A"
            label={
              <span className="text-sm text-slate-500">
                Remember me
              </span>
            }
          />

          <button
          onClick={()=> navigate("/reset-password")}
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
          onClick={handleSubmit}
        >
          Sign In
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