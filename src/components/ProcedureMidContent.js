import React from "react";
import mainpage from "../Img/ProcedureImages/mainpage.png";
import dropdown from "../Img/ProcedureImages/dropdown_menu.png";
import correct_fb from "../Img/ProcedureImages/correct_fb.png";
import incorrect_fb from "../Img/ProcedureImages/incorrect_fb.png";
import { useTranslation } from "react-i18next";

const ProcedureMidContent = () => {
  const { t } = useTranslation();
  return (
    <div
      className="py-3"
      style={{
        overflow: "auto",
        width: "100%",
        paddingRight: "10px",
        fontSize: "calc(.6rem + .4vw)",
      }}
    >
      <div className="fw-bolder">{t("procedure")}:</div>
      <ol>
        <li>{t("proc1")}</li>
        <div
          className="m-2"
          style={{ position: "relative", display: "inline-block" }}
        >
          <img
            className="img-fluid border border-dark"
            src={mainpage}
            alt="logo"
          />
          <div className="fw-bolder text-center">Fig. 1: Mainpage</div>
        </div>
        <li>{t("proc2")}</li>
        <div
          className="m-2"
          style={{ position: "relative", display: "inline-block" }}
        >
          <img
            className="img-fluid border border-dark"
            src={dropdown}
            alt="logo"
          />
          <div className="fw-bolder text-center">Fig. 2: Dropdown menu</div>
        </div>
        <li>{t("proc3")}</li>
        <li>{t("proc4")}</li>
        <li>{t("proc5")}</li>
        <li>{t("proc6")}</li>
        <div className="d-flex">
          <div className="col text-center me-2">
            <img
              className="img-fluid border border-dark"
              src={correct_fb}
              alt="logo"
            />
            <div className="fw-bolder">Fig. 3: Correct feedback</div>
          </div>
          <div className="col text-center">
            <img
              className="img-fluid border border-dark"
              src={incorrect_fb}
              alt="logo"
            />
            <div className="fw-bolder">Fig. 4: Incorrect feedback</div>
          </div>
        </div>
        <li>{t("proc7")}</li>
      </ol>
    </div>
  );
};

export default ProcedureMidContent;
