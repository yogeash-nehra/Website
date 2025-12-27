# PowerShell script to convert HTML to MDX using Pandoc

# Refresh environment variables to pick up newly installed pandoc
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Create mdx directory
New-Item -ItemType Directory -Force -Path "mdx" | Out-Null
New-Item -ItemType Directory -Force -Path "mdx\media" | Out-Null

# Find all HTML files in the blog directory
$htmlFiles = Get-ChildItem -Path "html\wgholdings.co.nz\blog" -Filter "*.html" -File

Write-Host "Found $($htmlFiles.Count) HTML files to convert"

foreach ($file in $htmlFiles) {
    $filename = $file.BaseName
    $outputPath = "mdx\$filename.mdx"
    
    Write-Host "Converting: $filename"
    
    # Run pandoc conversion
    & pandoc "$($file.FullName)" `
        -f html `
        -t markdown+raw_html `
        --wrap=none `
        --extract-media=mdx/media `
        -o $outputPath
}

Write-Host "`nConversion complete!"

