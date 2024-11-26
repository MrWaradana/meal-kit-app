"use client";

import { useState } from "react";
import { AppShell, Burger, Group, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { getToken } from "../lib/token";
import UsersTable from "../components/usersTable";

export default function Admin() {
  const [usersData, setUsersData]: any = useState("");
  const [userToken, setUserToken] = useState("");
  const [opened, { toggle }] = useDisclosure();
  const [loading, setLoading] = useState(false);

  async function fetchUser() {
    setLoading(true);
    let res = await fetch(`http://localhost:3001/api/v1/users?sortOrder=asc`, {
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

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={true} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
        {usersData ? (
          <UsersTable data={usersData.data.users} fetchUser={fetchUser} />
        ) : (
          "Loading..."
        )}
      </AppShell.Main>
    </AppShell>
  );
}
