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

public class AnimatedIOSClockViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AnimatedIOSClockView")

    View(AnimatedIOSClockView.self) {
      AsyncFunction("getValues") { (view: AnimatedIOSClockView) -> [String: Double] in
        return ["hours": view.hours, "minutes": view.minutes]      
      }
    }
  }
}
