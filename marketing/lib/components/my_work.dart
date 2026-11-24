import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

import '../content/widgets.dart';
import 'inline_svg.dart';
import 'section_heading.dart';

/// Custom widgets, which run while they're on screen.
///
/// Styles live in styles/tailwind.css under "My Work". Behavior lives in scripts/my_work.js.
class MyWork extends StatelessComponent {
  const MyWork({super.key});

  @override
  Component build(BuildContext context) {
    return section(id: 'myWork', classes: 'pt-[72px] md:pt-[112px] md:pb-[40px]', [
      div(classes: 'container max-w-[1000px] px-[24px] min-[1048px]:px-[0px]', [
        const div(classes: 'text-center', [
          SectionHeading(title: 'My Work', subtitle: 'Custom Flutter Widgets'),
        ]),
        div(classes: 'work', [
          for (final widget in widgets) //
            _WorkItem(widget),
        ]),
      ]),
    ]);
  }
}

class _WorkItem extends StatelessComponent {
  const _WorkItem(this.widget);

  final CustomWidget widget;

  @override
  Component build(BuildContext context) {
    return figure(classes: 'work-item work-item--${widget.key}', [
      div(classes: 'work-tile', [
        video(
          src: 'videos/demo_${widget.key}.mp4',
          poster: 'images/work/${widget.key}.jpg',
          loop: true,
          muted: true,
          preload: Preload.none,
          classes: 'work-video',
          attributes: {'aria-label': '${widget.name} widget, running', 'playsinline': ''},
          [],
        ),
        button(
          type: ButtonType.button,
          classes: 'work-toggle',
          attributes: {'aria-label': 'Play ${widget.name} animation'},
          [const InlineSvg('icons/play-pause')],
        ),
      ]),
      figcaption(classes: 'work-caption', [
        h3(classes: 'work-name', [.text('${widget.name}.')]),
        p(classes: 'work-description', [.text(widget.description)]),
        const br(),
        a(
          href: 'https://www.youtube.com/watch?v=${widget.episode}',
          target: Target.blank,
          classes: 'work-link',
          attributes: {'rel': 'noopener', 'data-play': widget.episode},
          [.text('Watch me build it')],
        ),
      ]),
    ]);
  }
}
