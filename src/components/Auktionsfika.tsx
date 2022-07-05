import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { action, computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import Image from "./Image";
import { ChangeEvent } from "react";

const fikaData = [
  {
    name: "Kaffe",
    price: 20,
    imageUrl: "img/kaffe.jpg",
  },
  {
    name: "Kaka",
    price: 20,
    imageUrl: "img/kaka.jpg",
  },
  {
    name: "Korv",
    price: 25,
    imageUrl: "img/korv.jpg",
  },
  {
    name: "Läsk",
    price: 15,
    imageUrl: "img/läsk.jpg",
  },
  {
    name: "Mer",
    price: 15,
    imageUrl: "img/mer.jpg",
  },
  {
    name: "Godis",
    price: 10,
    imageUrl: "img/godis.jpg",
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
  paid?: number = undefined;

  constructor() {
    this.items = fikaData.map((d) => new FikaItem(d.name, d.price, d.imageUrl));
    makeObservable(this, {
      paid: observable,
      totalQuantity: computed,
      totalPrice: computed,
      return: computed,
      none: computed,
    });
  }

  get totalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get totalPrice() {
    return this.items.reduce((total, item) => total + item.totalPrice, 0);
  }

  get return() {
    // TODO: Why doesn't this.paid ?? this.paid - this.totalPrice work?
    return this.paid == null ? null : this.paid - this.totalPrice;
  }

  get none() {
    return this.totalQuantity === 0;
  }

  reset = action(() => {
    this.items.forEach((item) => item.reset());
    this.resetPaid();
  });

  resetPaid = action(() => {
    this.paid = undefined;
  });

  onChangePaid = action((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.paid = value && Number(value) ? Number(value) : undefined;
  });
}

const fika = new Fika();

const FikaItemView = observer(function _FikaItemView({
  fikaItem,
  last,
}: {
  fikaItem: FikaItem;
  last?: boolean;
}) {
  return (
    <Box
      borderBottomWidth={last ? "4px" : "1px"}
      pb={1}
      alignItems="center"
      display="flex"
      width="100%"
    >
      <Image
        src={fikaItem.imageUrl}
        alt={fikaItem.name}
        width={40}
        height={40}
      />
      <Heading
        as="h2"
        size="lg"
        // wordBreak="break-word"
        // w={110}
        mx={4}
        color="gray.600"
      >
        {fikaItem.name}
      </Heading>

      <Spacer />
      <IconButton
        mr={10}
        aria-label="Rensa"
        icon={<DeleteIcon />}
        disabled={fikaItem.none}
        onClick={fikaItem.reset}
      />
      <Box display="flex" alignItems="center" flexDir="column">
        <Text color="gray.500">{fikaItem.price} kr/st</Text>
        <Box display="flex" alignItems="center">
          <Button onClick={fikaItem.decrease} disabled={fikaItem.none}>
            {" "}
            -{" "}
          </Button>
          <Stat px={3} w={20}>
            <StatNumber textAlign="right">{fikaItem.quantity}</StatNumber>
          </Stat>
          <Button onClick={fikaItem.increase}> + </Button>
        </Box>
        <Text color="gray.500">Totalt {fikaItem.totalPrice} kr</Text>
      </Box>
    </Box>
  );
});

export default observer(function Auktionsfika() {
  return (
    <Box>
      <Heading
        textAlign="center"
        as="h1"
        size="xl"
        mt={1}
        mb={0}
        display="none"
      >
        Auktionsfika
      </Heading>
      <Box as="section" minH="100vh" display="flex" flexDir="column" pb={2}>
        <Container maxW="container.xl">
          <VStack mt={4} mb={2}>
            {fika.items.map((item, i) => (
              <FikaItemView
                key={i}
                fikaItem={item}
                last={i === fika.items.length - 1}
              />
            ))}
          </VStack>
          <Box display="flex" alignItems="center">
            <FormControl maxWidth={90}>
              <FormLabel maxWidth={90}>Totalt</FormLabel>
              <InputGroup maxWidth={90}>
                <InputLeftElement>
                  <DeleteIcon
                    color={fika.none ? "gray.300" : "black"}
                    onClick={fika.reset}
                  />
                </InputLeftElement>
                <Input
                  maxWidth={90}
                  type="number"
                  value={fika.totalQuantity}
                  readOnly
                  border="none"
                />
              </InputGroup>
              <FormHelperText maxWidth={90}>varor</FormHelperText>
            </FormControl>

            <FormControl w={130}>
              <FormLabel>Betalt</FormLabel>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none" color="gray.300">
                  kr
                </InputLeftElement>
                <Input
                  type="number"
                  value={fika.paid === undefined ? "" : fika.paid}
                  onChange={fika.onChangePaid}
                />
                {fika.paid && (
                  <InputRightElement>
                    <CloseIcon color="gray.300" onClick={fika.resetPaid} />
                  </InputRightElement>
                )}
              </InputGroup>
              <FormHelperText>{fika.return} tillbaks</FormHelperText>
            </FormControl>

            <Spacer />
            <Heading as="h2" size="lg" mx={4} color="black" display="inline">
              {fika.totalPrice} kr
            </Heading>
          </Box>
        </Container>
      </Box>
    </Box>
  );
});
