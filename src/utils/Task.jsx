// 通用的 API 請求函數
const makeRequest = async (url, method, data = null) => {
  try {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const body = data ? new URLSearchParams(data).toString() : null;

    const response = await fetch(url, {
      method,
      headers,
      body,
      credentials: "include", // 如果需要發送 cookies
      mode: "cors", // 明確指定 CORS 模式
    });

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
  const data = {
    email: email,
    task_type: "0",
  };

  return await makeRequest(`/api/tasks/list`, "POST", data);
};

// 獲取任務描述
export const getTaskDescription = async (uuid) => {
  return await makeRequest(`/api/tasks/get/${uuid}`, "GET");
};

// 獲取子任務
export const getChildTasks = async (uuid) => {
  const data = { uuid };
  const result = await makeRequest(`/api/tasks/get_child_tasks`, "POST", data);
  return result.task;
};

// 獲取父任務
export const getParentTask = async (uuid) => {
  const data = { uuid };
  const result = await makeRequest(`/api/tasks/get_parent_task`, "POST", data);
  return result.task;
};

// 獲取任務狀態
export const getTaskStatus = async (uuid) => {
  const email = localStorage.getItem("email"); // 假設使用 localStorage
  const data = {
    uuid: uuid,
    email: email,
  };

  return await makeRequest(`/api/tasks/get_task_status`, "POST", data);
};

// 計算進度
export const calculateProgress = async (uuid) => {
  const email = localStorage.getItem("email");
  const data = {
    uuid: uuid,
    email: email,
  };

  return await makeRequest(`/api/tasks/cal_progress`, "POST", data);
};

// 保存任務
export const taskSave = async (objTask) => {
  const email = localStorage.getItem("email");
  const data = {
    email: email,
    uuid: objTask.uuid,
  };

  try {
    const response = await fetch(`/api/tasks/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

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
  return await makeRequest(`/api/tasks/submit`, "POST", data);
};

// 通過 UUID 保存任務
export const saveTaskByUuid = async (uuidTask) => {
  return await makeRequest(`/api/tasks/get/${uuidTask}`, "GET");
};
