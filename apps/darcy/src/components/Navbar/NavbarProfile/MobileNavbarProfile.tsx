import Link from 'next/link';
import { AiOutlineAlignLeft } from 'react-icons/ai';
import { MdOutlineSettings } from 'react-icons/md';

export default function MobileNavbarProfile() {
  return (
    <div className="flex items-center justify-between sm:hidden w-full py-2 px-4">
      <img alt="Your profile avatar." className="h-8 w-8 rounded-full" src="https://picsum.photos/48.webp" />

      <Link className="rounded-full p-2 text-textPrimary hover:bg-hoverEffect" href="/">
        <AiOutlineAlignLeft className="text-2xl" />
      </Link>

      <button type="button" className="hover:bg-hoverEffect p-2 mx-2 rounded-full block sm:hidden">
        <MdOutlineSettings className="text-xl" />
      </button>
    </div>
  );
}