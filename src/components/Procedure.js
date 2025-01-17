import React from 'react';
import ProcedureMidContent from './ProcedureMidContent';
import QuizPopupContent from "../components/QuizPopupContent";
import useWebSocket, { ReadyState } from "react-use-websocket";
import logconfig from "../config/dbconfig";
import { SendLogData } from "../config/wslog.js";
import { TheoryPageWithLabel } from "english-olabsnxtg-library";

const Procedure = () => {
  const { sendJsonMessage } = useWebSocket(logconfig.logurl, { share: true });
  return (
    <>
      <TheoryPageWithLabel
        H_title="Active and Passive Voice"
        HQ_yes="YES"
        HQ_cancel="CANCEL"
        HQ_quittext="Are you sure you want to quit?"
        M_midheight="90%"
        M_midcontent_comp={<ProcedureMidContent />}
        M_workbenchLebel_landscape="Procedure"
        M_workbenchLebel_portrait="Pro"
        RSM_theory_tt="Theory"
        RSM_vivavoce_tt="Viva voce"
        RSM_procedure_tt="Procedure"
        RSM_animation_tt="Animation"
        RSM_ok="OK"
        RSM_Intruc_popup_title_string="Instructions for quiz"
        RSM_QuizPopupContent_comp={<QuizPopupContent />}
        WS_sendJsonMessage={sendJsonMessage}
        WS_SendLogData={SendLogData}
        labNo="123"
        labShortName="Active Passive"
      />
    </>
  );
};

export default Procedure;
