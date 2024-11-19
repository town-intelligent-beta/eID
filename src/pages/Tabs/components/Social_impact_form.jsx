import * as React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Step1, Step2, Step3 } from "./Step";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import enter from "../../../assets/enter.png";
import { useParams } from "react-router-dom";
import { submitSROIForm } from "../../../utils/SROI";

function SubmissionSuccess() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 返回上一頁
  };

  return (
    <>
      <div className="flex items-center h-full">
        <img src={enter} alt="success" className="w-10" />
        <div>非常感謝撥空填寫。</div>
      </div>
      <div className="mt-4">
        <Button
          size="medium"
          variant="contained"
          color="primary"
          onClick={handleBack}
        >
          返回影響力護照
        </Button>
      </div>
    </>
  );
}

function SocialImpactFrom() {
  const uuid = useParams();
  const email = localStorage.getItem("email");
  const theme = useTheme();
  const rawData = useSelector((state) => state.formdata);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [file, setFile] = React.useState(null);

  const steps = [
    {
      page: <Step1 />,
    },
    {
      page: <Step2 />,
    },
    {
      page: <Step3 setFile={setFile} />,
    },
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      return;
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await submitSROIForm(uuid, email, rawData, file);
      alert("Form submitted");
      setIsSubmitted(true);
      console.log(result);
    } catch (error) {
      console.error("Error submitting SROI form:", error);
    }
  };

  return (
    <div className="w-4/5 mx-auto">
      {isSubmitted ? (
        <SubmissionSuccess />
      ) : (
        <>
          <Box sx={{ width: "100%", p: 2 }}>{steps[activeStep].page}</Box>
          <MobileStepper
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              activeStep === maxSteps - 1 ? (
                <Button
                  size="small"
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  送出
                </Button>
              ) : (
                <Button size="small" onClick={handleNext}>
                  下一頁
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              )
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                上一頁
              </Button>
            }
          />
        </>
      )}
    </div>
  );
}

export default SocialImpactFrom;
