import user from "../../assets/pages/user.png";
import { useState, useEffect } from "react";

export default function About() {
  const [username, setUsername] = useState("");
  const [avatarImg, setAvatarImg] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("username");
    const avatarImg = localStorage.getItem("avatar_img");
    setUsername(user);
    setAvatarImg(`${import.meta.env.VITE_HOST_URL_EID}/${avatarImg}`);
  }, []);

  return (
    <div className="container mx-auto w-full">
      <div className="flex flex-wrap mt-2 items-center justify-center md:flex-row-reverse">
        <div className="w-10/12 md:w-1/2">
          <div className="bg-white shadow-md rounded-lg">
            <div
              id="img_avatar"
              className="bg-center rounded-t-lg"
              style={{
                backgroundImage: `url(${avatarImg || user})`,
                height: "250px",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
        </div>
        <div className="w-10/12 md:w-1/2 md:mt-4 mt-0">
          <p className="mb-0">影響力護照</p>
          <p>Impact Pass</p>
          <div className="bg-gray w-1/2 h-12 flex items-center">
            <span className="pl-2">{username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
