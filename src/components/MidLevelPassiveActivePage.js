import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import XMLParser from "react-xml-parser";

import { Button } from "@mui/material";
import { Dropdown } from "react-bootstrap";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import FileCopyTwoToneIcon from "@mui/icons-material/FileCopyTwoTone";
import FiberManualRecordTwoToneIcon from "@mui/icons-material/FiberManualRecordTwoTone";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Inflectors } from "en-inflectors";
import { ReactSortable } from "react-sortablejs";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import tensejson from "../supportingfiles/DBJSON/tense.json";
import sentenceTemplate from "../supportingfiles/DBJSON/sentence_template.json";
import "../resources/Midcontent.css";
import verbjson from "../supportingfiles/DBJSON/verb.json";
import nounverbjson from "../supportingfiles/DBJSON/noun_verb.json";
import nounjson from "../supportingfiles/DBJSON/noun.json";
import passActFeedbackProps from "../supportingfiles/languageProperties/passiveActive/en-IN-feedbackproperties.json";

const MidLevelPassiveActivePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hintText, setHintText] = useState("Select Tense");
  const [hintTitle, setHintTitle] = useState("Instructions");
  const [tense, setTense] = React.useState("Simple Present Tense");
  const [sentTempPath, setSentTempPath] = useState("");
  const [actvityId, setActivityId] = useState(
    parseInt(location.state.activityId)
  );
  const [passActObj, setPassActObj] = useState({});
  const [actList, setActList] = useState([]);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [fdbackObj, setFeedbackObj] = useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  var tempPassActObj = {};

  var draggableItem = {
    padding: "10px 15px",
    maxWidth: "180px",
    margin: "10px 5px",
    background: "rgb(71, 119, 214)",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  };

  var tempActivityPojo = {
    sentence_tense: "Simple Present Tense",
    //sentence_tense : "modalverb",
    active_voice: "",
    passive_voice: "",
    subject_name: "",
    subject_number: "",
    subject_person: "",
    subject_phonemes: "",
    subject_countable: false, // countable / uncountable DB	// column
    specific_subject: false, // specific / unspecific (general)
    subject_type: "", // common /porper DB column present
    subject_gender: "", // male female neutral DB column	// present

    object_name: "",
    object_number: "",
    object_person: "",
    object_phonemes: "",
    object_countable: false, // countable / uncountable DB	// column

    specific_object: false, // specific / unspecific (general)
    object_type: "", // common /porper DB column present
    object_gender: "", // male female neutral DB column present

    object_article: "",
    subject_article: "",

    verb_category: "",
    verb: "",

    active_helping_verb: "",
    passive_helping_verb: "",
    active_main_verb: "",
    passive_main_verb: "",

    jumbled_active_sentence: [],
    jumbled_passive_sentence: [],
    active_sentence: [],
    passive_sentence: [],
  };

  var tempPojoSent = {
    sentenceID: "",
    sentenceType: "",
    subjectType: "",
    verbCategory: "",
    infinitiveType: "",
    infinitiveTense: "",
    subverbType: "",
    objectType: "",
    subjectArticleType: "",
    objectArticleType: "",
  };

  const [TemplatePojo, setTemplatePojo] = useState({
    sentenceID: "",
    sentenceType: "",
    subjectType: "",
    verbCategory: "",
    infinitiveType: "",
    infinitiveTense: "",
    subverbType: "",
    objectType: "",
    subjectArticleType: "",
    objectArticleType: "",
  });

  const [ActivityPojo, setActivityPojo] = useState({
    sentence_tense: "Simple Present Tense",
    active_voice: "",
    passive_voice: "",
    subject_name: "",
    subject_number: "",
    subject_person: "",
    subject_phonemes: "",
    subject_countable: false, // countable / uncountable DB	// column
    specific_subject: false, // specific / unspecific (general)
    subject_type: "", // common /porper DB column present
    subject_gender: "", // male female neutral DB column	// present

    object_name: "",
    object_number: "",
    object_person: "",
    object_phonemes: "",
    object_countable: false, // countable / uncountable DB	// column

    specific_object: false, // specific / unspecific (general)
    object_type: "", // common /porper DB column present
    object_gender: "", // male female neutral DB column present

    object_article: "",
    subject_article: "",

    verb_category: "",
    verb: "",

    active_helping_verb: "",
    passive_helping_verb: "",
    active_main_verb: "",
    passive_main_verb: "",

    jumbled_active_sentence: [],
    jumbled_passive_sentence: [],
    active_sentence: [],
    passive_sentence: [],
  });

  useEffect(() => {
    var sentenceTempPath = "";
    sentenceTempPath = getSentenceTempPath();

    if (undefined !== sentenceTempPath || "" === sentenceTempPath) {
      const result = simpleSentenceParser(sentenceTempPath).then((r) => {
        var allNounVrbObj = getDetailedNounVerb(
          actvityId,
          tempPojoSent,
          tempActivityPojo
        );
        setObjectDetails(allNounVrbObj.Noun_verb_nounid, tempActivityPojo);
        setSubjectDetails();
        var listActPass = getVerbInflections();
        articleSelector();
        generateSentence(actvityId, listActPass);
        jumbled_sentence();
        var passDataObj = populateJSON(actvityId);
        process(passDataObj, actvityId);
      });
    }
  }, [actvityId]);

  async function simpleSentenceParser(xmlFileSrc) {
    const path = "../supportingfiles" + xmlFileSrc;
    var staticPath = require(`../supportingfiles${xmlFileSrc}`);
    const response = fetch(staticPath);

    fetch(staticPath)
      .then((response) => response.text())
      .then((textResponse) => {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(textResponse, "text/xml");
        const listSentence = xmlDoc.querySelectorAll("sentence");
        var randSentId = randomNumberInRange(0, listSentence.length - 1);
        var node = listSentence[randSentId];
        var nodeId = node.getAttribute("id");
        var nodeType = node.getAttribute("type");
        var nodeChild = node.childNodes;
        var nodeSubject = node.querySelectorAll("subject");
        var nodePredicate = node.querySelectorAll("predicate");
        var nodeSubjNounType = nodeSubject[0]
          .querySelectorAll("noun")[0]
          .getAttribute("type");
        var nodePredVerbCate = nodePredicate[0]
          .querySelectorAll("verb")[0]
          .getAttribute("category");
        var nodePredVerbInfitype = nodePredicate[0]
          .querySelectorAll("verb")[0]
          .querySelectorAll("infinitive")[0]
          .getAttribute("type");
        var nodePredVerbInfiTense = nodePredicate[0]
          .querySelectorAll("verb")[0]
          .querySelectorAll("infinitive")[0]
          .getAttribute("tense");
        var nodePredVerbInfiSubVerbType = nodePredicate[0]
          .querySelectorAll("verb")[0]
          .querySelectorAll("infinitive")[0]
          .querySelectorAll("subverb")[0]
          .getAttribute("type");
        var nodePredObjNounType = nodePredicate[0]
          .querySelectorAll("object")[0]
          .querySelectorAll("noun")[0]
          .getAttribute("type");
        var nodeSubjArtType = nodeSubject[0]
          .querySelectorAll("article")[0]
          .getAttribute("type");
        var nodePredObjArtType = nodePredicate[0]
          .querySelectorAll("object")[0]
          .querySelectorAll("article")[0]
          .getAttribute("type");

        setTemplatePojo({
          ...TemplatePojo,
          sentenceID: nodeId,
          sentenceType: nodeType,
          subjectType: nodeSubjNounType,
          verbCategory: nodePredVerbCate,
          infinitiveType: nodePredVerbInfitype,
          infinitiveTense: nodePredVerbInfiTense,
          subverbType: nodePredVerbInfiSubVerbType,
          objectType: nodePredObjNounType,
          subjectArticleType: nodeSubjArtType,
          objectArticleType: nodePredObjArtType,
        });

        tempPojoSent = {
          ...tempPojoSent,
          sentenceID: nodeId,
          sentenceType: nodeType,
          subjectType: nodeSubjNounType,
          verbCategory: nodePredVerbCate,
          infinitiveType: nodePredVerbInfitype,
          infinitiveTense: nodePredVerbInfiTense,
          subverbType: nodePredVerbInfiSubVerbType,
          objectType: nodePredObjNounType,
          subjectArticleType: nodeSubjArtType,
          objectArticleType: nodePredObjArtType,
        };
      })
      .catch((error) => {
        console.log(error);
      });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(tempPojoSent);
      }, 600);
    });
  }

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getDetailedNounVerb = (actvityId, tempPojo, tempActPojo) => {
    var random_noun_id = 0;
    var random_verb_id = 0;
    var verbTemplate = tempPojo.infinitiveType;
    var verbId = verbjson[verbTemplate].verb_id;
    var nounverbkeycnt = Object.keys(nounverbjson).length;
    var allNounVrbObj = [];

    for (var i = 0; i < nounverbkeycnt; i++) {
      var nounverbobj = nounverbjson[i];
      if (
        undefined !== nounverbobj &&
        verbId === nounverbobj.Noun_verb_verbid
      ) {
        allNounVrbObj.push(nounverbobj);
      }
    }

    tempActivityPojo = {
      ...tempActivityPojo,
      verb_category: verbjson[verbTemplate].verb_type,
      verb: verbjson[verbTemplate].verb_base_form,
    };

    var randSentID = randomNumberInRange(0, allNounVrbObj.length - 1);
    return allNounVrbObj[randSentID];
  };

  const getSentenceTempPath = () => {
    var sentenseTempPath = "";
    var sentenceTempId = 0;
    var sentenceTense = tempActivityPojo.sentence_tense;

    if (actvityId === 3 || actvityId === 1) {
      sentenceTempId = 1;
    }

    for (var noofsent = 0; noofsent < sentenceTemplate.length; noofsent++) {
      if (sentenceTemplate[noofsent].activity_id == sentenceTempId) {
        sentenseTempPath = sentenceTemplate[noofsent].activity_name;
        break;
      }
    }

    setSentTempPath(sentenseTempPath);
    return sentenseTempPath;
  };

  const setObjectDetails = (noun_verb_nounid, tempActPojo) => {
    var nounobj = nounjson[noun_verb_nounid];
    var object_name = nounobj.noun_name;
    var object_type = nounobj.noun_type;
    var object_number = nounobj.noun_number;
    var object_person = nounobj.noun_person;
    var object_gender = nounobj.noun_gender;
    var object_countable = nounobj.countable;
    var object_phonemes = nounobj.noun_phoneme;

    tempActivityPojo = {
      ...tempActivityPojo,
      object_name: object_name,
      object_number: object_number,
      object_person: object_person,
      object_phonemes: object_phonemes,
      object_countable: object_countable, // countable / uncountable DB
      object_type: object_type, // common /porper DB column present
      object_gender: object_gender, // male female neutral DB column present
    };
  };

  const setSubjectDetails = () => {
    var subKeycnt = Object.keys(nounjson).length;
    var allSubDet = [];

    for (var i = 0; i < subKeycnt; i++) {
      var nounsubjobj = nounjson[i];
      if (undefined !== nounsubjobj && "person" === nounsubjobj.noun_case) {
        allSubDet.push(nounsubjobj);
      }
    }

    var randSentID = randomNumberInRange(0, allSubDet.length - 1);
    var subdet = allSubDet[randSentID];
    var subject_name = subdet.noun_name;
    var subject_type = subdet.noun_type;
    var subject_number = subdet.noun_number;
    var subject_person = subdet.noun_person;
    var subject_gender = subdet.noun_gender;
    var subject_countable = subdet.countable;
    var subject_phoneme = subdet.noun_phoneme;

    tempActivityPojo = {
      ...tempActivityPojo,
      subject_name: subject_name,
      subject_number: subject_number,
      subject_person: subject_person,
      subject_phoneme: subject_phoneme,
      subject_countable: subject_countable,
      subject_type: subject_type,
      subject_gender: subject_gender,
    };
  };

  const getVerbInflections = () => {
    var listTense = [];

    switch (tempActivityPojo.sentence_tense) {
      case "Simple Present Tense":
        listTense = simplepresent();
        break;
      case "Present Continuous Tense":
        listTense = continuouspresent();
        break;
      case "Present Perfect Tense":
        listTense = perfectpresent();
        break;
      case "Simple Past Tense":
        listTense = simplepast();
        break;
      case "Past Continuous Tense":
        listTense = continuouspast();
        break;
      case "Past Perfect Tense":
        listTense = perfectpast();
        break;
      case "Simple Future Tense":
        listTense = simplefuture();
        break;
      case "Future Perfect Tense":
        listTense = perfectfuture();
        break;
      case "modalverb":
        listTense = modalverb();
        break;
    }
    return listTense;
  };

  /**
   * Conjugate main verb and select helping verb  as per the tense i.e. Simple Present Tense.
   * @return Returns Active voice verbs and Passive voice sentence verbs at index 0 and 1 respectively
   */
  const simplepresent = () => {
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var object_number = tempActivityPojo.object_number;
    var subject_person = tempActivityPojo.subject_person;
    var sverb = null;
    var verb = tempActivityPojo.verb;
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    if (
      "regular" === category.toLowerCase() ||
      "irregular" === category.toLowerCase()
    ) {
      var verbstr = verb.substring(verb.length - 1, verb.length);

      if (
        "s" === verbstr.toLowerCase() ||
        ("singular" === subject_number.toLowerCase() &&
          "third" === subject_person.toLowerCase() &&
          "h" === verbstr.toLowerCase())
      ) {
        activeverb = verb.concat("es");
      } else {
        activeverb = verb.concat("s");
      }
      tempActivityPojo.active_main_verb = activeverb;
    }

    if ("regular" === category.toLowerCase()) {
      if ("singular" === object_number.toLowerCase()) {
        sverb = "is";
      } else if ("plural" === object_number.toLowerCase()) {
        sverb = "are";
      }

      tempActivityPojo.passive_helping_verb = sverb;
      var verbstr = verb.substring(verb.length - 1, verb.length);

      if ("e" === verbstr.toLowerCase()) {
        tempActivityPojo.passive_main_verb = verb.concat("d");
      } else {
        tempActivityPojo.passive_main_verb = verb.concat("ed");
      }
      passiveverb =
        tempActivityPojo.passive_helping_verb +
        " " +
        tempActivityPojo.passive_main_verb;
    }

    if ("irregular" === category.toLowerCase()) {
      var verbobj = verbjson[verb];
      var past_participle_verb = verbobj.verb_past_participle;

      if ("singular" === object_number.toLowerCase()) {
        sverb = "is";
      } else if ("plural" === object_number.toLowerCase()) {
        sverb = "are";
      }
      tempActivityPojo.passive_helping_verb = sverb;
      tempActivityPojo.passive_main_verb = past_participle_verb;
      passiveverb =
        tempActivityPojo.passive_helping_verb +
        " " +
        tempActivityPojo.passive_main_verb;
    }

    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb;
  };

  /**
   * Conjugate main verb and select helping verb  as per the tense i.e. Present Continuous Tense.
   * @return Returns Active voice sentence verbs and Passive voice sentence verbs at index 0 and 1 respectively
   */
  const continuouspresent = () => {
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var object_number = tempActivityPojo.object_number;
    var subject_person = tempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb;
    var sverb = null;
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    // active form
    if (
      "regular" === category.toLowerCase() ||
      "irregular" === category.toLowerCase()
    ) {
      var verbIngForm = new Inflectors(verb).conjugate("VBG"); //var ingrule = ingrules(verb);
      tempActivityPojo.active_main_verb = verbIngForm;

      if (
        "first" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "singular" === subject_number.toLowerCase())
      ) {
        sverb = "is";
      }

      if (
        "second" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "plural" === subject_number.toLowerCase())
      ) {
        sverb = "are";
      }

      tempActivityPojo.active_helping_verb = sverb;
      activeverb =
        tempActivityPojo.active_helping_verb +
        " " +
        tempActivityPojo.active_main_verb;
    } // active form

    // passive form
    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);

      if (
        "first" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "singular" === object_number.toLowerCase())
      ) {
        sverb = "is being";
      }

      if (
        "second" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "plural" === object_number.toLowerCase())
      ) {
        sverb = "are being";
      }

      if ("e" === verbstr.toLowerCase()) {
        tempActivityPojo.passive_main_verb = verb.concat("d");
      } else {
        tempActivityPojo.passive_main_verb = verb.concat("ed");
      }

      tempActivityPojo.passive_helping_verb = sverb;
      passiveverb =
        tempActivityPojo.passive_helping_verb +
        " " +
        tempActivityPojo.passive_main_verb; // passive regular
    }

    if ("irregular" === category.toLowerCase()) {
      if (
        "first" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "singular" === object_number.toLowerCase())
      )
        sverb = "is being";

      if (
        "second" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "plural" === object_number.toLowerCase())
      )
        sverb = "are being";

      var verbobj = verbjson[verb];
      var past_participle_verb = verbobj.verb_past_participle; //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";

      tempActivityPojo.passive_helping_verb = sverb;
      tempActivityPojo.passive_main_verb = past_participle_verb;
      passiveverb =
        tempActivityPojo.passive_helping_verb +
        " " +
        tempActivityPojo.passive_main_verb;
    }

    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb;
  };

  /**
   * Conjugate main verb and select helping verb  as per the tense i.e. Present Perfect Tense.
   * @return Returns Active voice sentence verbs and Passive voice sentence verbs at index 0 and 1 respectively
   */
  const perfectpresent = () => {
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var object_number = tempActivityPojo.object_number;
    var subject_person = tempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb;
    var sverb = null;
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    if ("third" === subject_person.toLowerCase()) sverb = "has";
    else sverb = "have";

    tempActivityPojo.active_helping_verb = sverb;

    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);
      if ("e" === verbstr.toLowerCase()) {
        activeverb = verb.concat("d");
      } else {
        activeverb = verb.concat("ed");
      }
      tempActivityPojo.active_main_verb = activeverb;
    } // active regular

    if ("irregular" === category.toLowerCase()) {
      var verbobj = verbjson[verb];
      var past_participle_verb = verbobj.verb_past_participle; //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.active_main_verb = past_participle_verb;
    }

    activeverb =
      tempActivityPojo.active_helping_verb +
      " " +
      tempActivityPojo.active_main_verb;

    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);
      if ("third" === subject_person.toLowerCase()) sverb = "has been";
      else sverb = "have been";

      if ("e" === verbstr.toLowerCase())
        tempActivityPojo.passive_main_verb = verb.concat("d");
      else tempActivityPojo.passive_main_verb = verb.concat("ed");

      tempActivityPojo.passive_helping_verb = sverb;
    } // passsiuve regular

    // passive form
    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);

      if ("third" === subject_person.toLowerCase()) sverb = "has been";
      else sverb = "have been";

      tempActivityPojo.passive_helping_verb = sverb;

      if ("e" === verbstr.toLoweCase())
        tempActivityPojo.passive_main_verb = verb.concat("d");
      else tempActivityPojo.passive_main_verb = verb.concat("ed");
    }

    if ("irregular" === category.toLowerCase()) {
      if ("third" === subject_person.toLowerCase()) sverb = "has been";
      else sverb = "have been";

      tempActivityPojo.passive_helping_verb = sverb;

      var verbobj = verbjson[verb];
      var past_participle_verb = verbobj.verb_past_participle; //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.passive_main_verb = past_participle_verb;
    }

    passiveverb =
      tempActivityPojo.passive_helping_verb +
      " " +
      tempActivityPojo.passive_main_verb;
    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb;
  };

  /**
   * Conjugate main verb and select helping verb  as per the tense i.e. Simple Past Tense.
   * @return Returns Active voice sentence verbs and Passive voice sentence verbs at index 0 and 1 respectively
   */
  const simplepast = () => {
    var sentencetense = tempActivityPojo.sentence_tense;
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number;
    var sverb = null;
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);
      if ("e" === verbstr.toLowerCase()) activeverb = verb.concat("d");
      else activeverb = verb.concat("ed");
      tempActivityPojo.active_main_verb = activeverb;
    } // active regular

    if ("irregular" === category.toLowerCase()) {
      var verbobj = verbjson[verb];
      var past_participle_verb = verbobj.verb_past_tense; //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.active_main_verb = past_participle_verb;
      tempActivityPojo.active_helping_verb = sverb;
    } // active irregular

    if (sverb != null)
      activeverb =
        tempActivityPojo.active_helping_verb +
        " " +
        tempActivityPojo.active_main_verb;
    else activeverb = tempActivityPojo.active_main_verb;

    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);

      if ("singular" === object_number.toLowerCase()) sverb = "was";
      else if ("plural" === object_number.toLowerCase()) sverb = "were";

      if ("e" === verbstr.toLowerCase())
        tempActivityPojo.passive_main_verb = verb.concat("d");
      else tempActivityPojo.passive_main_verb = verb.concat("ed");

      tempActivityPojo.passive_helping_verb = sverb;
    } // passive regular

    if ("irregular" === category.toLowerCase()) {
      if ("singular" === object_number.toLowerCase()) sverb = "was";
      else if ("plural" === object_number.toLowerCase()) sverb = "were";

      tempActivityPojo.passive_helping_verb = sverb;

      var verbobj = verbjson[verb];
      var past_participle_verb = verbobj.verb_past_participle; //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.passive_main_verb = past_participle_verb;
    } // passivce irregular

    passiveverb =
      tempActivityPojo.passive_helping_verb +
      " " +
      tempActivityPojo.passive_main_verb;
    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb;
  }; // passive form

  /**
   * Conjugate main verb and select helping verb  as per the tense i.e. Past Continuous Tense.
   * @return Returns Active voice sentence verbs and Passive voice sentence verbs at index 0 and 1 respectively
   */
  const continuouspast = () => {
    // active form
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number;
    var sverb = null;
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    if (
      "regular" === category.toLowerCase() ||
      "irregular" === category.toLowerCase()
    ) {
      var averb = new Inflectors(verb).conjugate("VBG"); //var ingrule = ingrules(verb);
      tempActivityPojo.active_main_verb = averb;

      if (
        "first" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "singular" === subject_number.toLowerCase())
      )
        sverb = "was";

      if (
        "second" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "plural" === subject_number.toLowerCase())
      )
        sverb = "were";

      tempActivityPojo.active_helping_verb = sverb;
      tempActivityPojo.active_main_verb = averb;
      activeverb =
        tempActivityPojo.active_helping_verb +
        " " +
        tempActivityPojo.active_main_verb;
    } // active

    // passive form
    if ("regular" === category.toLowerCase()) {
      if (
        "first" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "singular" === object_number.toLowerCase())
      )
        sverb = "was being";
      if (
        "second" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "plural" === object_number.toLowerCase())
      )
        sverb = "were being";

      var verbstr = verb.substring(verb.length - 1, verb.length);

      if ("e" === verbstr.toLowerCase())
        tempActivityPojo.passive_main_verb = verb.concat("d");
      else tempActivityPojo.passive_main_verb = verb.concat("ed");
    } // passive regular

    if ("irregular" === category.toLowerCase()) {
      if (
        "first" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "singular" === object_number.toLowerCase())
      )
        sverb = "was being";
      if (
        "second" === subject_person.toLowerCase() ||
        ("third" === subject_person.toLowerCase() &&
          "plural" === object_number.toLowerCase())
      )
        sverb = "were being";

      var verbobj = verbjson[verb];
      var past_participle_verb = verbobj.verb_past_participle; //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.passive_main_verb = past_participle_verb;
    }

    tempActivityPojo.passive_helping_verb = sverb;
    passiveverb =
      tempActivityPojo.passive_helping_verb +
      " " +
      tempActivityPojo.passive_main_verb;
    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb;
  };

  /**
   * Conjugate main verb and select helping verb  as per the tense i.e. Past Perfect Tense.
   * @return Returns Active voice sentence verbs and Passive voice sentence verbs at index 0 and 1 respectively
   */
  const perfectpast = () => {
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number;
    var sverb = "had";
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);
      if ("e" === verbstr.toLowerCase())
        tempActivityPojo.active_main_verb = verb.concat("d");
      else tempActivityPojo.active_main_verb = verb.concat("ed");
    } // active regular

    if ("irregular" === category.toLowerCase()) {
      var verbobj = verbjson[verb];
      var past_participle_verb = null;
      var past_participle_verb = verbobj.verb_past_participle; //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.active_main_verb = past_participle_verb;
    }

    tempActivityPojo.active_helping_verb = sverb;
    activeverb =
      tempActivityPojo.active_helping_verb +
      " " +
      tempActivityPojo.active_main_verb;

    // passive form
    sverb = "had been";

    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);
      if ("e" === verbstr.toLowerCase())
        tempActivityPojo.passive_main_verb = verb.concat("d");
      else tempActivityPojo.passive_main_verb = verb.concat("ed");
    } // passive regular

    if ("irregular" === category.toLowerCase()) {
      var verbobj = verbjson[verb];
      var past_participle_verb = null;
      var past_participle_verb = verbobj.verb_past_participle; //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.passive_main_verb = past_participle_verb;
    }

    tempActivityPojo.passive_helping_verb = sverb;
    passiveverb =
      tempActivityPojo.passive_helping_verb +
      " " +
      tempActivityPojo.passive_main_verb;
    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb;
  };

  /**
   * Conjugate main verb and select helping verb  as per the tense i.e. Simple Future Tense.
   * @return Returns Active voice sentence verbs and Passive voice sentence verbs at index 0 and 1 respectively
   */
  const simplefuture = () => {
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number;
    var sverb = "will";
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    if (
      "regular" === category.toLowerCase() ||
      "irregular" === category.toLowerCase()
    ) {
      tempActivityPojo.active_helping_verb = sverb;
      tempActivityPojo.active_main_verb = verb;
      activeverb =
        tempActivityPojo.active_helping_verb +
        " " +
        tempActivityPojo.active_main_verb;
    } // active form

    // passive form
    sverb = "will be";

    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);
      if ("e" === verbstr.toLowerCase())
        tempActivityPojo.passive_main_verb = verb.concat("d");
      else tempActivityPojo.passive_main_verb = verb.concat("ed");
    } // passive regular

    if ("irregular" === category.toLowerCase()) {
      var verbobj = verbjson[verb];
      var past_participle_verb = null;
      var past_participle_verb = verbobj.verb_past_participle; //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.passive_main_verb = past_participle_verb;
    } // passive irregular

    tempActivityPojo.passive_helping_verb = sverb;
    passiveverb =
      tempActivityPojo.passive_helping_verb +
      " " +
      tempActivityPojo.passive_main_verb;
    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb;
  };

  /**
   * Conjugate main verb and select helping verb  as per the tense i.e. Future Perfect Tense.
   * @return Returns Active voice sentence verbs and Passive voice sentence verbs at index 0 and 1 respectively
   */
  const perfectfuture = () => {
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number;
    var sverb = "will have";
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);
      if ("e" === verbstr.toLowerCase())
        tempActivityPojo.active_main_verb = verb.concat("d");
      else tempActivityPojo.active_main_verb = verb.concat("ed");
    } // active regular

    if ("irregular" === category.toLowerCase()) {
      var verbobj = verbjson[verb];
      var past_participle_verb = null;
      var past_participle_verb = verbobj.verb_past_participle;
      //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.active_main_verb = past_participle_verb;
    }

    tempActivityPojo.active_helping_verb = sverb;
    activeverb =
      tempActivityPojo.active_helping_verb +
      " " +
      tempActivityPojo.active_main_verb;

    // passive form
    sverb = "will have been";

    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);
      if ("e" === verbstr.toLowerCase())
        tempActivityPojo.passive_main_verb = verb.concat("d");
      else tempActivityPojo.passive_main_verb = verb.concat("ed");
    }

    if ("irregular" === category.toLowerCase()) {
      var verbobj = verbjson[verb];
      var past_participle_verb = null;
      var past_participle_verb = verbobj.verb_past_participle;
      //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.passive_main_verb = past_participle_verb;
    }

    tempActivityPojo.passive_helping_verb = sverb;
    passiveverb =
      tempActivityPojo.passive_helping_verb +
      " " +
      tempActivityPojo.passive_main_verb;
    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb; // passive
  };

  /**
   * Conjugate Model verb.
   * @return Returns array Active voice sentence verbs and Passive voice sentence verbs at index 0 and 1 respectively
   */
  const modalverb = () => {
    var obj = null;
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number;
    var sverb = null;
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    // active form
    if (
      "regular" === category.toLowerCase() ||
      "irregular" === category.toLowerCase()
    ) {
      if ("go" === verb.toLowerCase()) {
        obj = "to" + " " + obj;
      } else {
        obj = obj;
      }
      activeverb = sverb + " " + verb;
    }

    // passive form
    if ("regular" === category.toLowerCase()) {
      var verbstr = verb.substring(verb.length - 1, verb.length);
      if ("e" === verbstr.toLowerCase())
        passiveverb = sverb + " " + "be" + " " + verb.concat("d");
      else passiveverb = sverb + " " + "be" + " " + verb.concat("ed");
    }

    if ("irregular" === category.toLowerCase()) {
      var verbobj = verbjson[verb];
      var past_participle_verb = null;
      var past_participle_verb = verbobj.verb_past_participle;
      //pastparticiple_word = "SELECT verb_past_participle from verb WHERE verb_base_form=?";
      tempActivityPojo.passive_main_verb = past_participle_verb;
      passiveverb = sverb + " " + past_participle_verb;
    }

    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    actpassverb.push(obj);
    return actpassverb; // passive
  };

  const articleSelector = () => {
    /* Nouns - singular a/ an //handled plural nothing - countable a/an
     * Uncountable nothing - can go with adjective or an adverb-adjective combination before the noun
     */
    articleForSubject();
    articleForObject();
  };

  /** Generate article for the Object in the sentences using grammar rules. This article is set to Activity_Pojo. */
  const articleForObject = () => {
    var articleList = [];
    var nounNumber = tempActivityPojo.object_number;
    var countable = tempActivityPojo.object_countable;
    var specificNoun = false;
    var nounType = tempActivityPojo.object_type;
    var nounPhoneme = tempActivityPojo.object_phonemes;

    if ("common" === nounType.toLowerCase()) {
      if (!specificNoun) {
        if (countable) {
          if ("singular" === nounNumber.toLowerCase()) {
            if ("consonant" === nounPhoneme.toLowerCase()) {
              articleList.push("a");
              articleList.push("the");
            } else if ("vowel" === nounPhoneme.toLowerCase()) {
              articleList.push("an");
              articleList.push("the");
            }
          }
        } else if (!countable) {
          if ("singular" === nounNumber.toLowerCase()) {
            articleList.push("");
          }
        }
      } else if (specificNoun) {
        articleList.push("the");
      }
    } else if ("proper" === nounType.toLowerCase()) {
      if ("singular" == nounNumber.toLowerCase()) {
        if ("consonant" === nounPhoneme.toLowerCase()) {
          articleList.push("");
        } else if ("vowel" === nounPhoneme.toLowerCase()) {
          articleList.push("");
        }
      } else if ("plural" == nounNumber.toLowerCase()) {
        articleList.push("the");
      }
    }

    var randArtID = randomNumberInRange(0, articleList.length - 1);
    var article = articleList[randArtID];

    if (undefined === article) {
      article = "";
    }
    tempActivityPojo.object_article = article;
  };

  const articleForSubject = () => {
    var articleList = [];
    var nounNumber = tempActivityPojo.subject_number;
    var countable = tempActivityPojo.subject_countable;
    var specificNoun = false;
    var nounType = tempActivityPojo.subject_type;
    var nounPhoneme = tempActivityPojo.subject_phonemes;

    if ("common" === nounType.toLowerCase()) {
      if (!specificNoun) {
        if (countable) {
          if ("singular" === nounNumber) {
            if ("consonant" === nounPhoneme.toLowerCase()) {
              articleList.push("a");
              articleList.push("the");
            } else if ("vowel" === nounPhoneme.toLowerCase()) {
              articleList.push("an");
              articleList.push("the");
            }
          } else if ("plural" === nounNumber.toLowerCase()) {
            articleList.push("");
          }
        } else if (!countable) {
          if ("singular".nounNumber.toLowerCase()) {
            articleList.push("");
          }
        }
      } else if (specificNoun) {
        articleList.push("the");
      }
    } else if ("proper" === nounType.toLowerCase()) {
      if ("singular" === nounNumber.toLowerCase()) {
        if ("consonant" === nounPhoneme.toLowerCase()) {
          articleList.push("");
        } else if ("vowel" === nounPhoneme.toLowerCase()) {
          articleList.push("");
        }
      } else if ("plural" === nounNumber.toLowerCase()) {
        articleList.push("the");
      }
    }

    var randArtID = randomNumberInRange(0, articleList.length - 1);
    var article = articleList[randArtID];

    if (undefined === article) {
      article = "";
    }
    tempActivityPojo.subject_article = article;
  };

  /**
   * Generate sentence according to the exercise id.
   * Set Active voice and Passive voice sentence to the {@link Activity_Pojo}.
   * @param exerciseID exercise id to generate senetence according to
   * @param verbList (helping verb + main verb)
   */
  const generateSentence = (exerciseID, verbList) => {
    var active_voice = null;
    var passive_voice = null;
    var subject_name = tempActivityPojo.subject_name;
    var object_name = tempActivityPojo.object_name;

    if (exerciseID == 3) {
      if (
        ("" === tempActivityPojo.object_article ||
          null === tempActivityPojo.object_article) &&
        ("" === tempActivityPojo.subject_article ||
          null === tempActivityPojo.subject_article)
      ) {
        active_voice =
          subject_name.substring(0, 1).toUpperCase() +
          subject_name.substring(1) +
          " " +
          verbList[0] +
          " " +
          object_name;
      } else if (
        "" === tempActivityPojo.object_article ||
        null === tempActivityPojo.object_article
      ) {
        active_voice =
          tempActivityPojo.subject_article.substring(0, 1).toUpperCase() +
          tempActivityPojo.subject_article.substring(1) +
          " " +
          subject_name +
          " " +
          verbList[0] +
          " " +
          object_name;
      } else if (
        "" === tempActivityPojo.subject_article ||
        null === tempActivityPojo.subject_article
      ) {
        active_voice =
          subject_name.substring(0, 1).toUpperCase() +
          subject_name.substring(1) +
          " " +
          verbList[0] +
          " " +
          tempActivityPojo.object_article +
          " " +
          object_name;
      } else {
        active_voice =
          tempActivityPojo.subject_article.substring(0, 1).toUpperCase() +
          tempActivityPojo.subject_article.substring(1) +
          " " +
          subject_name +
          " " +
          verbList[0] +
          " " +
          tempActivityPojo.object_article +
          " " +
          object_name;
      }

      tempActivityPojo.active_voice = active_voice;

      if (
        ("" === tempActivityPojo.object_article ||
          null === tempActivityPojo.object_article) &&
        ("" === tempActivityPojo.subject_article ||
          null === tempActivityPojo.subject_article)
      ) {
        passive_voice =
          object_name.substring(0, 1).toUpperCase() +
          object_name.substring(1) +
          " " +
          verbList[1] +
          " by " +
          subject_name;
      } else if (
        "" === tempActivityPojo.subject_article ||
        null === tempActivityPojo.subject_article
      ) {
        passive_voice =
          tempActivityPojo.object_article +
          " " +
          object_name +
          " " +
          verbList[1] +
          " by " +
          subject_name;
      } else if (
        "" === tempActivityPojo.object_article ||
        null === tempActivityPojo.object_article
      ) {
        passive_voice =
          object_name.substring(0, 1).toUpperCase() +
          object_name.substring(1) +
          " " +
          verbList[1] +
          " by " +
          tempActivityPojo.subject_article +
          " " +
          subject_name;
      } else {
        passive_voice =
          tempActivityPojo.object_article +
          " " +
          object_name +
          " " +
          verbList[1] +
          " by " +
          tempActivityPojo.subject_article +
          " " +
          subject_name;
      }
      tempActivityPojo.passive_voice = passive_voice;
    }

    if (exerciseID == 1) {
      if (
        ("" === tempActivityPojo.object_article ||
          null === tempActivityPojo.object_article) &&
        ("" === tempActivityPojo.subject_article ||
          null === tempActivityPojo.subject_article)
      ) {
        active_voice =
          subject_name.substring(0, 1).toUpperCase() +
          subject_name.substring(1) +
          " " +
          verbList[0] +
          " " +
          object_name;
      } else if (
        "" === tempActivityPojo.object_article ||
        null === tempActivityPojo.object_article
      ) {
        active_voice =
          tempActivityPojo.subject_article +
          " " +
          subject_name +
          " " +
          verbList[0] +
          " " +
          object_name;
      } else if (
        "" === tempActivityPojo.subject_article ||
        null === tempActivityPojo.subject_article
      ) {
        active_voice =
          subject_name.substring(0, 1).toUpperCase() +
          subject_name.substring(1) +
          " " +
          verbList[0] +
          " " +
          tempActivityPojo.object_article +
          " " +
          object_name;
      } else {
        active_voice =
          tempActivityPojo.subject_article +
          " " +
          subject_name +
          " " +
          verbList[0] +
          " " +
          tempActivityPojo.object_article +
          " " +
          object_name;
      }
      tempActivityPojo.active_voice = active_voice;

      if (
        ("" === tempActivityPojo.object_article ||
          null === tempActivityPojo.object_article) &&
        ("" === tempActivityPojo.subject_article ||
          null === tempActivityPojo.subject_article)
      ) {
        passive_voice =
          object_name.substring(0, 1).toUpperCase() +
          object_name.substring(1) +
          " " +
          verbList[1] +
          " by " +
          subject_name;
      } else if (
        "" === tempActivityPojo.subject_article ||
        null === tempActivityPojo.subject_article
      ) {
        passive_voice =
          tempActivityPojo.object_article.substring(0, 1).toUpperCase() +
          tempActivityPojo.object_article.substring(1) +
          " " +
          object_name +
          " " +
          verbList[1] +
          " by " +
          subject_name;
      } else if (
        "" === tempActivityPojo.object_article ||
        null === tempActivityPojo.object_article
      ) {
        passive_voice =
          object_name.substring(0, 1).toUpperCase() +
          object_name.substring(1) +
          " " +
          verbList[1] +
          " by " +
          tempActivityPojo.subject_article +
          " " +
          subject_name;
      } else {
        passive_voice =
          tempActivityPojo.object_article.substring(0, 1).toUpperCase() +
          tempActivityPojo.object_article.substring(1) +
          " " +
          object_name +
          " " +
          verbList[1] +
          " by " +
          tempActivityPojo.subject_article +
          " " +
          subject_name;
      }
      tempActivityPojo.passive_voice = passive_voice;
    }
  };

  const jumbled_sentence = () => {
    var active_sentence = tempActivityPojo.active_voice.split(" ");
    tempActivityPojo.active_sentence = active_sentence;
    var passive_sentence = tempActivityPojo.passive_voice.split(" ");
    tempActivityPojo.passive_sentence = passive_sentence;
    tempActivityPojo.jumbled_active_sentence = shuffleArray(active_sentence);
    tempActivityPojo.jumbled_passive_sentence = shuffleArray(passive_sentence);
  };

  const populateJSON = (exercise_id) => {
    var jsonObject = {};
    jsonObject["tense"] = tempActivityPojo.sentence_tense;

    if (exercise_id === 3) {
      jsonObject["active_voice_array"] = tempActivityPojo.active_sentence;
      jsonObject["jumbled_passive_sentence_array"] =
        tempActivityPojo.jumbled_passive_sentence;
      setActList(jsonObject["jumbled_passive_sentence_array"]);
    }

    if (exercise_id === 1) {
      jsonObject["passive_voice_array"] = tempActivityPojo.passive_sentence;
      jsonObject["jumbled_active_sentence_array"] =
        tempActivityPojo.jumbled_active_sentence;
      setActList(jsonObject["jumbled_active_sentence_array"]);
    }

    tempPassActObj = jsonObject;
    setPassActObj({ ...jsonObject });
    setActivityPojo(tempActivityPojo);
    return jsonObject;
  };

  /**
   * Jumbles the array.
   * @param sent Sentence array to be jumbled.
   * @return returns jumbled array
   **/
  const shuffleArray = (sent) => {
    var sentence = new Array(sent.length);
    sentence = [...sent];
    //System.arraycopy(sent, 0, sentence, 0, sent.length);

    for (var i = sentence.length - 1; i > 0; i--) {
      var index = randomNumberInRange(0, i);
      // Simple swap
      var a = sentence[index];
      sentence[index] = sentence[i];
      sentence[i] = a;
    }

    var count = 0;
    for (var i = 0; i < sentence.length; i++) {
      if (sent[i].toLowerCase() === sentence[i].toLowerCase()) {
        // not shuffled then again shuffle it
        count++;
      }
    }

    if (count == sentence.length) {
      let temp0 = sentence[0];
      let temp1 = sentence[1];
      sentence[1] = temp0;
      temp0 = sentence[2];
      sentence[2] = temp1;
      sentence[0] = temp0;
    }
    return sentence;
  };

  /**
   * Render and bind the data to the elements. According to the activity i.e. exercise_id=3 : Active to Passive conversion and exercise_id=1 : Passive to Active conversion
   */
  function process(data, exercise_id) {
    var obj = data;
    var logPassiveSentence = "";
    var logActiveSentence = "";
    var logJumbledPassiveVoiceWord = "";
    var logJumbledActiveVoiceWord = "";

    if (exercise_id == 3) {
      var jumbled_passive_sentence = new Array(); // was null
      var active_voice = new Array(); // was null
      const nonSortElement = document.getElementById("sortable1");
      empty(nonSortElement);
      active_voice = obj["active_voice_array"];
      jumbled_passive_sentence = obj["jumbled_passive_sentence_array"];

      for (var x = 0; x < active_voice.length; x++) {
        var activeVoiceWord = active_voice[x];
        logActiveSentence += activeVoiceWord + " ";

        if (x == active_voice.length - 1) {
          activeVoiceWord = activeVoiceWord + ".";
          const rootElement = document.getElementById("sortable1");
          const element = document.createElement("li");
          element.setAttribute("id", "li" + x);
          element.setAttribute("class", "ui-state-default");
          element.setAttribute(
            "style",
            "margin: 0px 3px 3px; padding: 0 6px; font-size: 1.4em; font-family: arial; font-weight: bold;"
          );
          element.textContent = activeVoiceWord;
          rootElement.appendChild(element);
        } else {
          const rootElement = document.getElementById("sortable1");
          const element = document.createElement("li");
          element.setAttribute("id", "li" + x);
          element.setAttribute("class", "ui-state-default");
          element.setAttribute(
            "style",
            "margin: 0px 3px 3px; padding: 0 6px; font-size: 1.4em; font-family: arial; font-weight: bold;"
          );
          element.textContent = activeVoiceWord;
          rootElement.appendChild(element);
        }
      }
    }

    if (exercise_id == 1) {
      var jumbled_active_sentence = new Array(); // was null
      var passive_voice = new Array(); // was null
      const nonSortElement = document.getElementById("sortable1");
      empty(nonSortElement);
      passive_voice = obj["passive_voice_array"];
      jumbled_active_sentence = obj["jumbled_active_sentence_array"];

      for (var x = 0; x < passive_voice.length; x++) {
        var passiveVoiceWord = passive_voice[x];
        logPassiveSentence += passiveVoiceWord + " ";

        if (x == passive_voice.length - 1) {
          passiveVoiceWord = passiveVoiceWord + ".";
          const rootElement = document.getElementById("sortable1");
          const element = document.createElement("li");
          element.setAttribute("id", "li" + x);
          element.setAttribute("class", "ui-state-default");
          element.setAttribute(
            "style",
            "margin: 0px 3px 3px; padding: 0 6px; font-size: 1.4em; font-family: arial; font-weight: bold;"
          );
          element.textContent = passiveVoiceWord;
          rootElement.appendChild(element);
        } else {
          const rootElement = document.getElementById("sortable1");
          const element = document.createElement("li");
          element.setAttribute("id", "li" + x);
          element.setAttribute("class", "ui-state-default");
          element.setAttribute(
            "style",
            "margin: 0px 3px 3px; padding: 0 6px; font-size: 1.4em; font-family: arial; font-weight: bold;"
          );
          element.textContent = passiveVoiceWord;
          rootElement.appendChild(element);
        }
      }
    }
  }

  const empty = (element) => {
    while (element.firstElementChild) {
      element.firstElementChild.remove();
    }
  };

  const handleChange = (event) => {
    var sentenceTempPath = "";
    setTense(event.target.value);
    tempActivityPojo.sentence_tense = event.target.value;
    sentenceTempPath = getSentenceTempPath();

    if (undefined !== sentenceTempPath || "" === sentenceTempPath) {
      const result = simpleSentenceParser(sentenceTempPath).then((r) => {
        var allNounVrbObj = getDetailedNounVerb(
          actvityId,
          tempPojoSent,
          tempActivityPojo
        );
        setObjectDetails(allNounVrbObj.Noun_verb_nounid, tempActivityPojo);
        setSubjectDetails();
        var listActPass = getVerbInflections();
        articleSelector();
        generateSentence(actvityId, listActPass);
        jumbled_sentence();
        var passDataObj = populateJSON(actvityId);
        process(passDataObj, actvityId);
      });
    }
  };

  const displayScore = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseResult = () => {
    setOpenFeedback(false);
  };

  const onClickRestartActivity = () => {
    setOpen(false);
    navigate("/");
  };

  const handleFeedback = (e) => {
    var listSortSent = document.getElementById("sortable").childNodes;
    var user_answer = [];
    var feedbackObj = {};
    var correct_answer = "";

    for (var x = 0; x < listSortSent.length; x++) {
      user_answer.push(listSortSent[x].innerText);
    }

    if (actvityId === 3) {
      correct_answer = ActivityPojo.passive_sentence;
    }

    if (actvityId === 1) {
      correct_answer = ActivityPojo.active_sentence;
    }

    //check_answer(actvityId, user_answer, ActivityPojo.active_sentence, feedbackObj);
    check_answer(actvityId, user_answer, correct_answer, feedbackObj);
    feedbackDisplay(feedbackObj, user_answer);
  };

  const check_answer = (
    exerciseID,
    user_answer,
    correct_answer,
    feedbackObj
  ) => {
    let size = 20;
    var wrong_ans_position = [...Array(size)].fill(21);
    var j = 0;

    // CHECKING THE WRONG POSITIONS OF THE SUBJECT / OBJECT / HELPING VERB /
    // VERBS IN THE USER ANSWER
    for (var i = 0; i < correct_answer.length; i++) {
      if (correct_answer[i].toLowerCase() !== user_answer[i].toLowerCase()) {
        wrong_ans_position[j] = i;
        j = j + 1;
      }
    }

    if (exerciseID === 3) {
      getActiveToPassiveFeedback(wrong_ans_position, user_answer, feedbackObj);
      setFeedbackObj(feedbackObj);
      setOpenFeedback(true);
    }

    if (exerciseID === 1) {
      getPassiveToActiveFeedback(wrong_ans_position, user_answer, feedbackObj);
      setFeedbackObj(feedbackObj);
      setOpenFeedback(true);
    }
  };

  /**
   * Feedback for Passive to active voice activity is retrieved from here.
   * @param wrong_ans_position positions of wrong answers
   * @param user_answer the answer submitted by user word by word
   * @param json_object this object will be populated with all the feedback that is given to the user
   * @throws JSONException throws JSONException
   */
  const getPassiveToActiveFeedback = (
    wrong_ans_position,
    user_answer,
    feedbackObj
  ) => {
    let objectDiagnosis = passActFeedbackProps.object_Diagnosis;
    let subjectDiagnosis = passActFeedbackProps.subject_Diagnosis;
    let mainVerbDiagnosis = passActFeedbackProps.mainVerb_Diagnosis;
    let helpingVerbDiagnosis = passActFeedbackProps.helpingVerb_Diagnosis;
    let objectRemedy = passActFeedbackProps.object_Remedy;
    let subjectRemedy = passActFeedbackProps.subject_Remedy;
    let mainVerbRemedy = passActFeedbackProps.mainVerb_Remedy;
    let helpingVerbRemedy = passActFeedbackProps.helpingVerb_Remedy;
    var subjectArticle = ActivityPojo.subject_article;
    var subjectName = ActivityPojo.subject_name;
    var objectArticle = ActivityPojo.object_article;
    var objectName = ActivityPojo.object_name;
    var jsonArray = {};
    var wrong_flag = 0;

    tempPojoSent = {
      ...TemplatePojo,
    };

    for (var i = 0; i < wrong_ans_position.length; i++) {
      if (wrong_ans_position[i] !== 21) {
        if (
          user_answer[wrong_ans_position[i]].toLowerCase() ===
          objectName.toLowerCase()
        ) {
          wrong_flag = 1;
          var diagRemed = [];
          diagRemed.push(objectDiagnosis);
          diagRemed.push(objectRemedy);
          feedbackObj["object"] = diagRemed;
        } else if (
          user_answer[wrong_ans_position[i]].toLowerCase() ===
          subjectName.toLowerCase()
        ) {
          wrong_flag = 1;
          var diagRemed = [];
          diagRemed.push(subjectDiagnosis);
          diagRemed.push(subjectRemedy);
          feedbackObj["subject"] = diagRemed;
        } else if (
          user_answer[wrong_ans_position[i]].toLowerCase() ===
          ActivityPojo.active_main_verb
        ) {
          wrong_flag = 1;
          var diagRemed = [];
          diagRemed.push(mainVerbDiagnosis);
          diagRemed.push(mainVerbRemedy);
          feedbackObj["main_verb"] = diagRemed;
        } else if (ActivityPojo.active_helping_verb != null) {
          wrong_flag = 1;
          var flag = 0;
          var helping_verb = ActivityPojo.active_helping_verb.split(" ");

          for (var j = 0; j < helping_verb.length; j++) {
            if (
              helping_verb[j].toLowerCase() ===
              user_answer[wrong_ans_position[i]].toLowerCase()
            )
              flag = 1;
          }

          if (flag == 1) {
            var diagRemed = [];
            diagRemed.push(helpingVerbDiagnosis);
            diagRemed.push(helpingVerbRemedy);
            feedbackObj["helping_verb"] = diagRemed;
          }
        }
      }
    }

    if (wrong_flag == 1) {
      feedbackObj["result"] = ActivityPojo.active_voice;
    } else {
      feedbackObj["result"] = "Correct answer";
    }
  };

  const getActiveToPassiveFeedback = (
    wrong_ans_position,
    user_answer,
    feedbackObj
  ) => {
    let objectDiagnosis = passActFeedbackProps.object_Diagnosis;
    let subjectDiagnosis = passActFeedbackProps.subject_Diagnosis;
    let useOfByDiagnosis = passActFeedbackProps.useOfBy_Diagnosis;
    let mainVerbDiagnosis = passActFeedbackProps.mainVerb_Diagnosis;
    let helpingVerbDiagnosis = passActFeedbackProps.helpingVerb_Diagnosis;
    let objectRemedy = passActFeedbackProps.object_Remedy;
    let subjectRemedy = passActFeedbackProps.subject_Remedy;
    let useOfByRemedy = passActFeedbackProps.useOfBy_Remedy;
    let mainVerbRemedy = passActFeedbackProps.mainVerb_Remedy;
    let helpingVerbRemedy = passActFeedbackProps.helpingVerb_Remedy;

    //String subjectArticle = activityPojo.getObject_article();
    //String subjectName = activityPojo.getObject_name();
    //String objectArticle = activityPojo.getSubject_article();
    //String objectName = activityPojo.getSubject_name();
    var subjectArticle = ActivityPojo.subject_article;
    var subjectName = ActivityPojo.subject_name;
    var objectArticle = ActivityPojo.object_article;
    var objectName = ActivityPojo.object_name;
    var jsonArray = {};
    var wrong_flag = 0;

    tempPojoSent = {
      ...TemplatePojo,
    };

    for (var i = 0; i < wrong_ans_position.length; i++) {
      if (wrong_ans_position[i] != 21) {
        if (
          user_answer[wrong_ans_position[i]].toLowerCase() ===
          objectName.toLowerCase()
        ) {
          wrong_flag = 1;
          var diagRemed = [];
          diagRemed.push(objectDiagnosis);
          diagRemed.push(objectRemedy);
          feedbackObj["object"] = diagRemed;
        } else if (
          user_answer[wrong_ans_position[i]].toLowerCase() ===
          subjectName.toLowerCase()
        ) {
          wrong_flag = 1;
          var diagRemed = [];
          diagRemed.push(subjectDiagnosis);
          diagRemed.push(subjectRemedy);
          feedbackObj["subject"] = diagRemed;
        } else if (user_answer[wrong_ans_position[i]].toLowerCase() === "by") {
          wrong_flag = 1;
          var diagRemed = [];
          diagRemed.push(useOfByDiagnosis);
          diagRemed.push(useOfByRemedy);
          feedbackObj["by"] = diagRemed;
        } else if (
          user_answer[wrong_ans_position[i]].toLowerCase() ===
          ActivityPojo.passive_main_verb
        ) {
          wrong_flag = 1;
          var diagRemed = [];
          diagRemed.push(mainVerbDiagnosis);
          diagRemed.push(mainVerbRemedy);
          feedbackObj["main_verb"] = diagRemed;
        } else {
          wrong_flag = 1;
          var flag = 0;
          var helping_verb = ActivityPojo.passive_helping_verb.split(" ");

          for (var j = 0; j < helping_verb.length; j++) {
            if (
              helping_verb[j].toLowerCase() ===
              user_answer[wrong_ans_position[i]].toLowerCase()
            )
              flag = 1;
          }

          if (flag == 1) {
            var diagRemed = [];
            diagRemed.push(helpingVerbDiagnosis);
            diagRemed.push(helpingVerbRemedy);
            feedbackObj["helping_verb"] = diagRemed;
          }
        }
      }
    }

    if (wrong_flag == 1) {
      feedbackObj["result"] = ActivityPojo.passive_voice;
    } else {
      feedbackObj["result"] = "Correct answer";
    }
  };

  const feedbackDisplay = (feedbackObj, user_answer) => {};

  const handleRedirect = () => {
    var sentenceTempPath = "";
    sentenceTempPath = getSentenceTempPath();

    if (undefined !== sentenceTempPath || "" === sentenceTempPath) {
      const result = simpleSentenceParser(sentenceTempPath).then((r) => {
        var allNounVrbObj = getDetailedNounVerb(
          actvityId,
          tempPojoSent,
          tempActivityPojo
        );
        setObjectDetails(allNounVrbObj.Noun_verb_nounid, tempActivityPojo);
        setSubjectDetails();
        var listActPass = getVerbInflections();
        articleSelector();
        generateSentence(actvityId, listActPass);
        jumbled_sentence();
        var passDataObj = populateJSON(actvityId);
        process(passDataObj, actvityId);
      });
    }
  };

  const handlePassiveActive = (e) => {
    navigate("/launchpage/passive-active", { state: { activityId: 1 } });
  };

  const handleActivePassive = (e) => {
    navigate("/launchpage/active-passive", { state: { activityId: 3 } });
  };

  return (
    <div
      className="row-md-auto"
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "20px",
        background: "#F2FBFF",
      }}
    >
      <div
        className="row-md-auto"
        style={{ height: "100%", width: "100%", borderRadius: "20px" }}
      >
        {/* =============================== Start of Header ================================= */}
        <div className="row-md-auto d-flex " style={{ height: "8%" }}>
          <div
            className=""
            style={{ width: "20%", display: "flex", textAlign: "center" }}
          >
            <div style={{ width: "40%" }}></div>
            <h6
              className=""
              style={{
                backgroundColor: "rgb(245, 211, 139)",
                height: "70%",
                borderRadius: "0 0 10px 10px",
                width: "70%",
                paddingTop: "2%",
                marginLeft: "1vh",
                color: "#220730",
              }}
            >
              <strong style={{ fontSize: "1.2rem" }}>
                {" "}
                {actvityId == 1 ? <>Level 2</> : <>Level 1</>}
              </strong>
            </h6>
          </div>

          <div className="col text-center">
            <h5 style={{ paddingTop: "10px", color: "white" }}>
              <strong> </strong>
            </h5>
          </div>

          <div
            className="col-md-auto"
            style={{
              width: "30%",
              display: "flex",
              margin: "auto",
              textAlign: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Dropdown
              className="d-flex justify-content-end"
              style={{ height: "90%" }}
              variant="secondary"
            >
              <Dropdown.Toggle
                style={{ backgroundColor: "#1976d2", fontSize: "0.95rem" }}
                id="dropdown-basic"
              >
                {" "}
                SELECT LEVEL{" "}
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ background: "#F7F1FC" }}>
                <Dropdown.Item
                  //href="#/launchpage/active-passive"
                  style={{ color: "#350B5B" }}
                  onClick={(e) => handleActivePassive(e)}
                >
                  Level 1
                </Dropdown.Item>

                <Dropdown.Item
                  //href="#/launchpage/passive-active"
                  style={{ color: "#350B5B" }}
                  onClick={(e) => handlePassiveActive(e)}
                >
                  Level 2
                </Dropdown.Item>

                {/* <Dropdown.Item href="#/launchpage/select-letter" style={{ color: "#350B5B" }} >
                               Level 3
                          </Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        {/* =============================== End of Header ================================= */}

        {/* =============================== Start of Letter ================================= */}
        <div
          className="col justify-content-around"
          style={{
            // border: "1px solid #A7A8AB",
            //height: "90%",
            height: "77vh",
            marginLeft: "0.1%",
            marginRight: "0.1%",
            // backgroundColor: "#E4CDFF",
            //paddingLeft: "1%",
            //paddingTop: "1%",
            //fontSize: "2.2vh",
            borderRadius: "5px",
            //border: "1px solid #BAB7BD",
            width: "100%",
            display: "flex",
            //position: "relative",
          }}
        >
          {/* ============================================================================== */}

          <div
            className="row"
            style={{
              // border: "1px solid #A7A8AB",
              height: "100%",
              marginLeft: "0.1%",
              marginRight: "0.1%",
              // backgroundColor: "#E4CDFF",
              paddingLeft: "1%",
              paddingTop: "1%",
              fontSize: "2.2vh",
              borderRadius: "13px",
              boxShadow: "0px 4px 7px #00000029",
              width: "67%",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              className="row-md-auto overflow-auto"
              style={{
                fontSize: "1.8vh",
                height: "90%",
                textAlign: "center",
                justifyContent: "center",
                alignContent: "center",
                position: "relative",
              }}
            >
              <div
                className="row"
                style={{
                  textAlign: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="row d-flex justify-content-left"
                  style={{ padding: "10px", textAlign: "left" }}
                >
                  <h6>{hintText}</h6>
                </div>

                <div className="col-md-12 d-flex justify-content-left">
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Tense
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={tense}
                        label="tense"
                        onChange={handleChange}
                      >
                        {tensejson.map((tense, index) => (
                          <MenuItem
                            id={index}
                            key={index}
                            value={tense.activity_name}
                          >
                            {tense.activity_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              </div>
              <hr />

              <div
                className="row"
                style={{
                  height: "50%",
                  textAlign: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <h5 id="sentence-title-1">
                  Sentence in{" "}
                  {actvityId === 1 ? <>Passive Voice</> : <>Active Voice</>}{" "}
                </h5>
                <ul
                  id="sortable1"
                  style={{
                    display: "inline-flex",
                    padding: "10px 10px",
                    margin: "0",
                    justifyContent: "center",
                    listStyle: "none",
                    textAlign: "center",
                    alignContent: "center",
                  }}
                ></ul>
                <br />
                <p className="lead"></p>
                <h5 id="sentence-title-2">
                  Sentence in{" "}
                  {actvityId === 1 ? <>Active Voice</> : <>Passive Voice</>}{" "}
                </h5>
                <div style={{ textAlign: "center", alignContent: "center" }}>
                  <ReactSortable
                    id={"sortable"}
                    style={{ display: "inline-flex" }}
                    list={actList}
                    setList={setActList}
                  >
                    {actList.map((item, index) => (
                      <div id={"li" + index} style={draggableItem} key={item}>
                        {item}
                      </div>
                    ))}
                  </ReactSortable>
                </div>
              </div>
              <hr />

              <div
                className="row"
                style={{
                  textAlign: "center",
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    textAlign: "center",
                    margin: "0",
                  }}
                >
                  {/*<Button
                    variant="contained"
                    style={{ backgroundColor: "#01579b", color: "white" }}
                    onClick={(e) => handleRedirect(e)}
                    value="Previous"
                    color="inherit"
                    sx={{ width: "20%" }}
                  >
                    Previous
                  </Button> */}

                  <Button
                    variant="outlined"
                    style={{ backgroundColor: "green", color: "white" }}
                    onClick={(e) => handleFeedback(e)}
                    value="Check"
                    sx={{ width: "20%" }}
                  >
                    Check
                  </Button>

                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#01579b", color: "white" }}
                    onClick={(e) => handleRedirect(e)}
                    value="Next"
                    color="inherit"
                    sx={{ width: "20%" }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================================== */}

          <div
            //className="row"
            style={{
              height: "100%",
              marginLeft: "0.1%",
              marginRight: "0.1%",
              borderRadius: "13px",
              boxShadow: "0px 4px 7px #00000029",
              backgroundColor: "#FFFFFF",
              width: "30%",
              textAlign: "center",
              //justifyContent: "center",
              overflowX: "hidden",
              //overflowY: "auto",
            }}
          >
            <>
              <div
                className="text-center"
                style={{
                  background: "#002F65",
                  borderRadius: "10px 10px 0px 0px",
                  opacity: "1",
                  color: "#FFFFFF",
                  fontSize: "1.3rem",
                  fontWeight: "bolder",
                }}
              >
                Instructions
              </div>

              <div style={{ textAlign: "left" }}>
                <div style={{ maxHeight: "50vh", padding: "2%" }}>
                  <div>
                    <ul>
                      <li>Convert Passive Voice to Active Voice.</li>
                      <li>Select the desired tense from the dropdown.</li>
                      <li>The sentence displayed is in Passive voice.</li>
                      <li>
                        Corresponding a active voice sentence is given in the
                        form of disarranged words below.
                      </li>
                      <li>
                        Now, rearrange the given words below to construct the
                        corresponding Active voice of the given sentence.
                      </li>
                      <li>Click on "Hints" to view hints.</li>
                      <li>
                        Click on "Check" to check whether the Active voice is
                        properly constructed.
                      </li>
                      <li>Click on "Next" to view the next sentence.</li>
                      <li>
                        Click on 'Select Level' to attempt 'Level 1' or 'Level
                        2'.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          </div>

          {/* ============================================================================== */}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
              sx: {
                width: "50%",
                maxHeight: 300,
              },
            }}
          >
            <DialogTitle style={{ minWidth: "50%" }} id="alert-dialog-title">
              {hintTitle}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {hintText}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleClose} autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/* =======================================           ========================== */}

        {/* ================================= Feedback Dialogue ================================ */}

        <Dialog
          fullScreen={fullScreen}
          open={openFeedback}
          onClose={handleCloseResult}
          maxWidth={"lg"}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            id="responsive-dialog-title"
            style={{ textAlign: "center" }}
          >
            <b> RESULT </b>
          </DialogTitle>
          <DialogContent>
            {fdbackObj["result"] === "Correct answer" ? (
              <b style={{ color: "green" }}>
                Congratulations! Your answer is correct.
              </b>
            ) : (
              <table
                style={{
                  width: "100%",
                  tableLayout: "auto",
                  border: "1px solid black",
                }}
              >
                <thead style={{ padding: "10px", border: "1px solid black" }}>
                  <tr
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                      color: "white",
                      background: "blue",
                    }}
                  >
                    <th colSpan="4" style={{ padding: "10px" }}>
                      {" "}
                      <b> Feedback </b>{" "}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ padding: "10px", border: "1px solid black" }}>
                      Item
                    </th>
                    <th style={{ padding: "10px", border: "1px solid black" }}>
                      Result
                    </th>
                    <th style={{ padding: "10px", border: "1px solid black" }}>
                      Desctiption
                    </th>
                    <th style={{ padding: "10px", border: "1px solid black" }}>
                      Remedy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(fdbackObj).map((method, index) => (
                    <>
                      {method === "subject" ||
                      method === "object" ||
                      method === "main_verb" ||
                      method === "helping_verb" ||
                      method === "by" ? (
                        <tr key={index} style={{ border: "1px solid black" }}>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid black",
                            }}
                            key={method + "0"}
                          >
                            {method.toUpperCase()}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "5px",
                              border: "1px solid black",
                            }}
                            key={method + "1"}
                          >
                            {" "}
                            <CloseOutlinedIcon style={{ color: "red" }} />
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid black",
                            }}
                            key={method + "2"}
                          >
                            {fdbackObj[method][0]}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid black",
                            }}
                            key={method + "3"}
                          >
                            {fdbackObj[method][1]}
                          </td>
                        </tr>
                      ) : (
                        <tr key={index} style={{ display: "none" }}></tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResult} autoFocus>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
        {/* ================================= Feedback Dialogue ================================ */}
      </div>
    </div>
  );
};

export default MidLevelPassiveActivePage;
