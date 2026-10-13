import Cocoa
import WebKit

class AppDelegate: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate, WKDownloadDelegate {
    var window: NSWindow!
    var webView: WKWebView!
    var loadingIndicator: NSProgressIndicator!

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        setupMenu()
        setupWindow()
        loadApp()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

    func setupWindow() {
        let screenRect = NSScreen.main?.visibleFrame ?? NSRect(x: 0, y: 0, width: 1440, height: 900)
        let initialWidth: CGFloat = min(1400, screenRect.width * 0.9)
        let initialHeight: CGFloat = min(920, screenRect.height * 0.9)

        let contentRect = NSRect(
            x: (screenRect.width - initialWidth) / 2 + screenRect.minX,
            y: (screenRect.height - initialHeight) / 2 + screenRect.minY,
            width: initialWidth,
            height: initialHeight
        )

        window = NSWindow(
            contentRect: contentRect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )

        window.title = "AutoB-Roll Studio • Video VanzaLabs"
        window.titleVisibility = .hidden
        window.titlebarAppearsTransparent = true
        window.isMovableByWindowBackground = true
        window.backgroundColor = NSColor(red: 9/255, green: 11/255, blue: 16/255, alpha: 1.0)
        window.minSize = NSSize(width: 1060, height: 720)

        // Setup WebKit Configuration
        let config = WKWebViewConfiguration()
        config.preferences.setValue(true, forKey: "developerExtrasEnabled")
        config.defaultWebpagePreferences.allowsContentJavaScript = true
        config.mediaTypesRequiringUserActionForPlayback = []

        webView = WKWebView(frame: window.contentView!.bounds, configuration: config)
        webView.autoresizingMask = [.width, .height]
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.setValue(false, forKey: "drawsBackground") // Transparent background until loaded

        // Custom User-Agent to identify as Desktop Studio App
        webView.customUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) AutoB-Roll-Studio/1.0.0"

        window.contentView?.addSubview(webView)

        // Loading spinner
        loadingIndicator = NSProgressIndicator(frame: NSRect(x: (initialWidth - 36) / 2, y: (initialHeight - 36) / 2, width: 36, height: 36))
        loadingIndicator.style = .spinning
        loadingIndicator.controlSize = .regular
        loadingIndicator.autoresizingMask = [.minXMargin, .maxXMargin, .minYMargin, .maxYMargin]
        loadingIndicator.startAnimation(nil)
        window.contentView?.addSubview(loadingIndicator)

        window.makeKeyAndOrderFront(nil)
    }

    func loadApp() {
        if let url = URL(string: "https://autobroll-studio.vercel.app") {
            var request = URLRequest(url: url)
            request.cachePolicy = .returnCacheDataElseLoad
            webView.load(request)
        }
    }

    // MARK: - WKNavigationDelegate
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        loadingIndicator.stopAnimation(nil)
        loadingIndicator.removeFromSuperview()
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        showOfflineAlert(error: error)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        showOfflineAlert(error: error)
    }

    func showOfflineAlert(error: Error) {
        loadingIndicator.stopAnimation(nil)
        let alert = NSAlert()
        alert.messageText = "Не вдалося завантажити AutoB-Roll Studio"
        alert.informativeText = "Перевірте підключення до мережі або запустіть сервіс локально.\nПомилка: \(error.localizedDescription)"
        alert.alertStyle = .warning
        alert.addButton(withTitle: "Спробувати знову")
        alert.addButton(withTitle: "Вийти")
        let response = alert.runModal()
        if response == .alertFirstButtonReturn {
            loadingIndicator.startAnimation(nil)
            loadApp()
        } else {
            NSApp.terminate(nil)
        }
    }

    // Handle Blob/Data or URL Downloads (FCPXML, Premiere XML, EDL)
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, preferences: WKWebpagePreferences, decisionHandler: @escaping (WKNavigationActionPolicy, WKWebpagePreferences) -> Void) {
        if navigationAction.shouldPerformDownload {
            decisionHandler(.download, preferences)
        } else {
            decisionHandler(.allow, preferences)
        }
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
        if navigationResponse.canShowMIMEType {
            decisionHandler(.allow)
        } else {
            decisionHandler(.download)
        }
    }

    func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) {
        download.delegate = self
    }

    func webView(_ webView: WKWebView, navigationResponse: WKNavigationResponse, didBecome download: WKDownload) {
        download.delegate = self
    }

    // MARK: - WKDownloadDelegate
    func download(_ download: WKDownload, decideDestinationUsing response: URLResponse, suggestedFilename: String, completionHandler: @escaping (URL?) -> Void) {
        let downloadsDir = FileManager.default.urls(for: .downloadsDirectory, in: .userDomainMask).first!
        var destination = downloadsDir.appendingPathComponent(suggestedFilename)

        var count = 1
        let baseName = (suggestedFilename as NSString).deletingPathExtension
        let ext = (suggestedFilename as NSString).pathExtension

        while FileManager.default.fileExists(atPath: destination.path) {
            let newName = ext.isEmpty ? "\(baseName) (\(count))" : "\(baseName) (\(count)).\(ext)"
            destination = downloadsDir.appendingPathComponent(newName)
            count += 1
        }

        completionHandler(destination)
    }

    func downloadDidFinish(_ download: WKDownload) {
        NSSound(named: "Glass")?.play()
    }

    // MARK: - Native macOS Menu
    func setupMenu() {
        let mainMenu = NSMenu()

        // App Menu
        let appMenuItem = NSMenuItem()
        let appMenu = NSMenu(title: "AutoB-Roll Studio")
        appMenu.addItem(withTitle: "Про AutoB-Roll Studio", action: #selector(showAbout), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Сховати AutoB-Roll Studio", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        let hideOthersItem = appMenu.addItem(withTitle: "Сховати інші", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h")
        hideOthersItem.keyEquivalentModifierMask = [.command, .option]
        appMenu.addItem(withTitle: "Показати всі", action: #selector(NSApplication.unhideAllApplications(_:)), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Завершити AutoB-Roll Studio", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        appMenuItem.submenu = appMenu
        mainMenu.addItem(appMenuItem)

        // Edit Menu
        let editMenuItem = NSMenuItem()
        let editMenu = NSMenu(title: "Редагування")
        editMenu.addItem(withTitle: "Відмінити", action: Selector(("undo:")), keyEquivalent: "z")
        editMenu.addItem(withTitle: "Повторити", action: Selector(("redo:")), keyEquivalent: "Z")
        editMenu.addItem(NSMenuItem.separator())
        editMenu.addItem(withTitle: "Вирізати", action: Selector(("cut:")), keyEquivalent: "x")
        editMenu.addItem(withTitle: "Скопіювати", action: Selector(("copy:")), keyEquivalent: "c")
        editMenu.addItem(withTitle: "Вставити", action: Selector(("paste:")), keyEquivalent: "v")
        editMenu.addItem(withTitle: "Виділити все", action: Selector(("selectAll:")), keyEquivalent: "a")
        editMenuItem.submenu = editMenu
        mainMenu.addItem(editMenuItem)

        // View Menu
        let viewMenuItem = NSMenuItem()
        let viewMenu = NSMenu(title: "Вигляд")
        viewMenu.addItem(withTitle: "Перезавантажити проєкт", action: #selector(reloadApp), keyEquivalent: "r")
        let hardReload = viewMenu.addItem(withTitle: "Очистити кеш та перезавантажити", action: #selector(hardReloadApp), keyEquivalent: "R")
        hardReload.keyEquivalentModifierMask = [.command, .shift]
        viewMenu.addItem(NSMenuItem.separator())
        viewMenu.addItem(withTitle: "На весь екран", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f")
        viewMenuItem.submenu = viewMenu
        mainMenu.addItem(viewMenuItem)

        // Window Menu
        let windowMenuItem = NSMenuItem()
        let windowMenu = NSMenu(title: "Вікно")
        windowMenu.addItem(withTitle: "Згорнути", action: #selector(NSWindow.miniaturize(_:)), keyEquivalent: "m")
        windowMenu.addItem(withTitle: "Збільшити", action: #selector(NSWindow.zoom(_:)), keyEquivalent: "")
        windowMenuItem.submenu = windowMenu
        mainMenu.addItem(windowMenuItem)

        NSApp.mainMenu = mainMenu
    }

    @objc func reloadApp() {
        webView.reload()
    }

    @objc func hardReloadApp() {
        webView.reloadFromOrigin()
    }

    @objc func showAbout() {
        let alert = NSAlert()
        alert.messageText = "AutoB-Roll Studio"
        alert.informativeText = "Версія 1.0.0 (Native macOS)\nСинергетичний продукт екосистеми Video VanzaLabs.\n\nAI Cadence-Aware B-Roll Timeline Generator\n© 2026 VanzaLabs. All rights reserved."
        alert.alertStyle = .informational
        alert.runModal()
    }
}

// App Entry Point
let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.activate(ignoringOtherApps: true)
app.run()
