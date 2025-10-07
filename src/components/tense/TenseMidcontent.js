import React, { useEffect, useState } from "react";
import { Inflectors } from "en-inflectors";
import { DragDropContainer, DropTarget } from "react-drag-drop-container";

import TenseDropdown from "../Data/tenses.json";
import sentenceTemplate from "../../supportingfiles/DBJSON/sentence_template.json";
import verbjson from "../../supportingfiles/DBJSON/verb.json";
import nounverbjson from "../../supportingfiles/DBJSON/noun_verb.json";
import nounjson from "../../supportingfiles/DBJSON/noun.json";
import feedback from "./feedback.json";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useTranslation } from "react-i18next";
import SentenceTemplate from "../SentenceTemplate";

const TenseMidcontent = () => {
  const { t } = useTranslation();
  const [firstDropDown, setFirstDropDown] = useState("Simple Present Tense");
  const [secondDropDown, setSecondDropDown] = useState("Simple Past Tense");
  const [actvityId, setActivityId] = useState(3);
  const [actList, setActList] = useState([]);
  const [actSentList, setActSentList] = useState([]);
  const [droppableIndex, setDroppableIndex] = useState([]);
  const [openFeedback, setOpenFeedback] = useState(false);
  let [showAnswerCounter, setShowAnswerCounter] = useState(0);
  let [IsDisableNext, setIsDisableNext] = useState(true);

  var tempActivityPojo = {
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
    verb: "", //baseFormVerb=verb

    active_helping_verb: "",
    passive_helping_verb: "",
    active_main_verb: "",
    passive_main_verb: "",

    jumbled_active_sentence: [],
    jumbled_passive_sentence: [],
    active_sentence: [],
    passive_sentence: [],
    AnswerSentence: "",
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

  const [dummyTempActivityPojo, setDummyTempActivityPojo] = useState({
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
    verb: "", //baseFormVerb=verb

    active_helping_verb: "",
    passive_helping_verb: "",
    active_main_verb: "",
    passive_main_verb: "",

    jumbled_active_sentence: [],
    jumbled_passive_sentence: [],
    active_sentence: [],
    passive_sentence: [],
    AnswerSentence: "",
  });

  // const [dummyTempPojoSent, setDummyTempPojoSent] = useState({
  //   sentenceID: "",
  //   sentenceType: "",
  //   subjectType: "",
  //   verbCategory: "",
  //   infinitiveType: "",
  //   infinitiveTense: "",
  //   subverbType: "",
  //   objectType: "",
  //   subjectArticleType: "",
  //   objectArticleType: "",
  // });

  const [TenseConversionPojo, setTenseConversionPojo] = useState({
    tenseConvQuest: "",
    questSent_helping_verb: "",
    questSent_main_verb: "",
    questSent: [], // Empty array for questSent
    tenseConvAns: "",
    ansSent_helping_verb: "",
    ansSent_main_verb: "",
    ansSent_helping_verb_array: [], // Empty array for ansSent_helping_verb_array
    ansSent: [], // Empty array for ansSent
    AnswerSentence: "",
    QuestionSentence: "",
    helping_verb_array: [],
    main_verb_array: [],
  });

  const [feedbackAnswer, setFeedbackAnswer] = useState({
    helping_verb_Diagnosis: "",
    main_verb_Diagnosis: "",

    helping_verb_Remedy: "",
    main_verb_Remedy: "",

    answerFeedback: "",
  });

  useEffect(() => {
    const sentenceTempPath = getSentenceTempPath();

    // Ensure sentenceTempPath is valid before proceeding
    if (sentenceTempPath) {
      const fetchData = async () => {
        try {
          // Wait for sentence parsing to finish
          await simpleSentenceParser(sentenceTempPath);

          // Get the noun-verb details after parsing
          const allNounVrbObj = getDetailedNounVerb(
            actvityId,
            tempPojoSent,
            tempActivityPojo
          );

          // Set object details and subject details
          setObjectDetails(allNounVrbObj.Noun_verb_nounid, tempActivityPojo);
          setSubjectDetails();

          // Get verb inflections from the first dropdown
          const listActPass = getVerbInflections(firstDropDown);

          // Run the article selector and generate a sentence
          articleSelector();
          const firstDDSentence = generateSentence(4, listActPass);

          // Process the generated sentence
          process(firstDDSentence);
          generateAnswerSentence();

          // Set the activity options
          setActList(fetchOptions());

          // Copy the data to the dummy objects (this will update state)
          setDummyTempActivityPojo({ ...tempActivityPojo });
          // setDummyTempPojoSent({ ...tempPojoSent });
        } catch (error) {
          console.error("Error during sentence parsing or processing:", error);
        }
      };

      // Call the async function to handle the data fetching and updates
      fetchData();
    }
  }, [firstDropDown]); // Dependency array - this effect will run when `firstDropDown` changes

  useEffect(() => {
    const sentenceTempPath = getSentenceTempPath();

    if (sentenceTempPath) {
      simpleSentenceParser(sentenceTempPath).then(() => {
        // const listActPass = getVerbInflections(secondDropDown);
        // console.log(listActPass);

        // const secondDDSent = generateSentence(4, listActPass);
        generateAnswerSentence();
        // console.log(secondDDSent);
      });
    }
  }, [secondDropDown]);

  useEffect(() => {
    if (feedbackAnswer.answerFeedback === "Wrong answer.") {
      setShowAnswerCounter(showAnswerCounter + 1);
    } else if (feedbackAnswer.answerFeedback === "Correct answer.") {
      setIsDisableNext(false);
    }
  }, [feedbackAnswer]);

  const getSentenceTempPath = () => {
    var sentenseTempPath = "";
    var sentenceTempId = 1;

    for (var noofsent = 0; noofsent < sentenceTemplate.length; noofsent++) {
      if (sentenceTemplate[noofsent].activity_id === sentenceTempId) {
        sentenseTempPath = sentenceTemplate[noofsent].activity_name;
        break;
      }
    }
    return sentenseTempPath;
  };

  async function simpleSentenceParser(xmlFileSrc) {
    try {
      // var staticPath = require(`../../supportingfiles${xmlFileSrc}`);
      // console.log(staticPath);

      // const response = await fetch(SentenceTemplate);

      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      // const textResponse = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(SentenceTemplate, "text/xml");

      const listSentence = xmlDoc.querySelectorAll("sentence");
      const randSentId = randomNumberInRange(0, listSentence.length - 1);
      const node = listSentence[randSentId];

      const nodeId = node.getAttribute("id");
      const nodeType = node.getAttribute("type");
      const nodeSubject = node.querySelectorAll("subject");
      const nodePredicate = node.querySelectorAll("predicate");

      const nodeSubjNounType = nodeSubject[0]
        .querySelectorAll("noun")[0]
        .getAttribute("type");

      const nodePredVerbCate = nodePredicate[0]
        .querySelectorAll("verb")[0]
        .getAttribute("category");

      const nodePredVerbInfitype = nodePredicate[0]
        .querySelectorAll("verb")[0]
        .querySelectorAll("infinitive")[0]
        .getAttribute("type");

      const nodePredVerbInfiTense = nodePredicate[0]
        .querySelectorAll("verb")[0]
        .querySelectorAll("infinitive")[0]
        .getAttribute("tense");

      const nodePredVerbInfiSubVerbType = nodePredicate[0]
        .querySelectorAll("verb")[0]
        .querySelectorAll("infinitive")[0]
        .querySelectorAll("subverb")[0]
        .getAttribute("type");

      const nodePredObjNounType = nodePredicate[0]
        .querySelectorAll("object")[0]
        .querySelectorAll("noun")[0]
        .getAttribute("type");

      const nodeSubjArtType = nodeSubject[0]
        .querySelectorAll("article")[0]
        .getAttribute("type");

      const nodePredObjArtType = nodePredicate[0]
        .querySelectorAll("object")[0]
        .querySelectorAll("article")[0]
        .getAttribute("type");

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

      // Optionally return tempPojoSent immediately
      return tempPojoSent;
    } catch (error) {
      console.error(error);
      throw error; // rethrow the error to handle it in calling code if needed
    }
  }

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

  const getVerbInflections = (tense) => {
    var listTense = [];
    switch (tense) {
      case "Simple Present Tense":
        listTense = simplepresent();
        break;
      case "Present Continuous Tense":
        listTense = continuouspresent();
        break;
      case "Present Perfect Tense":
        listTense = perfectpresent();
        break;
      case "Present Perfect Continuous Tense":
        listTense = perfectpresentcontinuous();
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
      case "Past Perfect Continuous Tense":
        listTense = perfectpastcontinuous();
        break;
      case "Simple Future Tense":
        listTense = simplefuture();
        break;
      case "Future Continuous Tense":
        listTense = futurecontinuous();
        break;
      case "Future Perfect Tense":
        listTense = perfectfuture();
        break;
      case "Future Perfect Continuous Tense":
        listTense = perfectfuturecontinuous();
        break;
      default: // This is the correct syntax for the default case
        console.log("Tense cannot be identified.");
        break;
    }

    return listTense;
  };

  const simplepresent = () => {
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var sverb = null;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
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

  const continuouspresent = () => {
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
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

  const perfectpresent = () => {
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
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

  const perfectpresentcontinuous = () => {
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
    var sverb = null;
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    if (
      category.toLowerCase() === "regular" ||
      category.toLowerCase() === "irregular"
    ) {
      var averb = new Inflectors(verb).conjugate("VBG"); //var ingrule = ingrules(verb);
      tempActivityPojo.active_main_verb = averb;

      if (
        subject_number.toLowerCase() === "singular" &&
        subject_person.toLowerCase("third")
      )
        sverb = "has been";
      else sverb = "have been";

      tempActivityPojo.active_helping_verb = sverb;
      activeverb =
        tempActivityPojo.active_helping_verb +
        " " +
        tempActivityPojo.active_main_verb;
    }

    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb;
  };

  const simplepast = () => {
    var sentencetense = tempActivityPojo.sentence_tense
      ? tempActivityPojo.sentence_tense
      : dummyTempActivityPojo.sentence_tense;
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
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
  };

  const continuouspast = () => {
    // active form
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
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

  const perfectpast = () => {
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
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

  const perfectpastcontinuous = () => {
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
    var sverb = null;
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    var averb = new Inflectors(verb).conjugate("VBG");
    sverb = "had been";

    tempActivityPojo.active_helping_verb = sverb;
    tempActivityPojo.active_main_verb = averb;

    activeverb =
      tempActivityPojo.active_helping_verb +
      " " +
      tempActivityPojo.active_main_verb;

    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb;
  };

  const simplefuture = () => {
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
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

  const futurecontinuous = () => {
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
    var sverb = null;
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    if (
      category.toLowerCase() === "regular" ||
      category.toLowerCase() === "irregular"
    ) {
      var averb = new Inflectors(verb).conjugate("VBG"); //var ingrule = ingrules(verb);
      if (
        subject_person.toLowerCase() === "first" ||
        (subject_person.toLowerCase() === "third" &&
          subject_number.toLowerCase() === "singular")
      ) {
        sverb = "will be";
      }
      if (
        subject_person.toLowerCase() === "second" ||
        (subject_person.toLowerCase() === "third" &&
          subject_number.toLowerCase() === "plural")
      ) {
        sverb = "will be";
      }
      tempActivityPojo.active_helping_verb = sverb;
      tempActivityPojo.active_main_verb = averb;

      activeverb =
        tempActivityPojo.active_helping_verb +
        " " +
        tempActivityPojo.active_main_verb;
    }
    actpassverb.push(activeverb);
    actpassverb.push(passiveverb);
    return actpassverb;
  };

  const perfectfuture = () => {
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;
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

  const perfectfuturecontinuous = () => {
    var category = tempActivityPojo.verb_category
      ? tempActivityPojo.verb_category
      : dummyTempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number
      ? tempActivityPojo.subject_number
      : dummyTempActivityPojo.subject_number;
    var subject_person = tempActivityPojo.subject_person
      ? tempActivityPojo.subject_person
      : dummyTempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb
      ? tempActivityPojo.verb
      : dummyTempActivityPojo.verb;
    var object_number = tempActivityPojo.object_number
      ? tempActivityPojo.object_number
      : dummyTempActivityPojo.object_number;

    var sverb = null;
    var activeverb = null;
    var passiveverb = null;
    var actpassverb = [];

    if (
      category.toLowerCase() === "regular" ||
      category.toLowerCase() === "irregular"
    ) {
      var averb = new Inflectors(verb).conjugate("VBG");
      if (
        subject_person.toLowerCase() === "first" ||
        (subject_person.toLowerCase() === "third" &&
          subject_number.toLowerCase() === "singular")
      ) {
        sverb = "will have been";
      }
      if (
        subject_person.toLowerCase() === "second" ||
        (subject_person.toLowerCase() === "third" &&
          subject_number.toLowerCase() === "plural")
      ) {
        sverb = "will have been";
      }
      tempActivityPojo.active_helping_verb = sverb;
      tempActivityPojo.active_main_verb = averb;
      activeverb =
        tempActivityPojo.active_helping_verb +
        " " +
        tempActivityPojo.active_main_verb;
    }
    actpassverb.push(activeverb);
    // actpassverb.push(passiveverb);

    // console.log(actpassverb);

    return actpassverb;
  };

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // ************************************Ariticle************************************************************
  const articleSelector = () => {
    /* Nouns - singular a/ an //handled plural nothing - countable a/an
     * Uncountable nothing - can go with adjective or an adverb-adjective combination before the noun
     */
    articleForSubject();
    articleForObject();
  };

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
  // ************************************Ariticle************************************************************

  const generateSentence = (exerciseID, verbList) => {
    var active_voice = null;
    // var passive_voice = null;
    var subject_name = tempActivityPojo.subject_name
      ? tempActivityPojo.subject_name
      : dummyTempActivityPojo.subject_name;
    var object_name = tempActivityPojo.object_name
      ? tempActivityPojo.object_name
      : dummyTempActivityPojo.object_name;

    let obj_art = tempActivityPojo.object_article
      ? tempActivityPojo.object_article
      : dummyTempActivityPojo.object_article;
    let sub_art = tempActivityPojo.subject_article
      ? tempActivityPojo.subject_article
      : dummyTempActivityPojo.subject_article;

    if (exerciseID === 4) {
      if (
        ((obj_art === "" || obj_art === null) && sub_art === "") ||
        sub_art === null
      ) {
        active_voice =
          subject_name.substring(0, 1).toUpperCase() +
          subject_name.substring(1) +
          " " +
          verbList[0] +
          " " +
          object_name;
      } else if (obj_art === "" || obj_art === null) {
        active_voice =
          sub_art.substring(0, 1).toUpperCase() +
          sub_art.substring(1) +
          " " +
          subject_name +
          " " +
          verbList[0] +
          " " +
          object_name;
      } else if (sub_art === "" || sub_art === null) {
        active_voice =
          subject_name.substring(0, 1).toUpperCase() +
          subject_name.substring(1) +
          " " +
          verbList[0] +
          " " +
          obj_art +
          " " +
          object_name;
      } else {
        active_voice =
          sub_art.substring(0, 1).toUpperCase() +
          " " +
          sub_art.substring(1) +
          " " +
          subject_name +
          " " +
          verbList[0] +
          " " +
          obj_art +
          " " +
          object_name;
      }
      return active_voice;
    }
  };

  const jumbled_sentence = (sentenceTense) => {
    var active_sentence = [];
    tempActivityPojo.sentence_tense = sentenceTense;
    active_sentence = tempActivityPojo.active_voice.split(" ");
    tempActivityPojo.active_sentence = active_sentence;
  };

  const generateAnswerSentence = () => {
    var arr = [];
    arr = getVerbInflections(secondDropDown);

    let secondDDSent = generateSentence(4, arr);

    console.log(secondDDSent);

    setDummyTempActivityPojo((prevState) => ({
      ...prevState,
      AnswerSentence: secondDDSent,
    }));

    tempActivityPojo.active_voice = secondDDSent;
    tempActivityPojo.AnswerSentence = secondDDSent;

    jumbled_sentence(secondDropDown);

    TenseConversionPojo.tenseConvAns = secondDropDown;

    TenseConversionPojo.ansSent_helping_verb =
      tempActivityPojo.active_helping_verb
        ? tempActivityPojo.active_helping_verb
        : dummyTempActivityPojo.active_helping_verb;

    TenseConversionPojo.ansSent_main_verb = tempActivityPojo.active_main_verb
      ? tempActivityPojo.active_main_verb
      : dummyTempActivityPojo.active_main_verb;

    TenseConversionPojo.ansSent = tempActivityPojo.active_sentence;
    TenseConversionPojo.AnswerSentence = tempActivityPojo.active_voice;

    var tempArray = new Array(TenseConversionPojo.ansSent.length);

    let posMainVerb = 999;

    let sub_name = tempActivityPojo.subject_name
      ? tempActivityPojo.subject_name
      : dummyTempActivityPojo.subject_name;
    let obj_name = tempActivityPojo.object_name
      ? tempActivityPojo.object_name
      : dummyTempActivityPojo.object_name;
    let sub_art = tempActivityPojo.subject_article
      ? tempActivityPojo.subject_article
      : dummyTempActivityPojo.subject_article;
    let obj_art = tempActivityPojo.object_article
      ? tempActivityPojo.object_article
      : dummyTempActivityPojo.object_article;

    for (let i = 0; i < tempArray.length; i++) {
      if (
        sub_name.toLowerCase() ===
          TenseConversionPojo.ansSent[i].toLowerCase() ||
        obj_name.toLowerCase() ===
          TenseConversionPojo.ansSent[i].toLowerCase() ||
        sub_art.toLowerCase() ===
          TenseConversionPojo.ansSent[i].toLowerCase() ||
        obj_art.toLowerCase() === TenseConversionPojo.ansSent[i].toLowerCase()
      ) {
        if (!TenseConversionPojo.ansSent[i] == "") {
          tempArray[i] = TenseConversionPojo.ansSent[i];
        }
      } else {
        tempArray[i] = "--------";
        if (
          TenseConversionPojo.ansSent[i].toLowerCase() ===
          TenseConversionPojo.ansSent_main_verb.toLowerCase()
        ) {
          posMainVerb = i;
        }
      }
    }

    let indexes = tempArray.reduce((acc, item, index) => {
      if (item == "--------") {
        acc.push(index);
      }
      return acc;
    }, []);

    setDroppableIndex((prev) => [...prev, ...indexes]);
    setActSentList(tempArray);
  };

  const process = (sentence) => {
    const sentenceElement = document.getElementById("sent");
    if (sentenceElement) {
      sentenceElement.innerHTML = "";
      sentenceElement.innerHTML += `<strong>${sentence}</strong>`;
    }
  };

  const handleChange = (event, dropdown) => {
    // console.log("inside handlechange", event.target.value);

    switch (dropdown) {
      case "FirstDropdown":
        setFirstDropDown(event.target.value);
        break;
      case "SecondDropdown":
        setSecondDropDown(event.target.value);
        break;
      default:
        alert("Please select a correct dropdown value.");
        break;
    }
  };

  const fetchOptions = () => {
    const baseFormVerb = tempActivityPojo.verb;

    const mainVerbArray = new Array(10);
    const helpingVerbArray = [
      "am",
      "is",
      "are",
      "have",
      "has",
      "had",
      "be",
      "being",
      "been",
      "was",
      "were",
      "will",
      "going to",
    ];
    const optionsArray = new Array(30);
    let indexMainVerbArray = 3;
    let indexOptionArray = 0;

    mainVerbArray[0] = baseFormVerb;
    let str = baseFormVerb.substring(
      baseFormVerb.length - 1,
      baseFormVerb.length
    );
    if (str.toLowerCase() === "s" || str.toLowerCase() === "h") {
      mainVerbArray[1] = baseFormVerb.concat("es");
    } else {
      mainVerbArray[1] = baseFormVerb.concat("s");
    }
    mainVerbArray[2] = new Inflectors(baseFormVerb).conjugate("VBG"); //var ingrule = ingrules(verb);

    function getRelevantObject(verb) {
      return (
        verbjson[verb] || `No matching object found for the verb '${verb}'.`
      );
    }

    // console.log(getRelevantObject(baseFormVerb));
    const { verb_past_tense, verb_past_participle } =
      getRelevantObject(baseFormVerb);

    mainVerbArray[indexMainVerbArray] = verb_past_participle;
    indexMainVerbArray++;

    if (verb_past_tense !== verb_past_participle) {
      mainVerbArray[indexMainVerbArray] = verb_past_tense;
    }

    for (let i = 0; i < mainVerbArray.length; i++) {
      if (mainVerbArray[i] != null) {
        optionsArray[indexOptionArray] = mainVerbArray[i].concat("_mv");
        indexOptionArray++;
      }
    }

    for (let i = 0; i < helpingVerbArray.length; i++) {
      if (helpingVerbArray[i] != null) {
        optionsArray[indexOptionArray] = helpingVerbArray[i].concat("_hv");
        indexOptionArray++;
      }
    }

    setTenseConversionPojo((prev) => ({
      ...prev,
      helping_verb_array: helpingVerbArray,
      main_verb_array: mainVerbArray,
    }));

    const filteredData = optionsArray.filter((value) => value != null);

    function shuffledArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array;
    }

    return shuffledArray(filteredData);
  };

  const handleDrop = (e, index) => {
    const droppedItem = e.dragData; // The item being dropped
    const updatedList = actSentList.map((item, idx) =>
      idx === index ? droppedItem.slice(0, -3) : item
    );
    setActSentList(updatedList);
  };

  const CheckAnswer = (str) => {
    switch (str) {
      case "submit":
        break;
      case "showAnswer":
        setIsDisableNext(false);
        break;
      default:
        break;
    }

    let correctWordCount = 0;
    for (let i = 0; i < TenseConversionPojo.ansSent.length; i++) {
      if (
        TenseConversionPojo.ansSent[i].toLowerCase() ===
        actSentList[i].toLowerCase()
      ) {
        correctWordCount++;
      }
      if (correctWordCount == TenseConversionPojo.ansSent.length) {
        setFeedbackAnswer((prev) => ({
          ...prev,
          answerFeedback: feedback.correctAnswer,
        }));
      } else {
        setFeedbackAnswer((prev) => ({
          ...prev,
          answerFeedback: feedback.wrongAnswer,
        }));
      }
    }
    getDetailedFeedbackForMainVerb();
    getDetailedFeedbackForHelpingVerb();

    setOpenFeedback(true);
  };

  const getDetailedFeedbackForMainVerb = () => {
    const correctAns = TenseConversionPojo.ansSent;
    const usersAns = actSentList;

    for (let i = 0; i < correctAns.length; i++) {
      if (isMainVerb(correctAns, i) && isBoxEmpty(usersAns, i)) {
        setFeedbackAnswer((prev) => ({
          ...prev,
          main_verb_Diagnosis: feedback.Diagnosis.missingMV_Diagnosis,
          main_verb_Remedy: feedback.Remedy.missingMV_Remedy,
        }));
      } else if (isMainVerb(correctAns, i)) {
        let shouldDisplay = true;
        for (
          let j = 0;
          j < TenseConversionPojo.helping_verb_array.length;
          j++
        ) {
          if (isHelpingVerbFromOption(usersAns, i, j)) {
            let val = feedback.Remedy.misplacedMV_Remedy;
            val = val.replace("(XYZ)", tempActivityPojo.verb);
            setFeedbackAnswer((prev) => ({
              ...prev,
              main_verb_Diagnosis: feedback.Diagnosis.misplacedMV_Diagnosis,
              main_verb_Remedy: val,
            }));
            shouldDisplay = false;
            break;
          }
        }
        if (!isMainVerbCorrect(correctAns, usersAns, i) && shouldDisplay) {
          let val1 = feedback.Diagnosis.wrongMV_Diagnosis;
          let val2 = feedback.Remedy.wrongMV_Remedy;

          val1 = val1.replace("(XYZ)", tempActivityPojo.verb);
          val2 = val2.replace("(XYZ)", tempActivityPojo.verb);

          setFeedbackAnswer((prev) => ({
            ...prev,
            main_verb_Diagnosis: val1,
            main_verb_Remedy: val2,
          }));
          break;
        }
      }
      if (
        isMainVerbCorrect(usersAns, correctAns, i) &&
        isMainVerb(correctAns, i)
      ) {
        setFeedbackAnswer((prev) => ({
          ...prev,
          main_verb_Diagnosis: feedback.Diagnosis.correctMV_Diagnosis,
          main_verb_Remedy: feedback.Remedy.correctMV_Remedy,
        }));
      }
    }
  };

  const getDetailedFeedbackForHelpingVerb = () => {
    const correctAns = TenseConversionPojo.ansSent;
    const usersAns = actSentList;
    let count = 0;
    for (let i = 0; i < correctAns.length; i++) {
      for (let j = 0; j < TenseConversionPojo.helping_verb_array.length; j++) {
        if (
          isHelpingVerbFromOption(correctAns, i, j) &&
          isBoxEmpty(usersAns, i)
        ) {
          count++;
          break;
        }
      }
    }
    if (count === TenseConversionPojo.helping_verb_array.length) {
      setFeedbackAnswer((prev) => ({
        ...prev,
        helping_verb_Diagnosis: feedback.Diagnosis.missingHVerb_Diagnosis,
        helping_verb_Remedy: feedback.Remedy.missingHVerb_Remedy,
      }));
    } else if (count >= 1) {
      setFeedbackAnswer((prev) => ({
        ...prev,
        helping_verb_Diagnosis: feedback.Diagnosis.missingHVerbs_Diagnosis,
        helping_verb_Remedy: feedback.Remedy.missingHVerbs_Remedy,
      }));
    } else {
      let count1 = 0;
      let count2 = 0;
      for (let i = 0; i < correctAns.length; i++) {
        for (
          let j = 0;
          j < TenseConversionPojo.helping_verb_array.length;
          j++
        ) {
          if (
            isHelpingVerbFromOption(correctAns, i, j) &&
            isMainVerbCorrect(correctAns, usersAns, i)
          ) {
            count1++;
          }
        }
        for (
          let k = 0;
          k < TenseConversionPojo.ansSent_helping_verb_array.length;
          k++
        ) {
          if (isHelpingVerbFromCorrectAnswer(usersAns, i, k)) {
            count2++;
            break;
          }
        }
      }
      if (count1 === TenseConversionPojo.ansSent_helping_verb_array.length) {
        setFeedbackAnswer((prev) => ({
          ...prev,
          helping_verb_Diagnosis: feedback.Diagnosis.correctHV_Diagnosis,
          helping_verb_Remedy: feedback.Remedy.correctHV_Remedy,
        }));
      } else if (
        count2 === TenseConversionPojo.ansSent_helping_verb_array.length
      ) {
        setFeedbackAnswer((prev) => ({
          ...prev,
          helping_verb_Diagnosis:
            feedback.Diagnosis.incorrectPositionHV_Diagnosis,
          helping_verb_Remedy: feedback.Remedy.incorrectPositionHV_Remedy,
        }));
      } else {
        if (count1 > 1) {
          setFeedbackAnswer((prev) => ({
            ...prev,
            helping_verb_Diagnosis:
              feedback.Diagnosis.partialCorrectHV_Diagnosis,
            helping_verb_Remedy: feedback.Remedy.partialCorrectHV_Remedy,
          }));
        } else {
          setFeedbackAnswer((prev) => ({
            ...prev,
            helping_verb_Diagnosis: feedback.Diagnosis.wrongHV_Diagnosis,
            helping_verb_Remedy: feedback.Remedy.wrongHV_Remedy,
          }));
        }
      }
    }

    for (let i = 0; i < correctAns.length; i++) {
      for (
        let k = 0;
        k < TenseConversionPojo.ansSent_helping_verb_array.length;
        k++
      ) {
        if (
          correctAns[i] == TenseConversionPojo.ansSent_helping_verb_array[k]
        ) {
          for (let j = 0; j < TenseConversionPojo.main_verb_array.length; j++) {
            if (isMainVerbPlaced(usersAns, i, j)) {
              setFeedbackAnswer((prev) => ({
                ...prev,
                helping_verb_Diagnosis:
                  feedback.Diagnosis.misplacedHV_Diagnosis,
                helping_verb_Remedy: feedback.Remedy.misplacedHV_Remedy,
              }));
              break;
            }
          }
        }
      }
    }
  };

  const isMainVerb = (correctAns, i) => {
    return correctAns[i] === TenseConversionPojo.ansSent_main_verb;
  };

  const isMainVerbCorrect = (userAns, correctAns, i) => {
    return correctAns[i] === userAns[i];
  };

  const isBoxEmpty = (userAns, i) => {
    return userAns[i] === "--------";
  };

  const isHelpingVerbFromOption = (correctAns, i, j) => {
    return (
      correctAns[i].toLowerCase() == TenseConversionPojo.helping_verb_array[j]
    );
  };

  const isMainVerbPlaced = (userAns, i, j) => {
    return userAns[i].toLowerCase() === TenseConversionPojo.main_verb_array[j];
  };

  const isHelpingVerbFromCorrectAnswer = (userAns, i, k) => {
    return userAns[i] === TenseConversionPojo.ansSent_helping_verb_array[k];
  };

  const handleCloseResult = () => {
    setOpenFeedback(false);
  };

  const handleNext = async () => {
    setShowAnswerCounter(0);
    setIsDisableNext(true);

    const sentenceTempPath = getSentenceTempPath();

    // Ensure sentenceTempPath is valid before proceeding
    if (sentenceTempPath) {
      try {
        // Wait for sentence parsing to finish
        await simpleSentenceParser(sentenceTempPath);

        // Get the noun-verb details after parsing
        const allNounVrbObj = getDetailedNounVerb(
          actvityId,
          tempPojoSent,
          tempActivityPojo
        );

        // Set object details and subject details
        setObjectDetails(allNounVrbObj.Noun_verb_nounid, tempActivityPojo);
        setSubjectDetails();

        // Get verb inflections from the first dropdown
        const listActPass = getVerbInflections(firstDropDown);

        // Run the article selector and generate a sentence
        articleSelector();
        const firstDDSentence = generateSentence(4, listActPass);

        // Process the generated sentence
        process(firstDDSentence);
        generateAnswerSentence();

        // Set the activity options
        setActList(fetchOptions());

        // Copy the data to the dummy objects (this will update state)
        setDummyTempActivityPojo({ ...tempActivityPojo });
        // setDummyTempPojoSent({ ...tempPojoSent });
      } catch (error) {
        console.error("Error during sentence parsing or processing:", error);
      }
    }
  };

  return (
    <div
      className="row d-flex"
      style={{
        width: "100vw",
        backgroundColor: "#F2FBFF",
        borderRadius: "14px",
        opacity: 1,
        boxShadow: "0px 10px 5px rgba(0, 0, 0, 0.40)",
        display: "block",
        overflow: "auto",
      }}
    >
      <div className="col-sm-9 d-flex align-items-center">
        <div
          style={{
            height: "80vh",
            width: "95%",
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            borderRadius: "13px",
            boxShadow: "0px 4px 7px #00000029",
            display: "block",
            padding: "3%",
            overflow: "auto",
            overflowX: "hidden",
            margin: "5px",
            fontSize: "calc(.6rem + .4vw)",
          }}
        >
          <div className="row mb-3">
            <div
              style={{
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                height: "auto",
                width: "100%",
                padding: 0,
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  background: "#3bafda",
                  padding: "10px",
                  borderRadius: "5px 5px 0 0",
                  color: "#fff",
                  fontWeight: "bolder",
                }}
              >
                Tense Conversion
              </div>
              <div className="p-3">
                <div className="mb-3">
                  <div className="fw-bolder">Select Tense</div>
                  <div className="d-flex align-items-center">
                    <div>
                      {" "}
                      <select
                        value={firstDropDown} // Bind the value of the first dropdown
                        onChange={(e) => {
                          handleChange(e, "FirstDropdown");
                        }}
                        style={{
                          background: "#F5B946",
                          fontSize: "calc(.6rem + .4vw)",
                          cursor: "pointer",
                        }}
                      >
                        {TenseDropdown.map((item, index) => {
                          return (
                            <option key={index} value={item.tense}>
                              {item.tense}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="ms-3 me-3 text-danger">change to</div>
                    <div>
                      {" "}
                      <select
                        value={secondDropDown} // Bind the value of the second dropdown
                        onChange={(e) => {
                          handleChange(e, "SecondDropdown");
                        }}
                        style={{ cursor: "pointer", background: "#F5B946" }}
                      >
                        {TenseDropdown.map((item, index) => {
                          // Only include the option if it's not the same as the first dropdown value
                          if (item.tense === firstDropDown) return null; // Don't render this option in second dropdown
                          return (
                            <option key={index} value={item.tense}>
                              {item.tense}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div>
                    Sentence in{" "}
                    <span style={{ color: "#105294" }}>{firstDropDown}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div id="sent"></div>
                </div>

                <div>
                  <div>
                    Sentence in{" "}
                    <span style={{ color: "#105294" }}>{secondDropDown}</span>
                  </div>
                </div>

                <div>
                  <span>
                    {actSentList.map((item, index) =>
                      droppableIndex.includes(index) ? (
                        <DropTarget
                          key={index}
                          targetKey="item"
                          onHit={(e) => handleDrop(e, index)}
                        >
                          <span
                            className="btn btn-outline m-1"
                            style={{ border: "2px solid #04B4AE" }}
                          >
                            {item}
                          </span>
                        </DropTarget>
                      ) : (
                        <span
                          key={index}
                          className="btn btn-outline m-1"
                          style={{ border: "2px solid #04B4AE" }}
                        >
                          {item}
                        </span>
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div
              style={{
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                height: "auto",
                width: "100%",
                padding: 0,
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  background: "#3bafda",
                  padding: "10px",
                  borderRadius: "5px 5px 0 0",
                  color: "#fff",
                  fontWeight: "bolder",
                }}
              >
                Word Repository
              </div>
              <div className="p-3">
                {actList.map((item, index) => (
                  <DragDropContainer
                    key={index}
                    targetKey="item"
                    dragData={item}
                  >
                    <span
                      className="btn btn-outline m-1"
                      style={{ border: "2px solid #4a89dc" }}
                    >
                      {item.slice(0, -3)}
                    </span>
                  </DragDropContainer>
                ))}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="d-flex justify-content-between">
              <Button
                variant="contained"
                onClick={() => CheckAnswer("submit")}
                sx={{
                  background: "#0F477E",
                  color: "#ffffff",
                  fontSize: "calc(.6rem + .4vw)",
                }}
              >
                {t("submit")}
              </Button>
              <Button
                disabled={IsDisableNext}
                variant="contained"
                onClick={handleNext}
                sx={{
                  background: "#0F477E",
                  color: "#ffffff",
                  fontSize: "calc(.6rem + .4vw)",
                }}
              >
                {t("next")}
              </Button>
              <Button
                disabled={showAnswerCounter !== 4}
                variant="contained"
                onClick={() => CheckAnswer("showAnswer")}
                sx={{
                  background: "#0F477E",
                  color: "#ffffff",
                  fontSize: "calc(.6rem + .4vw)",
                }}
              >
                {t("show_answer")}
              </Button>
            </div>
          </div>

          <Dialog
            open={openFeedback}
            onClose={handleCloseResult}
            maxWidth={"lg"}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle
              id="responsive-dialog-title"
              style={{
                background: "#90D5FF",
                fontSize: "calc(.6rem + .4vw)",
                textAlign: "center",
              }}
            >
              <b> RESULT </b>
            </DialogTitle>
            <DialogContent>
              {feedbackAnswer["answerFeedback"] === "Correct answer." ? (
                <div style={{ fontSize: "calc(.6rem + .4vw)" }}>
                  <span style={{ color: "#098B0D" }}>
                    Congratulations!&nbsp;
                  </span>
                  Your answer is correct.
                </div>
              ) : (
                <>
                  <table
                    style={{
                      width: "100%",
                      tableLayout: "auto",
                      border: "1px solid black",
                      fontSize: "calc(.6rem + .4vw)",
                    }}
                  >
                    <thead
                      style={{ padding: "10px", border: "1px solid black" }}
                    >
                      <tr
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          color: "white",
                          background: "#428bca",
                        }}
                      >
                        <th
                          colSpan="4"
                          style={{ padding: "10px", fontWeight: "bolder" }}
                        >
                          Feedback
                        </th>
                      </tr>
                      <tr style={{ background: "#d9edf7" }}>
                        <th
                          style={{ padding: "10px", border: "1px solid black" }}
                        >
                          Item
                        </th>
                        <th
                          style={{ padding: "10px", border: "1px solid black" }}
                        >
                          Result
                        </th>
                        <th
                          style={{ padding: "10px", border: "1px solid black" }}
                        >
                          Desctiption
                        </th>
                        <th
                          style={{ padding: "10px", border: "1px solid black" }}
                        >
                          Remedy
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbackAnswer.main_verb_Diagnosis !==
                        "'main verb' is correct." && (
                        <tr style={{ background: "#d9edf7" }}>
                          <td className="td_col">Main verb</td>
                          <td className="td_col">
                            <CloseOutlinedIcon style={{ color: "red" }} />
                          </td>
                          <td className="td_col">
                            {feedbackAnswer.main_verb_Diagnosis}
                          </td>
                          <td className="td_col">
                            {feedbackAnswer.main_verb_Remedy}
                          </td>
                        </tr>
                      )}

                      {feedbackAnswer.helping_verb_Diagnosis !==
                        "'helping verb' is correct." && (
                        <tr style={{ background: "#d9edf7" }}>
                          <td className="td_col">Helping verb</td>
                          <td className="td_col">
                            <CloseOutlinedIcon style={{ color: "red" }} />
                          </td>
                          <td className="td_col">
                            {feedbackAnswer.helping_verb_Diagnosis}
                          </td>
                          <td className="td_col">
                            {feedbackAnswer.helping_verb_Remedy}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {showAnswerCounter >= 5 && (
                    <div
                      style={{
                        background: "#dff0d8",
                        border: "1px solid black",
                        padding: "10px",
                      }}
                    >
                      <div>
                        <b>Correct Answer: </b>
                        <span></span>
                        {dummyTempActivityPojo.AnswerSentence}.
                      </div>
                      <div>{t("instr5")}</div>
                    </div>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions className="d-flex justify-content-center">
              <Button
                variant="contained"
                onClick={handleCloseResult}
                sx={{
                  fontSize: "calc(.6rem + .2vw)",
                  background: "#0F477E",
                  color: "#ffffff",
                }}
              >
                {t("ok")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      <div className="col-sm-3 d-flex align-items-center justify-content-center">
        <div
          style={{
            height: "80vh",
            width: "95%",
            overflow: "auto",
            overflowX: "hidden",
            borderRadius: "13px",
            boxShadow: "0px 4px 7px #00000029",
            display: "block",
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            margin: "5px",
          }}
        >
          <div
            className="sticky-top text-center subheading"
            style={{
              background: "#002F65",
              borderRadius: "13px 13px 0px 0px",
              opacity: "1",
              color: "#FFFFFF",
              fontSize: "calc(1rem + 0.2vw)",
              fontWeight: "bolder",
            }}
          >
            {t("instr")}
          </div>
          <div
            style={{
              maxHeight: "50vh",
              padding: "2%",
              lineHeight: "30px",
              fontSize: "calc(.6rem + .4vw)",
            }}
          >
            <div>
              <ul>
                <li>{t("instr1")}</li>
                <li>{t("instr2")}</li>
                {!IsDisableNext && <li>{t("instr3")}</li>}
                {showAnswerCounter === 4 && <li>{t("instr4")}</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenseMidcontent;
