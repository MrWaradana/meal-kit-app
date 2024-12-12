"use client";

import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
  Notification,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import Cookies from "js-cookie";
import { setToken } from "../lib/token";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length < 1 ? "Password is required" : null),
    },
  });

  const handleSubmit = async (values: any) => {
    setIsLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || "Login failed");
      // }

      // Store token in cookie (more secure than localStorage)
      // Cookies.set("token", data.token);
      setToken(data.accessToken, "token");
      setToken(data.role, "role");

      notifications.show({
        title: "Success",
        message: `Successfully logged in! `,
        color: "green",
        position: "top-center",
      });

      setTimeout(() => {
        router.push("/");
      }, 10000);
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
        className={`bg-white/30 backdrop-blur-2xl w-full max-w-lg px-6 py-12 rounded-xl flex flex-col gap-4`}
      >
        <h2 className="mb-4 text-3xl font-bold capitalize">Log in</h2>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Password..."
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Group justify="space-between" mt="md">
          {" "}
          <Button variant="subtle" onClick={() => router.push("/register")}>
            Doesn`t have an account? Register
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </section>
  );
}
