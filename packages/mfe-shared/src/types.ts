export type User = {
  id: string;
  name: string;
  email: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
};

export type RemoteSlotProps = {
  user: User;
};

export type ProductsRemoteProps = RemoteSlotProps & {
  products: Product[];
};
