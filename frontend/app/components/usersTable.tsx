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
} from "@mantine/core";
import { IconSend, IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { getToken } from "../lib/token";
import { Notification } from "@mantine/core";
import { notifications } from "@mantine/notifications";

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
      },
      {
        accessorKey: "name",
        header: "NAME",
      },
      {
        accessorKey: "role",
        header: "ROLE",
      },
    ],
    []
  );

  const handleCreateUser = async () => {
    try {
      getToken().then((result: any) => {
        setUserToken(result);
      });

      if (userToken) {
        const response = await fetch(`http://localhost:3001/api/v1/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
        fetchUser();
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
      throw new Error("Failed to create user");
    }
  };

  const handleSaveUpdate = async ({ row, values }: any) => {
    try {
      const userId = row.original.id;
      getToken().then((result: any) => {
        setUserToken(result);
      });

      if (userToken) {
        const response = await fetch(
          `http://localhost:3001/api/v1/user/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
      throw new Error("Failed to update user");
    }
  };

  const handleDelete = async (row: any) => {
    try {
      const userId = row.original.id;
      getToken().then((result: any) => {
        setUserToken(result);
      });

      if (userToken) {
        const response = await fetch(
          `http://localhost:3001/api/v1/user/${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
      throw new Error("Failed to delete user");
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
        <ActionIcon color="red" onClick={() => handleDelete(row)}>
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
        <Stack gap={`md`}>
          <TextInput
            label="Email"
            placeholder="Enter email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Enter Password"
            description={`Password must be between 8 and 100 characters and Password must include one lowercase letter, one uppercase letter, one number, and one special character`}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <TextInput
            label="Name"
            placeholder="Enter name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <TextInput
            label="Role"
            placeholder="Enter role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            required
          />
          <Button onClick={handleCreateUser} fullWidth>
            Create User
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default UsersTable;
