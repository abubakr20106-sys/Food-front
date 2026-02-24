"use client";

import {
  Button,
  Container,
  Group,
  Paper,
  Table,
  TextInput,
  Title,
  ActionIcon,
  Text,
  Loader,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());
const API_URL = "https://food-api-7a58.onrender.com/api/categories";

export default function CategoryPage() {
  const { data: categories, mutate, isLoading } = useSWR(API_URL, fetcher);

  const form = useForm({
    initialValues: { name: "" },
    validate: {
      name: (value) => (value.length < 2 ? "Nom juda qisqa" : null),
    },
  });

  // Kategoriya qo'shish
  const handleAddCategory = async (values) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        form.reset();
        mutate();
      }
    } catch (err) {
      alert("Qo'shib bo'lmadi");
    }
  };

  // KATEGORIYA O'CHIRISH (To'g'irlangan variant)
  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) return;

    try {
      // API manzilini tekshiring: ba'zi serverlarda /id emas, ?id=... bo'ladi
      // Lekin odatda standart mana bunday:
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // SWR keshini yangilaymiz (ekrandan yo'qoladi)
        mutate();
        console.log("Muvaffaqiyatli o'chirildi");
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(
          errorData.message || "O'chirishning iloji bo'lmadi. Server rad etdi.",
        );
      }
    } catch (err) {
      console.error("Xato:", err);
      alert("Server bilan aloqa uzildi. Internetni tekshiring.");
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Link href="/dashboard">
          <Button
            variant="subtle"
            leftSection={<ArrowLeft size={16} />}
            color="gray"
          >
            Ortga qaytish
          </Button>
        </Link>

        <Paper p="xl" withBorder radius="md" shadow="xs">
          <Title order={2} mb="lg" c="blue.9">
            Kategoriyalar
          </Title>

          <form onSubmit={form.onSubmit(handleAddCategory)}>
            <Group align="flex-end" mb="xl">
              <TextInput
                label="Yangi kategoriya"
                placeholder="Masalan: Desertlar"
                required
                style={{ flex: 1 }}
                {...form.getInputProps("name")}
              />
              <Button
                type="submit"
                leftSection={<Plus size={18} />}
                color="blue"
              >
                Qo'shish
              </Button>
            </Group>
          </form>

          {isLoading ? (
            <Group justify="center" py="xl">
              <Loader size="md" />
            </Group>
          ) : (
            <Table verticalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Kategoriya nomi</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>O'chirish</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {categories?.map((item) => (
                  <Table.Tr key={item._id}>
                    <Table.Td>
                      <Text fw={500}>{item.name}</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <ActionIcon
                        color="red"
                        variant="light"
                        size="lg"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 size={18} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}

          {!isLoading && categories?.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              Kategoriyalar topilmadi.
            </Text>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
