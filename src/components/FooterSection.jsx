import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const FooterSection = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">

        

        {/* Column 1 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Logo</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">In news</li>
            <li className="hover:text-white cursor-pointer">Green Bigbasket</li>
            <li className="hover:text-white cursor-pointer">Privacy policy</li>
            <li className="hover:text-white cursor-pointer">affiliate</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-white cursor-pointer">Bb daily</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Help</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">FAQs</li>
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">bb Wallet FAQs</li>
            <li className="hover:text-white cursor-pointer">bb Wallet T&Cs</li>
            <li className="hover:text-white cursor-pointer">Vendar Contacts</li>

          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Download App</h3>
          <div className="space-y-3">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="w-32 cursor-pointer"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="w-36 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">

    
        <p className="text-sm text-gray-400">
          © 2026 BigBasket . All rights reserved.
        </p>

        {/*  Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <FaFacebookF className="cursor-pointer hover:text-white" />
          <FaInstagram className="cursor-pointer hover:text-white" />
          <FaTwitter className="cursor-pointer hover:text-white" />
          <FaYoutube className="cursor-pointer hover:text-white" />
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;