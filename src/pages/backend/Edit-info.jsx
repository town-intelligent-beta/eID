import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import LogOut from "../../assets/Logout.png";
import back from "../../assets/back.png";
import user from "../../assets/pages/user.png";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../utils/Auth";
import { useDropzone } from "react-dropzone";

const EditInfo = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarImg, setAvatarImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  //修改使用者名稱
  const modifyUsername = async (username) => {
    const formBody = new FormData();
    formBody.append("email", email);
    formBody.append("username", username);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_EID}/accounts/modify`,
        {
          method: "POST",
          body: formBody,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const resultJSON = await response.json();
      return resultJSON;
    } catch (error) {
      console.error("Error modifying username:", error);
      setError(error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await modifyUsername(username);
    if (result) {
      console.log("Username modified successfully:", result);
      localStorage.setItem("username", username);
      alert("修改成功");
      // 處理修改成功的邏輯
    } else {
      console.error("Failed to modify username");
      alert("修改失敗，請洽系統管理員。");
      // 處理修改失敗的邏輯
    }
  };

  //變更圖片
  const uploadAvatarImg = async (base64Img) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("img", base64Img);

      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_EID}/accounts/modify`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Avatar upload failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Avatar upload error:", error);
      throw error;
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      try {
        setLoading(true);
        setError("");

        const file = acceptedFiles[0];
        const base64 = await convertToBase64(file);
        const reader = new FileReader();

        reader.onload = () => {
          setAvatarImg(reader.result);
        };

        reader.readAsDataURL(file);
        const resultJSON = await uploadAvatarImg(base64);

        if (resultJSON.result) {
          alert("更新成功");
          navigate("/eid");
        } else {
          alert("更新失敗，請洽系統管理員。");
        }
      } catch (error) {
        setError("上傳頭像失敗，請重試");
        console.error("Avatar upload error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
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

      <>
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
                      <Button
                        variant="primary"
                        id="button-addon2"
                        onClick={handleSubmit}
                      >
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

                  <div className="flex gap-4">
                    <button
                      className="bg-light w-full flex items-center justify-center p-2 rounded-lg"
                      onClick={logout}
                    >
                      <img
                        src={LogOut}
                        className="pb-1 mr-2"
                        alt="Logout"
                        width={30}
                      />
                      登出
                    </button>
                    <button
                      className="bg-light w-full flex items-center justify-center p-2 rounded-lg"
                      onClick={() => navigate("/eid")}
                    >
                      <img
                        src={back}
                        className="pb-1 mr-2"
                        alt="Logout"
                        width={30}
                      />
                      返回
                    </button>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="card">
                    <div
                      id="btn_avatar_img"
                      className="border-1"
                      style={{ border: "solid 2px #fff38d", cursor: "pointer" }}
                      {...getRootProps()}
                      //onClick={uploadAvatarImage}
                    >
                      <input {...getInputProps()} />
                      <div
                        id="avatar_img"
                        className="bg-center rounded-lg"
                        style={{
                          backgroundImage: `url(${avatarImg || user})`,
                          height: "170px",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "contain",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default EditInfo;
