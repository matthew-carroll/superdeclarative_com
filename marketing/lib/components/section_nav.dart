import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

/// Sticky section navigation bar.
class SectionNav extends StatelessComponent {
  const SectionNav({super.key});

  @override
  Component build(BuildContext context) {
    return const nav(
      id: 'sectionNav',
      classes: 'sticky top-0 z-40 w-full bg-[#141417]/80 backdrop-blur-md border-y border-white/[0.06]',
      attributes: {'aria-label': 'Main navigation'},
      [
        div(classes: 'max-w-[1000px] mx-auto px-[18px] sm:px-6 h-14 flex items-center justify-center', [
          ul(
            classes:
                'w-full sm:w-auto flex items-center justify-between sm:justify-center gap-[0px] sm:gap-12 md:gap-16 m-0 p-0 list-none',
            [
              _SectionLink('Services', sectionId: 'services'),
              _SectionLink('Community', sectionId: 'community'),
              _SectionLink('My Work', sectionId: 'myWork'),
              _SectionLink('Hire Me', sectionId: 'hireMe'),
            ],
          ),
        ]),
      ],
    );
  }
}

class _SectionLink extends StatelessComponent {
  const _SectionLink(this.label, {required this.sectionId});

  final String label;
  final String sectionId;

  @override
  Component build(BuildContext context) {
    return li([
      a(
        href: '#$sectionId',
        classes:
            'inline-flex items-center h-[44px] sm:h-auto px-[6px] sm:px-[0px] sm:py-2 text-sm sm:text-xs font-medium whitespace-nowrap sm:uppercase sm:tracking-[0.14em] text-[#A1A1AA] hover:text-[#F7F8FC] transition-colors duration-150 no-underline',
        [.text(label)],
      ),
    ]);
  }
}
