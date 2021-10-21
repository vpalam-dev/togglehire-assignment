import React, { useState,useMemo, useCallback } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import { gql, useQuery } from "urql";
import { TextQuestion } from "./TextQuestion";
import { ChoiceQuestion } from "./ChoiceQuestion";

export function Questions() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [completed, setCompleted] = React.useState({});
  const [{ data, fetching, error }] = useQuery({ query });

  const handleStep = useCallback((step) => () => {
    setActiveQuestion(step);
  }, []);

  const handleAnswer = useCallback((value) => {
    setCompleted({
      ...completed,
      [activeQuestion]: value,
    });
  }, [activeQuestion, completed]);

  const handleNext = useCallback(() => {
    setActiveQuestion(activeQuestion + 1)
  }, [activeQuestion]);

  const handleBack = useCallback(() => {
    setActiveQuestion(activeQuestion - 1);
  }, [activeQuestion]);

  const sortedQuestions = useMemo(() => {
    if (!data || !data.questions) {
      return [];
    }

    return data.questions
      .map(q => ({
        ...q,
        type: q.options ? 'choice' : 'text'
      }))
      .sort(q => q.weight);
  }, [data]);

  const currentQuestion = useMemo(() => {
    return sortedQuestions[activeQuestion] || null;
  }, [activeQuestion, sortedQuestions]);

  if (fetching) {
    return <CircularProgress />
  };

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
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
      <Stepper nonLinear alternativeLabel activeStep={activeQuestion}>
        {data.questions.map((q, index) => (
          <Step key={q.id} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              <StepLabel>{q.body}</StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
      {currentQuestion ? (
        <Box sx={{ width: '100%', p: 1, mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {currentQuestion.type === 'text' ? <TextQuestion value={completed[activeQuestion] || ''} label={currentQuestion.body} onChange={handleAnswer} /> : <ChoiceQuestion label={currentQuestion.body} value={completed[activeQuestion]} onChange={handleAnswer} options={currentQuestion.options} />}
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
