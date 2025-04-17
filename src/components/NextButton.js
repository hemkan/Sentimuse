import { useRouter } from 'next/router';

export default function YourComponent() {
  const router = useRouter();

  return (
    <div className="lg:pr-12 flex flex-col flex-end items-center lg:items-end w-full">
      <button
        onClick={() => router.push('/test')}
        className="w-[50%] lg:w-[225px] h-[52px] bg-[#EC5A72] hover:brightness-75 ease-in duration-65 rounded-[25px] text-[27px] shadow-lg"
      >
        Next
      </button>
    </div>
  );
}
