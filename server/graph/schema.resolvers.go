package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"homework-backend/graph/generated"
	"homework-backend/graph/model"

	"github.com/google/uuid"
)

func (r *mutationResolver) AddAnswer(ctx context.Context, input model.AddQuestionAnswer, questionID string) (*model.QuestionAnswer, error) {
	for _, q := range r.AllQuestions {
		choiceQuestion, isChoiceQuestion := q.(model.ChoiceQuestion)
		if isChoiceQuestion && choiceQuestion.ID == questionID {
			var option *model.Option

			for _, o := range choiceQuestion.Options {
				if o.ID == input.Value {
					option = o
				}
			}

			if option == nil {
				return nil, errors.New("Invalid option")
			}

			fmt.Printf("Answer for question %s is option %s\n", choiceQuestion.ID, input.Value)
			return &model.QuestionAnswer{
				ID:         uuid.New().String(),
				Value:      input.Value,
				QuestionID: questionID,
			}, nil
		}

		textQuestion, isTextQuestion := q.(model.TextQuestion)
		if isTextQuestion && textQuestion.ID == questionID {
			fmt.Printf("Answer for question %s is %s\n", textQuestion.ID, input.Value)
			return &model.QuestionAnswer{
				ID:         uuid.New().String(),
				Value:      input.Value,
				QuestionID: questionID,
			}, nil
		}
	}

	return nil, errors.New("Question not found")
}

func (r *queryResolver) Questions(ctx context.Context) ([]model.Question, error) {
	return r.AllQuestions, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
