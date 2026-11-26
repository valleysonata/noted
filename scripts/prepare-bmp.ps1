param([Parameter(Mandatory)] [string] $Source, [Parameter(Mandatory)] [string] $Destination)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$sourcePath = (Resolve-Path -LiteralPath $Source).Path
$destPath = [IO.Path]::GetFullPath($Destination)
$im = [Drawing.Image]::FromFile($sourcePath)
try {
  $rgb = [Drawing.Bitmap]::new($im.Width, $im.Height, [Drawing.Imaging.PixelFormat]::Format24bppRgb)
  try {
    $g = [Drawing.Graphics]::FromImage($rgb)
    try { $g.Clear([Drawing.Color]::White); $g.DrawImageUnscaled($im,0,0) } finally { $g.Dispose() }
    $out = [IO.File]::Open($destPath,[IO.FileMode]::CreateNew)
    try { $rgb.Save($out,[Drawing.Imaging.ImageFormat]::Bmp) } finally { $out.Dispose() }
  } finally { $rgb.Dispose() }
} finally { $im.Dispose() }
