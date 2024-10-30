import { Link, Outlet, useLocation } from "react-router-dom";

export default function Eid() {
  const location = useLocation();
  const activeKey = location.pathname.split("/").pop();

  // const handleSelect = (key) => {
  //   setActiveKey(key);
  // };

  const getLinkStyle = (key) => {
    return activeKey === key
      ? { backgroundColor: "#E5E5E599", color: "#000000" } // Active styles
      : { backgroundColor: "#ffffff", color: "#000000" }; // Default styles
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-11/12 mx-auto">
        <div className="flex gap-2">
          <Link
            to="/eid/about"
            style={getLinkStyle("about")}
            className="no-underline p-2 rounded-lg"
          >
            關於
          </Link>
          <Link
            to="/eid/issue"
            style={getLinkStyle("issue")}
            className="no-underline p-2 rounded-lg"
          >
            永續合作
          </Link>
          <Link
            to="/eid/foot_print"
            style={getLinkStyle("foot_print")}
            className="no-underline p-2 rounded-lg"
          >
            數位足跡
          </Link>
          <Link
            to="/eid/wallet"
            style={getLinkStyle("wallet")}
            className="no-underline p-2 rounded-lg"
          >
            領取任務
          </Link>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
