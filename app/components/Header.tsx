import Image from "next/image";
import {assets} from "../Assets/assets";



const Header=()=>{
    return(
        <div className='py-5 px-5 md:px-12 lg:px-28'>
            <div className="flex justify-between items-center">
                <Image className="w-[100px] sm:w-auto" src={assets.logo} alt="Logo" width={100} height={30}/>
                <button className=" shadow-[-7px_7px_0px_#000000] flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border boder-solid border-black">
                    Get Started
                </button>
            </div>
            <div className="text-center my-8">
                <h1 className="text-3xl sm:text-5xl font-medium" >Latest Blogs</h1>
                <p className="mt-10 max-w-[740px] m-auto text-xs sm:text-base">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia nobis labore commodi aperiam, illum consequatur molestiae aliquam in, sapiente possimus ad corrupti? Fugiat?
                </p>
                <form action="" className='flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black'>
                    <input type="email" placeholder="Please enter your Email" className="pl-4 outline-none"/>
                    <button className='border-1 border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white'>
                        Subscribe
                    </button>
                </form>
            </div>
        </div> 
    )
}

export default Header;
