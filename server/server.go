package main

import (
	"homework-backend/graph"
	"homework-backend/graph/generated"
	"homework-backend/graph/model"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{
		AllQuestions: []model.Question{
			model.ChoiceQuestion{
				ID:     "100",
				Body:   "Where does the sun set?",
				Weight: 0.5,
				Options: []*model.Option{
					{ID: "200", Body: "East", Weight: 0},
					{ID: "201", Body: "West", Weight: 1},
				},
			},
			model.TextQuestion{
				ID:     "101",
				Body:   "What is your favourite food?",
				Weight: 1,
			},
		},
	}}))

	mux := http.NewServeMux()
	mux.Handle("/", playground.Handler("GraphQL playground", "/query"))
	mux.Handle("/query", srv)

	h := cors.Default().Handler(mux)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, h))
}
