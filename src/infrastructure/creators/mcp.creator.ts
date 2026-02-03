import type { ProjectConfig, ProjectCreator } from "../../domain/interfaces";

export class MCPCreator implements ProjectCreator {
  readonly type = "mcp";
  readonly stack = "go";
  readonly installCommand = "go mod tidy";
  readonly nextSteps = "make inspect";

  getTemplates(config: ProjectConfig): Record<string, string> {
    const moduleName = `github.com/carlos/${config.name}`;

    return {
      "go.mod": `module ${moduleName}

go 1.23.0

require (
\tgithub.com/google/uuid v1.6.0
\tgithub.com/mark3labs/mcp-go v0.43.2
)
`,

      ".gitignore": `bin/
*.exe
*.exe~
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
*.swo
.DS_Store
`,

      "Makefile": `.PHONY: build run run-sse inspect clean test tidy

BINARY_NAME=${config.name}
BUILD_DIR=bin
SSE_PORT=8080

build:
\t@echo "Building..."
\t@mkdir -p $(BUILD_DIR)
\tgo build -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/server

run: build
\t./$(BUILD_DIR)/$(BINARY_NAME) -mode=stdio

run-sse: build
\t./$(BUILD_DIR)/$(BINARY_NAME) -mode=sse -addr=:$(SSE_PORT)

inspect: build
\tnpx @modelcontextprotocol/inspector ./$(BUILD_DIR)/$(BINARY_NAME)

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
    └── mcp/
\`\`\`

## Usage

\`\`\`bash
make build      # Build binary
make run        # Run stdio mode
make run-sse    # Run SSE mode
make inspect    # MCP Inspector UI
\`\`\`
`,

      "cmd/server/main.go": `package main

import (
\t"flag"
\t"fmt"
\t"os"

\t"${moduleName}/internal/application/usecase"
\t"${moduleName}/internal/domain/service"
\t"${moduleName}/internal/infrastructure/mcp"
)

func main() {
\tmode := flag.String("mode", "stdio", "Server mode: stdio or sse")
\taddr := flag.String("addr", ":8080", "Address for SSE server")
\tflag.Parse()

\tsvc := service.NewService()
\tuc := usecase.NewUseCase(svc)
\tpresenter := mcp.NewPresenter()
\thandler := mcp.NewHandler(uc, presenter)
\tserver := mcp.NewServer(handler)

\tvar err error
\tswitch *mode {
\tcase "stdio":
\t\terr = server.ServeStdio()
\tcase "sse":
\t\terr = server.ServeSSE(*addr)
\tdefault:
\t\tfmt.Fprintf(os.Stderr, "Unknown mode: %s\\n", *mode)
\t\tos.Exit(1)
\t}

\tif err != nil {
\t\tfmt.Fprintf(os.Stderr, "Error: %v\\n", err)
\t\tos.Exit(1)
\t}
}
`,

      "internal/domain/entity/entity.go": `package entity

type Input struct {
\tData string
}

type Result struct {
\tID     string
\tOutput string
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

      "internal/infrastructure/mcp/presenter.go": `package mcp

import (
\t"fmt"
\t"${moduleName}/internal/domain/entity"
)

type Presenter struct{}

func NewPresenter() *Presenter {
\treturn &Presenter{}
}

func (p *Presenter) Format(result entity.Result) string {
\treturn fmt.Sprintf("ID: %s\\nOutput: %s", result.ID, result.Output)
}
`,

      "internal/infrastructure/mcp/handler.go": `package mcp

import (
\t"context"

\t"${moduleName}/internal/application/usecase"
\t"${moduleName}/internal/domain/entity"
\t"github.com/mark3labs/mcp-go/mcp"
)

type Handler struct {
\tuseCase   *usecase.UseCase
\tpresenter *Presenter
}

func NewHandler(uc *usecase.UseCase, p *Presenter) *Handler {
\treturn &Handler{useCase: uc, presenter: p}
}

func (h *Handler) Handle(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
\targs, _ := req.Params.Arguments.(map[string]any)
\tdata, _ := args["data"].(string)

\tinput := entity.Input{Data: data}
\tresult := h.useCase.Execute(input)

\treturn mcp.NewToolResultText(h.presenter.Format(result)), nil
}
`,

      "internal/infrastructure/mcp/server.go": `package mcp

import (
\t"fmt"
\t"net/http"

\t"github.com/mark3labs/mcp-go/mcp"
\t"github.com/mark3labs/mcp-go/server"
)

type Server struct {
\tmcpServer *server.MCPServer
\thandler   *Handler
}

func NewServer(handler *Handler) *Server {
\ts := server.NewMCPServer(
\t\t"${config.name}",
\t\t"1.0.0",
\t\tserver.WithToolCapabilities(true),
\t)

\tsrv := &Server{mcpServer: s, handler: handler}
\tsrv.registerTools()
\treturn srv
}

func (s *Server) registerTools() {
\ttool := mcp.NewTool("process",
\t\tmcp.WithDescription("Process input data"),
\t\tmcp.WithString("data",
\t\t\tmcp.Description("Input data to process"),
\t\t\tmcp.Required(),
\t\t),
\t)
\ts.mcpServer.AddTool(tool, s.handler.Handle)
}

func (s *Server) ServeStdio() error {
\treturn server.ServeStdio(s.mcpServer)
}

func (s *Server) ServeSSE(addr string) error {
\tsseServer := server.NewSSEServer(s.mcpServer)
\tfmt.Printf("SSE Server starting on %s\\n", addr)
\treturn http.ListenAndServe(addr, sseServer)
}
`,
    };
  }
}
