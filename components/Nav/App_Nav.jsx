import { Button, Container, Flex, ScrollArea } from "@mantine/core";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const App_Nav = () => {
  const { id } = useParams();
  const [language, setLanguage] = useState("uzb"); // "uzb" or "rus"

  const { data, error, isLoading } = useSWR(
    "https://web-bot-node-bqye.onrender.com/api/categories",
    fetcher,
  );

  const getCategoryName = (category) => {
    if (!category || !category.name) return "";
    if (typeof category.name === "string") return category.name;
    if (typeof category.name === "object") {
      return (
        category.name[language] || category.name.uzb || category.name.rus || ""
      );
    }
    return "";
  };

  if (error) return <Container>Xatolik yuz berdi</Container>;
  if (isLoading) return <Container>Yuklanmoqda...</Container>;

  return (
    <>
      <ScrollArea w="100%">
        <Container size="xl" pt="xs">
          <Flex
            gap="sm"
            justify={{ base: "center", sm: "flex-start" }}
            align="center"
            wrap="wrap"
            w="100%"
          >
            <Link href={`/`}>
              <Button variant={!id ? "filled" : "light"}>Barchasi</Button>
            </Link>

            {data.map((item) => (
              <Link key={item._id} href={`/category/${item.id}`}>
                <Button variant={id == item.id ? "filled" : "light"}>
                  {getCategoryName(item)}
                </Button>
              </Link>
            ))}

            {/* Language Toggle */}
            <Flex gap="xs" ml="auto">
              <Button
                size="xs"
                variant={language === "uzb" ? "filled" : "light"}
                onClick={() => setLanguage("uzb")}
              >
                O'Z
              </Button>
              <Button
                size="xs"
                variant={language === "rus" ? "filled" : "light"}
                onClick={() => setLanguage("rus")}
              >
                РУ
              </Button>
            </Flex>
          </Flex>
        </Container>
      </ScrollArea>
    </>
  );
};

export default App_Nav;
