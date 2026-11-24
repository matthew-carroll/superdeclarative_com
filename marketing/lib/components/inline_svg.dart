import 'dart:io';

import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

/// Renders `svg/[name].svg` directly into the page, so that the stylesheet and scripts can
/// reach the shapes inside of it.
///
/// The file is read when the page is pre-rendered. Nothing is loaded by the browser.
class InlineSvg extends StatelessComponent {
  const InlineSvg(this.name, {super.key});

  final String name;

  @override
  Component build(BuildContext context) {
    return RawText(File('svg/$name.svg').readAsStringSync().trim());
  }
}
