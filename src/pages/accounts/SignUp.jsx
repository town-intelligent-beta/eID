import { useState, useRef } from "react";
import wrong from "../../assets/wrong.svg";
import check from "../../assets/checkmark.svg";

export default function Signin() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [showPasswordIcon, setPasswordShowIcon] = useState(true);
  const [showCfmPasswordIcon, setCfmPasswordShowIcon] = useState(true);

  const handleCfmPasswordChange = (e) => {
    const value = e.target.value;
    setCfmPassword(value);
    setCfmPasswordShowIcon(value.length < 8);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordShowIcon(value.length < 8);
  };

  return (
    <div className="min-vh-100">
      <form>
        <div className="row justify-content-center">
          <div className="col-7 bg-gray shadow-sm rounded-xl py-2 mb-2 flex flex-col">
            <div className="form-group">
              <input
                type="email"
                className="rounded-xl w-full h-10 px-3 mb-3"
                id="email"
                aria-describedby="emailHelp"
                placeholder="電子郵件"
                value={emailRef.current}
                onChange={(e) => {
                  emailRef.current = e.target.value;
                }}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="rounded-xl w-full h-10 px-3 mb-3"
                id="username"
                placeholder="使用者名稱"
                value={usernameRef.current}
                onChange={(e) => {
                  usernameRef.current = e.target.value;
                }}
              />
            </div>
            <div className="mb-1 relative">
              <input
                type="password"
                className="rounded-xl w-full h-10 px-3 pr--10"
                id="password"
                placeholder="密碼"
                value={password}
                onChange={(e) => {
                  handlePasswordChange(e);
                }}
              />
              {showPasswordIcon ? (
                <img
                  className="w-6 h-6 absolute right-3 top-1/3 transform -translate-y-1/2"
                  src={wrong}
                  alt="wrong"
                />
              ) : (
                <img
                  className="w-6 h-6 absolute right-3 top-1/3 transform -translate-y-1/2"
                  src={check}
                  alt="correct"
                />
              )}
              <small id="war_msg" className="text-xs text-black ml-3">
                密碼不得少於 8 字元
              </small>
            </div>
            <div className="form-group mb-0 relative">
              <input
                type="password"
                className="rounded-xl w-full h-10 px-3 pr-10"
                id="cfm_password"
                placeholder="確認密碼"
                value={cfmPassword}
                onChange={(e) => {
                  handleCfmPasswordChange(e);
                }}
              />
              {showCfmPasswordIcon ? (
                <img
                  className="w-6 h-6 absolute right-3 top-1/3 transform -translate-y-1/2"
                  src={wrong}
                  alt="wrong"
                />
              ) : (
                <img
                  className="w-6 h-6 absolute right-3 top-1/3 transform -translate-y-1/2"
                  src={check}
                  alt="correct"
                />
              )}
              <small id="war_msg" className="text-xs text-black ml-3">
                密碼不得少於 8 字元
              </small>
            </div>
          </div>
        </div>
        <div className="text-center my-2">
          <button type="button" className="btn btn-success">
            註冊
          </button>
        </div>
      </form>
    </div>
  );
}
