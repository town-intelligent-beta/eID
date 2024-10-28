import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import LogOut from "../../assets/outline_logout_black_24dp.png";
import user from "../../assets/pages/user.png";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../utils/Auth";

const EditInfo = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarImg, setAvatarImg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function logout() {
    const jwt = "jwt";
    const resultBool = verifyToken(jwt);

    // Reset LocalStorage
    if (resultBool) {
      localStorage.setItem("jwt", "");
      navigate("/");
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const avatarImg = localStorage.getItem("avatar_img");
    setEmail(email);
    setUsername(user);
    setAvatarImg(`${import.meta.env.VITE_HOST_URL_EID}/${avatarImg}`);
  }, []);

  async function uploadAvatarImg(base64Img) {
    const dataJSON = {
      email: localStorage.getItem("email"),
      img: base64Img,
    };

    const response = await fetch(`/api/accounts/modify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataJSON),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const resultJSON = await response.json();
    return resultJSON;
  }

  const uploadAvatarImage = async () => {
    setLoading(true);
    try {
      await uploadImageFile(427, null, "avatar_img", true);
      const coverImg = document
        .getElementById("avatar_img")
        .style.backgroundImage.replace('url("', "")
        .replace('")', "");
      const resultJSON = await uploadAvatarImg(coverImg);
      if (resultJSON.result) {
        alert("更新成功");
        window.location.replace("/eid.html");
      } else {
        alert("更新失敗，請洽系統管理員。");
      }
    } catch (error) {
      console.error("Error uploading avatar image:", error);
      alert("更新失敗，請洽系統管理員。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div id="loading">
          <div id="loading-text">
            <p>上傳中 ...</p>
          </div>
          <div id="loading-spinner">
            <img src="/static/imgs/loading.png" alt="Loading" />
          </div>
        </div>
      )}

      <div className="h-screen">
        <div className="row">
          <div className="col">
            <div className="container">
              <div className="row mt-5 items-center">
                <div className="col-md-7 pl-0 mb-4">
                  <div className="mb-2 flex gap-2">
                    <label className="col-sm-2 col-form-label">電子郵件</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        id="email"
                        value={email}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <label className="col-sm-2 col-form-label">
                      使用者名稱
                    </label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <Button variant="primary" id="button-addon2">
                        確認
                      </Button>
                    </InputGroup>
                    {/* <div className="col-sm-10 input-group">
                      <input
                        id="username"
                        type="text"
                        className="form-control"
                        aria-label="Dollar amount (with dot and two decimal places)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-primary btn-sm"
                          type="button"
                          onClick={editUsername}
                        >
                          確認
                        </button>
                      </div>
                    </div> */}
                  </div>

                  <div className="flex gap-2">
                    <label className="col-sm-2 col-form-label">Password</label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        aria-label=""
                        aria-describedby=""
                        value="********"
                        readOnly
                      />
                      <Button
                        variant="primary"
                        id="button-addon2"
                        href="/backend/change-pw"
                      >
                        編輯
                      </Button>
                    </InputGroup>
                    {/* <div className="col-sm-10 flex">
                      <input
                        type="text"
                        className="form-control-plaintext"
                        readOnly
                        aria-label="Dollar amount (with dot and two decimal places)"
                        value="********"
                      />
                      <div className="">
                        <button
                          id="change-password-button"
                          className="btn btn-primary btn-sm rounded"
                          type="button"
                        >
                          編輯
                        </button>
                      </div>
                    </div> */}
                  </div>

                  <div className="flex">
                    <button
                      className="bg-light w-full flex items-center justify-center p-2 rounded-lg"
                      onClick={logout}
                    >
                      <img src={LogOut} className="pb-1 mr-2" alt="Logout" />
                      登出
                    </button>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="card">
                    <div
                      id="btn_avatar_img"
                      className="border-1"
                      style={{ border: "solid 2px #fff38d", cursor: "pointer" }}
                      //onClick={uploadAvatarImage}
                    >
                      <div
                        id="avatar_img"
                        className="bg-center rounded-lg"
                        style={{
                          backgroundImage: `url(${avatarImg || user})`,
                          height: "170px",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditInfo;
