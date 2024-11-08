import useMediaQuery from "@mui/material/useMediaQuery";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setStep3FormData } from "../../../app/formSlice";

export const SatisfactionRadioComponent = ({
  index,
  name,
  number,
  onRadioChange,
  onTextFieldChange,
}) => {
  const matches = useMediaQuery("(min-width:863px)");
  const [radioValue, setRadioValue] = useState("");
  const [textFieldValue, setTextFieldValue] = useState("");

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
        <div className="flex flex-col justify-center items-center gap-2 md:flex-row">
          <label>非常不滿意</label>
          <RadioGroup
            row={matches}
            aria-labelledby="demo-form-control-label-placement"
            name="position"
            value={radioValue}
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="1"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="2"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="3"
              control={<Radio />}
              label="3"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="4"
              control={<Radio />}
              label="4"
              labelPlacement="bottom"
            />
          </RadioGroup>
          <label>非常滿意</label>
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
  subTitle,
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
          <br />
          {subTitle}
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
                  <FormControlLabel
                    key={index}
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
                ))
              : option.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item}
                    control={<Radio />}
                    label={item}
                  />
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
