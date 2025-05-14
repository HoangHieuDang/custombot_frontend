import { Outlet, Link } from "react-router-dom";
const Layout = () => {
  return (
    <>
      <div>
        <Outlet />
        <Link to="/home">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/custombot">CustomBot</Link>
      </div>
    </>
  );
};

export default Layout;
