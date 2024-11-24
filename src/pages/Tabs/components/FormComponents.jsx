import useMediaQuery from "@mui/material/useMediaQuery";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStep3FormData } from "../../../app/formSlice";
import { checkbox } from "@material-tailwind/react";

export const SatisfactionRadioComponent = ({
  index,
  name,
  number,
  onRadioChange,
  onTextFieldChange,
  value,
}) => {
  const matches = useMediaQuery("(min-width:863px)");
  const [radioValue, setRadioValue] = useState(value?.radio || "");
  const [textFieldValue, setTextFieldValue] = useState(value?.textField || "");

  // 當 value 改變時更新本地 state
  useEffect(() => {
    if (value) {
      setRadioValue(value.radio || "");
      setTextFieldValue(value.textField || "");
    }
  }, [value]);

  const handleRadioChange = (event) => {
    const newRadioValue = event.target.value;
    setRadioValue(newRadioValue);
    onRadioChange(index, newRadioValue);
  };

  const handleTextFieldChange = (event) => {
    const newTextFieldValue = event.target.value;
    setTextFieldValue(newTextFieldValue);
    onTextFieldChange(index, newTextFieldValue);
  };

  return (
    <>
      <div className="flex flex-col gap-3 border p-4 rounded-xl">
        <label>
          {index}. 對本活動的「{name}」安排滿意度？{" "}
          <span className="text-red">*</span>
        </label>
        <div className="mx-auto md:flex md:justify-center md:items-center">
          <label className="hidden md:flex">非常不滿意</label>
          <RadioGroup
            row
            aria-labelledby="demo-form-control-label-placement"
            name="position"
            value={radioValue}
            onChange={handleRadioChange}
          >
            {[1, 2, 3, 4].map((item, index) => (
              <FormControlLabel
                key={index}
                value={item}
                control={<Radio />}
                label={item}
                labelPlacement="bottom"
                sx={{ margin: matches ? "0 1rem" : "0" }}
              />
            ))}
          </RadioGroup>
          <div className="flex justify-between md:hidden">
            <label className="text-xs">非常不滿意</label>
            <label className="text-xs">非常滿意</label>
          </div>
          <label className="hidden md:flex">非常滿意</label>
        </div>
      </div>
      <div className="flex flex-col gap-3 border p-4 rounded-xl">
        <label>{number}若填寫低於2分，請填寫原因</label>
        <TextField
          id="standard-basic"
          variant="standard"
          sx={{ width: "60%" }}
          value={textFieldValue}
          onChange={handleTextFieldChange}
        />
      </div>
    </>
  );
};

export const ImpactRadioComponent = ({
  subKey,
  title,
  option,
  isCheck,
  isRequire,
  formData,
  setFormData,
}) => {
  const dispatch = useDispatch();

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const newValues = checked
      ? [...(formData[subKey]?.checkbox || []), value]
      : (formData[subKey]?.checkbox || []).filter((v) => v !== value);

    setFormData((prevValues) => ({
      ...prevValues,
      [subKey]: { ...prevValues[subKey], checkbox: newValues },
    }));
    dispatch(
      setStep3FormData({
        ...formData,
        [subKey]: { ...formData[subKey], checkbox: newValues },
      })
    );
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setFormData((prevValues) => ({
      ...prevValues,
      [subKey]: { ...prevValues[subKey], radio: value },
    }));
    dispatch(
      setStep3FormData({
        ...formData,
        [subKey]: { ...formData[subKey], radio: value },
      })
    );
  };

  return (
    <>
      <div className="flex flex-col gap-2 border p-4 rounded-xl">
        <label>
          {title}
          {isRequire && <span className="text-red">*</span>}
        </label>
        <div className="flex justify-start items-center gap-2">
          <RadioGroup
            aria-labelledby="demo-form-control-label-placement"
            name="position"
            value={formData[subKey]?.radio || ""}
            onChange={handleRadioChange}
          >
            {isCheck
              ? option.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FormControlLabel
                      value={item}
                      control={
                        <Checkbox
                          checked={(formData[subKey]?.checkbox || []).includes(
                            item
                          )}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={item}
                    />
                    {item === "其他" && (
                      <TextField
                        size="small"
                        variant="standard"
                        sx={{ width: "50%" }}
                        value={formData[subKey]?.otherText || ""}
                        onChange={(e) => {
                          setFormData((prevValues) => ({
                            ...prevValues,
                            [subKey]: {
                              ...prevValues[subKey],
                              otherText: e.target.value,
                            },
                          }));
                          dispatch(
                            setStep3FormData({
                              ...formData,
                              [subKey]: {
                                ...formData[subKey],
                                otherText: e.target.value,
                              },
                            })
                          );
                        }}
                      />
                    )}
                  </div>
                ))
              : option.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FormControlLabel
                      value={item}
                      control={<Radio />}
                      label={item}
                    />
                    {item === "其他" && (
                      <TextField
                        size="small"
                        variant="standard"
                        sx={{ width: "50%" }}
                        value={formData[subKey]?.otherText || ""}
                        onChange={(e) => {
                          setFormData((prevValues) => ({
                            ...prevValues,
                            [subKey]: {
                              ...prevValues[subKey],
                              otherText: e.target.value,
                            },
                          }));
                          dispatch(
                            setStep3FormData({
                              ...formData,
                              [subKey]: {
                                ...formData[subKey],
                                otherText: e.target.value,
                              },
                            })
                          );
                        }}
                      />
                    )}
                  </div>
                ))}
          </RadioGroup>
        </div>
      </div>
    </>
  );
};

export const TextComponent = ({
  title,
  isRequire,
  subKey,
  formData,
  setFormData,
}) => {
  const dispatch = useDispatch();

  const handleTextChange = (event) => {
    const { value } = event.target;
    setFormData((prevValues) => ({
      ...prevValues,
      [subKey]: { ...prevValues[subKey], text: value },
    }));
    dispatch(
      setStep3FormData({
        ...formData,
        [subKey]: { ...formData[subKey], text: value },
      })
    );
  };
  return (
    <div className="flex flex-col gap-3 border p-4 rounded-xl">
      <label>
        {title} {isRequire && <span className="text-red">*</span>}
      </label>
      <TextField
        id="standard-basic"
        variant="standard"
        sx={{ width: "100%" }}
        value={formData[subKey]?.text || ""}
        onChange={handleTextChange}
      />
    </div>
  );
};

SatisfactionRadioComponent.propTypes = {
  index: PropTypes.string,
  name: PropTypes.string,
  number: PropTypes.string,
  onRadioChange: PropTypes.func,
  onTextFieldChange: PropTypes.func,
  value: PropTypes.shape({
    radio: PropTypes.string,
    textField: PropTypes.string,
  }),
};

ImpactRadioComponent.propTypes = {
  subKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  option: PropTypes.arrayOf(PropTypes.string).isRequired,
  isCheck: PropTypes.bool.isRequired,
  isRequire: PropTypes.bool.isRequired,
  subTitle: PropTypes.string,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

TextComponent.propTypes = {
  title: PropTypes.string,
  isRequire: PropTypes.bool,
  subKey: PropTypes.string,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};
