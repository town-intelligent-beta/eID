// 通用的 API 請求函數
export const makeRequest = async (url, method, data = null) => {
  try {
    // GET 请求不應包含 body
    const config = {
      method,
      credentials: "include", // 確保帶上 cookies
    };

    if (method !== "GET" && data) {
      config.body = data; // POST/PUT等請求包含body
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// 獲取用戶任務列表
export const getUserUuidTasks = async (email) => {
  const formdata = new FormData();
  formdata.append("email", email);
  formdata.append("task_type", "0");

  return await makeRequest(
    `${import.meta.env.VITE_HOST_URL_EID}/tasks/list`,
    "POST",
    formdata
  );
};

// 獲取任務描述
export const getTaskDescription = async (uuid) => {
  return await makeRequest(
    `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/get/${uuid}`,
    "GET"
  );
};

// 獲取子任務
export const getChildTasks = async (uuid) => {
  const formdata = new FormData();
  formdata.append("uuid", uuid);
  const result = await makeRequest(
    `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/get_child_tasks`,
    "POST",
    formdata
  );
  return result.task;
};

// 獲取父任務
export const getParentTask = async (uuid) => {
  const data = { uuid };
  const formdata = new FormData();
  formdata.append("uuid", uuid);
  const result = await makeRequest(
    `${import.meta.env.VITE_HOST_URL_EID}/tasks/get_parent_task`,
    "POST",
    formdata
  );
  return result.task;
};

// 獲取任務狀態
export const getTaskStatus = async (uuid) => {
  const email = localStorage.getItem("email"); // 假設使用 localStorage

  const formdata = new FormData();
  formdata.append("uuid", uuid);
  formdata.append("email", email);
  return await makeRequest(
    `${import.meta.env.VITE_HOST_URL_EID}/tasks/get_task_status`,
    "POST",
    formdata
  );
};

// 計算進度
export const calculateProgress = async (uuid) => {
  const email = localStorage.getItem("email");
  const formdata = new FormData();
  formdata.append("uuid", uuid);
  formdata.append("email", email);

  return await makeRequest(
    `${import.meta.env.VITE_HOST_URL_EID}/tasks/cal_progress`,
    "POST",
    formdata
  );
};

// 保存任務
export const taskSave = async (objTask) => {
  const email = localStorage.getItem("email");
  const formdata = new FormData();
  formdata.append("uuid", objTask.uuid);
  formdata.append("email", email);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_EID}/tasks/save`,
      {
        method: "POST",
        body: formdata,
        credentials: "include",
      }
    );

    const responseText = await response.text();
    return {
      result: response.ok,
      content: responseText,
    };
  } catch (error) {
    console.error("Save task failed:", error);
    return {
      result: false,
      content: error.message,
    };
  }
};

// 提交任務
export const submitTasks = async (data) => {
  return await makeRequest(
    `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/submit`,
    "POST",
    data
  );
};

// 通過 UUID 保存任務
export const saveTaskByUuid = async (uuidTask) => {
  return await makeRequest(
    `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/get/${uuidTask}`,
    "GET"
  );
};
