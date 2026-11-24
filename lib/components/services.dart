import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

import 'inline_svg.dart';
import 'section_heading.dart';

class Services extends StatelessComponent {
  const Services({super.key});

  @override
  Component build(BuildContext context) {
    return const section(id: 'services', classes: 'pt-[72px] md:pt-[112px] pb-[72px] md:pb-[112px]', [
      div(classes: 'container max-w-[1000px] px-[24px] md:px-[0px] text-center', [
        SectionHeading(title: 'Services', subtitle: 'I design and build app features'),
        _Platforms(),
        div(
          classes: 'max-w-[740px] mx-auto space-y-6 text-[#D4D4D8] text-lg md:text-xl leading-[1.85] md:leading-[1.9]',
          [
            p([
              .text(
                'I have nearly a decade of experience building Flutter apps, and a decade building Android apps. With '
                'the power of AI agents, I also build iOS apps, Mac apps, and web apps.',
              ),
            ]),
            p([
              .text("I'm available for hourly contract "),
              a(
                href: '#hireMe',
                classes:
                    'text-[#FFED4B] hover:text-[#FFF3A1] underline decoration-[#FFED4B]/50 hover:decoration-[#FFF3A1] underline-offset-4 transition-colors duration-150',
                [.text('development and consulting')],
              ),
              .text('.'),
            ]),
          ],
        ),
        _PastClients(),
      ]),
    ]);
  }
}

/// Platform logos (Android, iOS, Flutter, Mac, Chrome).
class _Platforms extends StatelessComponent {
  const _Platforms();

  @override
  Component build(BuildContext context) {
    return const div(
      classes: 'my-12 md:my-16 flex items-center justify-center gap-3.5 sm:gap-5 select-none',
      [
        _PlatformImage('android', 'Android'),
        _PlatformImage('ios', 'iOS'),
        _PlatformImage('flutter', 'Flutter'),
        InlineSvg('icons/mac'),
        InlineSvg('icons/chrome'),
      ],
    );
  }
}

class _PlatformImage extends StatelessComponent {
  const _PlatformImage(this.icon, this.name);

  final String icon;
  final String name;

  @override
  Component build(BuildContext context) {
    return img(
      src: 'images/icons/$icon.webp',
      alt: name,
      classes:
          'w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:-translate-y-0.5',
      attributes: {'title': name},
    );
  }
}

/// Past clients social proof.
class _PastClients extends StatelessComponent {
  const _PastClients();

  @override
  Component build(BuildContext context) {
    return const div(classes: 'mt-14 pt-10 border-t border-white/[0.06]', [
      p(classes: 'text-[11px] font-semibold uppercase tracking-[0.2em] text-[#71717A] mb-8 select-none', [
        .text('SHIPPED FEATURES FOR'),
      ]),
      div(
        classes: 'flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14 md:gap-x-16',
        [
          _Client('ClickUp', logo: 'clickup', gap: 'gap-2.5', nameClasses: 'font-bold tracking-[-0.03em]'),
          _Client('Superlist', logo: 'superlist', nameClasses: 'font-extrabold tracking-[-0.04em]'),
          _Client('Google', logo: 'google', nameClasses: 'font-semibold tracking-[-0.02em]'),
          // The Nest logo is its name.
          _Client('Nest', logo: 'nest', gap: ''),
          _Client('Mezzi', logo: 'mezzi', nameClasses: 'font-bold tracking-[-0.02em]'),
          _Client('Ardley', logo: 'ardley', nameClasses: 'font-semibold tracking-[0.06em] uppercase'),
        ],
      ),
    ]);
  }
}

class _Client extends StatelessComponent {
  const _Client(
    this.name, {
    required this.logo,
    this.gap = 'gap-2',
    this.nameClasses,
  });

  final String name;
  final String logo;
  final String gap;

  /// How to style the name next to the logo, or `null` to only show the logo.
  final String? nameClasses;

  @override
  Component build(BuildContext context) {
    return div(
      classes:
          'group inline-flex items-center $gap text-[#A1A1AA] opacity-70 hover:opacity-100 hover:text-[#F7F8FC] transition-all duration-200 select-none',
      attributes: {'title': name},
      [
        InlineSvg('clients/$logo'),
        if (nameClasses != null) //
          span(classes: 'text-[19px] leading-none $nameClasses', [.text(name)]),
      ],
    );
  }
}
