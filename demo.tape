# create-clean-app demo
# Records the interactive wizard creating a NestJS microservice

Output docs/demo.gif

Require node

Set Shell "bash"
Set Theme "Dracula"
Set FontSize 14
Set Width 900
Set Height 500
Set Padding 20
Set TypingSpeed 50ms

# Start the CLI
Type "npx create-clean-app"
Enter
Sleep 3s

# Prompt 1: "What do you want to create?" — select "Microservice / API" (2nd option)
Down
Sleep 300ms
Enter
Sleep 1s

# Prompt 2: "Select your stack:" — select "NestJS" (2nd option)
Down
Sleep 300ms
Enter
Sleep 1s

# Prompt 3: "Project name:" — type name
Type "payment-api"
Sleep 500ms
Enter
Sleep 1s

# Prompt 4: "Description:" — type description
Type "Event-sourced payment processing service"
Sleep 500ms
Enter
Sleep 1s

# Prompt 5: "Select features:" — gitflow already selected, toggle Docker and CI
Down
Sleep 200ms
Space
Sleep 200ms
Down
Sleep 200ms
Space
Sleep 300ms
Enter
Sleep 6s

# Wait for the success message to show
Sleep 3s
