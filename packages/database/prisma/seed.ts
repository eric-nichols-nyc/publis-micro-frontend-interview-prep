import { database } from "../node.js";

type ProductSeed = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
};

const image = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?w=400&h=300&fit=crop`;

const products: ProductSeed[] = [
  {
    id: "sku_1",
    name: "Trail Runner Pack",
    price: 89,
    category: "Bags",
    imageUrl: image("photo-1553062407-98eeb64c6a62"),
  },
  {
    id: "sku_2",
    name: "Insulated Bottle",
    price: 24,
    category: "Hydration",
    imageUrl: image("photo-1602143407151-7111542de6e8"),
  },
  {
    id: "sku_3",
    name: "Merino Base Layer",
    price: 65,
    category: "Apparel",
    imageUrl: image("photo-1434389677669-e08b4cac3105"),
  },
  {
    id: "sku_4",
    name: "Carbon Trekking Poles",
    price: 54,
    category: "Gear",
    imageUrl: image("photo-1682687220062-66aca41e7f76"),
  },
  {
    id: "sku_5",
    name: "Ultralight Rain Shell",
    price: 120,
    category: "Apparel",
    imageUrl: image("photo-1539185440875-384d04431286"),
  },
  {
    id: "sku_6",
    name: "Camp Stove Mini",
    price: 42,
    category: "Cooking",
    imageUrl: image("photo-1478139819320-7884be41212a"),
  },
  {
    id: "sku_7",
    name: "Down Sleeping Bag 20°F",
    price: 199,
    category: "Sleep",
    imageUrl: image("photo-1523987352953-319319031992"),
  },
  {
    id: "sku_8",
    name: "Grip Trek Socks (3-pack)",
    price: 28,
    category: "Apparel",
    imageUrl: image("photo-1586350977771-b3e0ad748214"),
  },
  {
    id: "sku_9",
    name: "Compact Headlamp Pro",
    price: 45,
    category: "Lighting",
    imageUrl: image("photo-1519681393784-d120267933ba"),
  },
  {
    id: "sku_10",
    name: "Titanium Cook Pot 900ml",
    price: 38,
    category: "Cooking",
    imageUrl: image("photo-1414362543977-f92276a46772"),
  },
  {
    id: "sku_11",
    name: "Softshell Hiking Pants",
    price: 78,
    category: "Apparel",
    imageUrl: image("photo-1506905925346-21bda4d32df4"),
  },
  {
    id: "sku_12",
    name: "Trail Gaiters",
    price: 32,
    category: "Apparel",
    imageUrl: image("photo-1544965880-8a63f39335fe"),
  },
  {
    id: "sku_13",
    name: "Inflatable Sleeping Pad",
    price: 95,
    category: "Sleep",
    imageUrl: image("photo-1455789674065-699fb1942277"),
  },
  {
    id: "sku_14",
    name: "Quick-Dry Camp Towel",
    price: 18,
    category: "Accessories",
    imageUrl: image("photo-1586023492125-27b2c045efd7"),
  },
  {
    id: "sku_15",
    name: "Bear Canister 7L",
    price: 72,
    category: "Safety",
    imageUrl: image("photo-1475483767286-a393a942bf4f"),
  },
  {
    id: "sku_16",
    name: "GPS Handheld Navigator",
    price: 249,
    category: "Electronics",
    imageUrl: image("photo-1569330041795-cc596601166e"),
  },
  {
    id: "sku_17",
    name: "Wool Camp Beanie",
    price: 22,
    category: "Apparel",
    imageUrl: image("photo-1576871338410-02225a6d0a71"),
  },
  {
    id: "sku_18",
    name: "Collapsible Water Filter",
    price: 59,
    category: "Hydration",
    imageUrl: image("photo-1548839140-29a7496591a5"),
  },
  {
    id: "sku_19",
    name: "Ultralight Tarp 2P",
    price: 135,
    category: "Shelter",
    imageUrl: image("photo-1504280390367-d5363834593d"),
  },
  {
    id: "sku_20",
    name: "Fire Starter Kit",
    price: 15,
    category: "Accessories",
    imageUrl: image("photo-1517824804614-a7cb2473c7f1"),
  },
];

const seedProducts = async () => {
  for (const product of products) {
    await database.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
      },
      create: product,
    });
  }
};

const main = async () => {
  await seedProducts();
  const count = await database.product.count();
  console.log(`Seeded ${count} products`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await database.$disconnect();
  });
