import React from "react";
import QuizPopupContent from "../../components/QuizPopupContent";
import useWebSocket, { ReadyState } from "react-use-websocket";
import logconfig from "../../config/dbconfig";
import { SendLogData } from "../../config/wslog.js";
import { OlabsPage } from "english-olabsnxtg-library";
import TenseMidcontent from "./TenseMidcontent.js";

const TenseMainpage = () => {
  const { sendJsonMessage } = useWebSocket(logconfig.logurl, { share: true });

  return (
    <>
      <OlabsPage
        H_title="Active and Passive voice"
        HQ_yes="YES"
        HQ_cancel="CANCEL"
        HQ_quittext="Are you sure you want to quit?"
        M_midheight="90%"
        RSM_procedure_tt="Procedure"
        RSM_animation_tt="Animation"
        RSM_theory_tt="Theory"
        RSM_vivavoce_tt="Viva voce"
        RSM_ok="OK"
        M_midcontent_comp={<TenseMidcontent />}
        RSM_Intruc_popup_title_string="Instructions for quiz"
        RSM_QuizPopupContent_comp={<QuizPopupContent />}
        WS_sendJsonMessage={sendJsonMessage}
        WS_SendLogData={SendLogData}
        labNo="6"
        labShortName="Letter"
      />
    </>
  );
};

export default TenseMainpage;
