import Link from "next/link";

export default function Logo({ isMainHeader }: { isMainHeader?: boolean }) {
  return isMainHeader ? (
    <Link href="/" className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-logo-color">
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
        </svg>
      </div>
      <span className="font-serif text-2xl font-bold text-black">Chapter</span>
    </Link>
  ) : (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-logo-color">
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
        </svg>
      </div>
      <span className="font-serif text-2xl font-bold text-white">Chapter</span>
    </Link>
  );
}
