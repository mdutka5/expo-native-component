import ExpoModulesCore

public class ContentTransitionTextViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ContentTransitionTextView")

    View(ContentTransitionTextView.self) {
      Prop("value") { (view: ContentTransitionTextView, value: Double) in
      view.value = value
    }
  }
}
}
