import React from "react";
import { Launchpage } from "english-olabsnxtg-library";
import ActStartPopupContent from "../components/ActStartPopupContent";
import useWebSocket, { ReadyState } from "react-use-websocket";
import logconfig from "../config/dbconfig";
import { SendLogData } from "../config/wslog.js";
import { useTranslation } from "react-i18next";

const Homepage = () => {
  const { t } = useTranslation();
  const { sendJsonMessage } = useWebSocket(logconfig.logurl, { share: true });

  var arr = [
    "The student will recognise different tenses, accurately change sentences from one tense to another, and demonstrate the ability to choose and use tenses correctly in both speech and writing.",
  ];

  return (
    <>
      <Launchpage
        L_title="Tense conversion"
        L_objective={t("obj")}
        L_act_objective="To understand how to change verbs from one tense to another while maintaining the meaning of the sentence."
        L_learning_outcome={t("lo")}
        L_array={arr}
        L_startbutton={t("start")}
        RSM_theory_tt={t("theory")}
        RSM_procedure_tt={t("procedure")}
        RSM_animation_tt={t("animation")}
        RSM_vivavoce_tt={t("vivavoce")}
        WAWGTL_title_string={t("wawgtl")}
        WAWGTL_comp={<ActStartPopupContent />}
        ok={t("ok")}
        cancel={t("cancel")}
        WS_sendJsonMessage={sendJsonMessage}
        WS_SendLogData={SendLogData}
        labNo="6"
        labShortName="Tense conversion"
      />
    </>
  );
};

export default Homepage;
