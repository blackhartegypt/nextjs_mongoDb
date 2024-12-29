"use client"
import {db,storage} from "../configurations/firebaseConfig";
import {doc,deleteDoc} from "firebase/firestore";
import {ref,deleteObject} from "firebase/storage";
import {collection,getDocs} from "firebase/firestore";
import {useEffect,useState} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type DocumentType={
    id:string;
    brand:string;
    category:string;
    desc:string;
    imageURL:string;
    price:number;
}

const fetchBlogItems =async(): Promise<DocumentType[]> =>{
    const colRef=collection(db,"products");
    const snapshot=await getDocs(colRef);
    const dataList: DocumentType[]=snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
    })) as DocumentType[];
    return dataList;
}

const handleDeleteProduct=async(productId:string,imageURL:string,
  setProducts:React.Dispatch<React.SetStateAction<DocumentType[]>>
)=>{
  try {
    const productRef=doc(db,"products",productId);
    const imageRef=ref(storage,imageURL);

    await deleteDoc(productRef)
    await deleteObject(imageRef)
    //revalidatePath cannot be used in client components theirfore you have to refresh the whole page or convert the code into
    //server components and fetch the data from it it after revalidating
    const updatedProducts=await fetchBlogItems();
    setProducts(updatedProducts)
    alert("products have been deleted successfully");

  } catch (err) {
    console.log(err);
    alert("an error occured while trying to delete the product")
  }
}
const BlogItem=()=>{
  const router=useRouter();
    const [products,setProducts] =useState<DocumentType[]>([]);

    useEffect(()=>{
        const getData=async ()=>{
            const data=await fetchBlogItems();
            setProducts(data);
        }
        getData();
    },[]);

    const shortenDesc=(text:string,n:number):string=>{
      return text.length>n ? text.substring(0,n).concat("....") : text
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(product => (
            <div 
              key={product.id} 
              className="p-4 border border-gray-300 rounded-lg shadow-md"
            >
              <Image priority={true}
                src={product.imageURL} width={400} height={400}
                alt={product.brand} 
                className="w-full h-48 object-cover mb-4" 
                unoptimized
              />
              <h2 className="text-lg font-semibold">{product.category}</h2>
              <p className="text-gray-600">{product.brand}</p>
              <p className="text-sm text-gray-500">{shortenDesc(product.desc,150)}</p>
              <div className="mt-5 flex justify-center items-center " >
                <span className="text-sm text-bold">Ksh {product.price}</span>
                <button className="p-1 bg-orange-500 text-white ml-5 border border-rounded-sm">Add To Cart</button>
              </div>
              <div className="mt-3 flex justify-center items-center">
                <button onClick={()=>router.push(`/editItems/${product.id}`)} className="p-1 bg-gray-500 text-white border rounded">Edit Product</button>
                <button onClick={()=>handleDeleteProduct(product.id,product.imageURL,setProducts)}
                className="p-1 bg-gray-500 border rounded ml-3 text-white">Delete Product</button>
              </div>
            </div>
          ))}
        </div>
      );
}
export default BlogItem;
