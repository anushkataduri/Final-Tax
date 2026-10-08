Add-Type -AssemblyName System.Drawing

$output = Join-Path $PSScriptRoot "..\assets\images\services\loans"
New-Item -ItemType Directory -Force -Path $output | Out-Null

function New-Canvas([string]$path, [string]$background, [scriptblock]$draw) {
  $bitmap = New-Object System.Drawing.Bitmap 1024, 1024
  $bitmap.SetResolution(96, 96)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($background))
  $graphics.FillEllipse($brush, 32, 32, 960, 960)
  $brush.Dispose()
  & $draw $graphics
  $graphics.Dispose()
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

function Brush([string]$color) { New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($color)) }
function Pen([string]$color, [float]$width) { New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml($color), $width) }
function Gear($g, [int]$cx, [int]$cy, [int]$r, [string]$color) {
  $p = Pen "#6B7280" 10
  $b = Brush $color
  for ($i = 0; $i -lt 12; $i++) {
    $a = $i * [Math]::PI / 6
    $x = $cx + [Math]::Cos($a) * ($r + 18) - 14
    $y = $cy + [Math]::Sin($a) * ($r + 18) - 14
    $g.FillRectangle($b, $x, $y, 28, 28)
  }
  $g.FillEllipse($b, $cx - $r, $cy - $r, 2 * $r, 2 * $r)
  $g.DrawEllipse($p, $cx - $r, $cy - $r, 2 * $r, 2 * $r)
  $hole = Brush "#E6F2FF"
  $g.FillEllipse($hole, $cx - 20, $cy - 20, 40, 40)
  $hole.Dispose(); $b.Dispose(); $p.Dispose()
}

function DrawBusiness($g) {
  Gear $g 400 470 120 "#9CA3AF"; Gear $g 650 560 145 "#D1D5DB"; Gear $g 590 320 82 "#6B7280"
  $p = Pen "#374151" 18
  $g.DrawLine($p, 240, 760, 790, 760); $g.DrawLine($p, 285, 760, 360, 680); $g.DrawLine($p, 735, 760, 650, 660)
  $p.Dispose()
}

function DrawShop($g) {
  $wood = Brush "#9A572F"; $dark = Brush "#61341F"; $cream = Brush "#FFF7E8"; $p = Pen "#4B2A1A" 10
  $g.FillRectangle($wood, 240, 390, 545, 370); $g.FillRectangle($cream, 205, 330, 615, 105); $g.FillRectangle($dark, 220, 300, 585, 42)
  for ($x = 240; $x -lt 790; $x += 72) { $g.FillRectangle($wood, $x, 320, 34, 100) }
  $g.FillRectangle($cream, 300, 500, 165, 260); $g.FillRectangle($dark, 505, 500, 200, 260); $g.FillEllipse($wood, 640, 610, 16, 16); $g.DrawRectangle($p, 240, 390, 545, 370)
  $wood.Dispose(); $dark.Dispose(); $cream.Dispose(); $p.Dispose()
}

function DrawHome($g) {
  $roof = Brush "#B66B3C"; $wall = Brush "#F7E8C9"; $gold = Brush "#D59A25"; $ink = Pen "#7B5326" 10
  $points = [Drawing.Point[]]@([Drawing.Point]::new(190,480), [Drawing.Point]::new(510,225), [Drawing.Point]::new(830,480))
  $g.FillPolygon($roof, $points); $g.FillRectangle($wall, 255, 455, 510, 310); $g.FillRectangle($roof, 460, 580, 115, 185); $g.FillRectangle($gold, 690, 250, 95, 210); $g.DrawRectangle($ink, 690, 250, 95, 210); $g.DrawEllipse($ink, 430, 200, 250, 320)
  $g.DrawLine($ink, 475, 330, 595, 330); $g.DrawLine($ink, 475, 370, 595, 370); $g.DrawLine($ink, 475, 410, 570, 410)
  $g.DrawLine($ink, 770, 700, 865, 605); $g.DrawLine($ink, 865, 605, 890, 630); $g.DrawLine($ink, 770, 700, 745, 675)
  $roof.Dispose(); $wall.Dispose(); $gold.Dispose(); $ink.Dispose()
}

function DrawProperty($g) {
  $roof = Brush "#6B3E25"; $wall = Brush "#D6A26C"; $window = Brush "#EAF1FE"; $p = Pen "#4B2A1A" 12
  $points = [Drawing.Point[]]@([Drawing.Point]::new(185,500), [Drawing.Point]::new(515,230), [Drawing.Point]::new(850,500))
  $g.FillPolygon($roof, $points); $g.FillRectangle($wall, 250, 460, 530, 315); $g.FillRectangle($roof, 470, 585, 120, 190); $g.FillRectangle($window, 320, 550, 100, 100); $g.FillRectangle($window, 630, 550, 100, 100); $g.DrawRectangle($p, 250, 460, 530, 315); $p.Dispose(); $roof.Dispose(); $wall.Dispose(); $window.Dispose()
}

function DrawAdvisor($g) {
  $skin = Brush "#C9825A"; $hair = Brush "#2F241F"; $suit = Brush "#1F2937"; $shirt = Brush "#FFFFFF"; $tie = Brush "#D97706"
  $g.FillEllipse($skin, 390, 185, 245, 275); $g.FillEllipse($hair, 385, 155, 255, 125); $g.FillPolygon($suit, [Drawing.Point[]]@([Drawing.Point]::new(220,850), [Drawing.Point]::new(350,500), [Drawing.Point]::new(675,500), [Drawing.Point]::new(810,850))); $g.FillPolygon($shirt, [Drawing.Point[]]@([Drawing.Point]::new(420,480), [Drawing.Point]::new(600,480), [Drawing.Point]::new(650,850), [Drawing.Point]::new(370,850))); $g.FillPolygon($tie, [Drawing.Point[]]@([Drawing.Point]::new(485,500), [Drawing.Point]::new(550,500), [Drawing.Point]::new(570,730), [Drawing.Point]::new(515,790), [Drawing.Point]::new(465,730)))
  $skin.Dispose(); $hair.Dispose(); $suit.Dispose(); $shirt.Dispose(); $tie.Dispose()
}

function DrawBuilding($g) {
  $glass = Brush "#8B6B4A"; $window = Brush "#FFF7DF"; $p = Pen "#59452F" 8
  $g.FillRectangle($glass, 300, 170, 430, 650); for ($y = 220; $y -lt 780; $y += 85) { for ($x = 335; $x -lt 700; $x += 75) { $g.FillRectangle($window, $x, $y, 38, 48) } }; $g.DrawRectangle($p, 300, 170, 430, 650); $p.Dispose(); $glass.Dispose(); $window.Dispose()
}

function DrawCar($g) {
  $metal = Brush "#AEB8C2"; $dark = Brush "#374151"; $glass = Brush "#D9F1F4"; $p = Pen "#4B5563" 10
  $g.FillRectangle($metal, 230, 505, 585, 190); $g.FillPolygon($metal, [Drawing.Point[]]@([Drawing.Point]::new(360,505), [Drawing.Point]::new(470,370), [Drawing.Point]::new(660,370), [Drawing.Point]::new(745,505))); $g.FillPolygon($glass, [Drawing.Point[]]@([Drawing.Point]::new(430,480), [Drawing.Point]::new(490,405), [Drawing.Point]::new(555,405), [Drawing.Point]::new(585,480))); $g.FillEllipse($dark, 300, 635, 105, 105); $g.FillEllipse($dark, 650, 635, 105, 105); $g.DrawRectangle($p, 230, 505, 585, 190); $p.Dispose(); $metal.Dispose(); $dark.Dispose(); $glass.Dispose()
}

function DrawBriefcase($g) {
  $leather = Brush "#74452C"; $dark = Brush "#4B2A1A"; $paper = Brush "#FFFDF5"; $p = Pen "#3F2418" 10
  $g.FillRectangle($leather, 260, 420, 500, 330); $g.FillRectangle($dark, 435, 350, 150, 90); $g.FillRectangle($paper, 330, 250, 160, 190); $g.FillRectangle($paper, 500, 220, 175, 220); $g.DrawLine($p, 360, 300, 450, 300); $g.DrawLine($p, 535, 275, 640, 275); $g.DrawRectangle($p, 260, 420, 500, 330); $p.Dispose(); $leather.Dispose(); $dark.Dispose(); $paper.Dispose()
}

function DrawCoins($g) {
  $gold = Brush "#D9A62E"; $light = Brush "#F2CD62"; $p = Pen "#966D17" 10
  for ($i = 0; $i -lt 4; $i++) { $x = 285 + ($i * 95); $g.FillEllipse($light, $x, 610 - ($i * 40), 180, 90); $g.FillRectangle($gold, $x, 655 - ($i * 40), 180, 75); $g.FillEllipse($gold, $x, 700 - ($i * 40), 180, 90); $g.DrawEllipse($p, $x, 610 - ($i * 40), 180, 90) }; $g.FillEllipse($light, 420, 245, 190, 190); $g.DrawEllipse($p, 420, 245, 190, 190); $g.DrawLine($p, 515, 290, 515, 385); $g.DrawLine($p, 470, 335, 560, 335); $p.Dispose(); $gold.Dispose(); $light.Dispose()
}

New-Canvas (Join-Path $output "business-loan.png") "#E6F2FF" { param($g) DrawBusiness $g }
New-Canvas (Join-Path $output "personal-loan.png") "#FFF2DF" { param($g) DrawShop $g }
New-Canvas (Join-Path $output "home-loan.png") "#E3F7F7" { param($g) DrawHome $g }
New-Canvas (Join-Path $output "property-loan.png") "#F3E8F8" { param($g) DrawProperty $g }
New-Canvas (Join-Path $output "vehicle-loan.png") "#E6F2FF" { param($g) DrawAdvisor $g }
New-Canvas (Join-Path $output "working-capital.png") "#FFF2DF" { param($g) DrawBuilding $g }
New-Canvas (Join-Path $output "machinery-loan.png") "#E3F7F7" { param($g) DrawCar $g }
New-Canvas (Join-Path $output "project-finance.png") "#F3E8F8" { param($g) DrawBriefcase $g }
New-Canvas (Join-Path $output "msme-loan.png") "#E6F2FF" { param($g) DrawCoins $g }