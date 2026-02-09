try {
    Add-Type -AssemblyName System.Drawing
    $files = @("d:\Projects\Medify-hub\public\images\gallery-small-1.jpg", "d:\Projects\Medify-hub\public\images\gallery-small-2.jpg")
    foreach ($f in $files) {
        if (Test-Path $f) {
            $bytes = [System.IO.File]::ReadAllBytes($f)
            $ms = New-Object System.IO.MemoryStream(,$bytes)
            $img = [System.Drawing.Image]::FromStream($ms)
            $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
            $img.Save($f, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            $img.Dispose()
            $ms.Dispose()
        }
    }
    "Success" | Out-File "d:\Projects\Medify-hub\rotation_success.txt"
} catch {
    $_ | Out-File "d:\Projects\Medify-hub\rotation_error.txt"
    exit 1
}
