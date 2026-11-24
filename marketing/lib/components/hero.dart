import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

import 'inline_svg.dart';

/// The top of the page: a character who conjures rings of icons around a phone.
///
/// The animation lives in scripts/hero_rings.js.
class Hero extends StatelessComponent {
  const Hero({super.key});

  @override
  Component build(BuildContext context) {
    return const header(
      id: 'hero',
      classes:
          'relative overflow-hidden w-full h-screen min-[1200px]:min-h-[725px] min-[1200px]:max-h-[986px] flex flex-col justify-end items-center bg-[#141417]',
      [
        _AppBar(),

        // Concentric 3D Icon Rings
        div(classes: 'pointer-events-none absolute inset-0 z-20', [
          _Ring(
            id: 'heroRing1',
            classes: 'min-[1200px]:top-[593px] w-[500px] min-[1200px]:w-[1749px]',
            [
              _LargeRingIcon('claude', 'Claude'),
              _LargeRingIcon('codex', 'Codex'),
              _LargeRingIcon('antigravity', 'Antigravity'),
              _LargeRingIcon('gemini', 'Gemini'),
              _LargeRingIcon('grok', 'Grok'),
              _LargeRingIcon('grok-bot', 'Grok Bot'),
              _LargeRingIcon('muse', 'Muse'),
              _LargeRingIcon('perplexity', 'Perplexity'),
              _LargeRingIcon('t3', 'T3'),
            ],
          ),
          _Ring(
            id: 'heroRing2',
            classes: 'min-[1200px]:top-[518px] w-[450px] min-[1200px]:w-[1093px]',
            [
              _SmallRingIcon('android-studio', 'Android Studio'),
              _SmallRingIcon('flutter', 'Flutter'),
              _SmallRingIcon('vscode', 'VSCode'),
              _SmallRingIcon('ios', 'iOS'),
              _SmallRingIcon('xcode', 'XCode'),
              _SmallRingIcon('dart', 'Dart'),
              _SmallRingIcon('rive', 'Rive'),
              _SmallRingIcon('android', 'Android'),
            ],
          ),
          _Ring(
            id: 'heroRing3',
            classes: 'min-[1200px]:top-[443px] w-[375px] min-[1200px]:w-[500px]',
            [
              _Heading(),
              _CenterPhone(),
            ],
          ),
        ]),
        _Character(),
      ],
    );
  }
}

/// Transparent seamless app bar.
class _AppBar extends StatelessComponent {
  const _AppBar();

  @override
  Component build(BuildContext context) {
    return const div(
      classes: 'absolute top-0 left-0 right-0 z-50 w-full h-14 px-6 flex items-center justify-between bg-transparent',
      [
        a(
          href: '/',
          classes: 'inline-flex items-center gap-2 no-underline group',
          attributes: {'aria-label': 'SuperDeclarative!'},
          [
            img(
              src: 'images/favicon/android-chrome-256x256.png',
              alt: 'SuperDeclarative',
              classes:
                  'w-7 h-7 rounded-full block object-cover transition-all duration-180 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,237,75,0.35)]',
            ),
            span(classes: 'text-[15px] font-bold tracking-[-0.3px] leading-none select-none', [
              span(classes: 'text-[#F7F8FC]', [.text('Super')]),
              span(classes: 'text-[#FFED4B]', [.text('Declarative!')]),
            ]),
          ],
        ),
      ],
    );
  }
}

class _Ring extends StatelessComponent {
  const _Ring(
    this.children, {
    required this.id,
    required this.classes,
  });

  final String id;
  final String classes;
  final List<Component> children;

  @override
  Component build(BuildContext context) {
    return div(
      id: id,
      classes:
          'hero-orbit-ring absolute top-[calc(100%-253.5px)] left-1/2 -translate-x-1/2 -translate-y-1/2 h-0 $classes',
      attributes: {'data-ring-tilt': '0.22', 'data-ring-speed': '0.35'},
      children,
    );
  }
}

class _LargeRingIcon extends StatelessComponent {
  const _LargeRingIcon(this.icon, this.name);

  final String icon;
  final String name;

  @override
  Component build(BuildContext context) {
    return img(
      src: 'images/icons/$icon.webp',
      alt: name,
      classes: 'hero-ring-icon absolute top-0 left-1/2 w-[76px] h-[76px] will-change-transform select-none',
    );
  }
}

class _SmallRingIcon extends StatelessComponent {
  const _SmallRingIcon(this.icon, this.name);

  final String icon;
  final String name;

  @override
  Component build(BuildContext context) {
    return img(
      src: 'images/icons/$icon.webp',
      alt: name,
      classes:
          'hero-ring-icon absolute top-0 left-1/2 w-[57px] h-[57px] min-[1200px]:w-[76px] min-[1200px]:h-[76px] will-change-transform select-none',
    );
  }
}

/// Hero heading above the iPhone.
class _Heading extends StatelessComponent {
  const _Heading();

  @override
  Component build(BuildContext context) {
    return const div(
      id: 'heroHeadingBlock',
      classes:
          'pointer-events-auto absolute bottom-[245px] left-1/2 -translate-x-1/2 w-screen min-[1200px]:w-max px-6 min-[1200px]:px-0 text-center min-[1200px]:whitespace-nowrap',
      attributes: {'style': 'z-index: 160;'},
      [
        span(
          id: 'heroEnergySubtitle',
          classes: 'block text-[#FFED4B] font-medium text-2xl tracking-wide mb-2 will-change-transform',
          attributes: {'style': 'opacity: 0;'},
          [.text('AI Infused')],
        ),
        h1(
          id: 'heroMainTitle',
          classes:
              'text-white font-bold text-[45px] min-[1200px]:text-6xl tracking-tight leading-tight will-change-transform',
          attributes: {'style': 'opacity: 0;'},
          [.text('App Development')],
        ),
      ],
    );
  }
}

/// Center iPhone (width = 1/4 of small ring diameter, behind the small ring at z-index: 5).
class _CenterPhone extends StatelessComponent {
  const _CenterPhone();

  static const _fadeOutBottom = 'linear-gradient(to bottom, #000 0%, #000 42%, rgba(0,0,0,0.35) 58%, transparent 72%)';

  @override
  Component build(BuildContext context) {
    return const div(
      id: 'heroCenterPhone',
      classes: 'absolute top-[-50px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[125px] select-none',
      attributes: {'style': 'z-index: 5; -webkit-mask-image: $_fadeOutBottom; mask-image: $_fadeOutBottom;'},
      [
        div(
          id: 'heroCenterPhoneSlide',
          classes: 'w-full h-auto will-change-transform',
          attributes: {'style': 'opacity: 0;'},
          [InlineSvg('hero-phone')],
        ),
      ],
    );
  }
}

class _Character extends StatelessComponent {
  const _Character();

  @override
  Component build(BuildContext context) {
    return const div(
      id: 'heroCharacterWrap',
      classes:
          'pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[768px] min-[1200px]:w-[1024px] flex justify-center items-end will-change-transform',
      attributes: {'style': 'opacity: 0;'},
      [
        div(
          classes:
              'pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[1214px] min-[1200px]:w-[1618px] h-[840px] min-[1200px]:h-[1120px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(6,6,12,0.95)_0%,_rgba(8,8,15,0.75)_45%,_rgba(12,12,20,0)_85%)] blur-3xl',
          attributes: {'aria-hidden': 'true'},
          [],
        ),
        img(
          src: 'images/hero_character.webp',
          alt: 'SuperDeclarative Character',
          classes: 'relative z-10 block w-[768px] min-[1200px]:w-[1024px] max-w-none h-auto',
        ),
      ],
    );
  }
}
