import { useState,useMemo, useCallback } from "react";

export function useSurvey({ questions, onQuestionComplete }) {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [completed, setCompleted] = useState({});

  const sortedQuestions = useMemo(() => {
    if (!questions) {
      return [];
    }

    return questions
      .map(q => ({
        ...q,
        type: q.options ? 'choice' : 'text'
      }))
      .sort(q => q.weight);
  }, [questions]);

  const currentQuestion = useMemo(() => {
    return sortedQuestions[activeQuestion] || null;
  }, [activeQuestion, sortedQuestions]);

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
    setActiveQuestion(activeQuestion + 1);
    if (currentQuestion) {
      onQuestionComplete({ questionID: currentQuestion.id, value: completed[activeQuestion] });
    }
  }, [activeQuestion, completed, currentQuestion, onQuestionComplete]);

  const handleBack = useCallback(() => {
    setActiveQuestion(activeQuestion - 1);
  }, [activeQuestion]);

  const isCompleted = sortedQuestions.length && activeQuestion >= sortedQuestions.length;

  return useMemo(() => ({
    handleStep,
    handleAnswer,
    handleNext,
    handleBack,
    currentQuestion,
    sortedQuestions,
    activeQuestion,
    completed,
    isCompleted,
  }), [activeQuestion, completed, currentQuestion, handleAnswer, handleBack, handleNext, handleStep, sortedQuestions, isCompleted]);
}