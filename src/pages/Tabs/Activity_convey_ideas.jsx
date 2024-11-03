import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getTaskDescription, getChildTasks } from "../../utils/Task";
import { useParams } from "react-router-dom";

//Helper function to get SDGs indexes
const getSdgsIndexes = (task) => {
  try {
    const content = task.content.replace(/'/g, '"');
    const contentParsed = JSON.parse(content);
    const sdgsIndexes = [];

    for (let index = 1; index <= 27; index++) {
      if (contentParsed[`sdgs-${index}`] !== "1") {
        continue;
      }
      const sdgsIndex = String(index).padStart(2, "0");
      sdgsIndexes.push(sdgsIndex);
    }

    return sdgsIndexes;
  } catch (error) {
    console.error("Error parsing SDGs:", error);
    return [];
  }
};

const TaskCard = ({ task }) => {
  const taskUrl = `/tasks/activity_convey_ideas/${task.uuid}`;
  const imageUrl = `${import.meta.env.VITE_HOST_URL_TPLANET}${task.thumbnail}`;
  const [sdgImages, setSdgImages] = useState([]);

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
      const images = await Promise.all(
        task.sdgs.map((sdg) => getSDGImage(sdg))
      );
      setSdgImages(images);
    };

    loadImages();
  }, [task.sdgs]);

  return (
    <div className="col-md-6">
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{task.name}</h5>
          <p className="card-text">
            時間：
            <small className="text-muted">{task.period}</small>
          </p>

          <h5>SDGs</h5>
          <div className="my-4 min-h-10 flex w-full">
            {sdgImages.map((src, index) => (
              <img
                key={task.sdgs[index]}
                className="mr-2 mb-2 flex"
                src={src}
                width="30px"
                height="30px"
                alt={`SDG ${task.sdgs[index]}`}
              />
            ))}
          </div>

          <a href="#" onClick="{{child_task.href}}" className="btn btn-primary">
            參與任務
          </a>
        </div>
      </div>
    </div>
  );
};

const ActivityConveyIdeas = () => {
  const [activityData, setActivityData] = useState(null);
  const [parentTask, setParentTask] = useState(null);
  const [childTaskIds, setChildTaskIds] = useState([]);
  const [childTasks, setChildTasks] = useState([]);
  const { id } = useParams();
  console.log(childTasks);

  useEffect(() => {
    if (id) {
      console.log(id);
      const parentTaskString = localStorage.getItem(id);
      if (parentTaskString) {
        try {
          const parentTask = JSON.parse(parentTaskString);
          setParentTask(parentTask);

          // 獲取子任務的 ID
          getChildTasks(id)
            .then((ids) => {
              setChildTaskIds(ids);
              return ids;
            })
            .then((ids) => {
              // 獲取子任務的詳細信息
              return Promise.all(
                ids.map((taskId) => getTaskDescription(taskId))
              );
            })
            .then((tasks) => {
              const updatedTasks = tasks.map((childTask) => {
                let period = childTask.period;
                if (parseInt(childTask.type_task) === 0) {
                  period = parentTask.period;
                }

                const sdgs = getSdgsIndexes(childTask);

                setActivityData({
                  ...parentTask,
                  childTasks,
                });
                return {
                  ...childTask,
                  sdgs,
                  period,
                  href: `/tasks/activity_participation/${childTask.uuid}`,
                };
              });
              setChildTasks(updatedTasks);
            })
            .catch((error) => {
              console.error("Error getting child tasks:", error);
            });
        } catch (error) {
          console.error("Error parsing parentTask JSON:", error);
        }
      }
    }
  }, [id]);

  if (!parentTask && !childTasks && !activityData) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mt-2">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          {parentTask ? parentTask.name : "Loading..."}
        </h1>
        <p className="text-gray-600 mb-6">
          日期: {parentTask ? parentTask.period : "Loading..."}
        </p>
        <div>
          {childTasks.map((task) => (
            <TaskCard key={task.uuid} task={task} />
          ))}
        </div>
      </div>

      {/* <div className="grid gap-4">
        {activityData.childTasks.map((childTask, index) => (
          <Card key={childTask.uuid || index} className="overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">{childTask.name}</h2>

                <div className="text-gray-600">時間：{childTask.period}</div>

                {childTask.sdgs.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">SDGs</h3>
                    <div className="flex flex-wrap gap-2">
                      {childTask.sdgs.map((sdg) => (
                        <span
                          key={sdg}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded"
                        >
                          SDG {sdg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href={childTask.href}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 w-fit"
                >
                  參與任務
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div> */}
    </div>
  );
};

export default ActivityConveyIdeas;
