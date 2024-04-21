import Header from '@/components/frontpage/Header';
import { Raleway } from 'next/font/google';

const RalewayRegular = Raleway({
  display: 'swap',
  subsets: ['latin'],
  weight: ['500', '700'],
});

export default function Home() {
  return (
    <div className={`min-h-screen bg-[#0B0B0B] ${RalewayRegular.className}`}>
      <Header />
      <main>
        <p className='text-white'>real stuff here</p>
      </main>
    </div>
  );
}
