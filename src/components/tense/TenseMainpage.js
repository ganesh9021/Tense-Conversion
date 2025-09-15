import React from "react";
import QuizPopupContent from "../../components/QuizPopupContent";
import useWebSocket, { ReadyState } from "react-use-websocket";
import logconfig from "../../config/dbconfig";
import { SendLogData } from "../../config/wslog.js";
import { OlabsPage } from "english-olabsnxtg-library";
import TenseMidcontent from "./TenseMidcontent.js";
import { useTranslation } from "react-i18next";

const TenseMainpage = () => {
  const { t } = useTranslation();
  const { sendJsonMessage } = useWebSocket(logconfig.logurl, { share: true });

  return (
    <>
      <OlabsPage
        H_title="Tense conversion"
        HQ_yes={t("yes")}
        HQ_cancel={t("cancel")}
        HQ_quittext={t("aysywtq")}
        M_midheight="90%"
        RSM_procedure_tt={t("procedure")}
        RSM_animation_tt={t("animation")}
        RSM_theory_tt={t("theory")}
        RSM_vivavoce_tt={t("vivavoce")}
        RSM_ok={t("ok")}
        M_midcontent_comp={<TenseMidcontent />}
        RSM_Intruc_popup_title_string={t("ifq")}
        RSM_QuizPopupContent_comp={<QuizPopupContent />}
        WS_sendJsonMessage={sendJsonMessage}
        WS_SendLogData={SendLogData}
        labNo="-"
        labShortName="Tense conversion"
      />
    </>
  );
};

export default TenseMainpage;
