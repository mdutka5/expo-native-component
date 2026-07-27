package expo.modules.contenttransitiontext

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ContentTransitionTextModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ContentTransitionTextView")

    View(ContentTransitionTextView::class) {
      Prop("value") { view: ContentTransitionTextView, value: Double ->
        view.setValue(value)
      }
    }
  }
}
