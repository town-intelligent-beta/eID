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
  const [error, setError] = useState(false);

  const fetchAvatarImg = async () => {
    const email = localStorage.getItem("email");
    const dataJSON = new FormData();
    dataJSON.append("email", email);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_EID}/accounts/get_avatar_img`,
        {
          method: "POST",
          body: dataJSON,
          credentials: "include",
        }
      );

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

  const signin = async (formdata) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_EID}/accounts/signin`,
        {
          method: "POST",
          body: formdata,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("登入失敗");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(true);
      console.error("登入錯誤:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const result = await signin(formData);

      if (result.token) {
        localStorage.setItem("jwt", result.token);
        localStorage.setItem("username", result.username);
        localStorage.setItem("email", email);
        await fetchAvatarImg();
        navigate("/eid");
      }
    } catch (error) {
      console.error("提交表單時發生錯誤:", error);
    }
  };

  useEffect(() => {
    // Initialize Google API
    const initGoogleClient = () => {
      window.gapi.load("client:auth2", () => {
        window.gapi.client.init({
          clientId:
            "1080674192413-b1vnqslm4gif3p9ntaj4ifl4i572p0bn.apps.googleusercontent.com",
          scope: "profile",
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
          ],
        });
      });
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
    const formData = new FormData();
    formData.append("email", res.result.emailAddresses[0].value);
    formData.append("username", res.result.names[0].displayName);
    formData.append("token", idToken);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_EID}/accounts/oauth/google`,
        {
          method: "POST",
          body: formData,
        }
      );

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
      const authResponse = googleUser.getAuthResponse(true);
      const idToken = authResponse.id_token;

      const peopleResponse = await window.gapi.client.people.people.get({
        resourceName: "people/me",
        personFields: "names,emailAddresses",
      });

      const userEmail = peopleResponse.result.emailAddresses[0].value;
      const resultJSON = await handleEidGoogleLogin(idToken, peopleResponse);

      try {
        localStorage.setItem("jwt", resultJSON.token);
        localStorage.setItem("username", resultJSON.username);
        localStorage.setItem("email", userEmail);
        await fetchAvatarImg();
        navigate("/eid");
      } catch (e) {
        alert("電子郵件或密碼錯誤，請重新輸入。若忘記密碼，請點擊「忘記密碼」。");
      }
    } catch (error) {
      console.error("Google登入失敗:", error);
    }
  };

  return (
    <>
      <form>
        <div className="row justify-content-center mt-3">
          <div className="col-11 col-sm-5 bg-gray shadow-sm rounded-xl py-2 mb-2 flex flex-col gap-3">
            <div className="form-group">
              <input
                type="email"
                className={`rounded-xl w-full h-10 px-3 ${
                  error ? "border-red" : ""
                }`}
                id="email"
                aria-describedby="emailHelp"
                placeholder="電子郵件"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group mb-0">
              <input
                type="password"
                className={`rounded-xl w-full h-10 px-3 ${
                  error ? "border border-red" : ""
                }`}
                placeholder="密碼"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            {error ? (
              <p id="wrong-pw" className="mb-0 pt-1 text-center text-danger">
                <small className="flex gap-2 items-center text-base">
                  <img
                    className="w-8 h-8 pb-1 pr-1"
                    src={warning}
                    alt="Warning"
                  />
                  您輸入的帳號密碼錯誤，請再次確認。
                  <a href="/accounts/forget-pw" className="text-danger">
                    <u>忘記密碼？</u>
                  </a>
                </small>
              </p>
            ) : (
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
            )}
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
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <Button variant="success" href="/accounts/signup">
          建立新帳號
        </Button>
      </div>
    </>
  );
}