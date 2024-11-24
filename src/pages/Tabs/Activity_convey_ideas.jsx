import React, { useEffect, useState } from "react";
import { getTaskDescription, getChildTasks } from "../../utils/Task";
import { useParams } from "react-router-dom";
import { getSdgsIndexes, getSDGImage } from "../../utils/Sdg";
import PropTypes from "prop-types";

const TaskCard = ({ task }) => {
  const taskUrl = `/eid/issue/tasks/activity_participation/${task.uuid}`;
  //const imageUrl = `${import.meta.env.VITE_HOST_URL_TPLANET}${task.thumbnail}`;
  const [sdgImages, setSdgImages] = useState([]);

  // const TaskImage = () => (
  //   <img
  //     id={`task_cover_${task.uuid}`}
  //     src={imageUrl}
  //     width="160"
  //     height="160"
  //     alt={task.name}
  //     className="w-full h-40 object-contain"
  //   />
  // );

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
          <div className="my-4 min-h-10 flex w-full flex-wrap">
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

          <a href={taskUrl} className="btn btn-primary">
            參與任務
          </a>
        </div>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string.isRequired,
    sdgs: PropTypes.arrayOf(PropTypes.string).isRequired,
    period: PropTypes.string.isRequired,
  }).isRequired,
};

const ActivityConveyIdeas = () => {
  //const [activityData, setActivityData] = useState(null);
  const [parentTask, setParentTask] = useState(null);
  //const [childTaskIds, setChildTaskIds] = useState([]);
  const [childTasks, setChildTasks] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const parentTaskString = localStorage.getItem(id);
      if (parentTaskString) {
        try {
          const parentTask = JSON.parse(parentTaskString);
          setParentTask(parentTask);

          // 獲取子任務的 ID
          getChildTasks(id)
            .then((ids) => {
              //setChildTaskIds(ids);
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

                // setActivityData({
                //   ...parentTask,
                //   childTasks,
                // });
                return {
                  ...childTask,
                  sdgs,
                  period,
                  href: `/eid/issue/tasks/activity_participation/${childTask.uuid}`,
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

  if (!parentTask && !childTasks) {
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
    </div>
  );
};

export default ActivityConveyIdeas;
