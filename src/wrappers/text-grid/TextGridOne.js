import React from "react";
import { multilanguage } from "redux-multilanguage";

const TextGridOne = ({ spaceBottomClass, allData, currentLanguageCode, strings }) => {

  return (
    <div className={`about-mission-area ${spaceBottomClass ? spaceBottomClass : ""}`}>
      <div className="container text-center">
        {/* Welcome Section */}
       

      

        {/* Mission, Vision, Goal Section */}
        <div className="row text-center">
          <div className="col-lg-4 col-md-4 mb-50">
            <div className="single-mission mb-30 p-1 text-left">
              <img src="https://zaien.test.do-go.net/images/88261737481675678fddcb4fde3.png" alt="about-banner" className="mb-30 w-100" style={{ height: "300px", objectFit: "cover" }} />
              <h3>{strings["our_vision"]}</h3>
              <p className="mb-50">
                {currentLanguageCode !== "en" ? allData?.vision.en : allData?.vision.ar}
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-4 mb-50">
            <div className="single-mission mb-30 text-left p-1">
              <img src="https://zaien.test.do-go.net/ar/images/47171737481632678fdda008e8a.png" alt="about-banner" className="mb-30 w-100" style={{ height: "300px", objectFit: "cover" }} />
              <h3>{strings["our_mission"]}</h3>
              <p >
                {currentLanguageCode !== "en" ? allData?.goal.en : allData?.goal.ar}
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-4 mb-50">
            <div className="single-mission text-left mb-30 p-1">
              <img src="https://zaien.test.do-go.net/ar/images/47171737481632678fdda008e8a.png" alt="about-banner" className="mb-30 w-100" style={{ height: "300px", objectFit: "cover" }} />
              <h3>{strings["our_goal"]}</h3>
              <p >
                {currentLanguageCode !== "en" ? allData?.mission.en : allData?.mission.ar}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default multilanguage(TextGridOne);