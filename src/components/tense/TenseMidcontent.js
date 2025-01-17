import React, { useEffect, useState } from "react";
import TenseDropdown from "../Data/tenses.json";
import { Inflectors } from "en-inflectors";

import tensejson from "../../supportingfiles/DBJSON/tense.json";
import sentenceTemplate from "../../supportingfiles/DBJSON/sentence_template.json";
import "../../resources/Midcontent.css";
import verbjson from "../../supportingfiles/DBJSON/verb.json";
import nounverbjson from "../../supportingfiles/DBJSON/noun_verb.json";
import nounjson from "../../supportingfiles/DBJSON/noun.json";
import passActFeedbackProps from "../../supportingfiles/languageProperties/passiveActive/en-IN-feedbackproperties.json";
import actpassFeedbackProps from "../../supportingfiles/languageProperties/activePassive/en-IN-feedbackproperties.json";

const TenseMidcontent = () => {
  const [firstDropDown, setFirstDropDown] = useState("Simple Present Tense");
  const [secondDropDown, setSecondDropDown] = useState("Simple Past Tense");
  const [actvityId, setActivityId] = useState(3);
  const [actList, setActList] = useState([]);

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
    verb: "", //baseFormVerb=verb

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

  var tempTenseConversionPojo = {
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
    sentence_tense: "Simple Present Tense", //tense=null
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
  });

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
    // activityPojo: {},
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
        var listActPass = getVerbInflections(firstDropDown);
        // console.log(listActPass);

        articleSelector();
        // generateSentence(actvityId, listActPass);
        // console.log(listActPass);

        generateSentence(4, listActPass);
        jumbled_sentence(firstDropDown);
        // var passDataObj = populateJSON(actvityId);
        // process(passDataObj, actvityId);
        updateTenseConversionPojo(firstDropDown);
        generateAnswerSentence();
        process();
      });
    }
  }, [firstDropDown, secondDropDown]);

  const getSentenceTempPath = () => {
    var sentenseTempPath = "";
    var sentenceTempId = 1;

    for (var noofsent = 0; noofsent < sentenceTemplate.length; noofsent++) {
      if (sentenceTemplate[noofsent].activity_id == sentenceTempId) {
        sentenseTempPath = sentenceTemplate[noofsent].activity_name;
        break;
      }
    }
    return sentenseTempPath;
  };

  async function simpleSentenceParser(xmlFileSrc) {
    // const path = "../../supportingfiles" + xmlFileSrc;
    var staticPath = require(`../../supportingfiles${xmlFileSrc}`);
    // const response = fetch(staticPath);

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
      case "default":
        console.log("Tense cannot be identified.");
        break;
    }
    return listTense;
  };

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

  const perfectpresentcontinuous = () => {
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var object_number = tempActivityPojo.object_number;
    var subject_person = tempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb;
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
  };

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

  const perfectpastcontinuous = () => {
    var category = tempActivityPojo.verb_category;
    var subject_number = tempActivityPojo.subject_number;
    var object_number = tempActivityPojo.object_number;
    var subject_person = tempActivityPojo.subject_person;
    var verb = tempActivityPojo.verb;
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

  const futurecontinuous = () => {
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

  const perfectfuturecontinuous = () => {
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
    actpassverb.push(passiveverb);
    return actpassverb;
  };

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

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

  const generateSentence = (exerciseID, verbList) => {
    var active_voice = null;
    // var passive_voice = null;
    var subject_name = tempActivityPojo.subject_name;
    var object_name = tempActivityPojo.object_name;

    if (exerciseID == 4) {
      if (
        ((tempActivityPojo.object_article.toLocaleLowerCase === "" ||
          tempActivityPojo.object_article === null) &&
          tempActivityPojo.subject_article.toLowerCase() === "") ||
        tempActivityPojo.subject_article === null
      ) {
        active_voice =
          subject_name.substring(0, 1).toUpperCase() +
          subject_name.substring(1) +
          " " +
          verbList[0] +
          " " +
          object_name;
      } else if (
        tempActivityPojo.object_article.toLowerCase() === "" ||
        tempActivityPojo.object_article === null
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
        tempActivityPojo.subject_article.toLowerCase() === "" ||
        tempActivityPojo.subject_article === null
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
          " " +
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
    }
  };

  const jumbled_sentence = (sentenceTense) => {
    // var active_sentence = tempActivityPojo.active_voice.split(" ");
    // tempActivityPojo.active_sentence = active_sentence;
    // var passive_sentence = tempActivityPojo.passive_voice.split(" ");
    // tempActivityPojo.passive_sentence = passive_sentence;
    // tempActivityPojo.jumbled_active_sentence = shuffleArray(active_sentence);
    // tempActivityPojo.jumbled_passive_sentence = shuffleArray(passive_sentence);

    var active_sentence = [];
    var passive_sentence = [];

    tempActivityPojo.sentence_tense = sentenceTense;
    active_sentence = tempActivityPojo.active_voice.split(" ");
    // console.log(active_sentence);
    tempActivityPojo.active_sentence = active_sentence;
    tempActivityPojo.jumbled_active_sentence = shuffleArray(active_sentence);
    if (tempActivityPojo.passive_voice !== null) {
      passive_sentence = tempActivityPojo.passive_voice.split(" ");
      tempActivityPojo.passive_sentence = passive_sentence;
      tempActivityPojo.jumbled_passive_sentence =
        shuffleArray(passive_sentence);
    }

    // console.log(active_sentence);
    // console.log(passive_sentence);
  };

  const updateTenseConversionPojo = (sentenceTense) => {
    tempTenseConversionPojo.tenseConvQuest = sentenceTense;
    tempTenseConversionPojo.questSent_helping_verb =
      tempActivityPojo.active_helping_verb;
    tempTenseConversionPojo.questSent_main_verb =
      tempActivityPojo.active_main_verb;
    tempTenseConversionPojo.QuestionSentence = tempActivityPojo.active_voice;
    tempTenseConversionPojo.questSent = tempActivityPojo.active_sentence;
  };

  const generateAnswerSentence = () => {
    // console.log(secondDropDown);
    // console.log(tempActivityPojo.active_voice);
    var arr = [];
    arr = getVerbInflections(secondDropDown);
    // console.log(arr);
    generateSentence(4, arr);
    jumbled_sentence(secondDropDown);
    TenseConversionPojo.tenseConvAns = secondDropDown;
    TenseConversionPojo.ansSent_helping_verb =
      tempActivityPojo.active_helping_verb;
    TenseConversionPojo.ansSent_main_verb = tempActivityPojo.active_main_verb;
    TenseConversionPojo.ansSent = tempActivityPojo.active_sentence;
    TenseConversionPojo.AnswerSentence = tempActivityPojo.active_voice;

    var tempArray = new Array(TenseConversionPojo.ansSent.length);
    console.log(TenseConversionPojo.ansSent);

    let posMainVerb = 999;
    for (let i = 0; i < tempArray.length; i++) {
      if (
        tempActivityPojo.subject_name.toLowerCase() ===
          TenseConversionPojo.ansSent[i].toLowerCase() ||
        tempActivityPojo.object_name.toLowerCase() ===
          TenseConversionPojo.ansSent[i].toLowerCase() ||
        tempActivityPojo.subject_article.toLowerCase() ===
          TenseConversionPojo.ansSent[i].toLowerCase() ||
        tempActivityPojo.object_article.toLowerCase() ===
          TenseConversionPojo.ansSent[i].toLowerCase()
      ) {
        console.log(TenseConversionPojo.ansSent[i]);
        if (!TenseConversionPojo.ansSent[i].toLowerCase() == "") {
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
    console.log(TenseConversionPojo.tenseConvAns);
    console.log(tempActivityPojo.subject_name);
    console.log(tempActivityPojo.object_name);
    console.log(tempArray);
    console.log(posMainVerb);
  };

  const process = () => {
    const sentenceElement = document.getElementById("sent");
    if (sentenceElement) {
      sentenceElement.innerHTML += `<strong>${tempActivityPojo.active_voice}</strong>`; // Appending HTML
    }
  };

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

  return (
    <div className="container-fluid p-3">
      <div className="row">Tense Conversion</div>
      <div className="row">Select Tense</div>
      <div className="row d-inline">
        <span>
          <select
            value={firstDropDown} // Bind the value of the first dropdown
            onChange={(e) => {
              handleChange(e, "FirstDropdown");
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
        </span>{" "}
        <span>change to</span>{" "}
        <span>
          <select
            value={secondDropDown} // Bind the value of the second dropdown
            onChange={(e) => {
              handleChange(e, "SecondDropdown");
            }}
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
        </span>
      </div>
      <div className="row">Sentence in {firstDropDown}</div>
      <div className="row">
        <div id="sent"></div>
      </div>
      <div className="row">Sentence in {secondDropDown}</div>
      <div className="row">sentence with blank spaces.</div>
    </div>
  );
};

export default TenseMidcontent;
