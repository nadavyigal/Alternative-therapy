# Install Playwright MCP
$ErrorActionPreference = "Continue"
# Run from a neutral directory to avoid path encoding issues
Push-Location $env:USERPROFILE
& "C:\Program Files\nodejs\npx.cmd" @playwright/mcp@latest
Pop-Location
