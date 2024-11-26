//Helper function to get SDGs indexes
export const getSdgsIndexes = (task) => {
  try {
    const content = task.content.replace(/'/g, '"');
    const contentParsed = JSON.parse(content);
    const sdgsIndexes = [];

    for (let index = 1; index <= 27; index++) {
      if (contentParsed[`sdgs-${index}`] !== "1") {
        continue;
      }
      const sdgsIndex = String(index).padStart(2, "0");
      sdgsIndexes.push(sdgsIndex);
    }

    return sdgsIndexes;
  } catch (error) {
    console.error("Error parsing SDGs:", error);
    return [];
  }
};

// get SDG img
export const getSDGImage = async (sdg) => {
  try {
    const image = await import(`../assets/SDGS/E_WEB_${sdg}.png`);
    return image.default;
  } catch (error) {
    console.error("Error loading SDG image:", error);
    return null;
  }
};
