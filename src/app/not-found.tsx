import Image from "next/image";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
        <h1 className="text-3xl font-bold pt-8">
          Oops! Something went wrong.
        </h1>
        <Image src="/searching.webp" alt="Error" width={400} height={300} className="mt-6" />
        </div>
      </div>
      <Footer />
    </div>
  );
}