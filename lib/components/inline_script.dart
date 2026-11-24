import 'dart:io';

import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

/// Renders `scripts/[name].js` directly into the page, as a classic script.
///
/// The file is read when the page is pre-rendered. Nothing is loaded by the browser.
class InlineScript extends StatelessComponent {
  const InlineScript(this.name, {super.key});

  final String name;

  @override
  Component build(BuildContext context) {
    return script(content: '\n${File('scripts/$name.js').readAsStringSync()}');
  }
}
