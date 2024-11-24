export const submitSROIForm = async (uuid, email, rawData, file) => {
  const formData = new FormData();
  formData.append("uuid_task", uuid.id);
  formData.append("email", email);
  formData.append("name", rawData.step1.name);
  formData.append("organization", rawData.step1.organization);
  formData.append("gender", rawData.step1.gender);
  formData.append("version", `${import.meta.env.VITE_SROIFORM_VERSION}`);
  formData.append(
    "feedback[ratings][topic][question]",
    "對本活動的「主題」滿意度？"
  );
  formData.append("feedback[ratings][topic][rating]", rawData.step2["1"].radio);
  formData.append(
    "feedback[ratings][topic][reason]",
    rawData.step2["1"].textField
  );
  formData.append(
    "feedback[ratings][time][question]",
    "對本活動的「時間」滿意度？"
  );
  formData.append("feedback[ratings][time][rating]", rawData.step2["2"].radio);
  formData.append(
    "feedback[ratings][time][reason]",
    rawData.step2["2"].textField
  );
  formData.append(
    "feedback[ratings][location][question]",
    "對本活動的「地點」滿意度？"
  );
  formData.append(
    "feedback[ratings][location][rating]",
    rawData.step2["3"].radio
  );
  formData.append(
    "feedback[ratings][location][reason]",
    rawData.step2["3"].textField
  );
  formData.append(
    "feedback[ratings][catering][question]",
    "對本活動的「餐飲」滿意度？"
  );
  formData.append(
    "feedback[ratings][catering][rating]",
    rawData.step2["4"].radio
  );
  formData.append(
    "feedback[ratings][catering][reason]",
    rawData.step2["4"].textField
  );
  formData.append(
    "feedback[ratings][execution][question]",
    "對本活動的「整體執行」滿意度？"
  );
  formData.append(
    "feedback[ratings][execution][rating]",
    rawData.step2["5"].radio
  );
  formData.append(
    "feedback[ratings][execution][reason]",
    rawData.step2["5"].textField
  );
  formData.append(
    "feedback[ratings][overall][question]",
    "對本活動的「整體」滿意度？"
  );
  formData.append(
    "feedback[ratings][overall][rating]",
    rawData.step2["6"].radio
  );
  formData.append(
    "feedback[ratings][overall][reason]",
    rawData.step2["6"].textField
  );
  formData.append(
    "social_impact_assessment[topic1][question]",
    "【經濟1-1】若本活動為收費活動，您願意用多少金額購票？"
  );
  formData.append(
    "social_impact_assessment[topic1][answer]",
    rawData.step3["1.1"].radio
  );
  formData.append(
    "social_impact_assessment[topic2][question]",
    "【經濟1-2】是否在此活動達到合作機會/取得新的工作"
  );
  formData.append(
    "social_impact_assessment[topic2][answer]",
    JSON.stringify(rawData.step3["1.2"])
  );
  formData.append(
    "social_impact_assessment[topic2][sub_question][question]",
    "【經濟1-2-1】在此合作或新的工作中大概產生多少價值"
  );
  formData.append(
    "social_impact_assessment[topic2][sub_question][answer]",
    rawData.step3?.["1.2.1"]?.radio ?? ""
  );
  formData.append(
    "social_impact_assessment[topic3][question]",
    "【社會2-1】參與本活動對您來說，最大的收穫為何？（複選）"
  );
  formData.append(
    "social_impact_assessment[topic3][answers]",
    JSON.stringify(rawData.step3["2.1"])
  );
  formData.append(
    "social_impact_assessment[topic3][sub_question][question]",
    "【社會2-1-1】 延續【社會2-1】，請論述其收穫內容(簡答)"
  );
  formData.append(
    "social_impact_assessment[topic3][sub_question][answer]",
    rawData.step3["2.1.1"].text
  );
  formData.append(
    "social_impact_assessment[topic4][question]",
    "【社會2-2】本活動如果還有其他場次，您會對什麼主題感到興趣？"
  );
  formData.append(
    "social_impact_assessment[topic4][answer]",
    JSON.stringify(rawData.step3["2.2"])
  );
  formData.append(
    "social_impact_assessment[topic4][sub_question][question]",
    "【社會2-2-1】延續社會2-2，為何對於相關議題有所興趣？"
  );
  formData.append(
    "social_impact_assessment[topic4][sub_question][answer]",
    rawData.step3["2.2.1"].text
  );
  formData.append(
    "social_impact_assessment[topic5][question]",
    "【社會2-3】對於本活動所傳遞之議題之認同程度？"
  );
  formData.append(
    "social_impact_assessment[topic5][answer]",
    rawData.step3["2.3"].radio
  );
  formData.append(
    "social_impact_assessment[topic6][question]",
    "【社會2-3-1】延續【社會2-3】為何認同此議題？"
  );
  formData.append(
    "social_impact_assessment[topic6][answer]",
    rawData.step3?.["2.3.1"]?.text ?? ""
  );
  formData.append(
    "social_impact_assessment[topic7][question]",
    "【社會2-4】是否通過此活動與其他共同參與者建立凝聚力？"
  );
  formData.append(
    "social_impact_assessment[topic7][answer]",
    rawData.step3["2.4"].radio
  );
  formData.append(
    "social_impact_assessment[topic8][question]",
    "【社會2-4-1】延續【社會2-4】題目，您認為為何會產生凝聚力"
  );
  formData.append(
    "social_impact_assessment[topic8][answer]",
    rawData.step3["2.4.1"].text
  );
  formData.append(
    "social_impact_assessment[topic9][question]",
    "【社會2-5】在本活動的主要的概念推展中，您認為是否有知識性的提升"
  );
  formData.append(
    "social_impact_assessment[topic9][answer]",
    rawData.step3?.["2.5"]?.radio ?? ""
  );
  formData.append(
    "social_impact_assessment[topic10][question]",
    "【社會2-5-1】延續社會2-5問題，請說明提升的內容"
  );
  formData.append(
    "social_impact_assessment[topic10][answer]",
    rawData.step3?.["2.5.1"]?.text ?? ""
  );
  formData.append(
    "social_impact_assessment[topic11][question]",
    "【社會2-6】是否透過本活動獲得了技能上的提升？"
  );
  formData.append(
    "social_impact_assessment[topic11][answer]",
    rawData.step3["2.6"].radio
  );
  formData.append(
    "social_impact_assessment[topic12][question]",
    "【社會2-6-1】延續社會2-6，實質上達到了多少薪資的提升?"
  );
  formData.append(
    "social_impact_assessment[topic12][answer]",
    rawData.step3?.["2.6.1"]?.radio ?? ""
  );
  formData.append(
    "social_impact_assessment[topic13][question]",
    "【環境3-1】是否透過參與本活動達到減碳，具體行為如下？"
  );
  formData.append(
    "social_impact_assessment[topic13][answer]",
    JSON.stringify(rawData.step3["3.1"])
  );
  formData.append(
    "social_impact_assessment[topic14][question]",
    "【環境3-1-1】延續環境3-1，具體所執行內容，如：清理多少海廢或是使用大眾交通工具之距離？"
  );
  formData.append(
    "social_impact_assessment[topic14][answer]",
    rawData.step3?.["3.1.1"]?.text ?? ""
  );
  formData.append(
    "social_impact_assessment[topic15][question]",
    "【環境3-1-2】延續3-1-1，請上傳并證明減碳行為。"
  );
  formData.append("social_impact_assessment[topic15][file]", file, "[PROXY]");

  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/projects/sroi_feedback`,
      requestOptions
    );

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error("表單資料有誤，請檢查必填欄位是否都已填寫");
        case 401:
          throw new Error("未授權的請求，請重新登入");
        case 403:
          throw new Error("沒有權限執行此操作");
        default:
          throw new Error(`請求失敗 (${response.status})`);
      }
    }

    return response;
  } catch (error) {
    console.error("提交表單時發生錯誤:", error);
    throw error; // 將錯誤往上拋給組件處理
  }
};
