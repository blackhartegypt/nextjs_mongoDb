"use client"
import {useState} from "react";
import { useRouter } from "next/navigation";
import {collection,addDoc} from "firebase/firestore";
import {db,storage} from "../configurations/firebaseConfig";
import {ref,uploadBytesResumable,getDownloadURL} from "firebase/storage";

interface Product{
    category:string;
    brand:string;
    price:number;
    desc:string;
    imageURL:string;
   

}


const PostItems =()=>{
    const  [product,setProduct]=useState<Omit<Product,"imageURL">>({
        brand:"",
        price:0,
        desc:"",
        category:""
    })
    const router=useRouter();
    const [image,setImage]=useState<File | null>(null);
    const [uploadProgress,setUploadProgress]=useState<number>(0);
    const [loading,setLoading]=useState<boolean>(false);

    const handleInputChange=(
        e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    )=>{
        const {name,value}=e.target;
        setProduct({...product,[name]: name === "price" ? parseFloat(value):value});
    };


    const handleFileChange=(
        e:React.ChangeEvent<HTMLInputElement>
    )=>{
        if(e.target.files && e.target.files[0]) setImage(e.target.files[0]);
    }
    

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        if(!image){
            alert("Please select an Image to Proceed");
            return;
        }
        setLoading(true);

        try{
            const storageRef=ref(storage,`productImages/${Date.now()}_${image.name}`);
            const uploadTask=uploadBytesResumable(storageRef,image);
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress=((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                    setUploadProgress(progress);

                },
                (error)=>{
                    console.error("their was an error while trying to upload you photo",error)
                    setLoading(false);
                },
                async()=>{
                    const imageURL=await getDownloadURL(uploadTask.snapshot.ref);
                    const colRef=collection(db,"products");
                    await addDoc(colRef,{...product,imageURL});
                    alert("product has been added successfully");

                    setLoading(false);
                    setUploadProgress(0);
                    setProduct({category:"",price:0,desc:"",brand:""});
                    setImage(null);
                    router.push('/');

                }
            )
        } catch(err){
            console.error("Error adding the product", err)
        }

    }


    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4 bg-white shadow-md rounded">
          <h2 className="text-2xl font-bold text-center">Add New Product</h2>
          <div>
            <label htmlFor="category" className="block font-medium">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              value={product.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="brand" className="block font-medium">Brand</label>
            <input
              type="text"
              name="brand"
              id="brand"
              
              value={product.brand}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block font-medium">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={product.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            
            
          </div>
          <div>
            <label htmlFor="desc" className="block font-medium">Description</label>
            <textarea
              name="desc"
              id="description"
              value={product.desc}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block font-medium">Upload Product Image</label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required
            />
          </div>
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded h-6 overflow-hidden">
              <div
                className="bg-green-500 h-6 text-white flex justify-center items-center"
                style={{ width: `${uploadProgress.toFixed(2)}%` }}
              >{uploadProgress.toFixed(2)}%</div>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      );
}

export default PostItems;