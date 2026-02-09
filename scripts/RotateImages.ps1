$logFile = "d:\Projects\Medify-hub\rotate_log.txt"
"Starting rotation script..." | Out-File $logFile

Add-Type -AssemblyName System.Drawing

$files = @(
    "d:\Projects\Medify-hub\public\images\gallery-small-1.jpg",
    "d:\Projects\Medify-hub\public\images\gallery-small-2.jpg"
)

foreach ($f in $files) {
    "Checking $f" | Out-File -Append $logFile
    if (Test-Path $f) {
        try {
            $bytes = [System.IO.File]::ReadAllBytes($f)
            $ms = New-Object System.IO.MemoryStream(,$bytes)
            $img = [System.Drawing.Image]::FromStream($ms)
            
            "Rotating $f" | Out-File -Append $logFile
            $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
            
            $img.Save($f, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            $img.Dispose()
            $ms.Dispose()
            
            "Successfully rotated $f" | Out-File -Append $logFile
        } catch {
            "Error rotating $f: $_" | Out-File -Append $logFile
        }
    } else {
        "File not found: $f" | Out-File -Append $logFile
    }
}
"Script finished." | Out-File -Append $logFile
