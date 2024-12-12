"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AppShell,
  Burger,
  Button,
  Group,
  NavLink,
  Skeleton,
  Text,
  Divider,
  Modal,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { getToken, removeToken } from "../lib/token";
import UsersTable from "../components/usersTable";
import {
  IconBuildingStore,
  IconHome,
  IconUsers,
  IconLogout,
  IconDashboard,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();
  const [usersData, setUsersData]: any = useState("");
  const [userToken, setUserToken] = useState("");
  const [opened, { toggle }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleSignOut = () => {
    removeToken();
    setIsSignOutModalOpen(false);
    router.push("/login");
  };

  async function fetchUser() {
    setLoading(true);
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    let res = await fetch(`${url}/users?sortOrder=asc`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    setUsersData(data);
    setLoading(false);
  }

  useEffect(() => {
    getToken().then((result: any) => {
      setUserToken(result);
    });
    if (userToken) {
      console.log(userToken, "user token");
      fetchUser();
    }
  }, [userToken]);

  if (usersData.message === "Forbidden") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 space-y-6 text-center bg-white shadow-lg rounded-xl">
          <IconUsers size={48} className="mx-auto text-red-500" />
          <Text size="xl" fw={700} className="text-gray-800">
            Access Restricted
          </Text>
          <Text className="text-gray-600">
            This page is only accessible to administrators.
          </Text>
          <Link href="/">
            <Button size="lg" leftSection={<IconHome size={20} />}>
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      className="bg-gray-50"
    >
      <AppShell.Header className="bg-white border-b">
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <div className="flex items-center gap-2">
              <IconBuildingStore size={28} className="text-blue-600" />
              <Text size="lg" fw={600} className="text-gray-800">
                Mealkit Store
              </Text>
            </div>
          </Group>
          <Text size="sm" c="dimmed" className="hidden sm:block">
            Admin Dashboard
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className="bg-white">
        <div className="flex flex-col h-full">
          <div className="space-y-1">
            <NavLink
              href="/"
              label="Home"
              leftSection={<IconHome size={20} />}
              variant="light"
            />
            <NavLink
              href="/admin"
              label="Admin Dashboard"
              leftSection={<IconDashboard size={20} />}
              variant="light"
              active
            />
          </div>

          <Divider my="md" />

          <Button
            onClick={() => setIsSignOutModalOpen(true)}
            color="gray"
            variant="light"
            leftSection={<IconLogout size={20} />}
            className="mt-auto"
          >
            Sign out
          </Button>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
          <Text size="xl" fw={700} className="text-gray-800">
            User Management
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            Create, edit, and manage user accounts from a central dashboard
          </Text>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} h={50} radius="md" animate={true} />
              ))}
          </div>
        ) : !usersData ? (
          <div className="py-8 text-center">
            <Text size="lg" c="dimmed">
              Loading user data...
            </Text>
          </div>
        ) : (
          <div className="p-4 bg-white shadow-sm rounded-xl">
            <UsersTable data={usersData.data?.users} fetchUser={fetchUser} />
          </div>
        )}
      </AppShell.Main>

      {/* Sign Out Confirmation Modal */}
      <Modal
        opened={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        title="Sign Out Confirmation"
        size="sm"
        centered
      >
        <Stack gap="md">
          <Group>
            <IconAlertCircle size={28} className="text-blue-600" />
            <div>
              <Text size="lg" fw={500}>
                Sign Out
              </Text>
              <Text size="sm" c="dimmed">
                Are you sure you want to sign out?
              </Text>
            </div>
          </Group>

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => setIsSignOutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={handleSignOut}
              leftSection={<IconLogout size={18} />}
            >
              Sign Out
            </Button>
          </Group>
        </Stack>
      </Modal>
    </AppShell>
  );
}
