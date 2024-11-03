import { useEffect, useState } from "react";
import {
  //getTaskDescription,
  getUserUuidTasks,
  getTaskStatus,
  calculateProgress,
} from "../../utils/Task";

export default function Issue() {
  // const [issues, setIssues] = useState([]);

  const [issues, setIssues] = useState([
    {
      uuid: "91661248",
      email: "s889951234@gmail.com",
      thumbnail:
        "https://beta-tplanet-backend.4impact.cc/static/project/22381600/tasks/20684066/cover.png",
      gps: true,
    },
  ]);

  function updateTicket(uuidTarget, objTarget) {
    localStorage.setItem(uuidTarget, JSON.stringify(objTarget));
  }

  function setTaskInPage(obj) {
    setIssues((prevIssues) => [...prevIssues, obj]);
  }

  const getTaskInfo = async (reqUuidTask, setPage = 1) => {
    console.log("getTaskInfo", reqUuidTask);
    //const resultJSON = await getTaskDescription(reqUuidTask);
    const getTaskDescription = async (uuid) => {
      console.log(
        "API url",
        `${import.meta.env.VITE_HOST_URL_EID}/tasks/get/${uuid}`
      );
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_EID}/tasks/get/${uuid}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("getTaskDescription", result);
      return result;
    };
    const resultJSON = await getTaskDescription(reqUuidTask);

    try {
      localStorage.setItem(resultJSON.uuid, JSON.stringify(resultJSON));
      const dataJSON = {
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
      };

      resultJSON.ticket = dataJSON;
      updateTicket(reqUuidTask, resultJSON);

      if (setPage === 1) {
        setTaskInPage(JSON.parse(localStorage.getItem(resultJSON.uuid)));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const listIssues = async (email) => {
    const resultJSON = await getUserUuidTasks(email);
    try {
      localStorage.setItem("list_tasks", resultJSON.uuid);
      for (let i = 0; i < resultJSON.uuid.length; i++) {
        let targetTicket = "";
        const storedTask = localStorage.getItem(resultJSON.uuid[i]);
        if (storedTask) {
          const objUuid = JSON.parse(storedTask);
          if (objUuid.ticket) {
            targetTicket = objUuid.ticket;
          }
        }

        if (!storedTask || !targetTicket) {
          getTaskInfo(resultJSON.uuid[i]);
          //console.log("getTaskInfo", resultJSON.uuid[i]);
        } else {
          setTaskInPage(JSON.parse(storedTask));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  /*   useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      listIssues(email);
    }
  }, []); */

  useEffect(() => {
    // 直接調用 API，假設你已知的任務 UUID
    const reqUuidTask = "20684066"; // 替換為實際的 UUID
    getTaskInfo(reqUuidTask);
  }, []);

  const checkTaskVerified = async (uuid) => {
    const resultJSON = { status: false };
    const objTaskStatus = await getTaskStatus(uuid);

    if (objTaskStatus.content === 1) {
      resultJSON.status = true;
      return resultJSON;
    }

    if (objTaskStatus.content === 0) {
      const objTaskProgress = await calculateProgress(uuid);
      const objTaskContent = objTaskProgress.content;
      if (
        objTaskContent.all.length !== 0 &&
        objTaskContent.verified.length === objTaskContent.all.length
      ) {
        resultJSON.status = true;
        return resultJSON;
      }
    }

    return resultJSON;
  };

  function overlayOnTask(img, objParent) {
    return <div className="watermark">{img}</div>;
  }

  console.log("Rendering Issue component...");

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="row mt-5" id="issues-list">
            {issues.map((issue) => {
              const resultTaskVerified = checkTaskVerified(issue.uuid);
              const img = (
                <img
                  id={`task_cover_${issue.uuid}`}
                  src={`${import.meta.env.VITE_HOST_URL_EID}${issue.thumbnail}`}
                  width="160"
                  height="160"
                  alt="Task Cover"
                />
              );

              return (
                <div className="col-md-4" key={issue.uuid}>
                  <div className="card p-3 mb-2 text-center">
                    <a
                      href={`/tasks/activity_convey_ideas.html?task=${issue.uuid}&gps=${issue.gps}`}
                    >
                      {resultTaskVerified.status ? overlayOnTask(img) : img}
                    </a>
                    <div className="card p-4">{issue.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
