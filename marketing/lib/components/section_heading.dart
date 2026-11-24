import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

/// The title and subtitle at the top of a page section.
class SectionHeading extends StatelessComponent {
  const SectionHeading({
    required this.title,
    required this.subtitle,
    super.key,
  });

  final String title;
  final String subtitle;

  @override
  Component build(BuildContext context) {
    return Component.fragment([
      h2(classes: 'text-[#F7F8FC] font-bold text-4xl md:text-5xl tracking-tight leading-tight', [.text(title)]),
      p(classes: 'mt-3 text-[#A1A1AA] text-lg md:text-xl font-normal tracking-normal', [.text(subtitle)]),
    ]);
  }
}
