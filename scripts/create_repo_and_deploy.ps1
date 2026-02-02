param(
    [Parameter(Mandatory=$true)][string]$RepoName,
    [string]$Visibility = "public",
    [string]$VercelProjectName = $null
)

function Check-Command($cmd, $installUrl) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Error "$cmd not found. Install from: $installUrl"
        exit 1
    }
}

Check-Command gh "https://cli.github.com/"
Check-Command vercel "https://vercel.com/docs/cli"

if (-not (Test-Path .git)) {
    git init
}

git add -A
if (-not (git rev-parse --verify HEAD -ErrorAction SilentlyContinue)) {
    git commit -m "Initial commit"
} else {
    git commit -m "Initial commit" -q 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "No changes to commit"
    }
}

$ghVisibility = if ($Visibility -eq "private") { "--private" } else { "--public" }

gh repo create $RepoName $ghVisibility --source=. --remote=origin --push

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create or push to GitHub repo. Please verify you are authenticated with 'gh auth login'."
    exit 1
}

Write-Host "GitHub repo created and pushed. Now deploying to Vercel..."

if ($VercelProjectName) {
    vercel --prod --confirm --name $VercelProjectName
} else {
    vercel --prod --confirm
}

if ($LASTEXITCODE -ne 0) {
    Write-Error "Vercel deployment failed. You may need to run 'vercel login' or configure project settings in Vercel dashboard."
    exit 1
}

Write-Host "Deployment completed. Visit your Vercel dashboard to manage domains and environment variables."
