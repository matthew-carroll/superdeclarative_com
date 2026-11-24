import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

import 'inline_svg.dart';

/// Contact popup.
///
/// Styles live in styles/tailwind.css under "Contact". Behavior lives in scripts/contact.js.
class ContactDialog extends StatelessComponent {
  const ContactDialog({super.key});

  @override
  Component build(BuildContext context) {
    return const dialog(
      id: 'hireMeModal',
      classes: 'contact',
      attributes: {'aria-labelledby': 'contactHeading'},
      [
        div(classes: 'contact-stage', [
          div(
            classes: 'contact-figure',
            attributes: {'aria-hidden': 'true'},
            [
              img(
                src: 'images/hero_character.webp',
                alt: '',
                width: 1024,
                height: 338,
                classes: 'contact-character',
              ),

              // Spans from hand to hand, and charges up as the form is completed
              InlineSvg('contact-ring'),
            ],
          ),
          div(classes: 'contact-card', [
            button(
              type: ButtonType.button,
              id: 'contactClose',
              classes: 'contact-close',
              attributes: {'aria-label': 'Close'},
              [InlineSvg('icons/close')],
            ),
            _ContactForm(),
            _ContactSent(),
          ]),
        ]),
      ],
    );
  }
}

class _ContactForm extends StatelessComponent {
  const _ContactForm();

  @override
  Component build(BuildContext context) {
    return const form(id: 'hireMeForm', classes: 'contact-form', noValidate: true, [
      h2(
        id: 'contactHeading',
        classes: 'contact-heading',
        attributes: {'tabindex': '-1'},
        [
          .text("Let's talk work"),
        ],
      ),
      p(classes: 'contact-intro', [.text("Tell me what you're building and where you need help.")]),
      div(classes: 'contact-fields', [
        div(classes: 'contact-field', [
          label(htmlFor: 'contactName', [.text('Name')]),
          input(
            type: InputType.text,
            id: 'contactName',
            name: 'name',
            attributes: {'autocomplete': 'name', 'aria-describedby': 'contactNameError'},
          ),
          p(id: 'contactNameError', classes: 'contact-error', [.text('Add your name.')]),
        ]),
        div(classes: 'contact-field', [
          label(htmlFor: 'contactEmail', [.text('Email')]),
          input(
            type: InputType.email,
            id: 'contactEmail',
            name: 'email',
            attributes: {'autocomplete': 'email', 'inputmode': 'email', 'aria-describedby': 'contactEmailError'},
          ),
          p(id: 'contactEmailError', classes: 'contact-error', [.text('Enter an email address I can reply to.')]),
        ]),
        div(classes: 'contact-field contact-field--wide', [
          label(htmlFor: 'contactMessage', [.text('What can I help you with?')]),
          textarea(
            id: 'contactMessage',
            name: 'message',
            rows: 4,
            attributes: {'aria-describedby': 'contactMessageError'},
            [],
          ),
          p(id: 'contactMessageError', classes: 'contact-error', [.text('Tell me a little about what you need.')]),
        ]),
      ]),
      p(
        id: 'contactFailure',
        classes: 'contact-failure',
        attributes: {'role': 'alert', 'hidden': ''},
        [
          .text("Your message didn't send, but it's still here. Try again, or message "),
          a(
            href: 'https://x.com/SuprDeclarative',
            target: Target.blank,
            attributes: {'rel': 'noopener'},
            [.text('@SuprDeclarative')],
          ),
          .text(' on X.'),
        ],
      ),
      button(type: ButtonType.submit, id: 'contactSend', classes: 'contact-send', [.text('Send message')]),
    ]);
  }
}

class _ContactSent extends StatelessComponent {
  const _ContactSent();

  @override
  Component build(BuildContext context) {
    return const div(
      id: 'contactSent',
      classes: 'contact-sent',
      attributes: {'hidden': ''},
      [
        h2(
          id: 'contactSentHeading',
          classes: 'contact-heading',
          attributes: {'tabindex': '-1'},
          [
            .text('Message sent'),
          ],
        ),
        p(classes: 'contact-intro', [
          .text('Thanks, '),
          span(id: 'contactSentName', []),
          .text(". I'll reply to "),
          span(id: 'contactSentEmail', classes: 'contact-sent-email', []),
          .text('.'),
        ]),
        button(type: ButtonType.button, id: 'contactDone', classes: 'contact-send', [.text('Done')]),
      ],
    );
  }
}
