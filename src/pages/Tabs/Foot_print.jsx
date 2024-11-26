import React, { useEffect, useState } from "react";
import { updateTableData } from "../../utils/Foot_print";
import SdgBarChart from "../../utils/chart/Bar";

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
    <div className="">
      <div className="row justify-content-center mt-4 mb-5">
        <div className="col-md-5 col-12">
          <div className="border p-2 h-80 overflow-y-scroll">
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
          <p className="mt-2 text-xs">個人 : 個人參與永續合作貢獻的權重。</p>
          <p className="text-xs">專案 : 全體參與者於永續合作中累積的權重。</p>
        </div>
        <div className="col-md-7 col-12">
          <div className="text-start">
            <div className="chart-container h-96">
              <SdgBarChart
                data={projectData}
                title="永續指標"
                canvasStyle={{
                  height: "500px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
