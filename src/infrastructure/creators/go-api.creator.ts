import type { ProjectConfig, ProjectCreator } from "../../domain/interfaces";

export class GoAPICreator implements ProjectCreator {
  readonly type = "microservice";
  readonly stack = "go";
  readonly installCommand = "go mod tidy";
  readonly nextSteps = "make run";

  getTemplates(config: ProjectConfig): Record<string, string> {
    const moduleName = `github.com/carlos/${config.name}`;

    return {
      "go.mod": `module ${moduleName}

go 1.23.0

require (
\tgithub.com/go-chi/chi/v5 v5.0.12
\tgithub.com/google/uuid v1.6.0
)
`,

      ".gitignore": `bin/
*.exe
*.dll
*.so
*.dylib
*.test
*.out
go.work
go.work.sum
.idea/
.vscode/
*.swp
.DS_Store
.env
`,

      "Makefile": `.PHONY: build run clean test tidy

BINARY_NAME=${config.name}
BUILD_DIR=bin
PORT=8080

build:
\t@echo "Building..."
\t@mkdir -p $(BUILD_DIR)
\tgo build -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/api

run: build
\t./$(BUILD_DIR)/$(BINARY_NAME) -port=:$(PORT)

clean:
\trm -rf $(BUILD_DIR)
\tgo clean

test:
\tgo test -v ./...

tidy:
\tgo mod tidy

.DEFAULT_GOAL := build
`,

      "README.md": `# ${config.name}

${config.description}

## Architecture

\`\`\`
internal/
├── domain/           # Business logic & entities
│   ├── entity/
│   └── service/
├── application/      # Use cases
│   ├── port/
│   └── usecase/
└── infrastructure/   # External interfaces
    └── http/
\`\`\`

## Usage

\`\`\`bash
make build    # Build binary
make run      # Run server on :8080
make test     # Run tests
\`\`\`

## Endpoints

- \`GET /health\` - Health check
- \`POST /api/v1/process\` - Process data
`,

      "cmd/api/main.go": `package main

import (
\t"flag"
\t"fmt"
\t"log"
\t"net/http"

\t"${moduleName}/internal/application/usecase"
\t"${moduleName}/internal/domain/service"
\thandler "${moduleName}/internal/infrastructure/http"
)

func main() {
\tport := flag.String("port", ":8080", "Server port")
\tflag.Parse()

\tsvc := service.NewService()
\tuc := usecase.NewUseCase(svc)
\th := handler.NewHandler(uc)
\trouter := handler.NewRouter(h)

\tfmt.Printf("Server starting on %s\\n", *port)
\tlog.Fatal(http.ListenAndServe(*port, router))
}
`,

      "internal/domain/entity/entity.go": `package entity

type Input struct {
\tData string \`json:"data"\`
}

type Result struct {
\tID     string \`json:"id"\`
\tOutput string \`json:"output"\`
}
`,

      "internal/domain/service/service.go": `package service

import (
\t"${moduleName}/internal/domain/entity"
\t"github.com/google/uuid"
)

type Service struct{}

func NewService() *Service {
\treturn &Service{}
}

func (s *Service) Process(input entity.Input) entity.Result {
\treturn entity.Result{
\t\tID:     uuid.New().String(),
\t\tOutput: "Processed: " + input.Data,
\t}
}
`,

      "internal/application/port/port.go": `package port

import "${moduleName}/internal/domain/entity"

type ServicePort interface {
\tProcess(input entity.Input) entity.Result
}
`,

      "internal/application/usecase/usecase.go": `package usecase

import (
\t"${moduleName}/internal/application/port"
\t"${moduleName}/internal/domain/entity"
)

type UseCase struct {
\tservice port.ServicePort
}

func NewUseCase(svc port.ServicePort) *UseCase {
\treturn &UseCase{service: svc}
}

func (uc *UseCase) Execute(input entity.Input) entity.Result {
\treturn uc.service.Process(input)
}
`,

      "internal/infrastructure/http/handler.go": `package http

import (
\t"encoding/json"
\t"net/http"

\t"${moduleName}/internal/application/usecase"
\t"${moduleName}/internal/domain/entity"
)

type Handler struct {
\tuseCase *usecase.UseCase
}

func NewHandler(uc *usecase.UseCase) *Handler {
\treturn &Handler{useCase: uc}
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
\tw.WriteHeader(http.StatusOK)
\tjson.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func (h *Handler) Process(w http.ResponseWriter, r *http.Request) {
\tvar input entity.Input
\tif err := json.NewDecoder(r.Body).Decode(&input); err != nil {
\t\thttp.Error(w, err.Error(), http.StatusBadRequest)
\t\treturn
\t}

\tresult := h.useCase.Execute(input)

\tw.Header().Set("Content-Type", "application/json")
\tjson.NewEncoder(w).Encode(result)
}
`,

      "internal/infrastructure/http/router.go": `package http

import "github.com/go-chi/chi/v5"

func NewRouter(h *Handler) *chi.Mux {
\tr := chi.NewRouter()

\tr.Get("/health", h.Health)
\tr.Post("/api/v1/process", h.Process)

\treturn r
}
`,
    };
  }
}
