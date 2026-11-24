/// A custom Flutter widget, with a video of it running.
class CustomWidget {
  const CustomWidget({
    required this.name,
    required this.key,
    required this.description,
    required this.episode,
  });

  final String name;

  /// Names the widget's video, `web/videos/demo_[key].mp4`, and the video's poster,
  /// `web/images/work/[key].jpg`.
  final String key;

  final String description;

  /// YouTube's ID for the video in which the widget is built, which must be one of the shows.
  final String episode;
}

const widgets = [
  CustomWidget(
    name: 'Nest Protect hero',
    key: 'nest-protect',
    description: 'A smoke detector with a ring that glows and breathes.',
    episode: 'X8Zx9E3IR8A',
  ),
  CustomWidget(
    name: 'Candlestick stock chart',
    key: 'candlestick-chart',
    description: 'Price and volume, painted across six time ranges.',
    episode: 'dOwVPZSJQuo',
  ),
  CustomWidget(
    name: 'Face pile',
    key: 'facepile',
    description: 'Avatars that make room as people come and go.',
    episode: 'slHjGPV-Jfo',
  ),
];
