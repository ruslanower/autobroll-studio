import Cocoa

func createIcon(size: CGFloat) -> NSImage {
    let img = NSImage(size: NSSize(width: size, height: size))
    img.lockFocus()

    guard let ctx = NSGraphicsContext.current?.cgContext else {
        img.unlockFocus()
        return img
    }

    let rect = CGRect(x: 0, y: 0, width: size, height: size)
    let cornerRadius = size * 0.2237 // Apple standard squircle corner radius

    // 1. Draw rounded squircle background
    let bgPath = CGPath(roundedRect: rect.insetBy(dx: size * 0.04, dy: size * 0.04),
                         cornerWidth: cornerRadius,
                         cornerHeight: cornerRadius,
                         transform: nil)

    ctx.saveGState()
    ctx.addPath(bgPath)
    ctx.clip()

    // Dark Studio Gradient (#0B0D13 -> #161B27)
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bgColors = [
        NSColor(red: 11/255, green: 13/255, blue: 19/255, alpha: 1.0).cgColor,
        NSColor(red: 22/255, green: 27/255, blue: 39/255, alpha: 1.0).cgColor
    ] as CFArray
    if let bgGradient = CGGradient(colorsSpace: colorSpace, colors: bgColors, locations: [0.0, 1.0]) {
        ctx.drawLinearGradient(bgGradient, start: CGPoint(x: 0, y: size), end: CGPoint(x: size, y: 0), options: [])
    }
    ctx.restoreGState()

    // 2. Neon Gradient Border (#00F2FE -> #7F00FF)
    ctx.saveGState()
    ctx.addPath(bgPath)
    ctx.setLineWidth(size * 0.03)
    let borderColors = [
        NSColor(red: 0/255, green: 242/255, blue: 254/255, alpha: 0.9).cgColor,
        NSColor(red: 127/255, green: 0/255, blue: 255/255, alpha: 0.9).cgColor
    ] as CFArray
    if let borderGradient = CGGradient(colorsSpace: colorSpace, colors: borderColors, locations: [0.0, 1.0]) {
        ctx.replacePathWithStrokedPath()
        ctx.clip()
        ctx.drawLinearGradient(borderGradient, start: CGPoint(x: 0, y: size), end: CGPoint(x: size, y: 0), options: [])
    }
    ctx.restoreGState()

    // 3. Central Glowing Video Camera & Sound Wave Symbol
    ctx.saveGState()
    // Camera Body
    let camWidth = size * 0.44
    let camHeight = size * 0.32
    let camRect = CGRect(x: size * 0.22, y: size * 0.34, width: camWidth, height: camHeight)
    let camPath = CGPath(roundedRect: camRect, cornerWidth: size * 0.06, cornerHeight: size * 0.06, transform: nil)
    ctx.addPath(camPath)

    // Camera Lens / Triangle
    ctx.move(to: CGPoint(x: size * 0.70, y: size * 0.58))
    ctx.addLine(to: CGPoint(x: size * 0.82, y: size * 0.65))
    ctx.addLine(to: CGPoint(x: size * 0.82, y: size * 0.35))
    ctx.addLine(to: CGPoint(x: size * 0.70, y: size * 0.42))
    ctx.closePath()

    // Sound waves inside camera body
    let waveColors = [
        NSColor(red: 0/255, green: 242/255, blue: 254/255, alpha: 1.0).cgColor,
        NSColor(red: 79/255, green: 172/255, blue: 254/255, alpha: 1.0).cgColor
    ] as CFArray
    if let camGradient = CGGradient(colorsSpace: colorSpace, colors: waveColors, locations: [0.0, 1.0]) {
        ctx.clip()
        ctx.drawLinearGradient(camGradient, start: CGPoint(x: 0, y: size), end: CGPoint(x: size, y: 0), options: [])
    }
    ctx.restoreGState()

    // 4. Cadence Sound Wave Bars inside camera
    ctx.saveGState()
    let barHeights: [CGFloat] = [0.08, 0.16, 0.22, 0.14, 0.20, 0.12]
    let barWidth = size * 0.032
    let startX = size * 0.28
    let centerY = size * 0.50

    for (i, h) in barHeights.enumerated() {
        let x = startX + CGFloat(i) * (size * 0.06)
        let barH = size * h
        let barRect = CGRect(x: x, y: centerY - barH / 2, width: barWidth, height: barH)
        let barPath = CGPath(roundedRect: barRect, cornerWidth: barWidth / 2, cornerHeight: barWidth / 2, transform: nil)
        ctx.addPath(barPath)
    }
    ctx.setFillColor(NSColor(red: 11/255, green: 13/255, blue: 19/255, alpha: 0.95).cgColor)
    ctx.fillPath()
    ctx.restoreGState()

    img.unlockFocus()
    return img
}

let fm = FileManager.default
let iconsetDir = "AppIcon.iconset"
try? fm.removeItem(atPath: iconsetDir)
try? fm.createDirectory(atPath: iconsetDir, withIntermediateDirectories: true)

let sizes: [(String, CGFloat)] = [
    ("icon_16x16.png", 16),
    ("icon_16x16@2x.png", 32),
    ("icon_32x32.png", 32),
    ("icon_32x32@2x.png", 64),
    ("icon_128x128.png", 128),
    ("icon_128x128@2x.png", 256),
    ("icon_256x256.png", 256),
    ("icon_256x256@2x.png", 512),
    ("icon_512x512.png", 512),
    ("icon_512x512@2x.png", 1024)
]

for (name, sz) in sizes {
    let img = createIcon(size: sz)
    if let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff) {
        let png = rep.representation(using: .png, properties: [:])
        let path = "\(iconsetDir)/\(name)"
        try? png?.write(to: URL(fileURLWithPath: path))
    }
}

print("Iconset generated successfully!")
