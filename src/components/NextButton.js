import { useRouter } from "next/router";

export default function YourComponent() {
  const router = useRouter();

  return (
    <div className="lg:pr-12 flex flex-col flex-end items-center lg:items-end w-full">
      <button
        onClick={() => router.push("/preview")}
        className="w-[190px] h-[45px] bg-[#ec5a72] rounded-[20px] font-['Inria_Sans'] font-normal text-white text-2xl text-center hover:bg-[#ec5a72] hover:ring-2 hover:ring-[#B3445A] transition-all duration-200"
        // w-[50%] lg:w-[225px] h-[52px] bg-[#EC5A72] hover:brightness-75 ease-in duration-65 rounded-[25px] text-[27px] shadow-lg"
      >
        Next
      </button>
    </div>
  );
}
