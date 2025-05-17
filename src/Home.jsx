import MainContent from "./components/MainContent";

const Home = () => {
  return (
    <>
      <h1 className="font-bold text-orange-700">Welcome to Custom Bot</h1>
      <h2>What is Custom Bot?</h2>
      <div className="bg-red-500 h-5"></div>
      <p>
        Custom Bot is basically a mecha model kit offered by us but we let you
        decide to choose the robot parts and customize your own version
      </p>
      {/*style={{width:"30%", height:"auto"}}*/}
      <img
        src="./src/assets/images/Custombot_Banner_2.png"
        alt="a banner picture of custom bots"
      />
    </>
  );
};

export default Home;
