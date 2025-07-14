export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <img
          src="/assets/images/PLAplay_Logo.png"
          className="ml-5 h-9 w-auto justify-self mt-auto mb-auto"
          alt="PLAplay logo"
        />
        <div className="text-sm font-extralight text-gray-400">
          © {new Date().getFullYear()} PLAplay. All rights reserved.
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0 font-extralight">
          <a
            href="https://github.com/HoangHieuDang/custombot_frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-400 transition duration-200 text-sm"
          >
            Github
          </a>
          <a
            href="mailto:hoanghieu.dang@gmail.com"
            className="hover:text-orange-400 transition duration-200 text-sm"
          >
            Contact
          </a>
          <a
            href="/about"
            className="hover:text-orange-400 transition duration-200 text-sm"
          >
            About
          </a>
        </div>
      </div>
    </footer>
  );
}
