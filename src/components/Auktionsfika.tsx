import {
  Box,
  Button,
  Container,
  Heading,
  IconButton,
  SimpleGrid,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { action, computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import Image from "./Image";
import Link from "next/link";

const fikaData = [
  {
    name: "Kaffe",
    price: 20,
    imageUrl:
      "https://www.öob.se/storage/ma/325534a7213a46b183877132faf0a3b7/140255d78f4e4ebd9db6d1da8f6bb04c/558-480-0-jpg.Jpeg/9F8816AD470844C52E1B1D9E8BD26210740E1473/2_28690.jpeg",
  },
  {
    name: "Kaka",
    price: 20,
    imageUrl:
      "https://i0.wp.com/lindasbakskola.se/app/uploads/sites/4/2017/06/sverigekaka6.jpg",
  },
  {
    name: "Korv m. bröd",
    price: 25,
    imageUrl:
      "https://mb.cision.com/Public/151/9801247/aaf29112963ea076_800x800ar.jpg",
  },
  {
    name: "Dricka",
    price: 15,
    imageUrl:
      "http://www.fruktdirekt.se/sites/default/files/imagecache/product_full/lask-png.png",
  },
  {
    name: "Godis",
    price: 10,
    imageUrl:
      "https://static.mathem.se/shared/images/products/large/06411401037191_g1l1.jpg",
  },
];

class FikaItem {
  name = "Fika";
  price = 0;
  imageUrl = "";
  quantity = 0;

  constructor(name: string, price: number, imageUrl: string) {
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;

    makeObservable(this, {
      quantity: observable,
      totalPrice: computed,
      none: computed,
    });
  }

  get totalPrice() {
    return this.quantity * this.price;
  }

  get none() {
    return this.quantity === 0;
  }

  increase = action(() => {
    this.quantity += 1;
  });

  decrease = action(() => {
    if (this.quantity > 0) {
      this.quantity -= 1;
    }
  });

  reset = action(() => {
    this.quantity = 0;
  });
}

class Fika {
  items: FikaItem[] = [];

  constructor() {
    this.items = fikaData.map((d) => new FikaItem(d.name, d.price, d.imageUrl));
    makeObservable(this, {
      totalQuantity: computed,
      totalPrice: computed,
      none: computed,
    });
  }

  get totalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get totalPrice() {
    return this.items.reduce((total, item) => total + item.totalPrice, 0);
  }

  get none() {
    return this.totalQuantity === 0;
  }

  reset = action(() => {
    this.items.forEach((item) => item.reset());
  });
}

const fika = new Fika();

const FikaItemView = observer(function _FikaItemView({
  fikaItem,
}: {
  fikaItem: FikaItem;
}) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={3}
      alignItems="center"
      display="flex"
    >
      <Image
        src={fikaItem.imageUrl}
        alt={fikaItem.name}
        width={50}
        height={50}
      />
      <Heading as="h2" size="lg" mx={4} color="gray.600">
        {fikaItem.name}
      </Heading>
      <Stat px={3} pb={5}>
        <StatLabel>Pris/st</StatLabel>
        <StatNumber>{fikaItem.price} kr</StatNumber>
      </Stat>

      <IconButton
        mr={10}
        aria-label="Rensa"
        icon={<DeleteIcon />}
        disabled={fikaItem.none}
        onClick={fikaItem.reset}
      />

      <Box display="flex" alignItems="center">
        <Button onClick={fikaItem.decrease} disabled={fikaItem.none}>
          {" "}
          -{" "}
        </Button>
        <Stat px={3} pb={5}>
          <StatLabel>Antal</StatLabel>
          <StatNumber textAlign="right">{fikaItem.quantity}</StatNumber>
        </Stat>
        <Button onClick={fikaItem.increase}> + </Button>
      </Box>

      <Box minW={100} ml={10} display="flex" alignItems="flex-end">
        <Stat px={3} pb={5}>
          <StatLabel>Totalt</StatLabel>
          <StatNumber>{fikaItem.totalPrice} kr</StatNumber>
        </Stat>
      </Box>
    </Box>
  );
});

export default observer(function Auktionsfika() {
  return (
    <Box>
      <Heading textAlign="center" as="h1" size="2xl" mt={2} mb={4}>
        Auktionsfika
      </Heading>
      <Box as="section" minH="100vh" display="flex" flexDir="column" pb={100}>
        <Container maxW="container.xl">
          <SimpleGrid columns={1} spacing="20px" mt={4} pb={10}>
            {fika.items.map((item) => (
              <FikaItemView key={item.name} fikaItem={item} />
            ))}
          </SimpleGrid>
          <Box display="flex" alignItems="stretch">
            <Heading as="h2" size="lg" mx={4} color="gray.600">
              Totalt {fika.totalQuantity} varor
            </Heading>

            <IconButton
              mr={10}
              aria-label="Rensa"
              icon={<DeleteIcon />}
              disabled={fika.none}
              onClick={fika.reset}
            />

            <Spacer />
            <Heading as="h2" size="lg" mx={4} color="black">
              {fika.totalPrice} kr
            </Heading>
          </Box>
        </Container>
      </Box>
    </Box>
  );
});
