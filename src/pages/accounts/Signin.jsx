import { useEffect, useState } from "react";
import googleLogo from "../../assets/google-color-svgrepo-com.svg";
import warning from "../../assets/warning-icon.svg";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: email,
    password: password,
  });

  const fetchAvatarImg = async () => {
    const email = localStorage.getItem("email");
    //const dataJSON = { email };
    const dataJSON = new URLSearchParams();
    dataJSON.append("email", email);

    try {
      const response = await fetch(`/api/accounts/get_avatar_img`, {
        method: "POST",
        headers: {
          //"Content-Type": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: dataJSON,
        mode: "cors", // 明確指定 CORS 模式
        credentials: "include", // Handles CORS if needed
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const resultJSON = await response.json();
      localStorage.setItem("avatar_img", resultJSON.url);
    } catch (error) {
      console.error("Error fetching avatar image:", error);
      setError(error);
    }
  };

  const signin = async (credentials) => {
    setIsLoading(true);
    setError("");

    try {
      const formBody = new URLSearchParams();
      Object.keys(credentials).forEach((key) => {
        formBody.append(key, credentials[key]);
      });

      const response = await fetch(`/api/accounts/signin`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        //body: JSON.stringify(credentials),
        body: formBody,
        mode: "cors", // 明確指定 CORS 模式
        credentials: "include", // Handles CORS if needed
      });

      if (!response.ok) {
        throw new Error("登入失敗");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError("帳號或密碼錯誤，請重新輸入");
      console.error("登入錯誤:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signin(formData);

      // 假設登入成功後的處理，例如儲存 token 等
      if (result.token) {
        localStorage.setItem("jwt", result.token);
        localStorage.setItem("username", result.username);
        localStorage.setItem("email", email);
        await fetchAvatarImg();
        navigate("/eid");
      }
    } catch (error) {
      // 錯誤已經在 signin 函數中處理
      console.error("提交表單時發生錯誤:", error);
    }
  };

  useEffect(() => {
    // Initialize Google API
    const initGoogleClient = () => {
      window.gapi.load(
        "client",
        () => {
          window.gapi.client.init({
            clientId:
              "1080674192413-b1vnqslm4gif3p9ntaj4ifl4i572p0bn.apps.googleusercontent.com",
            scope: "profile",
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
            ],
          });
        },
        []
      );
    };

    // Load Google API Script
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => initGoogleClient();
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const handleEidGoogleLogin = async (idToken, res) => {
    try {
      const response = await fetch(`api/accounts/oauth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: res.result.emailAddresses[0].value,
          username: res.result.names[0].displayName,
          token: idToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();

      const userId = googleUser.getId();
      console.log(`user_id: ${userId}`);

      const authResponse = googleUser.getAuthResponse(true);
      const idToken = authResponse.id_token;

      const peopleResponse = await window.gapi.client.people.people.get({
        resourceName: "people/me",
        personFields: "names,emailAddresses",
      });

      const resultJSON = await handleEidGoogleLogin(idToken, peopleResponse);

      try {
        localStorage.setItem("jwt", resultJSON.token);
        localStorage.setItem("username", resultJSON.username);
        //localStorage.setItem("email", result.emailAddresses[0].value);
        navigate("/eid");
      } catch (e) {
        alert("登入失敗，請洽系統管理員！");
      }
    } catch (error) {
      console.error("Google登入失敗:", error);
    }
  };

  return (
    <div className="min-vh-100">
      <form>
        <div className="row justify-content-center mt-3">
          <div className="col-11 col-sm-5 bg-gray shadow-sm rounded-xl py-2 mb-2 flex flex-col gap-3">
            <div className="form-group">
              <input
                type="email"
                className="rounded-xl w-full h-10 px-3"
                id="email"
                aria-describedby="emailHelp"
                placeholder="電子郵件"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form-group mb-0">
              <input
                type="password"
                className="rounded-xl w-full h-10 px-3"
                id="password"
                placeholder="密碼"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  });
                }}
              />
            </div>
            <p className="mb-0">
              <small>
                <a
                  href="/accounts/forget-pw"
                  className="no-underline hover:underline text-dark"
                >
                  忘記密碼？
                </a>
              </small>
            </p>

            <p id="wrong-pw" className="hidden mb-0 pt-1 text-center">
              <small className="text-red-500">
                <img className="w-4 h-4 pb-1 pr-1" src={warning} alt="" />
                您輸入的帳號密碼錯誤，請再次確認。
                <a href="/accounts/forget-pw.html" className="text-red-500">
                  <u>忘記密碼？</u>
                </a>
              </small>
            </p>
          </div>
        </div>

        <div className="row justify-content-center mt-2">
          <div className="col-11 col-sm-5">
            <button
              type="submit"
              className="btn btn-block btn-primary w-full"
              onClick={handleSubmit}
            >
              登入
            </button>
          </div>
        </div>
      </form>
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-11 col-sm-5">
          <div className="row">
            <div className="col-5 px-0">
              <hr className="border-sm" />
            </div>
            <div className="col-2 mt-1 px-0 text-center">
              <p className="mb-0 text-dark">或</p>
            </div>
            <div className="col-5 px-0">
              <hr className="border-sm" />
            </div>
          </div>
          <div className="flex justify-center">
            {/* <a
              className="btn btn-block btn-outline-secondary p-2"
              id="btnSignIn"
            > */}
            <Button
              variant="outline-secondary"
              className="p-2"
              onClick={handleGoogleLogin}
            >
              <div className="flex justify-center">
                <img className="mr-1 w-5" src={googleLogo} alt="google logo" />
                <small className="text-dark">透過 Google 登入</small>
              </div>
            </Button>

            {/* </a> */}
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <Button variant="success" href="/accounts/signup">
          建立新帳號
        </Button>
      </div>
    </div>
  );
}
