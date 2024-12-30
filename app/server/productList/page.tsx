import Image from "next/image";
import Link from "next/link";
import DeleteAction from "./productActions/DeleteAction";

interface Product {
    id:string;
    brand:string;
    category:string;
    desc:string;
    price:number;
    imageURL:string;
}
const fetchProducts=async():Promise<Product[]>=>{
    const res=await fetch("http://localhost:3000/api/fetchProducts",{
    cache: "no-store",
})
    if (!res.ok){
      throw new Error ("Failed to fetch Products");
    }
    const data:Product[]=await res.json();
    return data;
}

const shortenDesc=(text:string,n:number):string=>{
    return text.length>n ? text.substring(0,n).concat("..."):text;
}

export default async function ProductsPage(){
    const products=await fetchProducts();
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="p-4 border border-gray-300 rounded-lg shadow-md"
            >
              <Image
                priority={true}
                src={product.imageURL}
                width={400}
                height={400}
                alt={product.brand}
                className="w-full h-48 object-cover mb-4"
                unoptimized
              />
              <h2 className="text-lg font-semibold">{product.category}</h2>
              <p className="text-gray-600">{product.brand}</p>
              <p className="text-sm text-gray-500">{shortenDesc(product.desc, 150)}</p>
              <div className="mt-5 flex justify-center items-center">
                <span className="text-sm text-bold">Ksh {product.price}</span>
                <button className="p-1 bg-orange-500 text-white ml-5 border rounded-sm">
                  Add To Cart
                </button>
              </div>
              <div className="mt-3 flex justify-center items-center">
                <Link href={`/editItems/${product.id}`}>
                  <button className="p-1 bg-gray-500 text-white border rounded">
                    Edit Product
                  </button>
                </Link>
                  <DeleteAction
                  productId={product.id}
                  imageURL={product.imageURL}
                  />
              </div>
            </div>
          ))}
        </div>
      );
}