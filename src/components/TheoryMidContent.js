import React from "react";
import "../resources/TheoryMidcontent.css";

const TheoryMidContent = () => {
  return (
    <div
      className="py-3"
      style={{
        overflow: "auto",
        width: "100%",
        paddingRight: "10px",
        fontSize: "calc(.6rem + .4vw)",
      }}
    >
      <div className="fw-bolder">Objective</div>
      <p className="ms-3">
        To understand how to change verbs from one tense to another while
        maintaining the meaning of the sentence.
      </p>
      <div className="fw-bolder">
        Tenses are basically categorized as follows:
      </div>
      <ol type="A">
        <li className="fw-bolder">Present Tense</li>
        <ol>
          <li className="fw-bolder">Simple Present tense</li>
          <ul type="disc">
            <li>A general ongoing, regular or scheduled activity.</li>
            <li>
              In Simple Present, the action is simply mentioned and there is
              nothing being said about its completeness.
            </li>
            <li>
              It is used to talk about an action which happens on a regular
              basis.
            </li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I take English classes every Monday.</li>
              <li>You play football.</li>
              <li>John drives the bike very fast.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ol type="i">
              <li>[VERB] + s/es in third person</li>
              <li>Verb "+s/es" form is used</li>
            </ol>
            <li className="fw-bolder">Structure</li>
            <ol type="i">
              <li>If the subject is 3rd person singular.</li>
              <li>The verb is used in its original form.</li>
              <li>If the subject is 1st and/or 2nd person singular.</li>
              <li>If the subject is 1st and/or 2nd person plural.</li>
              <li>If the subject is 3rd person plural.</li>
            </ol>
          </ul>
          <li className="fw-bolder">Present Continuous Tense</li>
          <ul type="disc">
            <li>An action occurring now.</li>
            <li>
              In the Present Continuous tense, the action is on-going/ still
              going on and hence continuous.
            </li>
            <li>
              The present continuous tense is used to talk about actions that
              are happening at this current moment.
            </li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I am studying.</li>
              <li>She is eating the apple.</li>
              <li>They are playing cricket.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ul type="circle">
              <li>[am/is/are + present participle]</li>
            </ul>
            <li className="fw-bolder">Structure</li>
            <ol>
              <li>Use the first form of the verb “+ing”.</li>
              <li>Singular 3rd person subject — use ‘is’.</li>
              <li>
                Plural 1st, 2nd and 3rd person and singular 2nd person subject —
                use ‘are’.
              </li>
              <li>1st person singular — use ‘am’.</li>
              <li>Subject + be (is, am, are) + Verb+ -ing + Object.</li>
            </ol>
          </ul>
          <li className="fw-bolder">Present Perfect Tense</li>
          <ul type="disc">
            <li>
              An action started in the past that has been completed in, or has
              relevance to, the present.
            </li>
            <li>
              In the Present Perfect tense, the action is complete or has ended
              and hence termed Perfect.
            </li>
            <li>
              The exact time when the action happened is not important and
              hence, it is not mentioned in this tense.
            </li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I have already studied the tenses today.</li>
              <li>You have slept well today.</li>
              <li>He has played cricket.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ol type="i">
              <li>[has/have + past participle]</li>
              <li>Subject + has/have + past tense of verb + Object.</li>
            </ol>
          </ul>
          <li className="fw-bolder">Present Perfect Continuous Tense</li>
          <ul type="disc">
            <li>An action still continuing from the past to the present.</li>
            <li>
              In the Present Perfect Continuous tense, the action has been
              taking place for some time and is still ongoing.
            </li>
            <li>
              The duration for which the action has been going on is usually
              mentioned in the present perfect continuous tense.
            </li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I have been learning English for three years.</li>
              <li>You have been working skillfully.</li>
              <li>He has been playing cricket.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ul type="circle">
              <li>[has/have + been + present participle]</li>
            </ul>
            <li className="fw-bolder">Structure</li>
            <ol type="i">
              <li>Use the first form of the verb + “–ing”.</li>
              <li>
                Singular subject (has been), Plural subject or I (have been).
              </li>
              <li>‘Since’— if the point of time is mentioned.</li>
              <li>‘For’ — if the duration of time is specified.</li>
            </ol>
          </ul>
        </ol>
        <li className="fw-bolder">Past Tense</li>
        <ol>
          <li className="fw-bolder">Simple Past Tense</li>
          <ul type="disc">
            <li>An action that happened in the past.</li>
            <li>
              In the Simple Past tense, the action is simply mentioned and
              understood to have taken place in the past.
            </li>
            <li>
              The action started and ended sometime in the past but the time may
              or may not be mentioned.
            </li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I went to school.</li>
              <li>John ate the banana.</li>
              <li>You bought the chair.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ul type="circle">
              <li>[VERB+ed] or past tense of irregular verbs</li>
            </ul>
            <li>Structure</li>
            <ul type="circle">
              <li>Subject + past tense of verb + Object.</li>
            </ul>
          </ul>
          <li className="fw-bolder">Past Continuous Tense</li>
          <ul type="disc">
            <li>An action that happened at a specific point in the past.</li>
            <li>
              In the Past Continuous tense, the action was ongoing till a
              certain time in the past.
            </li>
            <li>
              This tense is used to talk about an action at a particular time in
              the past.
            </li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I was washing the car when it rained.</li>
              <li>You were drinking mango juice.</li>
              <li>Sheena was cleaning the shelf.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ul type="circle">
              <li>[was/were + present participle]</li>
            </ul>
            <li className="fw-bolder">Structure</li>
            <ul type="circle">
              <li>Subject + was/were + Verb in its -ing form + Object.</li>
            </ul>
          </ul>
          <li className="fw-bolder">Past Perfect Tense</li>
          <ul type="disc">
            <li>An action that happened before another event in the past.</li>
            <li>
              The Past Perfect tense is used to express something that happened
              before another action in the past.
            </li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I had washed the car before it rained.</li>
              <li>You had drunk sweet coffee.</li>
              <li>Drake had played hockey.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ul type="circle">
              <li>[had + past participle]</li>
            </ul>
            <li className="fw-bolder">Structure</li>
            <ul type="circle">
              <li>Subject + had + past participle form of verb + Object.</li>
            </ul>
          </ul>
          <li className="fw-bolder">Past Perfect Continuous Tense</li>
          <ul type="disc">
            <li>
              An action that happened before a certain time in the past, to show
              duration.
            </li>
            <li>
              The Past Perfect Continuous tense is used to express something
              that started in the past and continued until another time in the
              past.
            </li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I had been going to school for a year when it was closed.</li>
              <li>You had been baking the cookies.</li>
              <li>John had been driving the car.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ul type="circle">
              <li>[had been + present participle]</li>
            </ul>
            <li className="fw-bolder">Structure</li>
            <ul type="circle">
              <li>Subject + had + been + Verb (ing) + object.</li>
            </ul>
          </ul>
        </ol>
        <li className="fw-bolder">Future Tense</li>
        <ol>
          <li className="fw-bolder">Simple Future Tense</li>
          <ul type="disc">
            <li>An action to be completed in the future.</li>
            <li>
              The Simple Future tense is used when we plan or make a decision to
              do something.
            </li>
            <li>Nothing is said about the time in the future.</li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I will go to the cinema.</li>
              <li>You will drive the scooter.</li>
              <li>Anna will buy the house.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ol type="i">
              <li>[will + verb]</li>
              <li>[am/is/are + going to + verb]</li>
            </ol>
            <li className="fw-bolder">Structure</li>
            <ol type="i">
              <li>Subject + will + Verb + object.</li>
              <li>Subject + going to + Verb + object.</li>
            </ol>
          </ul>
          <li className="fw-bolder">Future Continuous Tense</li>
          <ul type="disc">
            <li>An action occurring at a specific point in the future.</li>
            <li>
              The future continuous tense is used to express action at a
              particular moment in the future.
            </li>
            <li>However, the action will not have finished at the moment.</li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I will be fishing this time next week.</li>
              <li>You will be buying the cookies.</li>
              <li>Adam will be drinking the coffee.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ol type="i">
              <li>[will be + present participle]</li>
              <li>[am/is/are + going to be + present participle]</li>
            </ol>
            <li className="fw-bolder">Structure</li>
            <ul type="circle">
              <li>'will' + 'be' + present participle of the verb (ing).</li>
            </ul>
          </ul>
          <li className="fw-bolder">Future Perfect Tense</li>
          <ul type="disc">
            <li>
              An action that finishes in the future, before or at the time of
              another future action.
            </li>
            <li>
              The Future Perfect tense expresses an action that will occur in
              the future before another action or time in the future.
            </li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>I will have learned all the tenses by tomorrow.</li>
              <li>You will have slept before John arrives.</li>
              <li>John will have played hockey.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ol type="i">
              <li>[will have + past participle]</li>
              <li>am/is/are + going to have + past participle]</li>
            </ol>
            <li className="fw-bolder">Structure</li>
            <ul type="circle">
              <li>'will' + 'have' + 'past participle of the verb'.</li>
            </ul>
          </ul>
          <li className="fw-bolder">Future Perfect Continuous Tense</li>
          <ul type="disc">
            <li>
              An action at a certain point in the future, expressing duration.
            </li>
            <li>
              Future Perfect Continuous is used to talk about an on-going action
              before some point in the future.
            </li>
            <li className="fw-bolder">For example</li>
            <ol type="i">
              <li>
                I will have been studying English for three years this summer.
              </li>
              <li>
                You will have been sleeping for two hours when John arrives.
              </li>
              <li>John will have been playing the flute.</li>
            </ol>
            <li className="fw-bolder">Form</li>
            <ol type="i">
              <li>[will have been + present participle]</li>
              <li>[am/is/are + going to have been + present participle]</li>
            </ol>
          </ul>
        </ol>
      </ol>
    </div>
  );
};

export default TheoryMidContent;
