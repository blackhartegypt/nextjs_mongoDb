"use client"
import {db, storage} from "../../configurations/firebaseConfig";
import {doc,updateDoc,getDoc} from "firebase/firestore";
import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import * as React from "react";
import { deleteObject,ref ,getDownloadURL,uploadBytes} from "firebase/storage";

interface Params{
  id:string;
}

interface Product{
  category:string;
  brand:string;
  desc:string;
  imageURL:string;
  price:number;
}



//you can only use await params in server component
export default  function EditItems({params}:{params:Promise<Params>}){
const {id}=React.use(params);

const router=useRouter();
const [product,setProduct]=useState<Product |null>(null);
const [imageURL,setImageURL]=useState('');
const [brand,setBrand]=useState("");
const [category,setCategory]=useState("");
const [desc,setDesc]=useState("");
const [price,setPrice]=useState(0);
const [selectedImage,setSelectedImage]=useState<File | null>(null);


const url=imageURL.substring(imageURL.indexOf("_")+1,imageURL.indexOf("?")-1)
const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
  const file=e.target.files ? e.target.files[0]:null;
  if(file) {
    setSelectedImage(file);
  }
}

const handleSave=async()=>{
  if(selectedImage && selectedImage.name !== url){
    const oldImage=ref(storage,imageURL);
    try{
      await deleteObject(oldImage);
    }catch(err){
      console.log(err)
    }
    const storageRef=ref(storage,`productImages/${selectedImage}`);
    await uploadBytes(storageRef,selectedImage).then(async(snapshot)=>{
      const downloadURL=await getDownloadURL(snapshot.ref);
      await updateDoc(doc(db,"products",id as string),{
        imageURL:downloadURL,
        brand,category,price,desc
      });
    });
    console.log("product hass has been updated with its image too")
    router.push("/")
  }else{
    await updateDoc(doc(db,"products",id as string),{brand,category,desc,price});
    console.log("product without an image has been updated successfully");
    router.push("/")
  }
}
useEffect(()=>{
  const fetchProducts=async()=>{
    if(id){
      const productRef=doc(db,"products",id as string);
      const docSnap=await getDoc(productRef);
      if(docSnap.exists()){
        const productData=docSnap.data() as Product;
        setProduct(productData);
        setImageURL(productData.imageURL);
        setBrand(productData.brand);
        setCategory(productData.category);
        setPrice(productData.price);
        setDesc(productData.desc);
      }

    }else{
      console.log("Their is no such document that exists")
    }
  }
  fetchProducts();

},[id])




return (
  <div className="p-8">
    <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Image URL</label>
      <input
        type="text"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
        className="p-2 border rounded w-full"
      />
    </div>
    

    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Choose New Image</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="p-2 border rounded w-full"
        />
      </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Brand</label>
      <input
        type="text"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="p-2 border rounded w-full"
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Category</label>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded w-full"
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="p-2 border rounded w-full"
      ></textarea>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Price</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="p-2 border rounded w-full"
      />
    </div>
    <div>
      <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded">
        Save Changes
      </button>
    </div>
    </div>
  
);
}