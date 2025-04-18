export default function MainHeader() {
  return (
    // <div className="px-16 w-[full] h-[120px] border-b-solid border-b-[1px] border-b-white/50">
    //     <div style={{width: '100%', height: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 40, fontWeight: '400', wordWrap: 'break-word'}}>Sentimuse</div>
    // </div>
    <nav className="w-full h-24 bg-[#191113]">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="font-['Inria_Sans'] font-normal text-white text-[28px]">
          Sentimuse
        </div>
      </div>
      <div className="w-full h-px bg-[#FFFFFF40]" />
    </nav>
  );
}
