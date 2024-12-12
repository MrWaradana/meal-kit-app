import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import { useMemo, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import {
  Box,
  ActionIcon,
  Button,
  Modal,
  Stack,
  TextInput,
  PasswordInput,
  Select,
  Text,
  Group,
} from "@mantine/core";
import {
  IconSend,
  IconEdit,
  IconTrash,
  IconPlus,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { getToken } from "../lib/token";
import { Notification } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Form } from "@mantine/form";

type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};

const UsersTable = ({ data, fetchUser }: any) => {
  const [userToken, setUserToken] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [newUser, setNewUser] = useState<Partial<any>>({
    email: "",
    password: "",
    name: "",
    role: "",
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
      },
      {
        accessorKey: "email",
        header: "EMAIL",
        mantineEditTextInputProps: {
          type: "email",
          required: true,
          description:
            "Must be a valid email address. Will be converted to lowercase.",
        },
      },
      {
        accessorKey: "name",
        header: "NAME",
        mantineEditTextInputProps: {
          required: true,
          description:
            "Must be between 2 and 50 characters. Can only contain letters and spaces.",
        },
      },
      {
        accessorKey: "role",
        header: "ROLE",
        editVariant: "select",
        mantineEditSelectProps: {
          data: ["ADMIN", "USER"],
          required: true,
          description: "Select a user role (USER or ADMIN)",
        },
      },
    ],
    []
  );

  const handleCreateUser = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    try {
      getToken().then((result: any) => {
        setUserToken(result);
      });

      if (userToken) {
        const response = await fetch(`${url}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) {
          notifications.show({
            title: "Error",
            message: "Failed to create user",
            position: "top-center",
            color: "red",
          });
          return;
        }

        const createdUser = await response.json();


        // Close modal and reset form
        setIsCreateModalOpen(false);
        setNewUser({
          email: "",
          name: "",
          role: "",
        });

        notifications.show({
          title: "User Created!",
          message: "New user created successfully!",
          position: "top-center",
          color: "green",
        });
        // fetchUser();
        return createdUser;
      }
      return null;
    } catch (error) {
      console.error("Error creating user:", error);
      notifications.show({
        title: "Error",
        message: "Failed to create user",
        position: "top-center",
        color: "red",
      });
      // throw new Error("Failed to create user");
    }
  };

  const handleSaveUpdate = async ({ row, values }: any) => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    try {
      const userId = row.original.id;
      getToken().then((result: any) => {
        setUserToken(result);
      });

      if (userToken) {
        const response = await fetch(`${url}/user/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          notifications.show({
            title: "Error",
            message: `Failed to update user, ${response.statusText}`,
            position: "top-center",
            color: "red",
          });
          return;
        }

        const updatedUser = await response.json();

        table.setEditingRow(null);

        notifications.show({
          title: "User Updated!",
          message: "User updated successfully!",
          position: "top-center",
          color: "green",
        });
        fetchUser();
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error("Error updating user:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update user",
        position: "top-center",
        color: "red",
      });
      // throw new Error("Failed to update user");
    }
  };

  const handleDelete = async (row: any) => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
      const userId = row.id;
      getToken().then((result: any) => {
        setUserToken(result);
      });

      if (userToken) {
        const response = await fetch(`${url}/user/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          notifications.show({
            title: "Error",
            message: `Failed to delete user, Error ${response.status}`,
            position: "top-center",
            color: "red",
          });
          return;
        }

        notifications.show({
          title: "User Deleted!",
          message: "User deleted successfully!",
          position: "top-center",
          color: "green",
        });
        fetchUser();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete user",
        position: "top-center",
        color: "red",
      });
      // throw new Error("Failed to delete user");
    }
  };

  const handleDeleteClick = (row: any) => {
    setUserToDelete(row.original);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      await handleDelete(userToDelete);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowActions: true,
    positionActionsColumn: "last",
    onEditingRowSave: handleSaveUpdate,
    onCreatingRowSave: handleCreateUser,
    renderTopToolbarCustomActions: () => (
      <Button
        leftSection={<IconPlus size="1rem" />}
        onClick={() => setIsCreateModalOpen(true)}
      >
        Create New User
      </Button>
    ),
    renderRowActions: ({ row }) => (
      <Box className="flex gap-4">
        <ActionIcon
          color="orange"
          onClick={() => {
            table.setEditingRow(row);
          }}
        >
          <IconEdit />
        </ActionIcon>
        <ActionIcon color="red" onClick={() => handleDeleteClick(row)}>
          <IconTrash />
        </ActionIcon>
      </Box>
    ),
  });

  return (
    <>
      <MantineReactTable table={table} />

      <Modal
        opened={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewUser({
            email: "",
            name: "",
            role: "",
          });
        }}
        title="Create New User"
        size="md"
      >
        <form action={handleCreateUser}>
          <Stack gap={`md`}>
            <TextInput
              label="Email"
              placeholder="Enter email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
              description="Must be a valid email address. Will be converted to lowercase."
            />
            <PasswordInput
              label="Password"
              placeholder="Enter Password"
              description={[
                "• Must be between 8 and 100 characters",
                "• Must include at least one lowercase letter",
                "• Must include at least one uppercase letter",
                "• Must include at least one number",
                "• Must include at least one special character",
              ].join("\n")}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required
            />
            <TextInput
              label="Name"
              placeholder="Enter name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              description="Must be between 2 and 50 characters. Can only contain letters and spaces."
              required
            />
            <Select
              label="Role"
              placeholder="Pick role"
              data={["USER", "ADMIN"]}
              value={newUser.role}
              onChange={(role) => setNewUser({ ...newUser, role })}
              description="Select a user role (USER or ADMIN)"
              required
            />
            <Button type="submit" fullWidth>
              Create User
            </Button>
          </Stack>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        title="Delete User Confirmation"
        size="md"
      >
        <Stack gap="md">
          <Group>
            <IconAlertTriangle size={32} color="red" />
            <div>
              <Text size="lg" fw={500}>
                Are you sure you want to delete this user?
              </Text>
              {userToDelete && (
                <Text size="sm" c="dimmed">
                  User: {userToDelete.name} ({userToDelete.email})
                </Text>
              )}
            </div>
          </Group>

          <Text c="red" size="sm">
            This action cannot be undone.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteConfirm}>
              Delete User
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default UsersTable;
