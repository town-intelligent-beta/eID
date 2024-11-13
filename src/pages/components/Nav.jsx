import { useState } from "react";
import Logo from "../../assets/Second Home logo.svg";
import menu from "../../assets/menu.svg";
import { useLocation } from "react-router-dom";

export default function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const pagesWithoutDropdown = [
    "/",
    "/accounts/signup",
    "/accounts/signin",
    "/accounts/forget-pw",
  ];

  return (
    <nav className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center w-[70%]">
        <a href="/" className="text-lg font-bold">
          <img
            src={Logo}
            width="240"
            className="d-inline-block align-top"
            alt="Second Home logo"
          />
        </a>
      </div>
      {!pagesWithoutDropdown.includes(location.pathname) && (
        <div className="relative ml-auto">
          <button onClick={toggleDropdown} className="focus:outline-none">
            <img
              src={menu}
              width="30"
              className="d-inline-block align-top"
              alt="menu"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <a
                href="/backend/edit-info"
                className="no-underline block px-4 py-2 text-black hover:bg-gray-100"
              >
                設定
              </a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
