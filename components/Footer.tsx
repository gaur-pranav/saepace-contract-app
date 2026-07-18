import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 py-4 flex justify-between items-center px-8 text-xs text-gray-500 bg-[#050505]/80 backdrop-blur-sm">
      <span>© PACTO. Managed by SAE PACE.</span>
      <div className="flex items-center gap-6">
        <Link
          href="/docs"
          className="transition-colors hover:text-gray-300"
        >
          Documentation
        </Link>
        <Link
          href="/terms"
          className="transition-colors hover:text-gray-300"
        >
          Terms
        </Link>
        <Link
          href="/help"
          className="transition-colors hover:text-gray-300"
        >
          Help
        </Link>
      </div>
    </footer>
  );
}
