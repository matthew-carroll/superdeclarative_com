import 'package:jaspr/dom.dart';
import 'package:jaspr/server.dart';

import 'components/community.dart';
import 'components/contact_dialog.dart';
import 'components/hero.dart';
import 'components/hire_me.dart';
import 'components/inline_script.dart';
import 'components/my_work.dart';
import 'components/section_nav.dart';
import 'components/services.dart';

class HomePage extends StatelessComponent {
  const HomePage({super.key});

  @override
  Component build(BuildContext context) {
    return const Component.fragment([
      Document.body(attributes: {'class': 'w-full bg-[#1C1C21] text-[#FFFFFF88]'}),
      ContactDialog(),
      Hero(),
      SectionNav(),
      main_([
        Services(),
        Community(),
        MyWork(),
        HireMe(),
      ]),
      footer([]),

      // These run while the page is parsed, so they must come after the elements they use.
      InlineScript('shows'),
      InlineScript('my_work'),
      script(src: 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js', defer: true),
      InlineScript('emailjs'),
      InlineScript('contact'),
      InlineScript('hero_beam'),
      InlineScript('hero_rings'),
    ]);
  }
}
