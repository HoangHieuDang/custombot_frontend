import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, Fragment } from "react";
import Orders from "../api/ordersApi";
import Users from "../api/usersApi";

export default function Header({ user, onLogout, isOrderOpen }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  //isOrderOpen tells whether an order has been opened and still haven't paid yet
  const dropdownRef = useRef(null);

  function liCssStyling(isActive) {
    return isActive
      ? "transition-all duration-70 text-lg text-orange-200 font-light"
      : "transition-all duration-70 font-extralight text-white hover:text-white-200 hover:rounded-md";
  }

  const liClassName = "rounded-lg px-2 py-2 ml-5 mr-5 hover:bg-gray-700";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userLogOut = async () => {
    const usersApi = new Users();
    const logOutRes = await usersApi.logOutUser();
    if (logOutRes && onLogout) {
      onLogout();
      navigate("/login");
    }
  };

  const navLinks = (
    <>
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
    </>
  );

  return (
    <header className="w-full">
      <nav className="flex flex-row w-full bg-slate-800 items-center justify-between px-4 py-2 relative">
        {/* Logo */}
        <NavLink to="/" end className="flex items-center flex-shrink-0">
          <img
            src="/assets/images/PLAplay_Logo.png"
            alt="PLAplay logo"
            className="h-10 w-auto object-contain"
          />
        </NavLink>

        {/* Desktop Nav */}
        <ul className="hidden md:flex flex-row items-center">{navLinks}</ul>

        {/* Desktop Cart + Auth */}
        <div className="hidden md:flex items-center ml-auto" ref={dropdownRef}>
          <NavLink
            to="/cart"
            end
            className="flex items-center justify-center mr-3"
          >
            <img
              src={isOrderOpen ? "/assets/ui_components/trolley_with_red_dot.png" : "/assets/ui_components/trolley.png"}
              className="w-6.5 h-6 hover:brightness-75"
            />
          </NavLink>

          {user ? (
            <>
              <p className="font-extralight mr-2 text-amber-500">
                Hi, {user.username}!
              </p>
              <button onClick={() => setShowMenu(!showMenu)}>
                <img
                  className="w-6 h-6 cursor-pointer hover:brightness-75"
                  src="./assets/ui_components/user.png"
                  alt="user-icon"
                />
              </button>
              {showMenu && (
                <div className="absolute top-14 right-4 bg-gray-700 text-white shadow-md rounded-md w-40 z-50">
                  <button
                    className="block w-full text-center font-extralight px-4 py-2 hover:bg-gray-500"
                    onClick={() => {
                      setShowMenu(false);
                      userLogOut();
                    }}
                  >
                    Log out
                  </button>
                  <Link to="/profile">
                    <button
                      className="block w-full text-center font-extralight px-4 py-2 hover:bg-gray-500"
                      onClick={() => setShowMenu(false)}
                    >
                      Profile
                    </button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="rounded-lg px-2 py-2 mr-2 border border-amber-100 bg-gray-900 hover:bg-gray-700 font-extralight">
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button className="rounded-lg px-2 py-2 ml-2 border border-amber-100 bg-gray-900 hover:bg-gray-700 font-extralight">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Burger Button (Mobile) */}
        <button
          className="md:hidden text-white ml-auto"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 w-full bg-slate-600 opacity-90 md:hidden z-50 px-4 pb-4 animate-fade-in-scale">
            <ul className="flex flex-col items-center py-2">
              <li className={liClassName}>
                <NavLink
                  to="/"
                  className={({ isActive }) => liCssStyling(isActive)}
                  end
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              <li className={liClassName}>
                <NavLink
                  to="/custombot"
                  className={({ isActive }) => liCssStyling(isActive)}
                  end
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Custombot
                </NavLink>
              </li>
              <li className={liClassName}>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => liCssStyling(isActive)}
                  end
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </NavLink>
              </li>
              <li className={liClassName}>
                <NavLink
                  to="/order"
                  className={({ isActive }) => liCssStyling(isActive)}
                  end
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Order
                </NavLink>
              </li>
            </ul>

            {user ? (
              <Fragment>
                <div className="flex items-center justify-center mb-3">
                  <NavLink
                    to="/cart"
                    end
                    className="flex items-center justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <img
                      src={isOrderOpen ? "/assets/ui_components/trolley_with_red_dot.png" : "/assets/ui_components/trolley.png"}
                      className="w-6.5 h-6 hover:brightness-75 ml-auto mr-auto"
                    />
                  </NavLink>
                </div>
                <div className="bg-gray-800 rounded">
                  <div className="flex flex-row items-center text-white text-sm">
                    <p className="p-2 mb-2 text-amber-500">
                      Hi, {user.username}!
                    </p>
                    <button
                      className="w-full text-right font-extralight px-4 py-2 hover:bg-gray-600 rounded"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        userLogOut();
                      }}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="bg-gray-800 rounded ">
                <div className="flex flex-col items-center text-sm text-white">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-center font-extralight px-4 py-2 hover:bg-gray-600 rounded">
                      Log in
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-center font-extralight px-4 py-2 hover:bg-gray-600 rounded">
                      Register
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
