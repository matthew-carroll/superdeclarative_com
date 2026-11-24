/// The entrypoint for pre-rendering the site.
///
/// The site is fully static: it has no Jaspr client components, so this is the only
/// entrypoint, and no Dart is compiled to JavaScript or shipped to visitors.
library;

import 'package:jaspr/dom.dart';
import 'package:jaspr/server.dart';

import 'home_page.dart';
// This file is generated automatically by Jaspr, do not remove or edit.
import 'main.server.options.dart';
import 'site.dart';

void main() {
  Jaspr.initializeApp(options: defaultServerOptions);

  runApp(
    const Document(
      lang: 'en',
      title: siteTitle,
      // No <base>, because with one, the "#section" links would reload the page whenever
      // its URL has a query, e.g., "/?utm_source=x".
      base: null,
      meta: {
        'description': siteDescription,
        'msapplication-TileColor': '#da532c',
        'msapplication-config': '/images/favicon/browserconfig.xml',
        'theme-color': '#141417',

        // Twitter
        'twitter:card': 'summary_large_image',
        'twitter:site': '@SuprDeclarative',
        'twitter:url': '$siteUrl/',
        'twitter:title': siteTitle,
        'twitter:description': siteDescription,
        'twitter:image': _socialImageUrl,
        'twitter:image:alt': _socialImageAlt,
      },
      head: [
        link(rel: 'canonical', href: '$siteUrl/'),

        link(
          rel: 'apple-touch-icon',
          href: '/images/favicon/apple-touch-icon.png',
          attributes: {'sizes': '180x180'},
        ),
        link(
          rel: 'icon',
          type: 'image/png',
          href: '/images/favicon/favicon-32x32.png',
          attributes: {'sizes': '32x32'},
        ),
        link(
          rel: 'icon',
          type: 'image/png',
          href: '/images/favicon/favicon-16x16.png',
          attributes: {'sizes': '16x16'},
        ),
        link(rel: 'manifest', href: '/images/favicon/site.webmanifest'),
        link(rel: 'mask-icon', href: '/images/favicon/safari-pinned-tab.svg', attributes: {'color': '#5bbad5'}),
        link(rel: 'shortcut icon', href: '/images/favicon/favicon.ico'),

        // Open Graph Social Media
        meta(content: '$siteUrl/', attributes: {'property': 'og:url'}),
        meta(content: siteTitle, attributes: {'property': 'og:title'}),
        meta(content: siteDescription, attributes: {'property': 'og:description'}),
        meta(content: _socialImageUrl, attributes: {'property': 'og:image'}),
        meta(content: 'image/jpeg', attributes: {'property': 'og:image:type'}),
        meta(content: '1200', attributes: {'property': 'og:image:width'}),
        meta(content: '630', attributes: {'property': 'og:image:height'}),
        meta(content: _socialImageAlt, attributes: {'property': 'og:image:alt'}),
        meta(content: 'website', attributes: {'property': 'og:type'}),

        // Compiled from styles/tailwind.css.
        link(href: 'styles/tailwind.css', rel: 'stylesheet'),
      ],
      body: HomePage(),
    ),
  );
}

const _socialImageUrl = '$siteUrl/images/social.jpg';
const _socialImageAlt =
    'SuperDeclarative! AI Infused App Development. Flutter, Android, iOS, Mac, and web. A hooded figure with glowing '
    'red eyes stands behind a ring of golden energy that carries the Claude, Codex, Flutter, Antigravity, and Grok Bot '
    'icons.';
