import googleLogo from "../assets/google-color-svgrepo-com.svg";
import warning from "../assets/warning-icon.svg";
import Button from "react-bootstrap/Button";

export default function Signin() {
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
              />
            </div>
            <div className="form-group mb-0">
              <input
                type="password"
                className="rounded-xl w-full h-10 px-3"
                id="password"
                placeholder="密碼"
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
            <button type="submit" className="btn btn-block btn-primary w-full">
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
            <Button variant="outline-secondary" className="p-2">
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
