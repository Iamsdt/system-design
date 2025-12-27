export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-slate-900">
              System Design & Cloud Architecture
            </p>
            <p className="text-xs text-slate-500 mt-1">
              © 2025 • Created by Shudipto Trafder
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              Resources
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
