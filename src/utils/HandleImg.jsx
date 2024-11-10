const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export async function compressImageToBase64(file) {
  // 設定壓縮選項
  const maxSize = 1024 * 1024; // 1 MB
  const maxWidth = 1024;
  const maxHeight = 1024;

  // 創建 canvas 元素
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // 創建 Image 對象並設置 src
  const img = new Image();
  img.src = await convertToBase64(file);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // 計算新的寬高比例
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      // 設置 canvas 的寬高並繪製圖像
      canvas.width = width;
      canvas.height = height;
      context.drawImage(img, 0, 0, width, height);

      // 將 canvas 轉換為 base64 字串
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          if (blob.size > maxSize) {
            reject(new Error("Image size exceeds the maximum allowed size"));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        },
        "image/png",
        0.8 // 設置壓縮質量
      );
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
}
