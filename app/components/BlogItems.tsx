"use client"
import {db} from "../configurations/firebaseConfig";
import {collection,getDocs} from "firebase/firestore";
import {useEffect,useState} from "react";
import Image from "next/image";


type DocumentType={
    id:string;
    brand:string;
    category:string;
    desc:string;
    imageURL:string;
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
const BlogItem=()=>{
    const [products,setProducts] =useState<DocumentType[]>([]);

    useEffect(()=>{
        const getData=async ()=>{
            const data=await fetchBlogItems();
            setProducts(data);
        }

        getData();
    },[]);

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
              <h2 className="text-lg font-semibold">{product.brand}</h2>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-sm text-gray-500">{product.desc}</p>

            </div>
          ))}
        </div>
      );
}





export default BlogItem;
