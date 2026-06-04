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

export type CartLine = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type ProductsRemoteProps = RemoteSlotProps & {
  products: Product[];
  onAddToCart: (productId: string) => void;
};

export type CartRemoteProps = RemoteSlotProps & {
  lines: CartLine[];
  subtotal: number;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemoveLine: (lineId: string) => void;
};
