import Link from "next/link";
import Image from 'next/image';

export default function NotFound() {
    return (
    <div className="p-25 flex items-center justify-center px-3" style={{ background: '#FAFAF8' }}>
      <div className="text-center">
        <Image
          src="/sad-book.webp"
          alt="Not Found"
          width={200}
          height={200}
          className="mx-auto mb-6"
        />
        <h1 className="font-serif text-3xl font-bold mb-3" style={{ color: '#232F3E' }}>Content not found</h1>
        <p className="mb-6" style={{ color: '#666666' }}>
          This audiobook does not exist or has been removed. Please check your link or return to the homepage.
        </p>
        <Link
          href="/audiobook"
          className="inline-flex items-center px-6 py-3 rounded-full font-semibold"
          style={{ background: '#F7941D', color: 'white' }}
        >
          Back to audiobooks
        </Link>
      </div>
    </div>
    );
}