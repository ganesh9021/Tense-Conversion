import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Mainpage from "./components/Mainpage";
import TheoryPage from "./components/TheoryPage";
import AnimationPage from "./components/AnimationPage";
import MathsQuiz from "./quiz/MathsQuiz";
//import MainPageDisplayLetter from "./components/MainPageDisplayLetter";
import MidLevelActivePassive from "./components/MidLevelActivePassive";
import MidLevelPassiveActive from "./components/MidLevelPassiveActive";
import Procedure from "./components/Procedure";
import TenseMainpage from "./components/tense/TenseMainpage";

function App() {
  const arr = [
    "Student will able to learn about the conversion of sentence from Passive voice to Active voice and vice versa.",
  ];

  return (
    <Routes>
      <Route exact path="/" element={<Homepage />}></Route>
      <Route exact path="/theory" element={<TheoryPage />}></Route>
      <Route exact path="/animation" element={<AnimationPage />}></Route>
      <Route exact path="/quiz" element={<MathsQuiz />}></Route>
      <Route exact path="/procedure" element={<Procedure />}></Route>
      <Route exact path="/letusverify" element={<Homepage />}></Route>
      <Route exact path="/launchpage/englishactivity" element={<Mainpage />}></Route> 
      <Route exact path="/launchpage/active-passive" element={<MidLevelActivePassive />}></Route>    
      <Route exact path="/launchpage/passive-active" element={<MidLevelPassiveActive />}></Route>
      <Route exact path="/launchpage/tensemainpage" element={<TenseMainpage />}></Route>
    </Routes>
  );
}

export default App;
