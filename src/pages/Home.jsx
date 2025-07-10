import { NavLink } from "react-router-dom";
const Home = () => {
  return (
    <>
      <section className="relative h-screen w-full flex items-center justify-center #222222">
        {/* image-banner-for-desktop */}
        <img
          className="absolute left-auto right-auto z-10 pointer-events-none hidden md:block"
          src="./src/assets/images/Custombot_Banner_Transparent.png"
          alt="a banner picture of custom bots"
        />
        {/* image-banner-for-mobile */}
        <img
          className="absolute  left-auto right-auto z-10 pointer-events-none w-full sm:hidden"
          src="./src/assets/images/Custombot_Banner_Transparent_mobile.png"
          alt="a banner picture of custom bots"
        />
        <div className="marquee-wrapper h-1/1 w-1/1 flex flex-row items-center justify-evenly">
          <p className="z-0 text-5xl md:text-9xl text-amber-100 font-extralight  marquee-content-right">
            Custom your own robot
          </p>
          <p className="z-0 text-3xl md:text-6xl text-amber-50 font-extralight  marquee-content-left">
            Combine the parts yourself
          </p>
          <p className="z-0 text-2xl md:text-4xl text-amber-200 font-extralight  marquee-content-right">
            Make your dream robot come true
          </p>
          <p className="z-0 text-6xl md:text-8xl text-amber-50 font-extralight  marquee-content-right">
            It is never too late to have fun
          </p>
        </div>
      </section>

      <section className="h-full w-full flex flex-col items-center justify-center #222222">
        <div className="intro p-6 max-w-4xl mx-auto items-center justify-center">
          <h2 className="text-2xl md:text-4xl font-extralight text-amber-200 text-center pt-5 mb-15">
            Build Your Dream Mecha Model Kit
          </h2>
          <p className="font-extralight text-xl text-amber-100">
            Craft your perfect mecha from premium, interchangeable parts
            designed by our team. Assemble your unique build online, then order
            it as a real-world model kit — built to your specs and shipped to
            your door.
          </p>
        </div>

        <div className="quick-start-guide p-6 max-w-full md:max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-extralight text-amber-200 text-center mb-15">
            How It Works
          </h2>
          <ul className="flex items-start justify-center flex-col md:flex-row list-inside space-y-2 text-left text-base leading-relaxed font-extralight text-amber-100">
            <li className="ml-2 mr-2 sm:w-[90%] md:w-[30%] h-100 border border-amber-200 rounded p-5 wrap-break-word ">
              <div className="mt-auto mb-auto">
                <img
                  className="w-1/4 ml-auto mr-auto mb-10 mt-5"
                  src="./src/assets/images/customize.png"
                  alt="customize-icon"
                ></img>
                <h3 className="text-amber-200 text-xl md:text-2xl font-extralight text-center">
                  <strong>Pick Your Parts</strong>
                </h3>
                <br />
                <p className="text-white">
                  Choose from a curated selection of mecha components — head,
                  arms, legs, chest, and more. Each part is original and
                  designed for seamless compatibility. Mix and match to create
                  your own combination.
                </p>
              </div>
            </li>
            <li className="ml-2 mr-2 sm:w-[90%] md:w-[30%] h-100 border border-amber-200 rounded p-5 wrap-break-word ">
              <div className="mt-auto mb-auto">
                <img
                  className="w-1/4 ml-auto mr-auto mb-10 mt-5"
                  src="./src/assets/images/order.png"
                  alt="customize-icon"
                ></img>
                <h3 className="text-amber-200 text-xl md:text-2xl font-extralight text-center">
                  <strong>Save or Order</strong>
                </h3>
                <br />
                <p className="text-white">
                  Save your creation or place an order. We'll package your
                  custom kit with precision-cut parts, ready for you to build at
                  home.
                </p>
              </div>
            </li>
            <li className="ml-2 mr-2 sm:w-[90%] md:w-[30%] h-100 border border-amber-200 rounded p-5  wrap-break-word">
              <div className="mt-auto mb-auto">
                <img
                  className="w-1/4 ml-auto mr-auto mb-10 mt-5"
                  src="./src/assets/images/assemble.png"
                  alt="customize-icon"
                ></img>
                <h3 className="text-amber-200 text-xl md:text-2xl font-extralight text-center">
                  <strong>Assemble & Display</strong>
                </h3>
                <br />
                <p className="text-white">
                  Enjoy the build process and bring your vision to life. Your
                  mecha is more than a model — it’s a statement piece.
                </p>
              </div>
            </li>
          </ul>
          <div className="flex justify-center">
            <button className="font-extralight bg-gray-800 border-1 rounded-2xl p-2 mt-10 sm:max-w-1 md:max-w-1/5 ">
              <NavLink to="/custombot">
                <strong className="text-amber-200">LET'S BUILD!</strong>
              </NavLink>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
