/// A series of videos.
class Show {
  const Show({required this.name, required this.videos});

  final String name;
  final List<Video> videos;
}

/// A YouTube video.
class Video {
  const Video({
    required this.id,
    required this.title,
    required this.label,
    required this.description,
    this.year,
    required this.length,
    required this.image,
  });

  /// YouTube's ID for the video.
  final String id;

  final String title;

  /// A short title, for the list of videos.
  final String label;

  final String description;
  final String? year;
  final String length;

  /// The name of the thumbnail: `web/images/live-coding/[image].jpg`, and its small
  /// version, `web/images/live-coding/[image]-small.jpg`.
  final String image;

  String get url => 'https://www.youtube.com/watch?v=$id';
}

/// The video that's on the stage when the page opens.
const featuredVideo = Video(
  id: 'lx6hLeEKPjc',
  title: 'Render Kit: Tools, Strategies, and Tips for Building Custom Render Objects',
  label: 'Render objects',
  description: 'Fluttercon USA 2026. Tools to generate and validate your own custom render objects.',
  year: '2026',
  length: '38:32',
  image: 'fluttercon_render-kit',
);

const shows = [
  Show(
    name: 'Fluttercon USA',
    videos: [
      // Newest first, by session date: July 2026, June 26 and 25 2025, September 20 and 19 2024.
      featuredVideo,
      Video(
        id: 'We-7J2TwYF8',
        title: 'How to build a desktop widget kit for Flutter apps',
        label: 'Desktop widget kit',
        description: 'Fluttercon USA 2025. What goes into desktop widgets, with examples from the Lucid widget kit.',
        year: '2025',
        length: '30:11',
        image: 'fluttercon_desktop-widgets',
      ),
      Video(
        id: 'FNfu9l0s-8g',
        title: "Flutter's Golden Age",
        label: "Flutter's Golden Age",
        description: "Fluttercon USA 2025. How golden tests work, why they're difficult, and new tools that help.",
        year: '2025',
        length: '35:15',
        image: 'fluttercon_golden-age',
      ),
      Video(
        id: 'zsx0ZV65dL8',
        title: 'A humble approach to Flutter app architecture',
        label: 'Humble architecture',
        description: 'Fluttercon USA 2024. Stop centralizing! Use humble patterns to decentralize your code.',
        year: '2024',
        length: '18:45',
        image: 'fluttercon_architecture',
      ),
      Video(
        id: 'iiFs4UfEUys',
        title: 'The art of Flutter testing',
        label: 'The art of testing',
        description: 'Fluttercon USA 2024. How to start writing tests, evolve them, and make an existing app testable.',
        year: '2024',
        length: '41:18',
        image: 'fluttercon_testing',
      ),
    ],
  ),
  Show(
    name: 'Built with Flutter',
    videos: [
      Video(
        id: 'uoJqGJ89G74',
        title: 'I code a Flutter app to download Twitter Spaces',
        label: 'Twitter Spaces app',
        description: 'I build Space Pod, a Mac desktop app that turns my weekly Space into a podcast.',
        length: '2:41:21',
        image: 'space-pod_1',
      ),
      Video(
        id: '3R0SEFhkpwQ',
        title: 'I add a custom loading indicator to Space Pod',
        label: 'Loading indicator',
        description: 'I replace the stock Cupertino spinner with an indicator that I paint myself.',
        length: '25:46',
        image: 'space-pod_2',
      ),
      Video(
        id: '-SBHmuxji20',
        title: 'I add an error widget to Space Pod',
        label: 'Error widget',
        description: 'I lay out and animate an error display that stacks up multiple messages.',
        length: '40:26',
        image: 'space-pod_3',
      ),
      Video(
        id: 'dTlwwzi5TM0',
        title: 'I build an audio entrypoint selector for Space Pod',
        label: 'Audio entrypoint',
        description: 'I build a draggable control that picks where a recording should start.',
        length: '53:04',
        image: 'space-pod_4',
      ),
    ],
  ),
  Show(
    name: 'Building Flutter',
    videos: [
      Video(
        id: '7vf-XHHG-y4',
        title: 'To contribute to Flutter start with THIS',
        label: 'Set up to contribute',
        description: 'Taha Tesser and I set up everything you need to work on the Flutter framework.',
        length: '1:17:40',
        image: 'building-flutter_setup',
      ),
      Video(
        id: 'MOtP1U3znY8',
        title: 'This is how you contribute a test to Flutter',
        label: 'Contribute a test',
        description: 'Taha Tesser and I test an API docs example, then submit the pull request.',
        length: '1:13:03',
        image: 'building-flutter_tests',
      ),
    ],
  ),
  Show(
    name: 'Widget Workshop',
    videos: [
      Video(
        id: 'slHjGPV-Jfo',
        title: 'How to build a Face Pile widget in Flutter',
        label: 'Face pile',
        description: 'I build overlapping avatars that come and go as people join and leave a group.',
        length: '1:08:56',
        image: 'ww_face-pile',
      ),
      Video(
        id: 'dOwVPZSJQuo',
        title: 'Flutter Candlestick Stock Chart',
        label: 'Candlestick chart',
        description: 'I paint a candlestick and volume chart, inspired by the Robinhood app.',
        length: '48:21',
        image: 'ww_candlestick-chart',
      ),
      Video(
        id: 'X8Zx9E3IR8A',
        title: 'Nest Protect Hero in Flutter',
        label: 'Nest Protect hero',
        description: 'I recreate the smoke detector animation from the top of the Nest app.',
        length: '39:40',
        image: 'ww_nest-protect',
      ),
    ],
  ),
];
