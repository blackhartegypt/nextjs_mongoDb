import {NextResponse} from "next/server";
import { db } from "@/app/configurations/firebaseConfig";
import {collection,getDocs} from "firebase/firestore";

export async function GET(){
    try{
        const colRef=collection(db,"products");
        const snapshot=await getDocs(colRef);
        const products=snapshot.docs.map((doc)=>({
            id:doc.id,...doc.data(),
        }))
        return NextResponse.json(products);
    }catch(error){
        console.log("There was an error fetching products",error);
        return NextResponse.json(
            {message:"Failed to fetch Products in the server side "},
            {status:500}
        );
    }
}