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

export default function Login({ cookie }: any) {
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
      const url = "http://localhost:3001";
      const response = await fetch(`${url}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        notifications.show({
          title: "Error",
          message: `Failed to login, Error ${response.status} ${response.statusText}`,
          color: "red",
        });
        return;
      }

      // Store token in cookie (more secure than localStorage)
      // Cookies.set("token", data.token);
      await cookie.set("token", data.token);

      notifications.show({
        title: "Success",
        message: "Successfully logged in!",
        color: "green",
      });

      router.push("/admin");
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center bg-blue-300">
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className={`bg-white/30 backdrop-blur-2xl w-full max-w-lg px-6 py-12 rounded-xl flex flex-col gap-4`}
      >
        <h1 className="mb-4 text-3xl font-bold capitalize ">Log in</h1>
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
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </section>
  );
}
