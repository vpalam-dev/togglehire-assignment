import React, { useCallback } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import Typography from "@mui/material/Typography";
import { gql, useQuery, useMutation } from "urql";
import { useSurvey } from "../hooks/use-survey";
import { TextQuestion } from "./TextQuestion";
import { ChoiceQuestion } from "./ChoiceQuestion";

export function Questions() {
  const [{ data, fetching, error }] = useQuery({ query });
  const [{ fetching: submittingAnswer, error: submitError }, addAnswer] = useMutation(addAnswerMutation);
  const {
    handleStep,
    handleAnswer,
    handleNext,
    handleBack,
    currentQuestion,
    sortedQuestions,
    activeQuestion,
    completed,
    isCompleted,
  } = useSurvey({
    questions: data ? data.questions : [],
    onQuestionComplete: addAnswer,
  });

  const renderSurvey = useCallback(() => {
    return (
      <>
        {submittingAnswer ? <CircularProgress /> : currentQuestion ? (
          <Box sx={{ width: '100%', p: 1, mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {currentQuestion.type === 'text' ? <TextQuestion value={completed[activeQuestion] || ''} label={currentQuestion.body} onChange={handleAnswer} /> : <ChoiceQuestion label={currentQuestion.body} value={completed[activeQuestion] | null} onChange={handleAnswer} options={currentQuestion.options} />}
          </Box>
        ) : null}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, maxWidth: 320, justifyContent: 'center', m: '0 auto' }}>
          <Button
            color="inherit"
            disabled={activeQuestion === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext} sx={{ mr: 1 }}>
            {activeQuestion === sortedQuestions.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </Box>
      </>
    )
  }, [activeQuestion, completed, currentQuestion, handleAnswer, handleBack, handleNext, sortedQuestions.length, submittingAnswer]);

  const renderResult = useCallback(() => {
    const completedQuestions = Object.keys(completed).length;
    const totalQuestions = sortedQuestions.length;

    return (
      <>
        <Typography variant="h2">Result:</Typography>
        <Typography>You answered {completedQuestions} out of {totalQuestions} questions.</Typography>
      </>
    )
  }, [completed, sortedQuestions.length]);

  if (fetching) {
    return <CircularProgress />;
  };

  if (error || submitError) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {(error || submitError).toString()}
      </Alert>
    );
  }

  if(sortedQuestions.length === 0) {
    return (
      <Alert severity="warning">
        <AlertTitle>Warning</AlertTitle>
        You don't have any questions to answer.
      </Alert>
    )
  }

  return (
    <Box sx={{ width: '100%', p: 1, maxWidth: 640 }}>
      {isCompleted ? renderResult() : (
        <>
          <Stepper nonLinear alternativeLabel activeStep={activeQuestion}>
            {data.questions.map((q, index) => (
              <Step key={q.id} completed={!!completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  <StepLabel>{q.body}</StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>
          {renderSurvey()}
        </>
      )}
    </Box>
  );
}

const query = gql`
  query {
    questions {
      __typename
      ... on ChoiceQuestion {
        id
        body
        weight
        options {
          id
          body
          weight
        }
      }
      ... on TextQuestion {
        id
        body
        weight
      }
    }
  }
`;

const addAnswerMutation = gql`
  mutation ($value: String!, $questionID: ID!) {
    addAnswer(input: { value: $value }, questionID: $questionID) {
      id,
      value,
      questionID
    }
  } 
`;
