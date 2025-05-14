import MainContent from "./components/MainContent";

const Home = () => {
  return (
    <>
      <h1>Welcome to Custom Bot</h1>
      <h2>What is Custom Bot?</h2>
      <p>
        Custom Bot is basically a mecha model kit offered by us but we let you
        decide to choose the robot parts and customize your own version
      </p>
      <img
        className="w-3xs h-2xs"
        src="./src/assets/images/Custombot_Banner_2.png"
        alt="a banner picture of custom bots"
      />
    </>
  );
};

export default Home;
