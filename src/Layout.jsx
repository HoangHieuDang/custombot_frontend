import { Outlet, Link } from "react-router-dom";
const Layout = () => {
  return (
    <>
      <div style={{ backgroundColor: "red" }}>
        <Outlet />
        <Link to="/home">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/custombot">CustomBot</Link>
      </div>
    </>
  );
};

export default Layout;
