import React, { useEffect, useState } from "react";
import { updateTableData } from "../../utils/Foot_print";

export default function FootPrint() {
  const [images, setImages] = useState({});
  const [personalWeights, setPersonalWeights] = useState(Array(27).fill(0));
  const [projectData, setProjectData] = useState(Array(27).fill(0));

  useEffect(() => {
    loadImages();
    updateTableData(setPersonalWeights, setProjectData);
  }, []);

  const loadImages = async () => {
    const imagePromises = [];
    for (let i = 1; i <= 27; i++) {
      const imageNumber = i.toString().padStart(2, "0");
      imagePromises.push(
        import(`../../assets/SDGS/E_WEB_${imageNumber}.png`).then((module) => ({
          key: `E_WEB_${imageNumber}`,
          src: module.default,
        }))
      );
    }

    const loadedImages = await Promise.all(imagePromises);
    const imagesObject = loadedImages.reduce((acc, image) => {
      acc[image.key] = image.src;
      return acc;
    }, {});

    setImages(imagesObject);
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row justify-content-center mt-4">
        <div className="col-md-5 col-12 mb-5">
          <div
            className="border p-2"
            style={{ height: "300px", overflowY: "scroll" }}
          >
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col" className="text-center">
                    指標
                  </th>
                  <th scope="col" className="text-center">
                    個人
                  </th>
                  <th scope="col" className="text-center">
                    專案
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 27 }, (_, i) => {
                  const formattedIndex = (i + 1).toString().padStart(2, "0");
                  return (
                    <tr key={i}>
                      <td>
                        {images[`E_WEB_${formattedIndex}`] && (
                          <img
                            src={images[`E_WEB_${formattedIndex}`]}
                            alt={`E_WEB_${formattedIndex}`}
                            style={{ width: "50px", height: "50px" }}
                          />
                        )}
                      </td>
                      <td>{personalWeights[i] || 0}</td>
                      <td>{projectData[i + 1] || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 mb-0" style={{ fontSize: "12px" }}>
            個人 : 個人參與永續合作貢獻的權重。
          </p>
          <p className="mb-0" style={{ fontSize: "12px" }}>
            專案 : 全體參與者於永續合作中累積的權重。
          </p>
        </div>
      </div>
    </div>
  );
}
