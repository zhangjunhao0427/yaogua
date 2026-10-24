import SwiftUI
import WidgetKit

// 配色与应用内一致
private let paperLight = Color(red: 0.957, green: 0.933, blue: 0.886)
private let inkLight = Color(red: 0.165, green: 0.145, blue: 0.129)
private let paperDark = Color(red: 0.086, green: 0.078, blue: 0.067)
private let inkDark = Color(red: 0.925, green: 0.894, blue: 0.839)
private let copper = Color(red: 0.643, green: 0.373, blue: 0.169)

struct DailyEntry: TimelineEntry {
    let date: Date
    let passage: Passage
}

struct DailyProvider: TimelineProvider {
    func placeholder(in context: Context) -> DailyEntry {
        DailyEntry(date: Date(), passage: Scripture.judgments[0])
    }

    func getSnapshot(in context: Context, completion: @escaping (DailyEntry) -> Void) {
        completion(DailyEntry(date: Date(), passage: Scripture.ofDay(Date())))
    }

    /// 排到七天后，每天零点换一卦
    func getTimeline(in context: Context, completion: @escaping (Timeline<DailyEntry>) -> Void) {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let entries = (0 ..< 7).compactMap { offset -> DailyEntry? in
            guard let day = calendar.date(byAdding: .day, value: offset, to: today) else { return nil }
            return DailyEntry(date: day, passage: Scripture.ofDay(day))
        }
        completion(Timeline(entries: entries, policy: .atEnd))
    }
}

/// 六爻卦象，初爻在最下
struct HexagramLines: View {
    let bits: String
    let color: Color
    var lineHeight: CGFloat = 5
    var spacing: CGFloat = 4

    var body: some View {
        let lines = Array(bits).enumerated().map { (index: $0.offset, yang: $0.element == "1") }
        VStack(spacing: spacing) {
            ForEach(lines.reversed(), id: \.index) { line in
                if line.yang {
                    Capsule().fill(color).frame(height: lineHeight)
                } else {
                    HStack(spacing: lineHeight * 1.8) {
                        Capsule().fill(color)
                        Capsule().fill(color)
                    }
                    .frame(height: lineHeight)
                }
            }
        }
    }
}

struct DailyWidgetView: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.widgetFamily) private var family
    let entry: DailyEntry

    private var ink: Color { scheme == .dark ? inkDark : inkLight }
    private var paper: Color { scheme == .dark ? paperDark : paperLight }

    var body: some View {
        content.containerBackground(paper, for: .widget)
    }

    @ViewBuilder private var content: some View {
        switch family {
        case .systemSmall: small
        default: medium
        }
    }

    private var small: some View {
        VStack(spacing: 9) {
            HexagramLines(bits: entry.passage.bits, color: ink).frame(width: 54)
            VStack(spacing: 1) {
                Text(entry.passage.name)
                    .font(.system(size: 20, weight: .semibold, design: .serif))
                    .foregroundStyle(ink)
                Text(entry.passage.theme)
                    .font(.system(size: 11))
                    .foregroundStyle(copper)
            }
        }
    }

    private var medium: some View {
        HStack(alignment: .center, spacing: 16) {
            HexagramLines(bits: entry.passage.bits, color: ink, lineHeight: 6, spacing: 5).frame(width: 58)
            VStack(alignment: .leading, spacing: 5) {
                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Text(entry.passage.name)
                        .font(.system(size: 19, weight: .semibold, design: .serif))
                        .foregroundStyle(ink)
                    Text(entry.passage.theme)
                        .font(.system(size: 11))
                        .foregroundStyle(copper)
                }
                Text(entry.passage.original)
                    .font(.system(size: 14, design: .serif))
                    .foregroundStyle(ink)
                    .lineLimit(2)
                Text(entry.passage.plain)
                    .font(.system(size: 11))
                    .foregroundStyle(ink.opacity(0.65))
                    .lineLimit(3)
            }
            Spacer(minLength: 0)
        }
    }
}

struct DailyHexagramWidget: Widget {
    let kind = "DailyHexagram"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DailyProvider()) { entry in
            DailyWidgetView(entry: entry)
        }
        .configurationDisplayName("今日一卦")
        .description("每天一卦卦辞，轻点进入摇卦。")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

@main
struct YaoguaWidgetBundle: WidgetBundle {
    var body: some Widget {
        DailyHexagramWidget()
    }
}
