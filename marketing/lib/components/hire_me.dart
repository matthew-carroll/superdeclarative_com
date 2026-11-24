import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

import 'inline_svg.dart';
import 'section_heading.dart';

class HireMe extends StatelessComponent {
  const HireMe({super.key});

  @override
  Component build(BuildContext context) {
    return const section(id: 'hireMe', classes: 'overflow-x-clip pt-[96px] md:pt-[192px] pb-[120px] md:pb-[240px]', [
      div(classes: 'container max-w-[1000px] px-[24px] md:px-[0px]', [
        div(classes: 'text-center', [
          SectionHeading(title: 'Hire Me', subtitle: 'Available for Hourly Work'),
        ]),
        div(
          classes:
              'mt-24 md:mt-28 flex flex-col sm:flex-row items-center justify-center gap-16 sm:gap-32 sm:-translate-x-6',
          [
            div(classes: 'relative flex items-center justify-center shrink-0', [
              _Map(),
              img(
                src: 'images/hero-avatar-light.webp',
                loading: MediaLoading.lazy,
                alt: 'Matt Carroll',
                classes:
                    'relative z-10 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-[#141417] object-cover shrink-0 select-none',
              ),
              _LocationLabel(),
            ]),
            _Details(),
          ],
        ),
      ]),
    ]);
  }
}

/// Faded-edge mid-east coast map background.
class _Map extends StatelessComponent {
  const _Map();

  static const _fadeOutEdges =
      'radial-gradient(circle closest-side at 50% 54%, #000 38%, rgba(0,0,0,0.75) 62%, rgba(0,0,0,0.22) 82%, transparent 100%)';

  @override
  Component build(BuildContext context) {
    return const div(
      classes:
          'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[37%] w-[560px] h-[560px] sm:w-[700px] sm:h-[700px] select-none',
      attributes: {
        'aria-hidden': 'true',
        'style': '-webkit-mask-image: $_fadeOutEdges; mask-image: $_fadeOutEdges;',
      },
      [InlineSvg('hire-me-map')],
    );
  }
}

/// Anderson, SC callout label pointing up to the Anderson marker.
class _LocationLabel extends StatelessComponent {
  const _LocationLabel();

  @override
  Component build(BuildContext context) {
    return const div(
      classes:
          'z-20 absolute -bottom-[112px] sm:-bottom-[136px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none whitespace-nowrap',
      [
        div(
          classes:
              'w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-[#FFED4B]/60 mb-1',
          [],
        ),
        div(
          classes:
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141417]/95 border border-[#FFED4B]/35 shadow-[0_8px_20px_rgba(0,0,0,0.6)]',
          [
            span(classes: 'w-1.5 h-1.5 rounded-full bg-[#FFED4B] shadow-[0_0_8px_#FFED4B]', []),
            span(classes: 'text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F7F8FC]', [
              .text('Anderson, SC'),
            ]),
          ],
        ),
      ],
    );
  }
}

class _Details extends StatelessComponent {
  const _Details();

  @override
  Component build(BuildContext context) {
    return const div(classes: 'mt-[100px] sm:mt-0 text-left relative z-10', [
      div(classes: 'text-[#F7F8FC] font-bold text-2xl sm:text-3xl tracking-tight leading-tight', [
        .text('Matt Carroll'),
      ]),
      div(classes: 'mt-1 text-[#D4D4D8] text-lg sm:text-xl font-medium', [.text('Product Engineer')]),
      a(
        href: 'https://x.com/SuprDeclarative',
        target: Target.blank,
        classes:
            'mt-1 inline-block text-[#A1A1AA] hover:text-[#FFED4B] text-base sm:text-lg transition-colors duration-150 no-underline',
        attributes: {'rel': 'noopener'},
        [.text('@SuprDeclarative')],
      ),
      div(classes: 'mt-6', [
        button(
          classes:
              'inline-flex items-baseline gap-1 px-6 py-3 rounded-xl bg-[#FFED4B] hover:bg-[#FFF380] text-[#141417] font-extrabold transition-all duration-200 shadow-[0_0_24px_rgba(255,237,75,0.2)] hover:shadow-[0_0_32px_rgba(255,237,75,0.4)] cursor-pointer border-0',
          attributes: {'onclick': 'openHireMeModal()'},
          [
            span(classes: 'text-2xl sm:text-3xl tracking-tight', [.text(r'$150')]),
            span(classes: 'text-sm sm:text-base font-bold uppercase tracking-wider text-[#141417]/80', [
              .text('/HR'),
            ]),
          ],
        ),
      ]),
    ]);
  }
}
