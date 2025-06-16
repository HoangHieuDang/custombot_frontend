import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Users from "../api/usersApi";

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  function liCssStyling(isActive) {
    return isActive
      ? "text-lg text-orange-200 font-light"
      : "font-extralight text-white hover:text-white-200 hover:rounded-md";
  }

  const liClassName = "rounded-lg px-2 py-2 ml-5 mr-5 hover:bg-gray-700";

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //function which handles logging out
  const userLogOut = async () => {
    const usersApi = new Users();
    const logOutRes = await usersApi.logOutUser();
    if (logOutRes && onLogout) {
      onLogout(); // Clear user state in App
      navigate("/login");
    }
  };
  return (
    <header>
      <nav className="inline-flex flex-row w-full bg-slate-800 items-center">
        <img
          src="/src/assets/images/PLAplay_logo.png"
          className="ml-5 h-9 w-auto justify-self mt-auto mb-auto"
          alt="PLAplay logo"
        />
        <ul className="flex h-16 p-5 items-center justify-between">
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
              Custombot
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

        {user ? (
          <div
            className="w-full p-5 pr-10 flex flex-row items-center justify-end relative"
            ref={dropdownRef}
          >
            <button onClick={() => setShowMenu(!showMenu)}>
              <img
                className="w-6 h-6"
                src="./src/assets/ui_components/user.png"
              />
            </button>
            {showMenu && (
              <div className="absolute grid grid-cols-1 gap-1 items-center justify-center top-14 right-0 bg-gray-700 text-white shadow-md rounded-md w-40 z-50">
                <button
                  className="block w-full text-center font-extralight px-4 py-2 ml-auto mr-auto hover:bg-gray-500 rounded"
                  onClick={() => {
                    setShowMenu(false);
                    userLogOut(); // Call logout function
                  }}
                >
                  Log out
                </button>
                <Link to="/profile">
                  <button
                    className="block w-full text-center font-extralight px-4 py-2 ml-auto mr-auto hover:bg-gray-500 rounded"
                    onClick={() => {
                      setShowMenu(false);
                    }}
                  >
                    Profile
                  </button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full p-5 pr-5 flex flex-row items-center justify-end relative">
            <Link to="/login">
              <button className="rounded-lg px-2 py-2 mr-5 border-1 border-amber-100 bg-gray-900 hover:bg-gray-700 font-extralight">
                Log in
              </button>
            </Link>
            <Link to="/register">
              <button className="rounded-lg px-2 py-2 ml-5 mr-5  border-1 border-amber-100 bg-gray-900 hover:bg-gray-700 font-extralight">
                Register
              </button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
