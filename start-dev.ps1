# PowerShell script to start the development server with proper environment variables

$env:POSTGRES_URL = "postgresql://dev_user:dev_password@localhost:5432/postgres_dev"
$env:BETTER_AUTH_SECRET = "qtD4Ssa0t5jY7ewALgai97sKhAtn7Ysc"
$env:NEXT_PUBLIC_APP_URL = "http://localhost:3000"
$env:NODE_ENV = "development"

Write-Host "Starting Next.js development server..."
Write-Host "POSTGRES_URL: $env:POSTGRES_URL"
Write-Host "BETTER_AUTH_SECRET: Set"
Write-Host "NEXT_PUBLIC_APP_URL: $env:NEXT_PUBLIC_APP_URL"
Write-Host ""

pnpm dev
