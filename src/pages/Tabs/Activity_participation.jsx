import { useEffect, useState, useCallback } from "react";
import { getTaskDescription } from "../../utils/Task";
import { useParams, Link } from "react-router-dom";
import image from "../../assets/image_icon.svg";
import { useDropzone } from "react-dropzone";
import { PrepareSubmitProjectComment } from "../../utils/TaskUtils";
import { compressImageToBase64 } from "../../utils/HandleImg";
import { getSDGImage } from "../../utils/Sdg";

export default function ActivityParticipation() {
  const { id } = useParams();
  const [taskDescription, setTaskDescription] = useState(null);
  const [sdgImages, setSdgImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [comment, setComment] = useState("");
  const [Img, setImg] = useState(null);

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
    localStorage.setItem("target", id);
  }, [id]);

  // 上傳圖片
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
          <Link to={`/social-impact/${id}`} className="no-underline text-black">
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
                    alt={`SDG ${index}`}
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
            onClick={() => PrepareSubmitProjectComment(id, comment, Img)}
          >
            提交
          </button>
        </div>
      </div>
    </>
  );
}
