import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen opacity-100 text-amber-100 mb-auto mt-auto px-6 py-12 flex flex-col items-center justify-start">
      {/* image-banner-for-background */}
      <img
        className="absolute w-auto h-9/10 z-5 left-auto right-auto pointer-events-none animate-brightness-in-out hidden md:block"
        src="./assets/images/Custombot_Banner_Transparent.png"
        alt="a banner picture of custom bots"
      />
      {/* image-banner-for-background */}
      <img
        className="absolute w-auto h-9/10 z-5 left-auto right-auto pointer-events-none animate-brightness-in-out md:hidden"
        src="./assets/images/Custombot_Banner_Transparent_mobile.png"
        alt="a banner picture of custom bots"
      />
      <div className="max-w-3xl text-center z-10">
        <h1 className="text-4xl sm:text-5xl font-extralight mb-8 text-amber-200">
          About <span className="font-semibold text-amber-300">PLAplay</span>
        </h1>

        <p className="text-lg sm:text-xl font-extralight leading-relaxed mb-6 text-amber-50">
          PLAplay is a web application where users can create their own
          customized mecha robots by mixing and matching modular parts. Inspired
          by Gunpla, digital design, and the spirit of play, PLAplay brings that
          experience into the browser — where imagination meets interaction.
        </p>

        <p className="text-lg sm:text-xl font-extralight leading-relaxed mb-6 text-amber-50">
          I created PLAplay as a way to combine my love for robots, design, and
          technology. It started as a passion project to bring a piece of my
          childhood into the digital world, and evolved into a fullstack
          application that represents my journey into web development.
        </p>

        <p className="text-lg sm:text-xl font-extralight leading-relaxed mb-10 text-amber-50">
          This app is not only about building robots — it’s about honoring our
          inner child, and empowering others to create something that feels
          truly personal and fun.
        </p>

        <div className="text-center">
          <p className="text-base sm:text-lg font-extralight mb-3">
            Learn more about me and my other projects:
          </p>
          <a
            href="https://hoanghieudang.github.io/personal_website/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-200 text-slate-900 px-6 py-2 rounded-lg font-light hover:bg-amber-300 transition-colors"
          >
            Visit My Portfolio
          </a>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="text-sm underline text-amber-400 hover:text-amber-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
