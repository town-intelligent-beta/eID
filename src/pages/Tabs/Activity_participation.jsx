import { useEffect, useState, useCallback } from "react";
import { getTaskDescription } from "../../utils/Task";
import { useParams, Link } from "react-router-dom";
import image from "../../assets/image_icon.svg";
import { useDropzone } from "react-dropzone";

// export async function prepareSubmitProjectComment() {
//   try {
//     await prepareUploadTaskComment();

//     // Get task
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString);
//     const uuid = urlParams.get('uuid');

//     const objTarget = await getTaskDescription(uuid);
//     const content = objTarget.content.replace(/'/g, '"');
//     const objTargetContent = JSON.parse(content);

//     // Weight
//     objTarget.ticket = {
//       s1: '0', s2: '0', s3: '0', s4: '0', s5: '0', s6: '0', s7: '0',
//       s8: '0', s9: '0', s10: '0', s11: '0', s12: '0', s13: '0', s14: '0', s15: '0', s16: '0', s17: '0',
//       s18: '0', s19: '0', s20: '0', s21: '0', s22: '0', s23: '0', s24: '0', s25: '0', s26: '0', s27: '0',
//     };

//     for (let index = 1; index <= 27; index++) {
//       objTarget.ticket[`s${index}`] = objTargetContent[`sdgs-${index}`];
//     }

//     // Set ticket to localStorage
//     localStorage.setItem(uuid, JSON.stringify(objTarget));

//     const resultBool1 = await submitTaskTickets(uuid);
//     const resultBool2 = await submitTaskComment();

//     if (resultBool1 && resultBool2) {
//       alert('更新成功');
//       // Redirect
//       window.location.href = '/foot_print.html';
//     } else {
//       alert('更新失敗，請洽系統管理員。');
//       stopLoading();
//     }
//   } catch (error) {
//     console.error('Error preparing project comment:', error);
//   }
// }

export default function ActivityParticipation() {
  const { id } = useParams();
  const [taskDescription, setTaskDescription] = useState(null);
  const [sdgImages, setSdgImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

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
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // 提交評論的邏輯
  const prepareSubmitProjectComment = () => {
    console.log("提交評論");
  };

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
      {/* <div id="loading">
        <div id="loading-text">
          <p>上傳中 ...</p>
        </div>
        <div id="loading-spinner">
          <img src="/static/imgs/loading.png" alt="Loading" />
        </div>
      </div> */}

      {/* <div className="row">
        <div className="col">
          <div className="container-fluid">
            <form>
              <div className="flex mt-3 w-full justify-center">
                <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12 w-1/2">
                  <div className="form-row">
                    <div className="form-group col-12 mb-1">
                      <div
                        id="img_block"
                        className="border d-flex align-items-center justify-content-center h-100"
                      >
                        <button
                          type="button"
                          id="btn_foot_print_img"
                          onClick={uploadFootPrintImg}
                        >
                          <div
                            id="id_upload_foot_print_img"
                            className="bg-contain"
                            style={{
                              backgroundImage:
                                "url(../static/imgs/image_icon.svg)",
                              width: "100px",
                              height: "100px",
                              backgroundRepeat: "no-repeat",
                            }}
                          ></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12 w-1/2">
                  <div className="form-row">
                    <div className="form-group col-12 mb-1">
                      <label
                        htmlFor="inputEvent"
                        className="mb-1"
                        style={{ fontSize: "14px" }}
                      >
                        活動名稱
                      </label>
                      <input
                        id="task_name"
                        type="text"
                        className="form-control form-control-sm"
                        placeholder=""
                        readOnly
                      />
                    </div>
                    <div className="form-group col-12 mb-1">
                      <label
                        htmlFor="inputEvent"
                        className="mb-1"
                        style={{ fontSize: "14px" }}
                      >
                        SDGs
                      </label>
                      <div className="d-flex flex-wrap" id="task_sdgs"></div>
                    </div>
                    <div className="form-group col-12 mb-1">
                      <label
                        htmlFor="inputDatePicker1"
                        className="mb-1"
                        style={{ fontSize: "14px" }}
                      >
                        時間
                      </label>
                      <div className="row">
                        <div className="col-6">
                          <div
                            className="input-group date"
                            data-target-input="nearest"
                          >
                            <input
                              type="text"
                              id="task_start_time"
                              className="form-control form-control-sm datetimepicker-input"
                              data-target="#datetimepicker1"
                            />
                            <div
                              className="input-group-append"
                              data-target="#datetimepicker1"
                              data-toggle="datetimepicker"
                            >
                              <div className="input-group-text">
                                <i className="fa fa-calendar"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className="input-group date"
                            data-target-input="nearest"
                          >
                            <input
                              type="text"
                              id="task_end_time"
                              className="form-control form-control-sm datetimepicker-input"
                              data-target="#datetimepicker1"
                            />
                            <div
                              className="input-group-append"
                              data-target="#datetimepicker1"
                              data-toggle="datetimepicker"
                            >
                              <div className="input-group-text">
                                <i className="fa fa-calendar"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="comment_block" className="form-group col-12 mb-1">
                      <label
                        htmlFor="textareaIdea"
                        className="mb-1"
                        style={{ fontSize: "14px" }}
                      >
                        關係人口評論
                      </label>
                      <textarea
                        className="form-control form-control-sm w-100"
                        id="Idcomment"
                        placeholder=""
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="text-center my-3">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={prepareSubmitProjectComment}
                      >
                        提交
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div> */}
      <div className="flex w-11/12 mx-auto border border-t-gray mt-4">
        <div className="w-1/2">
          <Link to="/foot_print.html" className="no-underline text-black">
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
                placeholder=""
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
            onClick={prepareSubmitProjectComment}
          >
            提交
          </button>
        </div>
      </div>
    </>
  );
}
