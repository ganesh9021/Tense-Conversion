import React from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import level1Img from "../Img/levelImg/Level1.png"
import level2Img from "../Img/levelImg/Level2.png"
import "../resources/Midcontent.css";
import { Card } from "react-bootstrap";
import { Button } from "@mui/material";

export const Midcontent = () => {
  const navigate = useNavigate();
      
  const handlePassiveActive = (e) => {
    navigate("/launchpage/passive-active", {state : {activityId : e.target.id}});
  };
  
  const handleActivePassive = (e) => {
      navigate("/launchpage/active-passive", {state : {activityId : e.target.id}});
  };
      
  return (
    <div>
        <div className="row scrollbar-primary" style={{ height: "100%", width: "93vw", overflowX: "hidden", overflowY: "auto", }} >
            <div className="col animate__animated animate__bounceInLeft d-flex justify-content-center align-items-center mb-3 mt-3">
                <Card style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={level1Img} />
                    <Card.Body className="text-center">
                        <Card.Title>Active to Passive</Card.Title>
                        <Button variant="contained" id="3" onClick={handleActivePassive} >  LET'S GO  </Button>
                    </Card.Body>
                </Card>
            </div>
            
            <div className="col animate__animated animate__bounceInUp d-flex justify-content-center align-items-center mb-3">
                <Card style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={level2Img} />
                    <Card.Body className="text-center">
                        <Card.Title>Passive to Active</Card.Title>
                        <Button variant="contained" id="1" onClick={handlePassiveActive} >  LET'S GO  </Button>
                    </Card.Body>
                </Card>            
            </div>
        </div>
    </div>
  );
};

