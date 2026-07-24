import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 py-8 px-8 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm sm:text-base text-gray-400 bg-[#050505]/90 backdrop-blur-md print:hidden">
      <span className="font-semibold text-gray-300">© PACTo. Managed by SAE PACE.</span>
      <div className="flex items-center gap-8 font-medium">
        <Link
          href="/docs"
          className="transition-colors hover:text-white hover:underline underline-offset-4"
        >
          Documentation
        </Link>
        <Link
          href="/terms"
          className="transition-colors hover:text-white hover:underline underline-offset-4"
        >
          Terms
        </Link>
        <Link
          href="/help"
          className="transition-colors hover:text-cyan-400 font-bold hover:underline underline-offset-4"
        >
          Help
        </Link>
      </div>
    </footer>
  );
}
