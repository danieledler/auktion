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
    name: "Korv",
    price: 25,
    imageUrl:
      "https://mb.cision.com/Public/151/9801247/aaf29112963ea076_800x800ar.jpg",
  },
  {
    name: "Läsk",
    price: 15,
    imageUrl:
      "http://www.fruktdirekt.se/sites/default/files/imagecache/product_full/lask-png.png",
  },
  {
    name: "Mer",
    price: 15,
    imageUrl:
      "https://varsego.se/storage/8BC8C86A26D62161AE940D4DD2223D45ABD75DF17FCF364D9D8079C739D3C826/1feacaccb30d456ea7c733e3b83ca179/500-500-0-png.Png/media/756cad40c07041b7b143584da3af06a3/13883%20MER%20PA%CC%88RON%2020cl.png",
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
    this.paid = value ? Number(value) : undefined;
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
      pb={2}
      alignItems="center"
      display="flex"
      width="100%"
      flexDir={["column", "row"]}
    >
      <Box display="flex" alignItems="center" w="100%" mb={2}>
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
        <Text color="gray.600">{fikaItem.price} kr/st</Text>
      </Box>

      <Box display="flex" alignItems="center" pl={7}>
        <Spacer />
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
          <Stat px={3}>
            <StatNumber textAlign="right">{fikaItem.quantity}</StatNumber>
          </Stat>
          <Button onClick={fikaItem.increase}> + </Button>
        </Box>
        <Box maxW={100} minW={100} ml={10} display="flex" alignItems="flex-end">
          <Stat px={3} color="gray.400">
            <StatNumber>{fikaItem.totalPrice} kr</StatNumber>
          </Stat>
        </Box>
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
          <VStack spacing="20px" mt={4} mb={2}>
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
