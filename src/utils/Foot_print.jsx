import {
  makeRequest,
  submitTasks,
  getUserUuidTasks,
  getTaskDescription,
  getChildTasks,
} from "./Task.jsx";

export const submitTaskTickets = async (task_UUID) => {
  if (localStorage.getItem(task_UUID) === "") {
    throw new Error("No data found in localStorage for the given task UUID");
  }

  const obj = JSON.parse(localStorage.getItem(task_UUID));
  const dataJSON = {
    uuid: task_UUID,
    "sdgs-1": obj.ticket.s1,
    "sdgs-2": obj.ticket.s2,
    "sdgs-3": obj.ticket.s3,
    "sdgs-4": obj.ticket.s4,
    "sdgs-5": obj.ticket.s5,
    "sdgs-6": obj.ticket.s6,
    "sdgs-7": obj.ticket.s7,
    "sdgs-8": obj.ticket.s8,
    "sdgs-9": obj.ticket.s9,
    "sdgs-10": obj.ticket.s10,
    "sdgs-11": obj.ticket.s11,
    "sdgs-12": obj.ticket.s12,
    "sdgs-13": obj.ticket.s13,
    "sdgs-14": obj.ticket.s14,
    "sdgs-15": obj.ticket.s15,
    "sdgs-16": obj.ticket.s16,
    "sdgs-17": obj.ticket.s17,
    "sdgs-18": obj.ticket.s18,
    "sdgs-19": obj.ticket.s19,
    "sdgs-20": obj.ticket.s20,
    "sdgs-21": obj.ticket.s21,
    "sdgs-22": obj.ticket.s22,
    "sdgs-23": obj.ticket.s23,
    "sdgs-24": obj.ticket.s24,
    "sdgs-25": obj.ticket.s25,
    "sdgs-26": obj.ticket.s26,
    "sdgs-27": obj.ticket.s27,
  };

  try {
    const taskWeight = await submitTasks(dataJSON);
    localStorage.setItem("project_weight", taskWeight);
    return taskWeight;
  } catch (error) {
    console.error("Error submitting task tickets:", error);
    throw error;
  }
};

export const submitTaskComment = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uuid = urlParams.get("uuid");

  const dataJSON = {
    uuid,
    email: localStorage.getItem("email"),
    comment: document.getElementById("Idcomment").value,
    img: document
      .getElementById("id_upload_foot_print_img")
      .style.backgroundImage.replace('url("', "")
      .replace('")', ""),
  };

  try {
    const resultBool = await commentProject(dataJSON);
    return resultBool;
  } catch (error) {
    console.error("Error submitting task comment:", error);
    throw error;
  }
};

export const updateNodeData = async (baseNodes, baseLinks) => {
  let list_task_UUIDs = [];
  const str_list_task_UUIDs = localStorage.getItem("list_tasks");

  if (str_list_task_UUIDs === "") {
    try {
      const resultJSON = await getUserUuidTasks(localStorage.getItem("email"));
      list_task_UUIDs = resultJSON.uuid;
    } catch (error) {
      console.error("Error getting user tasks:", error);
    }
  } else {
    list_task_UUIDs = str_list_task_UUIDs.split(",");
  }

  // 提交所有任務
  for (const task_UUID of list_task_UUIDs) {
    await submitTaskTickets(task_UUID);
  }

  // 更新表格數據
  await updateTableData();

  // 獲取個人權重
  const new_personal_node = [];
  for (const task_UUID of list_task_UUIDs) {
    const taskData = localStorage.getItem(task_UUID);
    if (taskData === "") continue;

    const obj = JSON.parse(taskData);
    for (let index_sdgs = 1; index_sdgs < 28; index_sdgs++) {
      if (obj.ticket[`s${index_sdgs}`] !== "0") {
        const obj_personal = {
          id: `personal-${task_UUID}-${index_sdgs}`,
          group: 18,
          label: "個人",
        };
        baseNodes.push(obj_personal);

        new_personal_node.push({
          nodeid: obj_personal.id,
          source: index_sdgs,
        });
      }
    }
  }

  // 獲取專案權重
  let projectWeight = {};
  const list_uuid_project = [];

  for (const task_UUID of list_task_UUIDs) {
    const obj_task = await getTaskDescription(task_UUID);
    const uuid_project = obj_task.thumbnail.split("/")[3];

    if (uuid_project && !list_uuid_project.includes(uuid_project)) {
      list_uuid_project.push(uuid_project);
      const weight = getProjectWeight(task_UUID);
      projectWeight = addWeight(projectWeight, weight);
    }
  }

  const new_project_node = [];
  for (let index = 1; index < 28; index++) {
    if (projectWeight[`sdgs-${index}`] !== "0") {
      for (
        let count = 0;
        count < parseInt(projectWeight[`sdgs-${index}`]);
        count++
      ) {
        const obj_project = {
          id: `cumulative-${index}-${count}`,
          group: 19,
          label: "專案",
          level: 4,
        };
        baseNodes.push(obj_project);

        new_project_node.push({
          nodeid: obj_project.id,
          source: index,
        });
      }
    }
  }

  // 更新鏈接
  for (const obj of new_personal_node) {
    baseLinks.push({
      target: obj.nodeid,
      source: `SDG-${obj.source}`,
      strength: 0.5,
    });
  }

  for (const obj of new_project_node) {
    baseLinks.push({
      target: obj.nodeid,
      source: `SDG-${obj.source}`,
      strength: 0.5,
    });
  }

  return [baseNodes, baseLinks];
};

export const updateTableData = async () => {
  let list_task_UUIDs = [];
  const str_list_task_UUIDs = localStorage.getItem("list_tasks");

  if (str_list_task_UUIDs === "") {
    try {
      const resultJSON = await getUserUuidTasks(localStorage.getItem("email"));
      list_task_UUIDs = resultJSON.uuid;
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      return;
    }
  } else {
    try {
      list_task_UUIDs = str_list_task_UUIDs.split(",");
    } catch (error) {
      console.error("Error parsing task UUIDs:", error);
      return;
    }
  }

  const list_child_tasks = await Promise.all(
    list_task_UUIDs.map((taskUUID) => getChildTasks(taskUUID))
  );

  // Project weight
  let projectWeight = {};
  const list_uuid_project = [];

  for (const taskUUID of list_task_UUIDs) {
    const obj_task = await getTaskDescription(taskUUID);
    const uuid_project = obj_task.thumbnail.split("/")[3];

    if (uuid_project && !list_uuid_project.includes(uuid_project)) {
      list_uuid_project.push(uuid_project);
      const weight = getProjectWeight(taskUUID);
      projectWeight = addWeight(projectWeight, weight);
    }
  }

  try {
    for (let index = 1; index <= 27; index++) {
      document.getElementById("project_s" + index).innerHTML =
        projectWeight["sdgs-" + index] || 0;
    }
  } catch (error) {
    console.error("Error updating project weights:", error);
  }

  // Personal
  try {
    const uuid_target = localStorage.getItem("target");
    if (uuid_target === "") return;

    const obj_target = JSON.parse(localStorage.getItem(uuid_target));
    const obj_ticket = obj_target.ticket;

    for (let index = 1; index <= 27; index++) {
      if (obj_ticket["s" + index] !== "1") continue;
      document.getElementById("person_s" + index).innerHTML = (
        parseInt(document.getElementById("person_s" + index).innerHTML) +
        parseInt(obj_ticket["s" + index])
      ).toString();
    }
  } catch (error) {
    console.error("Error updating personal weights:", error);
  }
};

export const getProjectWeight = async (uuid_task) => {
  const formData = new FormData();
  formData.append("uuid", uuid_task);

  try {
    const projectWeight = await makeRequest(
      `${import.meta.env.VITE_HOST_URL_EID}/projects/weight`,
      "POST",
      formData
    );
    return projectWeight;
  } catch (error) {
    console.error("Error fetching project weight:", error);
    throw error;
  }
};

export const commentProject = async (dataJSON) => {
  const formData = new FormData();
  Object.keys(dataJSON).forEach((key) => {
    formData.append(key, dataJSON[key]);
  });

  try {
    const result = await makeRequest(
      `${import.meta.env.VITE_HOST_URL_EID}/projects/comment`,
      "POST",
      formData
    );
    return result;
  } catch (error) {
    console.error("Error submitting project comment:", error);
    throw error;
  }
};

export function addWeight(w1, w2) {
  const combined = [w1, w2].reduce((a, obj) => {
    Object.entries(obj).forEach(([key, val]) => {
      a[key] = (parseInt(a[key]) || 0) + parseInt(val);
    });
    return a;
  });

  return combined;
}
