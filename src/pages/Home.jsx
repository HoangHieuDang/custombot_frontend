const Home = () => {
  return (
    <>
      <section className="relative h-screen w-full flex items-center justify-center bg-black">
        <img
          className="absolute w-full left-auto right-auto z-10 pointer-events-none"
          src="./src/assets/images/Custombot_Banner_Transparent.png"
          alt="a banner picture of custom bots"
        />

        <p className="z-0 text-9xl text-amber-200 font-extralight top-50 animate-marquee">
          Custom your own robot
        </p>
      </section>
      <section>
        <h2>What is Custom Bot?</h2>
        <p>
          Custom Bot is basically a mecha model kit offered by us but we let you
          decide to choose the robot parts and customize your own version
        </p>
      </section>
    </>
  );
};

export default Home;
