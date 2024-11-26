import React, { useEffect, useState } from "react";
import {
  getTaskStatus,
  calculateProgress,
  getTaskDescription,
  getUserUuidTasks,
} from "../../utils/Task";
import Watermark from "../../assets/verified-icon.png";

const TaskCard = ({ task, isVerified }) => {
  const taskUrl = `/eid/issue/tasks/activity_convey_ideas/${task.uuid}`;
  const imageUrl = `${import.meta.env.VITE_HOST_URL_TPLANET}${task.thumbnail}`;

  const TaskImage = () => (
    <img
      id={`task_cover_${task.uuid}`}
      src={imageUrl}
      width="160"
      height="160"
      alt={task.name}
      className="w-full h-40 object-contain"
    />
  );

  const WatermarkedImage = () => (
    <div className="relative">
      <TaskImage />
      <img
        src={Watermark}
        className="absolute top-0 left-0 z-[1000] opacity-50 scale-50 transform -translate-x-1/4 -translate-y-1/4 "
        alt="verified"
      />
    </div>
  );

  return (
    <div className="col-md-4">
      <div className="card p-3 mb-2 text-center flex min-h-80 max-h-80 flex-col justify-between">
        <a href={taskUrl} className="block">
          {isVerified ? <WatermarkedImage /> : <TaskImage />}
        </a>
        <div className="card p-4">{task.name}</div>
      </div>
    </div>
  );
};

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [verifiedTasks, setVerifiedTasks] = useState(new Set());

  const updateTicket = (uuidTarget, objTarget) => {
    localStorage.setItem(uuidTarget, JSON.stringify(objTarget));
  };

  const checkTaskVerified = async (uuid) => {
    try {
      const taskStatus = await getTaskStatus(uuid);

      if (taskStatus.content === 1) {
        return true;
      }

      if (taskStatus.content === 0) {
        const taskProgress = await calculateProgress(uuid);
        const taskContent = taskProgress.content;
        if (
          taskContent.all.length !== 0 &&
          taskContent.verified.length === taskContent.all.length
        ) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error checking task verification:", error);
      return false;
    }
  };

  const getTaskInfo = async (reqUuidTask, setPage = 1) => {
    try {
      const resultJSON = await getTaskDescription(reqUuidTask);

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

      const taskData = {
        ...resultJSON,
        ticket: dataJSON,
      };

      localStorage.setItem(resultJSON.uuid, JSON.stringify(taskData));
      updateTicket(reqUuidTask, taskData);

      if (setPage === 1) {
        setTasks((prevTasks) => {
          const exists = prevTasks.some((task) => task.uuid === taskData.uuid);
          if (!exists) {
            return [...prevTasks, taskData];
          }
          return prevTasks;
        });

        const isVerified = await checkTaskVerified(taskData.uuid);
        if (isVerified) {
          setVerifiedTasks((prev) => new Set([...prev, taskData.uuid]));
        }
      }
    } catch (error) {
      console.error("Error getting task info:", error);
    }
  };

  const listIssues = async (email) => {
    try {
      const resultJSON = await getUserUuidTasks(email);
      localStorage.setItem("list_tasks", JSON.stringify(resultJSON.uuid));

      await Promise.all(
        resultJSON.uuid.map(async (uuid) => {
          const storedTask = localStorage.getItem(uuid);
          if (storedTask) {
            const parsedTask = JSON.parse(storedTask);
            if (parsedTask.ticket) {
              setTasks((prevTasks) => {
                if (!prevTasks.some((task) => task.uuid === parsedTask.uuid)) {
                  return [...prevTasks, parsedTask];
                }
                return prevTasks;
              });

              const isVerified = await checkTaskVerified(uuid);
              if (isVerified) {
                setVerifiedTasks((prev) => new Set([...prev, uuid]));
              }
              return;
            }
          }
          await getTaskInfo(uuid);
        })
      );
    } catch (error) {
      console.error("Error listing issues:", error);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      listIssues(email);
    }
  }, []);

  return (
    <div className="row mt-5">
      {tasks.map((task) => (
        <TaskCard
          key={task.uuid}
          task={task}
          isVerified={verifiedTasks.has(task.uuid)}
        />
      ))}
    </div>
  );
}
