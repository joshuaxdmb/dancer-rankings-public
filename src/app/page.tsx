
import Header from '@/app/components/Header';
import MainLinkItem from '@/app/components/MainLinkItem';
import { ActiveLinks } from '@/content';


export default function Home() {
  return (
    <div
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header>
        <div className='mb-2 py-2'>
          <h1 className='text-white text-3xl font-semibold'>{`If you're not a dancer, kindly close your browser 💃 🕺`}</h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4'>
          {ActiveLinks.map((al)=>(
            <MainLinkItem key={al.route} name={al.label} emoji={al.emoji} href={al.route}/>
          ))}
        </div>
      </Header>
    </div>
  );
}
