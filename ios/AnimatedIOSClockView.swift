import ExpoModulesCore
import SwiftUI

class AnimatedIOSClockView: ExpoView {
  private var hostingController: UIHostingController<AnimatedIOSClockContent>?

  var hours: Double = 0 {
    didSet { updateContent() }
  }

  var minutes: Double = 0 {
    didSet { updateContent() }
  }

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    let hosting = UIHostingController(rootView: makeContent())
    hostingController = hosting
    hosting.view.backgroundColor = .clear
    addSubview(hosting.view)
  }

  private func makeContent() -> AnimatedIOSClockContent {
    AnimatedIOSClockContent(hours: hours, minutes: minutes) { [weak self] newHours, newMinutes in
      guard let self else { return }
      self.hours = newHours
      self.minutes = newMinutes
      self.onValueSet([
        "hours": newHours,
        "minutes": newMinutes,
      ])
    }
  }

  private func updateContent() {
    hostingController?.rootView = makeContent()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    hostingController?.view.frame = bounds
  }
}

struct AnimatedIOSClockContent: View {
  var hours: Double
  var minutes: Double
  var onCommit: (_ hours: Double, _ minutes: Double) -> Void

  @State private var showEditor = false
  @State private var draftHours: Int = 0
  @State private var draftMinutes: Int = 0

  var body: some View {
    HStack(spacing: 2) {
      Text(hours, format: .number.precision(.integerAndFractionLength(integer: 2, fraction: 0)))
        .contentTransition(.numericText(value: hours))
        .animation(.snappy, value: hours)

      Text(":")

      Text(minutes, format: .number.precision(.integerAndFractionLength(integer: 2, fraction: 0)))
        .contentTransition(.numericText(value: minutes))
        .animation(.snappy, value: minutes)
    }
    .font(.largeTitle)
    .bold()
    .monospacedDigit()
    .onTapGesture {
      draftHours = Int(hours.rounded())
      draftMinutes = Int(minutes.rounded())
      showEditor = true
    }
    .sheet(isPresented: $showEditor) {
      ClockPickerSheet(
        hours: $draftHours,
        minutes: $draftMinutes,
        onSet: {
          onCommit(Double(draftHours), Double(draftMinutes))
          showEditor = false
        },
        onCancel: {
          showEditor = false
        }
      )
      .presentationDetents([.height(320)])
    }
  }
}

struct ClockPickerSheet: View {
  @Binding var hours: Int
  @Binding var minutes: Int
  var onSet: () -> Void
  var onCancel: () -> Void

  var body: some View {
    VStack(spacing: 16) {
      Text("Set Time")
        .font(.headline)
        .padding(.top, 8)

      HStack(spacing: 0) {
        Picker("Hours", selection: $hours) {
          ForEach(0..<24, id: \.self) { hour in
            Text(String(format: "%02d", hour)).tag(hour)
          }
        }
        .pickerStyle(.wheel)
        .frame(maxWidth: .infinity)

        Picker("Minutes", selection: $minutes) {
          ForEach(0..<60, id: \.self) { minute in
            Text(String(format: "%02d", minute)).tag(minute)
          }
        }
        .pickerStyle(.wheel)
        .frame(maxWidth: .infinity)
      }
      .frame(height: 160)

      HStack(spacing: 16) {
        Button("Cancel", role: .cancel, action: onCancel)
          .buttonStyle(.bordered)
        Button("Set", action: onSet)
          .buttonStyle(.borderedProminent)
      }
      .padding(.bottom, 8)
    }
    .padding()
  }
}
