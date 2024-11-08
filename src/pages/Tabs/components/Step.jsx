import { useState } from "react";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  ImpactRadioComponent,
  TextComponent,
  SatisfactionRadioComponent,
} from "./FormComponents";
import { useDispatch, useSelector } from "react-redux";
import {
  setStep1FormData,
  setStep2FormData,
  setStep3FormData,
} from "../../../app/formSlice";

export function Step1() {
  const Step1FormData = useSelector((state) => state.formdata.step1);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(Step1FormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    dispatch(
      setStep1FormData({
        ...formData,
        [name]: value,
      })
    );
  };

  return (
    <div className="w-10/12 md:w-4/5 mx-auto ">
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 border p-4 rounded-xl">
          <h3>社會影響力評估表單</h3>
          <p className="font-bold underline">
            什麼是社會投資報酬率？為何需要進行計算？
          </p>
          <p>
            過去面對各項議題經常以經濟效應做為評估標準，然為了因應社會、環境、經濟等永續發展的趨勢，發展出了社會影響力的評估。
          </p>
          <p>
            社會影響力報告就如同此產品或專案的社會影響力的證明，需由專業人員去做計算與撰寫，而呈現的方式是一個數值為
            SROI (Social Return on Investment) 也就是社會投資報酬率。
          </p>
          <p>
            SROI 是由 Jeremy Nicholas 所創辦的，他是國際社會價值協會（Social
            Value
            International）的執行長，英國第三部門辦公室（相當於台灣衛福部）用這個方法來評估社會福利預算分配。現為廣大在全球使用，做為一個公信力的證明參考。
          </p>
          <p className="font-bold underline">小鎮賦能股份有限公司 製作</p>
        </div>
        <div className="flex flex-col gap-2 border p-4 rounded-xl">
          <label>
            姓名 <span className="text-red">*</span>
          </label>
          <TextField
            id="standard-basic"
            variant="standard"
            sx={{ width: "50%" }}
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 border p-4 rounded-xl">
          <label>
            任職單位/代表單位 <span className="text-red">*</span>
          </label>
          <TextField
            id="standard-basic"
            variant="standard"
            sx={{ width: "50%" }}
            name="organization"
            value={formData.organization}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 border p-4 rounded-xl">
          <label>
            性別 <span className="text-red">*</span>
          </label>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </div>
      </form>
    </div>
  );
}

const theme = createTheme();

export function Step2() {
  const Step2FormData = useSelector((state) => state.formdata.step2);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(Step2FormData);

  const handleSatisfactionRadioChange = (index, value) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [index]: { ...prevValues[index], radio: value },
    }));
    dispatch(
      setStep2FormData({
        ...formData,
        [index]: { ...formData[index], radio: value },
      })
    );
  };

  const handleSatisfactionTextFieldChange = (index, value) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [index]: { ...prevValues[index], textField: value },
    }));
    dispatch(
      setStep2FormData({
        ...formData,
        [index]: { ...formData[index], textField: value },
      })
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="w-full md:w-4/5 mx-auto ">
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 border p-4 rounded-xl">
            <h3>社會影響力評估表單</h3>
            <p className="font-bold">滿意度調查問題</p>
          </div>
          <SatisfactionRadioComponent
            index="1"
            name="主題"
            number="【第一題】"
            onRadioChange={handleSatisfactionRadioChange}
            onTextFieldChange={handleSatisfactionTextFieldChange}
          />
          <SatisfactionRadioComponent
            index="2"
            name="時間"
            number="【第二題】"
            onRadioChange={handleSatisfactionRadioChange}
            onTextFieldChange={handleSatisfactionTextFieldChange}
          />
          <SatisfactionRadioComponent
            index="3"
            name="地點"
            number="【第三題】"
            onRadioChange={handleSatisfactionRadioChange}
            onTextFieldChange={handleSatisfactionTextFieldChange}
          />
          <SatisfactionRadioComponent
            index="4"
            name="餐飲"
            number="【第四題】"
            onRadioChange={handleSatisfactionRadioChange}
            onTextFieldChange={handleSatisfactionTextFieldChange}
          />
          <SatisfactionRadioComponent
            index="5"
            name="流程與行政"
            number="【第五題】"
            onRadioChange={handleSatisfactionRadioChange}
            onTextFieldChange={handleSatisfactionTextFieldChange}
          />
          <SatisfactionRadioComponent
            index="6"
            name="整體"
            number="【第六題】"
            onRadioChange={handleSatisfactionRadioChange}
            onTextFieldChange={handleSatisfactionTextFieldChange}
          />
        </form>
      </div>
    </ThemeProvider>
  );
}

export function Step3() {
  const Step3FormData = useSelector((state) => state.formdata.step3);
  const [formData, setFormData] = useState(Step3FormData);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div className="w-full md:w-4/5 mx-auto ">
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 border p-4 rounded-xl">
          <h3>社會影響力評估表單</h3>
          <p className="font-bold">社會影響力價值評估</p>
          <p>將分為三個面向進行投資報酬率評估，經濟、社會、環境。</p>
          <p>以下的問題將以上述三個面向為架構進行調查</p>
        </div>
        <ImpactRadioComponent
          subKey="1.1"
          title="【經濟1-1】若本活動為收費活動，您願意用多少金額購票？"
          option={[
            "1000元以下",
            "1001元-2000元",
            "2001元-3000元",
            "3001元以上",
          ]}
          isCheck={false}
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <ImpactRadioComponent
          subKey="1.2"
          title="【經濟1-2】是否在此活動達到合作機會/取得新的工作"
          option={["是", "否", "其他"]}
          isCheck={false}
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <ImpactRadioComponent
          subKey="1.2.1"
          title="【經濟1-2-1】在此合作或新的工作中大概產生多少價值"
          subTitle="計算方法：加總參加者所填寫之價值總價，即可算出提升之技能水平。"
          option={[
            "無",
            "5000元以下",
            "5000元-10000元",
            "10000元-30000元",
            "30000元-50000元",
            "50000元以上",
          ]}
          isCheck={false}
          isRequire={false}
          formData={formData}
          setFormData={setFormData}
        />
        <ImpactRadioComponent
          subKey="2.1"
          title="【社會2-1】參與本活動對您來說，最大的收穫為何？（複選）"
          option={[
            "獲得新的知識或觀點",
            "對於自身的工作有所啟發或幫助",
            "coffee break 或休息期間媒合到新的工作機會",
            "尋找到潛在的事業合作對象",
            "其他：",
          ]}
          isCheck={true}
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <TextComponent
          subKey="2.1.1"
          title="【社會2-1-1】 延續【社會2-1】，請論述其收穫內容(簡答)"
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <ImpactRadioComponent
          subKey="2.2"
          title="【社會2-2】本活動如果還有其他場次，您會對什麼主題感到興趣？"
          option={[
            "數位轉型與企業永續治理的連結與發展",
            "產官學研在AI與永續議題應用與發展",
            "AI應用與永續治理發展與應用",
            "科技賦能對於企業永續發展應用與成功案例",
            "其他：",
          ]}
          isCheck={true}
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <TextComponent
          subKey="2.2.1"
          title="【社會2-2-1】延續社會2-2，為何對於相關議題有所興趣？"
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <ImpactRadioComponent
          subKey="2.3"
          title="【社會2-3】對於本活動所傳遞之議題之認同程度？"
          option={["1非常不認同", "2不認同", "3認同", "4非常認同"]}
          isCheck={false}
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <TextComponent
          subKey="2.3.1"
          title="【社會2-3-1】延續【社會2-3】為何認同此議題？"
          formData={formData}
          setFormData={setFormData}
        />
        <ImpactRadioComponent
          subKey="2.4"
          title="【社會2-4】是否通過此活動與其他共同參與者建立凝聚力？"
          option={["1非常不認同", "2不認同", "3認同", "4非常認同"]}
          isCheck={false}
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <TextComponent
          subKey="2.4.1"
          title="【社會2-4-1】延續【社會2-4】題目，您認為為何會產生凝聚力"
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <ImpactRadioComponent
          subKey="2.5"
          title="【社會2-5】在本活動的主要的概念推展中，您認為是否有知識性的提升"
          subTitle="計算方法：
根據對於概念提升的分數，需要達到3分以上並且在質化說明中具體說明提升的內容，即可作為計算人員。"
          option={[
            "1.無提升",
            "2.淺層知識提升",
            "3.中層知識提升",
            "4.深層知識提升",
          ]}
          isCheck={false}
          isRequire={false}
          formData={formData}
          setFormData={setFormData}
        />
        <TextComponent
          subKey="2.5.1"
          title="【社會2-5-1】延續社會2-5問題，請說明提升的內容"
          formData={formData}
          setFormData={setFormData}
        />
        <ImpactRadioComponent
          subKey="2.6"
          title="【社會2-6】是否透過本活動獲得了技能上的提升？"
          option={["是", "否"]}
          isCheck={false}
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <ImpactRadioComponent
          subKey="2.6.1"
          title="【社會2-6-1】延續社會2-6，實質上達到了多少薪資的提升?"
          option={[
            "1000元以下",
            "1000元-3000元",
            "3000元-5000元",
            "3001元以上",
          ]}
          isCheck={false}
          isRequire={false}
          formData={formData}
          setFormData={setFormData}
        />
        <ImpactRadioComponent
          subKey="3.1"
          title="【環境3-1】是否透過參與本活動達到減碳，具體行為如下？"
          option={[
            "無",
            "使用大眾交通工具/共乘",
            "進行淨灘/農廢棄物/海廢再利用",
            "其他：",
          ]}
          isCheck={false}
          isRequire={true}
          formData={formData}
          setFormData={setFormData}
        />
        <TextComponent
          subKey="3.1.1"
          title="【環境3-1-1】延續環境3-1，具體所執行內容，如：清理多少海廢或是使用大眾交通工具之距離？"
          formData={formData}
          setFormData={setFormData}
        />
        <div className="flex flex-col gap-3 border p-4 rounded-xl">
          <label>
            【環境3-1-2】延續3-1-1，請上傳并證明減碳行為。{" "}
            <span className="text-red">*</span>
            <br />
            <span className="text-xs">
              可上傳 1 個支援的檔案，大小上限為 1 MB。
            </span>
          </label>
          <div className="w-full md:w-1/4">
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              新增檔案
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
              />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
