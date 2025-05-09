import {useState} from 'react';
export default function header() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [message, setMessage] = useState("");
  function handleClickCraftAvabot(){
    setMessage("Craft Avabot got clicked!")
  }
  function handleClickProfile(){
    setMessage("Profile got clicked!")
  }
  function handleClickOrders(){
    setMessage("Orders got clicked!")
  }
  return (
    <>
      <header>
        <img
          src="/src/assets/images/Custombot.png"
          width="50px"
          height="auto"
          alt="this is custombot logo"
        />
        <nav>
          <ul className="nav-list">
            <li className="nav-list-item" onClick={handleClickCraftAvabot}>Craft your Avabot</li>
            <li className="nav-list-item" onClick={handleClickProfile}>Profile</li>
            <li className="nav-list-item" onClick={handleClickOrders}>Orders</li>
          </ul>
          
        </nav>
        <p>{message}</p>
      </header>
    </>
  );
}
