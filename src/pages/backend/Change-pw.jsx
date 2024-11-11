import { useState, useEffect } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (currentPassword && newPassword && confirmPassword) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const changePassword = async (formdata) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_EID}/accounts/modify`,
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
      console.error("Error changing password:", error);
      setErrorMessage("Error changing password");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("新密碼和確認密碼不匹配");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("密碼不得少於8個字元");
      return;
    }

    const formdata = new FormData();
    formdata.append("email", localStorage.getItem("email"));
    formdata.append("username", localStorage.getItem("username"));
    formdata.append("password", newPassword);

    const result = await changePassword(formdata);
    if (result) {
      console.log("Password changed successfully:", result);
      alert("變更密碼成功");
    } else {
      console.error("Failed to change password");
      alert("變更密碼失敗");
    }
  };

  return (
    <>
      <form>
        <div className="row justify-content-center mt-4">
          <div className="col-7 bg-gray py-2 rounded-xl mb-2 flex flex-col gap-3">
            <p className="h4 text-center">變更密碼</p>
            <div className="form-group">
              <input
                type="password"
                className="rounded-xl w-full h-10 px-3"
                id="password0"
                placeholder="請輸入現有密碼"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="rounded-xl w-full h-10 px-3"
                id="password1"
                placeholder="請輸入新密碼"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <small id="war_msg" className="text-xs text-black ml-3">
                密碼不得少於8個字元
              </small>
            </div>
            <div className="form-group mb-0">
              <input
                type="password"
                className="rounded-xl w-full h-10 px-3"
                id="password2"
                placeholder="請再次確認密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <small id="war_msg" className="fz-xs text-danger ml-3">
                {errorMessage}
              </small>
            </div>
            <div className="text-center my-2">
              <button
                type="submit"
                onClick={handleSubmit}
                className={`btn btn-block ${
                  isFormValid ? "btn-primary" : "btn-secondary"
                }`}
                disabled={!isFormValid}
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
