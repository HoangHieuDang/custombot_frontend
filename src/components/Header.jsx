import { NavLink } from "react-router-dom";
export default function Header() {
  return (
    <header>
      <nav className="inline-flex flex-row">
        <img
          src="/src/assets/images/Custombot.png"
          width="auto"
          height="60px"
          alt="this is custombot logo"
        />

        <div className="bg-red-700 w-5"></div>

        <ul className="list-none p-0 inline-flex flex-row justify-center  text-white">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/custombot" end>
              Custom bot
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" end>
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
