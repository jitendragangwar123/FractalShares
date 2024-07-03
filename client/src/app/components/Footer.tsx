import Image from "next/image";
const Footer = () => {
  return (
    <footer className="bg-[#141925] flex font-serif flex-col justify-center items-center">
      <div className="bg-footer-image w-full px-4 md:px-8 py-10 flex flex-col justify-center items-center gap-4">
        <div className="flex items-center gap-4">
          <a href="/">
            <div className="p-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full">
              <div className="bg-white p-1 rounded-full">
                <Image
                  className="border border-transparent"
                  src="/logo1.png"
                  alt="logo1"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </a>
        </div>
        <h2 className="text-center text-[#FF6734] text-lg md:text-3xl font-bold">
          Become a Part of the Ecosystem
        </h2>
        <p className="text-[#BC988C] text-center text-sm-2 md:text-xl max-w-2xl">
          Explore our services to learn and build together! If there's a new feature you'd like to see, please raise an issue on our GitHub
        </p>
        <a href="">
          <button className="px-3 py-2 text-lg bg-white text-black rounded-md font-medium border-2 border-blue-600 shadow-md hover:bg-blue-600 hover:text-white hover:shadow-lg active:bg-white active:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-700 ease-in-out">
            Let's Chat
          </button>
        </a>
      </div>
      <div className="py-4">
        <p className="text-center text-[#BC988C] text-sm md:text-base">
          Built with ❤️ by Team Cypher
        </p>
      </div>
    </footer>

  );
};

export default Footer;