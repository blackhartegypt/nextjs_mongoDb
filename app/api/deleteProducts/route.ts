import {db,storage} from "../../configurations/firebaseConfig";
import {doc, deleteDoc } from 'firebase/firestore';
import {ref,deleteObject} from "firebase/storage";
import {NextRequest,NextResponse} from "next/server";

export async function POST(req:NextRequest,){
        
        try{
            const {productId,imageURL}= await req.json();
            const productRef=doc(db,"products",productId);
            const imageRef=ref(storage,imageURL);
            await deleteDoc(productRef);
            await deleteObject(imageRef);
            return NextResponse.json(
                {message: "Product has been deleted successfully"},
                {status:200}
            )
        }catch(error){
            console.error(error);
            return NextResponse.json(
                {error:"Failed to delete the Product"},
                {status:500}
            )

        }
    }