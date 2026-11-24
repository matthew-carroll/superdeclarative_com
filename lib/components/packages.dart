import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

import '../content/packages.dart';
import 'inline_svg.dart';

/// Open source packages.
///
/// Styles live in styles/tailwind.css under "Packages".
class Packages extends StatelessComponent {
  const Packages({super.key});

  @override
  Component build(BuildContext context) {
    return div(classes: 'mt-20 md:mt-28', [
      const h3(classes: 'community-heading', [.text('Flutter packages')]),
      const p(classes: 'community-intro', [
        .text('I create and maintain open source packages that power production Flutter apps.'),
      ]),
      ul(classes: 'pkg-grid', [
        for (final package in packages) //
          _PackageTile(package),
      ]),
      const _Funding(),
    ]);
  }
}

class _PackageTile extends StatelessComponent {
  const _PackageTile(this.package);

  final Package package;

  @override
  Component build(BuildContext context) {
    return li(classes: 'pkg pkg--${package.package}', [
      a(
        href: package.url,
        target: Target.blank,
        classes: 'pkg-link',
        attributes: {'rel': 'noopener'},
        [
          div(classes: 'pkg-art', [InlineSvg('packages/${package.package}')]),
          div(classes: 'pkg-name', [.text(package.name)]),
          p(classes: 'pkg-desc', [.text(package.description)]),
        ],
      ),
    ]);
  }
}

class _Funding extends StatelessComponent {
  const _Funding();

  @override
  Component build(BuildContext context) {
    return const div(classes: 'pkg-fund', [
      p(classes: 'pkg-fund-text', [
        strong([.text('Every package is free and MIT licensed.')]),
        .text(' Sponsor the upkeep, or fund what your team needs through Flutter Bounty Hunters.'),
      ]),
      div(classes: 'pkg-fund-actions', [
        a(
          href: 'https://github.com/sponsors/matthew-carroll',
          target: Target.blank,
          classes: 'pkg-button',
          attributes: {'rel': 'noopener'},
          [
            InlineSvg('icons/github'),
            .text('Sponsor on GitHub'),
          ],
        ),
        a(
          href: 'https://flutterbountyhunters.com',
          target: Target.blank,
          classes: 'pkg-button',
          attributes: {'rel': 'noopener'},
          [.text('Fund a feature')],
        ),
      ]),
    ]);
  }
}
