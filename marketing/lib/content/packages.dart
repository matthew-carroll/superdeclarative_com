/// An open source package.
class Package {
  const Package({
    required this.name,
    required this.package,
    required this.description,
    required this.url,
  });

  final String name;

  /// The name on Pub, which also names the package's artwork: `svg/packages/[package].svg`.
  final String package;

  final String description;
  final String url;
}

const packages = [
  Package(
    name: 'Super Editor',
    package: 'super_editor',
    description: 'Configurable, extensible rich text editor and document renderer for Flutter.',
    url: 'https://github.com/superlistapp/super_editor',
  ),
  Package(
    name: 'Puck',
    package: 'puck',
    description: 'A floating menu that drags anywhere and springs to the edge of the screen.',
    url: 'https://github.com/Flutter-Bounty-Hunters/puck',
  ),
  Package(
    name: 'Follow the Leader',
    package: 'follow_the_leader',
    description: 'Widgets following widgets across layers and scrollables.',
    url: 'https://github.com/flutter-bounty-hunters/follow_the_leader',
  ),
  Package(
    name: 'Overlord',
    package: 'overlord',
    description: 'An assortment of popovers, menus, and widgets that loom over your content.',
    url: 'https://github.com/flutter-bounty-hunters/overlord',
  ),
  Package(
    name: 'Flutter Test Robots',
    package: 'flutter_test_robots',
    description: 'Easily simulate human behaviors in tests.',
    url: 'https://github.com/flutter-bounty-hunters/flutter_test_robots',
  ),
  Package(
    name: 'Golden Bricks',
    package: 'golden_bricks',
    description: 'A better font for deterministic golden tests.',
    url: 'https://github.com/flutter-bounty-hunters/golden_bricks',
  ),
];
