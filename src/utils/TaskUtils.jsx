import { getTaskDescription } from "./Task";
import { submitTaskTickets, submitTaskComment } from "./Foot_print";

export async function PrepareSubmitProjectComment(id, comment, img) {
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
