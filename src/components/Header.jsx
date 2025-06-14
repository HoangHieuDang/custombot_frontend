import { NavLink } from "react-router-dom";
export default function Header({user}) {
  //define a function for styling for list element of the nav depending on isActive argument given by NavLink component
  function liCssStyling(isActive) {
    return isActive
      ? "text-lg text-orange-200 font-light"
      : "font-extralight text-white hover:text-white-200 hover:rounded-md";
  }
  const liClassName = "rounded-lg px-3 py-2 ml-5 mr-5 hover:bg-gray-700";
  return (
    <header>
      <nav className="inline-flex flex-row w-full bg-slate-800">
        <img
          src="/src/assets/images/PLAplay_logo.png"
          className="ml-5 h-9 w-auto justify-self mt-auto mb-auto"
          alt="this is PLAplay logo"
        />
        <ul className="flex h-16 items-center justify-between">
          <li className={liClassName}>
            <NavLink
              to="/"
              className={({ isActive }) => liCssStyling(isActive)}
              end
            >
              Home
            </NavLink>
          </li>
          <li className={liClassName}>
            <NavLink
              to="/custombot"
              className={({ isActive }) => liCssStyling(isActive)}
              end
            >
              Custom bot
            </NavLink>
          </li>
          <li className={liClassName}>
            <NavLink
              to="/profile"
              className={({ isActive }) => liCssStyling(isActive)}
              end
            >
              Profile
            </NavLink>
          </li>
          <li className={liClassName}>
            <NavLink
              to="/order"
              className={({ isActive }) => liCssStyling(isActive)}
              end
            >
              Order
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
