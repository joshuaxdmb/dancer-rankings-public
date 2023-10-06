import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import SytledButton from '@/app/components/SytledButton';
import ListItem from '@/app/components/MainLinkItem';
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
        <div className='mb-2'>
          <h1 className='text-white text-3xl font-semibold'>{`If you're not a dancer, kindly close your browser 💃 🕺`}</h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4'>
            
        </div>
      </Header>
    </div>
  );
}
