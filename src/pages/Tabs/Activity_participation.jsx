import { useEffect, useState, useCallback } from "react";
import { getTaskDescription } from "../../utils/Task";
import { useParams, Link, useNavigate } from "react-router-dom";
import image from "../../assets/image_icon.svg";
import { useDropzone } from "react-dropzone";
import { submitTaskComment, submitTaskTickets } from "../../utils/Foot_print";

async function PrepareSubmitProjectComment({ id, comment, img }) {
  try {
    // 檢查必要參數
    if (!id || !comment) {
      throw new Error("請填寫完整資料");
    }

    // 取得使用者資訊
    const email = localStorage.getItem("email");

    // 取得任務描述
    const objTarget = await getTaskDescription(id);
    if (!objTarget || !objTarget.content) {
      throw new Error("無法取得任務資料");
    }

    let objTargetContent;
    try {
      objTargetContent = JSON.parse(objTarget.content.replace(/'/g, '"'));
    } catch (parseError) {
      console.error("解析任務內容失敗:", parseError);
      throw new Error("任務資料格式錯誤");
    }

    // Weight
    objTarget.ticket = {
      s1: "0",
      s2: "0",
      s3: "0",
      s4: "0",
      s5: "0",
      s6: "0",
      s7: "0",
      s8: "0",
      s9: "0",
      s10: "0",
      s11: "0",
      s12: "0",
      s13: "0",
      s14: "0",
      s15: "0",
      s16: "0",
      s17: "0",
      s18: "0",
      s19: "0",
      s20: "0",
      s21: "0",
      s22: "0",
      s23: "0",
      s24: "0",
      s25: "0",
      s26: "0",
      s27: "0",
    };

    // 設置 SDGS 權重
    for (let index = 1; index <= 27; index++) {
      const key = `s${index}`;
      const sdgsKey = `sdgs-${index}`;
      objTarget.ticket[key] = objTargetContent[sdgsKey] || "0";
    }

    // 儲存到 localStorage
    try {
      localStorage.setItem(id, JSON.stringify(objTarget));
    } catch (storageError) {
      console.error("儲存到 localStorage 失敗:", storageError);
      throw new Error("儲存資料失敗");
    }

    // 準備提交資料
    const dataJSON = {
      uuid: id,
      email,
      comment,
      img,
    };

    // 同時提交 ticket 和評論
    const [ticketResult, commentResult] = await Promise.all([
      submitTaskTickets(id),
      submitTaskComment(dataJSON),
    ]);

    if (!ticketResult || !commentResult) {
      throw new Error("提交資料失敗");
    }

    alert("更新成功");
    window.location.href = "/eid/foot_print";
    return true;
  } catch (error) {
    console.error("PrepareSubmitProjectComment 錯誤:", error);
    alert(error.message || "更新失敗，請洽系統管理員。");
    return false;
  }
}

export default function ActivityParticipation() {
  const { id } = useParams();
  const [taskDescription, setTaskDescription] = useState(null);
  const [sdgImages, setSdgImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [comment, setComment] = useState("");
  const [Img, setImg] = useState(null);

  // 取得 SDG 圖片
  const getSDGImage = async (sdg) => {
    try {
      const image = await import(`../../assets/SDGS/E_WEB_${sdg}.png`);
      return image.default;
    } catch (error) {
      console.error("Error loading SDG image:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      if (taskDescription && taskDescription.content) {
        const contentParsed = JSON.parse(
          taskDescription.content.replace(/'/g, '"')
        );
        const sdgsIndexes = Object.entries(contentParsed)
          .filter(([key, value]) => value === "1")
          .map(([key]) => key.split("-")[1].padStart(2, "0"));

        const images = await Promise.all(
          sdgsIndexes.map((sdg) => getSDGImage(sdg))
        );
        setSdgImages(images);
      }
    };

    loadImages();
  }, [taskDescription]);

  useEffect(() => {
    const fetchTaskDescription = async () => {
      try {
        const taskDescription = await getTaskDescription(id);
        setTaskDescription(taskDescription);
      } catch (error) {
        console.error("Error fetching task description:", error);
      }
    };

    fetchTaskDescription();
  }, [id]);

  // 上傳圖片
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

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
    const base64 = compressImageToBase64(file);
    setImg(base64);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const getStartTime = (period) => {
    if (!period) return "";
    return period.split("-")[0].trim();
  };

  const getEndTime = (period) => {
    if (!period) return "";
    return period.split("-")[1].trim();
  };

  return (
    <>
      <div className="flex w-11/12 mx-auto border border-t-gray mt-4">
        <div className="w-1/2">
          <Link to="/social-impact" className="no-underline text-black">
            <div className="bg-main p-2 w-5/6 m-4 rounded-lg text-center mx-auto">
              社會影響力評估表單
            </div>
          </Link>
          <div
            id="img_block"
            className="border flex items-center justify-center h-80 m-2 cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {uploadedImage ? (
              <div
                id="id_upload_foot_print_img"
                className="bg-contain"
                style={{
                  backgroundImage: `url(${uploadedImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  width: "75%",
                  height: "100%",
                }}
              ></div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <img src={image} alt="upload" className="w-full" />
                <p className="text-sm">（請上傳照片）</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2 mt-6">
          <div className="form-row m-2">
            <div className="form-group col-12 mb-1">
              <label htmlFor="inputEvent" className="mb-1 text-xl">
                活動名稱
              </label>
              <input
                id="task_name"
                type="text"
                className="form-control form-control-sm"
                placeholder={taskDescription?.name}
                readOnly
              />
            </div>
            <div className="form-group col-12 mb-1">
              <label htmlFor="inputEvent" className="mb-1 text-xl">
                SDGs
              </label>
              <div className="my-4 min-h-10 flex w-full flex-wrap">
                {sdgImages.map((src, index) => (
                  <img
                    key={[index]}
                    className="mr-2 mb-2 flex"
                    src={src}
                    width={36}
                    height={36}
                    //alt={`SDG ${sdgs[index]}`}
                  />
                ))}
              </div>
            </div>
            <div className="form-group col-12 mb-1">
              <label htmlFor="inputDatePicker1" className="mb-1 text-xl">
                時間
              </label>
              <div className="flex">
                <div>
                  <div className="input-group date" data-target-input="nearest">
                    <input
                      type="text"
                      id="task_start_time"
                      className="form-control form-control-sm datetimepicker-input"
                      data-target="#datetimepicker1"
                      placeholder={getStartTime(taskDescription?.period)}
                      readOnly
                    />
                  </div>
                </div>
                <div className="w-6 border border-gray mx-2 my-auto"></div>
                <div>
                  <div className="input-group date" data-target-input="nearest">
                    <input
                      type="text"
                      id="task_end_time"
                      className="form-control form-control-sm datetimepicker-input"
                      data-target="#datetimepicker1"
                      placeholder={getEndTime(taskDescription?.period)}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div id="comment_block" className="form-group col-12 mb-1">
              <label htmlFor="textareaIdea" className="mb-1 text-xl">
                關係人口評論
              </label>
              <textarea
                className="form-control form-control-sm w-100"
                id="Idcomment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="text-center my-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => PrepareSubmitProjectComment({ id, comment, Img })}
          >
            提交
          </button>
        </div>
      </div>
    </>
  );
}
