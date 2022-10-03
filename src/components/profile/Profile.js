import classes from "./Profile.module.css";
import { AiOutlineUser } from "react-icons/ai";
import {  Fragment, useEffect, useState } from "react";
import camera from "../../images/camera.png";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { Swiper, SwiperSlide,  } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const DUMMY_DATA = [
  { titre: "java", note: 33 },
  { titre: "javascript", note: 96 },
  { titre: "node", note: 80 },
  { titre: "reactjs", note: 40 },
  { titre: "spring boot", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
  { titre: "typescript", note: 40 },
];

const DUMMY_DATA2 = [
  {name:"user",value:80},
  {name:"user1",value:45},
  {name:"boughattasaziz@gmail.com",value:30},
  {name:"user1",value:29},
  {name:"user1",value:68},
  {name:"user1",value:56},
  {name:"user1",value:56},
  {name:"user1",value:56},
  {name:"user1",value:56},
  {name:"user1",value:56},
]

const Profile = (props) => {
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }, [file]);

  const fileChange = (event) => {
    setFile(event.target.files[0]);
    console.log(file);
  };
  return (
    <div className={classes.profile}>
      <p>My Profile</p>
      <div className={classes.underline}></div>
      <div className={classes.grids}>
        <div className={classes.leftColumn}>
          <div className={classes.userImage}>
            <label
              htmlFor="file-upload"
              className={classes["custom-file-upload"]}
            >
              <img src={camera} alt="camera" className={classes.camera} />
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={fileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            {!image ? (
              <AiOutlineUser className={classes.icon} />
            ) : (
              <img className={classes.icon} src={image} alt="ok" />
            )}
          </div>
          <div className={classes.cordonne}>
            <p>
              My Email : <input className={classes.input} value={props.data.email} readOnly />
            </p>
            <p>
              My Password :
              <input className={classes.input} type="password" value={props.data.password} readOnly />
            </p>
            <button className={classes.button}>Change my password ?</button>
          </div>
        </div>
        <div className={classes.rightColumn}>
          <div className={classes.firstColumn}>
            <div className={classes.test}>
              <p>My Last Result</p>
              <div className={classes.circle}>
                <div className={classes.inner}>5/7</div>
              </div>
            </div>
            <Swiper
              modules={[Navigation, Scrollbar, A11y]}
              spaceBetween={40}
              slidesPerView={1}
              navigation
              touchRatio={1.5}
              scrollbar={{ draggable: true }}
              loop={true}
              pagination={{ clickable: true }}
              className={classes.test}
              onSwiper={(swiper) => console.log(swiper)}
            >
              <div className={classes.resultat}>
                {DUMMY_DATA.map((data, i) => (
                  <SwiperSlide key={i} className={classes.allo}>
                    <p>
                      {data.titre} : {data.note}%
                    </p>
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>

            <div className={classes.rank}>
              <p>My Rank</p>
              <div className={classes.progressBar}>
              {DUMMY_DATA2.map((data) => <Fragment><p style={{display:"inline"}}>{data.name}:{data.value}%</p><progress value={data.value} max="100">aa</progress></Fragment>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
