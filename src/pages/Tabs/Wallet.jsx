import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { getTaskDescription, taskSave } from "../../utils/Task";
import { useNavigate } from "react-router-dom";

export default function Wallet() {
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const isScanning = useRef(false);
  const scannerId = useRef(
    `qr-reader-${Math.random().toString(36).substr(2, 9)}`
  );

  const getTask = async (url) => {
    const path = url.split("/");
    const uuidTask = path[4];
    let objTask = {};

    try {
      objTask = await getTaskDescription(uuidTask);
    } catch (e) {
      console.log(e);
      navigate("/eid/about");
      return;
    }

    // Save
    let resultJSON = {};
    try {
      resultJSON = await taskSave(objTask);
    } catch (e) {
      console.log(e);
      alert("您掃描的 QR Code 可能有問題！請洽系統管理員！ (001)");
      return;
    }

    if (resultJSON.result === true) {
      navigate("/eid/about");
    } else {
      if (resultJSON.content === "Task exist already") {
        alert("任務已被重複領取，請確認永續合作頁面是否有該任務，謝謝。");
      } else {
        alert("這個任務不存在，請確認 QR Code 是否正確，謝謝。");
      }
    }
  };

  const analysisUrl = (url) => {
    const path = url.split("/");
    return path[3];
  };

  const stopScanner = async () => {
    if (html5QrCode && isScanning.current) {
      try {
        isScanning.current = false;
        await html5QrCode.stop();
        setHtml5QrCode(null);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const startScanner = async (cameraId) => {
    // 防止重複啟動
    if (isScanning.current || !scannerRef.current) {
      return;
    }

    try {
      // 確保先停止任何現有的掃描
      await stopScanner();

      // 創建新的掃描器實例
      const newHtml5QrCode = new Html5Qrcode(scannerId.current);
      setHtml5QrCode(newHtml5QrCode);
      isScanning.current = true;

      await newHtml5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: 250,
        },
        async (qrCodeMessage) => {
          const method = analysisUrl(qrCodeMessage);
          if (method === "tasks") {
            await getTask(qrCodeMessage);
          } else {
            alert("這個任務不存在，請確認 QR Code 是否正確，謝謝。");
          }
        },
        (errorMessage) => {
          // 只在開發環境下記錄錯誤
          //console.error(`Error scanning: ${errorMessage}`);
        }
      );
    } catch (err) {
      console.error(`Unable to start scanning, error: ${err}`);
      isScanning.current = false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeCamera = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length && mounted) {
          const cameraId = devices[devices.length - 1].id;
          await startScanner(cameraId);
        }
      } catch (err) {
        if (mounted) {
          alert("抱歉，您的相機不支援 QR Code 掃描器！");
        }
      }
    };

    initializeCamera();

    // Cleanup function
    return () => {
      mounted = false;
      stopScanner().catch(console.error);
    };
  }, []);

  return (
    <div className="flex justify-center mt-10">
      <div id={scannerId.current} ref={scannerRef} style={{ width: "300px" }} />
    </div>
  );
}
