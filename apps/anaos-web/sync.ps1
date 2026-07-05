$envVars = Get-Content .env
foreach ($line in $envVars) {
  if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith('#')) { continue }
  $key = $line.Substring(0, $line.IndexOf('='))
  $value = $line.Substring($line.IndexOf('=') + 1).Trim('"')
  Write-Host "Syncing $key..."
  try { npx vercel env rm $key production preview development --yes *>&1 | Out-Null } catch {}
  try { npx vercel env add $key production preview development --value "$value" *>&1 | Out-Null } catch {}
}
Write-Host "Sync Complete!"
