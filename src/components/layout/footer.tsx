import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      {/* Footer */}
      <footer className="px-6 py-16 mt-10" style={{ background: "#232F3E" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-logo-color"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                  </svg>
                </div>
                <span className="font-serif text-xl font-bold text-white">
                  Chapter
                </span>
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                Premium audiobooks and podcasts for curious minds.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Discover</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/home"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Audiobooks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Podcasts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Categories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/home"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="pt-8 border-t"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              © {currentYear} Chapter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
