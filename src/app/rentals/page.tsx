import { pb } from "@/lib/pocketbase";
import { ProductRecord } from "@/types";
import RentalsClient from "./RentalsClient";

async function getProducts() {
  try {
    const records = await pb.collection("products").getFullList({
      filter: 'published = true && (productType = "Rental" || productType = "Both")',
      sort: 'name',
    });
    return records as unknown as ProductRecord[];
  } catch {
    return [];
  }
}

export default async function RentalsPage() {
  const products = await getProducts();

  return <RentalsClient products={products} />;
}
