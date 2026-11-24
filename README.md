# SuperDeclarative.com
This is the marketing website for SuperDeclarative! Flutter services.

## Technologies
 * The site is statically generated with [Jaspr](https://jaspr.site). No Dart is shipped to the browser.
 * The site is styled with Tailwind, using the `tailwindcss` (v3) executable in this directory.
 * Emails are sent without a server through Emailjs.

## Where things are
 * **lib/** - The page: its components, and the content that they display.
 * **svg/** and **scripts/** - Artwork and JavaScript that are written directly into the page when it's generated.
 * **styles/** - The source of the stylesheet, which is compiled to `web/styles/tailwind.css`.
 * **web/** - Files that are deployed as they are.

## Develop
Run `dart pub get` once. Then:

 * `tool/serve.sh` runs the site at http://localhost:8080. It uses its own proxy port (5569), so it can run next to
   other Jaspr sites. If 8080 is taken, add `--port 8081`. It warns that there's no `.client.dart` file, which is
   intentional. Reload the browser by hand to see changes.
 * `tool/build.sh` builds the site into `build/jaspr`, the same way that it's built for deployment. It fails with
   "Address already in use" while another Jaspr site is being served from the default proxy port (5567).
