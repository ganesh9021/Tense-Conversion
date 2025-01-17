import React from "react";
import { ListItemText } from "@mui/material";

const ActStartPopupContent = () => {
  return (
    <>
      <ListItemText sx={{ display: "list-item" }}>
        In this activity, we are going to learn about the conversion of sentence from 
        passive voice to active voice and vice versa.
      </ListItemText>
      <ListItemText sx={{ display: "list-item" }}>
        Understand the structure of the active voice and passive voice sentences.
      </ListItemText>
      <ListItemText sx={{ display: "list-item" }}>
        Convert the sentence from active voice to passive voice.
      </ListItemText>
      <ListItemText sx={{ display: "list-item" }}>
        Convert the sentence from passive voice to active voice.
      </ListItemText>      
      <ListItemText sx={{ display: "list-item" }}>
        Click on "CHECK" to verify the converted sentence.
      </ListItemText>
      <ListItemText sx={{ display: "list-item" }}>
        The pop-up will show the result along with the explanation.
      </ListItemText>
    </>
  );
};

export default ActStartPopupContent;
