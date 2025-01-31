const Footer = () => {
  return (
    <footer className="bg-[#A9C46C] text-white text-center p-4 fixed bottom-0 left-0 w-full h-12 flex items-center justify-center">
      <p className="text-sm text-black tracking-wide">
        &copy; {new Date().getFullYear()} TaskMate. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
