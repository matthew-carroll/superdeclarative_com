import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

import '../content/shows.dart';
import 'inline_svg.dart';

/// Shows and talks, which play in place.
///
/// Styles live in styles/tailwind.css under "Shows". Behavior lives in scripts/shows.js.
class Shows extends StatelessComponent {
  const Shows({super.key});

  @override
  Component build(BuildContext context) {
    return div(classes: 'mt-16 md:mt-20', [
      const h3(classes: 'community-heading', [.text('Shows & talks')]),
      const p(classes: 'community-intro', [
        .text('No secrets here. Watch me build on camera and teach on stage.'),
      ]),
      div(id: 'shows', classes: 'shows', [
        const _Stage(featuredVideo),
        div(classes: 'shows-list', [
          for (final show in shows) //
            _ShowGroup(show),
        ]),
      ]),
    ]);
  }
}

class _Stage extends StatelessComponent {
  const _Stage(this.video);

  final Video video;

  @override
  Component build(BuildContext context) {
    return div(classes: 'shows-stage', [
      div(id: 'showsScreen', classes: 'shows-screen', [
        a(
          id: 'showsPoster',
          href: video.url,
          target: Target.blank,
          classes: 'shows-poster',
          attributes: {'rel': 'noopener', 'aria-label': 'Play ${video.title}'},
          [
            img(
              src: 'images/live-coding/${video.image}.jpg',
              alt: '',
              width: 1280,
              height: 720,
              loading: MediaLoading.lazy,
            ),
            const InlineSvg('icons/play-video'),
          ],
        ),
      ]),
      div(
        classes: 'shows-caption',
        attributes: {'aria-live': 'polite'},
        [
          div(id: 'showsTitle', classes: 'shows-title', [.text(video.title)]),
          p(id: 'showsDescription', classes: 'shows-description', [.text(video.description)]),
          a(
            id: 'showsLink',
            href: video.url,
            target: Target.blank,
            classes: 'shows-youtube',
            attributes: {'rel': 'noopener'},
            [.text('Watch on YouTube')],
          ),
        ],
      ),
    ]);
  }
}

class _ShowGroup extends StatelessComponent {
  const _ShowGroup(this.show);

  final Show show;

  @override
  Component build(BuildContext context) {
    return div(classes: 'shows-group', [
      h4(classes: 'shows-name', [
        span(classes: 'shows-name-text', [.text(show.name)]),
        button(
          type: ButtonType.button,
          classes: 'shows-expand',
          attributes: {'aria-expanded': 'true'},
          [
            span([.text(show.name)]),
            span(classes: 'shows-count', [
              .text('${show.videos.length}'),
              span(classes: 'visually-hidden', [.text(' videos')]),
            ]),
            const InlineSvg('icons/chevron-down'),
          ],
        ),
      ]),
      div(classes: 'shows-fold', [
        ul(classes: 'shows-videos', [
          for (final video in show.videos) //
            li([_VideoLink(video)]),
        ]),
      ]),
    ]);
  }
}

class _VideoLink extends StatelessComponent {
  const _VideoLink(this.video);

  final Video video;

  @override
  Component build(BuildContext context) {
    return a(
      href: video.url,
      target: Target.blank,
      classes: 'shows-video',
      attributes: {
        'rel': 'noopener',
        'data-video': video.id,
        'data-title': video.title,
        'data-description': video.description,
        if (video == featuredVideo) 'aria-current': 'true',
      },
      [
        img(
          src: 'images/live-coding/${video.image}-small.jpg',
          alt: '',
          width: 256,
          height: 144,
          loading: MediaLoading.lazy,
          classes: 'shows-thumb',
        ),
        span(classes: 'shows-text', [
          span(classes: 'shows-label', [.text(video.label)]),
          span(classes: 'shows-length', [
            if (video.year case final year?) //
              span(classes: 'shows-year', [.text(year)]),
            .text(video.length),
          ]),
        ]),
      ],
    );
  }
}
