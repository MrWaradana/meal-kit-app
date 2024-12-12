"use client";

import { useState, useEffect } from "react";
import { Button, Modal, Stack, Group, Text } from "@mantine/core";
import {
  IconBuildingStore,
  IconLogout,
  IconDashboard,
  IconAlertCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import { removeToken, getRole } from "./lib/token";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [role, setRole] = useState("USER");
  const [isLoading, setIsLoading] = useState(true);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setIsLoading(true);
        const userRole: any = await getRole();
        setRole(userRole);
      } catch (error) {
        console.error("Error fetching role:", error);
        setRole("USER");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, []);

  const handleSignOut = () => {
    removeToken();
    setIsSignOutModalOpen(false);
    router.push("/login");
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen gap-8 bg-[url('/img/bg-makanan.png')] bg-cover bg-center relative">
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="z-10 flex flex-col items-center gap-8">
        {/* Main Title Section */}
        <div className="space-y-4 text-center">
          <h1 className="flex items-center justify-center gap-4 text-6xl font-bold text-white drop-shadow-lg">
            Mealkit
            <IconBuildingStore size={48} className="text-white" />
            Store
          </h1>
          <p className="text-xl italic font-light text-white drop-shadow-md">
            Your Gateway to Gourmet Home Cooking
          </p>
        </div>

        {/* User Role Badge */}
        <div className="px-6 py-3 rounded-full shadow-lg bg-white/80 backdrop-blur-md">
          <h2 className="text-xl text-gray-800">
            Logged in as{" "}
            <span className="font-semibold text-blue-600 capitalize">
              {role.toLowerCase()}
            </span>
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center w-full max-w-xs gap-4">
          {role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center justify-center w-full"
            >
              <Button
                size="lg"
                className="w-full py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700"
                leftSection={<IconDashboard size={20} />}
              >
                Admin Dashboard
              </Button>
            </Link>
          )}

          <Button
            size="lg"
            color="gray"
            className="w-full font-semibold text-gray-800 bg-white/80 hover:bg-white/90"
            onClick={() => setIsSignOutModalOpen(true)}
            leftSection={<IconLogout size={20} />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute z-10 text-sm bottom-8 text-white/80">
        © 2024 Mealkit Store. All rights reserved.
      </div>

      {/* Sign Out Confirmation Modal */}
      <Modal
        opened={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        title="Sign Out Confirmation"
        size="sm"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
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
    </main>
  );
}
