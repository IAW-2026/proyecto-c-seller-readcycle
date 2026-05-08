"use client"

import {
  Button,
  Card,
  Image,
  Text,
} from "@chakra-ui/react";

type BookCardProps = {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
};

export default function BookCard({
  id,
  title,
  author,
  description,
  price,
  image,
}: BookCardProps) {

  /*
  async function handleDelete() {
    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      console.log(`Producto ${id} eliminado`);
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  }
    */

  return (
    <Card.Root
      maxW="sm"
      overflow="hidden"
      borderRadius="2xl"
      boxShadow="md"
      transition="0.2s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
      }}
    >
      <Image
        src={image}
        alt={title}
        h="200px"
        objectFit="cover"
      />

      <Card.Body gap="3">
        <div>
          <Card.Title fontSize="xl">
            {title}
          </Card.Title>

          <Text color="gray.500" fontSize="sm">
            {author}
          </Text>
        </div>

        <Card.Description color="gray.600">
          {description}
        </Card.Description>

        <Text
          textStyle="2xl"
          fontWeight="bold"
          letterSpacing="tight"
          mt="2"
        >
          ${price}
        </Text>
      </Card.Body>

      <Card.Footer gap="2">
        <Button
          flex="1"
          bg="brand.forest"     
          color="brand.beige"    
          borderRadius="brand"
          fontFamily="heading"
          fontWeight="600"
          _hover={{ bg: "brand.sage" }} 
        >
          Editar
        </Button>

        <Button
          flex="1"
          bg="brand.clay"        
          color="brand.beige"    
          borderRadius="brand"
          fontFamily="heading"
          fontWeight="600"
          _hover={{ 
            bg: "brand.clay", 
            opacity: 0.9, 
            transform: "scale(0.98)" 
          }}
        >
          Eliminar
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}