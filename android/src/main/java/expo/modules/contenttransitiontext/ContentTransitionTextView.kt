package expo.modules.contenttransitiontext

import android.content.Context
import android.graphics.Typeface
import android.util.TypedValue
import android.widget.TextView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

class ContentTransitionTextView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val textView = TextView(context).also {
    it.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    it.setTextSize(TypedValue.COMPLEX_UNIT_SP, 34f)
    it.setTypeface(it.typeface, Typeface.BOLD)
    addView(it)
  }

  private val currencyFormatter = NumberFormat.getCurrencyInstance(Locale.US).apply {
    currency = Currency.getInstance("USD")
  }

  private var value: Double = 0.0

  fun setValue(value: Double) {
    this.value = value
    textView.text = currencyFormatter.format(value)
  }

  init {
    setValue(0.0)
  }
}
