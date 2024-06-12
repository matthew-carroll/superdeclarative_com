import 'dart:async';
import 'dart:io';

import 'package:static_shock/static_shock.dart';

Future<void> main(List<String> arguments) async {
  // Configure the static website generator.
  final staticShock = StaticShock()
    // Here, you can directly hook into the StaticShock pipeline. For example,
    // you can copy an "images" directory from the source set to build set:
    ..pick(DirectoryPicker.parse("images"))
    ..pick(DirectoryPicker.parse("videos"))
    ..pick(DirectoryPicker.parse("fonts"))
    // All 3rd party behavior is added through plugins, even the behavior
    // shipped with Static Shock.
    ..plugin(const MarkdownPlugin())
    ..plugin(const JinjaPlugin())
    ..plugin(const PrettyUrlsPlugin())
    ..plugin(const SassPlugin())
    ..plugin(TailwindPlugin(
      input: "source/styles/tailwind.css",
      output: "build/styles/tailwind.css",
    ));

  // Generate the static website.
  await staticShock.generateSite();
}

class TailwindPlugin extends StaticShockPlugin {
  TailwindPlugin({
    required this.input,
    required this.output,
  });

  /// File path to the input file, which contains Tailwind code.
  final String input;

  /// File path to the output file, where Tailwind should write the compiled CSS.
  final String output;

  @override
  void configure(StaticShockPipeline pipeline, StaticShockPipelineContext context) {
    pipeline.finish(_TailwindGenerator(
      input: input,
      output: output,
    ));
  }
}

class _TailwindGenerator implements Finisher {
  const _TailwindGenerator({
    required this.input,
    required this.output,
  });

  /// File path to the input file, which contains Tailwind code.
  final String input;

  /// File path to the output file, where Tailwind should write the compiled CSS.
  final String output;

  @override
  Future<void> execute(StaticShockPipelineContext context) async {
    try {
      context.log.info("Generating Tailwind CSS");
      final result = await Process.run(
        "./tailwindcss",
        ["-i", input, "-o", output],
      );
      if (result.exitCode != 0) {
        context.log.warn("Failed to run Tailwind CSS compilation - exist code: $result.exitCode");
        return;
      }

      context.log.detail("Successfully generated Tailwind CSS: $output");
    } catch (exception, stacktrace) {
      context.log.err("$exception");
      context.log.err("$stacktrace");
    }
  }
}

class TailwindFile {
  const TailwindFile(this.source, this.destination);

  final String source;
  final String destination;
}
