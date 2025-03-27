export default function AudioBox(){
    return (
        <div className="flex flex-col gap-12 items-center justify-center w-[55%] h-full">
            <div className="w-full text-white text-[40px] font-[400] font-[Inria Sans] ">
                Set the Rhythm
            </div>
            <div className=" h-[40%] gap-10 w-full flex flex-row justify-center items-center">
                <div style={{width: '30%', height: '80%', background: '#3A141E', borderRadius: 20}} />
                <div style={{width: '30%', height: '80%', background: '#3A141E', borderRadius: 20}} />
                <div style={{width: '30%', height: '80%', background: '#3A141E', borderRadius: 20}} />
                <div style={{width: '30%', height: '80%', background: '#3A141E', borderRadius: 20}} />
            </div>
            <div className="text-center justify-center text-white text-2xl font-normal font-['Inria_Sans']">+ Add your own</div>
            <div button className="flex flex-col flex-end items-end w-full"><button className="text-2xl h-full">Next</button></div>
        </div>
    );
}