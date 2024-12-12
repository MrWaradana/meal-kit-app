"use client";

import { Button, Group, PasswordInput, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "user", // Default role
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => {
        if (value.length < 6) return "Password must be at least 6 characters";
        if (!/\d/.test(value))
          return "Password must contain at least one number";
        if (!/[a-zA-Z]/.test(value))
          return "Password must contain at least one letter";
        return null;
      },
      role: (value) => (!value ? "Please select a role" : null),
    },
  });

  const handleSubmit = async (values: any) => {
    setIsLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || "Registration failed");
      // }

      notifications.show({
        title: "Success",
        message: "Account created successfully!",
        color: "green",
        position: "top-center",
      });

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center bg-[url('/img/bg-makanan.png')] bg-cover">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Meal Kit Store
        </h1>
        <p className="mt-2 text-xl italic text-white drop-shadow-md">
          Your Gateway to Gourmet Home Cooking
        </p>
      </div>

      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="flex flex-col w-full max-w-lg gap-4 px-6 py-12 bg-white/30 backdrop-blur-2xl rounded-xl"
      >
        <h2 className="mb-4 text-3xl font-bold capitalize">Register</h2>

        <TextInput
          withAsterisk
          label="Full Name"
          placeholder="John Doe"
          {...form.getInputProps("name")}
        />

        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
        />

        <PasswordInput
          withAsterisk
          label="Password"
          placeholder="Create a strong password"
          {...form.getInputProps("password")}
        />

        <Select
          withAsterisk
          label="Role"
          placeholder="Select your role"
          data={[
            { value: "USER", label: "User" },
            { value: "ADMIN", label: "Admin" },
          ]}
          {...form.getInputProps("role")}
        />

        <Group justify="space-between" mt="xl">
          <Button variant="subtle" onClick={() => router.push("/login")}>
            Already have an account? Login
          </Button>
          <Button type="submit" loading={isLoading}>
            Register
          </Button>
        </Group>
      </form>
    </section>
  );
}
