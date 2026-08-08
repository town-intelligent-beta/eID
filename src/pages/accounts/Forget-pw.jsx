import { useState } from "react";

export default function ForgetPw() {
  const [email, setEmail] = useState("");

  const forgotPassword = async (email) => {
    const formdata = new FormData();
    formdata.append("email", email);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_EID}/accounts/forgot_password`,
        {
          method: "POST",
          body: formdata,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const resultJSON = await response.json();
      return resultJSON;
    } catch (error) {
      console.error("Error:", error);
      return { result: false };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await forgotPassword(email);

    if (response.result === true) {
      alert("新密碼已郵寄到您的信箱。");
    } else {
      alert("密碼變更失敗，請檢查您的信箱是否正確。");
    }
    setEmail("");
  };

  return (
    <>
      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="row justify-center">
          <div className="col-7 bg-gray rounded-lg pt-2 pb-1">
            <div>
              <p className="mb-2">忘記密碼？</p>
              <p>請輸入電子郵件信箱以重新設定</p>
            </div>
            <div className="form-group">
              <input
                type="email"
                className="rounded-xl w-full h-10 px-3"
                id="email"
                aria-describedby="emailHelp"
                placeholder="電子郵件"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-center mt-2">
              <div className="pb-2 w-full">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-block btn-primary w-full"
                >
                  重設密碼
                </button>
              </div>
            </div>
            <p className="text-center mb-0 pb-2">
              <a
                className="text-dark no-underline"
                href="/accounts/signin.html"
              >
                返回
              </a>
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
