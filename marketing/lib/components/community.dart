import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

import 'packages.dart';
import 'section_heading.dart';
import 'shows.dart';

class Community extends StatelessComponent {
  const Community({super.key});

  @override
  Component build(BuildContext context) {
    return const section(id: 'community', classes: 'pt-[72px] md:pt-[112px] pb-[72px] md:pb-[112px]', [
      div(classes: 'container max-w-[1000px] px-[24px] min-[1048px]:px-[0px]', [
        div(classes: 'text-center', [
          SectionHeading(title: 'Community', subtitle: 'Hosting Shows & Building Packages'),
        ]),
        Shows(),
        Packages(),
      ]),
    ]);
  }
}
