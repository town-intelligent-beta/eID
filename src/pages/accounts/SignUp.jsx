import { useState } from "react";
import wrong from "../../assets/wrong.svg";
import check from "../../assets/checkmark.svg";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [showPasswordIcon, setPasswordShowIcon] = useState(true);
  const [showCfmPasswordIcon, setCfmPasswordShowIcon] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleCfmPasswordChange = (e) => {
    const value = e.target.value;
    setCfmPassword(value);
    setCfmPasswordShowIcon(value.length < 8);
    if (password !== value) {
      setCfmPasswordShowIcon(true);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordShowIcon(value.length < 8);
  };

  const signup = async (formdata) => {
    try {
      if (password !== cfmPassword) {
        throw new Error("Password and Confirm Password are not the same");
      }

      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_EID}/accounts/signup`,
        {
          method: "POST",
          body: formdata,
          credentials: "include", // Handles CORS if needed
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const resultJSON = await response.json();
      console.log("Signup result:", resultJSON);
      setResult(resultJSON);
      return resultJSON;
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formBody = new FormData();
    formBody.append("username", username);
    formBody.append("email", email);
    formBody.append("password", password);

    const result = await signup(formBody);
    if (result) {
      console.log("Signup successful:", result);
      localStorage.setItem("username", result.username);
      localStorage.setItem("email", email);
      localStorage.setItem("jwt", result.token);
      alert("註冊成功！");
      navigate("/eid");
      // 處理註冊成功的邏輯
    } else {
      console.error("Signup failed");
      alert("註冊失敗，請洽系統管理員！");
      // 處理註冊失敗的邏輯
    }
  };

  return (
    <>
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="rounded-xl w-full h-10 px-3 mb-3"
                id="username"
                placeholder="使用者名稱"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
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
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSubmit}
          >
            註冊
          </button>
        </div>
      </form>
    </>
  );
}
