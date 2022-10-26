import classes from "./Profile.module.css";
import { AiOutlineUser } from "react-icons/ai";
import { Fragment, useEffect, useState } from "react";
import camera from "../../images/camera.png";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useSelector } from "react-redux";
import axios from "axios";

const Profile = (props) => {
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const email = useSelector((state) => state.auth.email);
  const nickname = useSelector((state) => state.auth.nickname);
  const [note, setNote] = useState([]);
  const [allNotes, setAllNotes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/quiz/myquiz").then((res) => {
      console.log(res);
      setNote(res.data);
    });
    axios.get("http://localhost:8080/api/quiz/allquiz").then((res) => {
      setAllNotes(res.data);
    });
  }, []);

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
              My Email :{" "}
              <input className={classes.input} value={email} readOnly />
            </p>
            <p>
              My Nickname :
              <input
                className={classes.input}
                type="text"
                value={nickname}
                readOnly
              />
            </p>
            <button className={classes.button}>Change my password ?</button>
          </div>
        </div>
        <div className={classes.rightColumn}>
          <div className={classes.firstColumn}>
            <div className={classes.test}>
              <p>My Last Result</p>
              {note.length !== 0 ? (
                <div
                  className={classes.circle}
                  style={{
                    backgroundImage: `conic-gradient(#d7c49eff ${
                      note[note.length - 1].note
                    }%, #343148ff 0)`,
                  }}
                >
                  <div className={classes.inner}>
                    {note[note.length - 1].note}%
                  </div>
                </div>
              ) : (
                <p>neirouz</p>
              )}
            </div>
            {note.length !== 0 ? (
              <Swiper
                modules={[Navigation, Scrollbar, A11y, Pagination]}
                spaceBetween={40}
                slidesPerView={1}
                navigation
                touchRatio={1.5}
                loop={true}
                pagination={{ clickable: true }}
                className={classes.test}
                onSwiper={(swiper) => console.log(swiper)}
              >
                <div className={classes.resultat}>
                  {note.map((data, i) => (
                    <SwiperSlide key={i} className={classes.allo}>
                      <p>
                        {data.subject} : {data.note}%
                      </p>
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>
            ) : (
              <p className={classes.test}>neirouz</p>
            )}
            <div className={classes.rank}>
              <p>My Rank</p>
              <div className={classes.progressBar}>
                {allNotes.map((data, index) => (
                  <Fragment key={index}>
                    <p style={{ display: "inline" }}>
                      {data.nickname}:{data.note}%
                    </p>
                    <progress value={data.note} max="100"></progress>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
