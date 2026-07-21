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

const fieldStyles = {
  label: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 6,
  },
  input: {
    borderColor: "rgba(255,255,255,0.1)",
    color: "#CBD5E1",

    "&::placeholder": {
      color: "#ffffff",
      opacity: 1,
    },
  },
  error: {
    color: "#FACC15", // Yellow
    fontSize: "12px",
    marginTop: "4px",
    fontWeight: 500,
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

  if (!validateForm()) return;

  try {

    console.log(formData);

    // axios.post(...)

    setIsLogin(true);

  } catch (error) {

    if (error.response) {
      alert(error.response.data.errorMessage);
    } else {
      alert("Something went wrong");
    }

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