import * as React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Step1, Step2, Step3 } from "./Step";
import { useSelector } from "react-redux";

function SocialImpactFrom() {
  const theme = useTheme();
  const formData = useSelector((state) => state.formdata);

  const steps = [
    {
      page: <Step1 />,
    },
    {
      page: <Step2 />,
    },
    {
      page: <Step3 />,
    },
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      // Handle form submission here
      console.log("Form submitted");
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="w-4/5 mx-auto">
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
              onClick={handleNext}
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
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            上一頁
          </Button>
        }
      />
    </div>
  );
}

export default SocialImpactFrom;
