"use client"
import {useState} from "react";
interface ProductActionProps{
    productId:string;
    imageURL:string;
}

const DeleteAction=({productId,imageURL}:ProductActionProps)=>{
    const [deleting,setDeleting]=useState(false)
    const [error,setError]=useState<string | null>(null);

    const handleDelete=async()=>{
        setDeleting(true);
        setError(null);

        try{
            const res=await fetch("http://localhost:3000/api/deleteProducts",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({productId,imageURL})
            })
            const data=await res.json();
            if (res.ok){
                alert(data.message);
                window.location.reload();
            }else{
                setError(data.error || "Failed to delete the Product")
            }
        }catch(error){
            console.log(error);
            setError("Failed to delete the product")
        }finally{
            setDeleting(false);
        }
    }

    return(
        <div>
            <button 
                onClick={handleDelete}
                disabled={deleting}
                className="p-1 bg-gray-500 border rounded text-white"
            >
            {deleting ? "Deleting....":"Delete Product"}  
            {error && <p className="text-red-500 text-sm">{error}</p>}  
            </button>    
        </div>
    )
}
export default DeleteAction;