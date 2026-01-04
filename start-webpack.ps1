# PowerShell script to start dev server with webpack (not Turbopack)

$env:POSTGRES_URL = "postgresql://dev_user:dev_password@localhost:5432/postgres_dev"
$env:BETTER_AUTH_SECRET = "qtD4Ssa0t5jY7ewALgai97sKhAtn7Ysc"
$env:NEXT_PUBLIC_APP_URL = "http://localhost:3000"
$env:NODE_ENV = "development"
$env:TURBOPACK = "0"
$env:NEXT_USE_WEBPACK = "1"

Write-Host "Starting Next.js development server with Webpack..."
Write-Host "POSTGRES_URL: $env:POSTGRES_URL"
Write-Host "TURBOPACK: Disabled"
Write-Host ""

pnpm run dev:webpack
