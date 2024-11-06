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
import Loading from "../components/Loading";

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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  async function compressImageToBase64(file) {
    // 設定壓縮選項
    const maxSize = 1024 * 1024; // 1 MB
    const maxWidth = 1024;
    const maxHeight = 1024;

    // 創建 canvas 元素
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // 創建 Image 對象並設置 src
    const img = new Image();
    img.src = await convertToBase64(file);

    return new Promise((resolve, reject) => {
      img.onload = () => {
        // 計算新的寬高比例
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        // 設置 canvas 的寬高並繪製圖像
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);

        // 將 canvas 轉換為 base64 字串
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            if (blob.size > maxSize) {
              reject(new Error("Image size exceeds the maximum allowed size"));
              return;
            }
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.readAsDataURL(blob);
          },
          "image/png",
          0.8 // 設置壓縮質量
        );
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  }

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
        //const base64 = await convertToBase64(file);
        const reader = new FileReader();

        reader.onload = () => {
          setAvatarImg(reader.result);
        };

        reader.readAsDataURL(file);
        const compressedPNGFile = await compressImageToBase64(file);
        //const base64 = await convertToBase64(compressedPNGFile);
        console.log("base64", compressedPNGFile);
        const resultJSON = await uploadAvatarImg(compressedPNGFile);

        if (resultJSON.result) {
          console.log("Avatar updated successfully:", resultJSON);
          alert("更新成功");
          navigate("/eid/about", { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          alert("更新失敗，請洽系統管理員。");
        }
      } catch (error) {
        setError("上傳頭像失敗，請重試");
        alert("上傳頭像失敗，請重試");
        console.error("Avatar upload error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      {loading && <Loading />}

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
                      onClick={() => navigate("/eid/about")}
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
