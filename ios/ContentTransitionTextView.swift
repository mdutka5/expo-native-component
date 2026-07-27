import ExpoModulesCore
import SwiftUI

class ContentTransitionTextView: ExpoView {
    private var hostingController: UIHostingController<ContentTransitionTextContent>?

    // Prop coming from JS
    var value: Double = 0 {
        didSet {
            hostingController?.rootView = ContentTransitionTextContent(value: value)
        }
    }

    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)

        let hosting = UIHostingController(rootView: ContentTransitionTextContent(value: value))
        hostingController = hosting

        hosting.view.backgroundColor = .clear
        addSubview(hosting.view)
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        hostingController?.view.frame = bounds
    }
}

struct ContentTransitionTextContent: View {
    var value: Double

    private static let currencyFormatter: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencySymbol = "$"
        return formatter
    }()

    var body: some View {
        Text(Self.currencyFormatter.string(from: value as NSNumber) ?? "$0.00")
            .contentTransition(.numericText(value: value))
            .animation(.snappy, value: value)
            .font(.largeTitle)
            .bold()
    }
}