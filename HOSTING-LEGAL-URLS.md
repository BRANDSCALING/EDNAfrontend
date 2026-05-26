# Hosting setup for public legal URLs

These three URLs **must** return `HTTP/2 200` with the **legal HTML text in the raw response body** (no JavaScript required) for Google Play Console / app store validators to accept them:

- https://www.brandscaling.co.uk/privacy-policy/
- https://www.brandscaling.co.uk/terms-of-service/
- https://www.brandscaling.co.uk/delete-account/

This repo now ships real static HTML files for those routes:

```
public/privacy-policy/index.html
public/terms-of-service/index.html
public/delete-account/index.html
public/robots.txt
public/sitemap.xml
```

Vite copies everything under `public/` into the build output (`build/`) at build time, so after a normal deploy, the bucket will contain `delete-account/index.html`, `privacy-policy/index.html`, and `terms-of-service/index.html` as **real objects**.

> Code change alone is not enough. You also need to apply **one** of the AWS hosting fixes below so the URLs `/.../privacy-policy/` (with the trailing slash) actually resolve to those `index.html` files instead of returning 404 or being rewritten back to the SPA shell.

---

## 1. If the site is on AWS Amplify Hosting

Amplify Hosting's default SPA rewrite (`/<*> → /index.html  200`) makes folder URLs return the SPA shell. You need to add **explicit rewrites for the legal pages BEFORE the SPA catch-all**.

Open **Amplify Console → your app → Hosting → Rewrites and redirects** and add these rules **in this order** (the existing SPA rule must come last):

| Source address                | Target address                          | Type          |
|------------------------------|------------------------------------------|---------------|
| `/privacy-policy/`           | `/privacy-policy/index.html`            | `200 (Rewrite)` |
| `/privacy-policy`            | `/privacy-policy/`                      | `301 (Redirect)` |
| `/terms-of-service/`         | `/terms-of-service/index.html`          | `200 (Rewrite)` |
| `/terms-of-service`          | `/terms-of-service/`                    | `301 (Redirect)` |
| `/delete-account/`           | `/delete-account/index.html`            | `200 (Rewrite)` |
| `/delete-account`            | `/delete-account/`                      | `301 (Redirect)` |
| `</^[^.]+$\|\.(?!(css\|gif\|ico\|jpg\|js\|png\|txt\|svg\|woff\|woff2\|ttf\|map\|json\|html\|xml\|webp\|mp4)$)([^.]+$)/>` | `/index.html` | `200 (Rewrite)` |

Notes:
- The last rule is the standard Vite/React SPA fallback. Make sure `html` and `xml` are in the excluded extensions list so the legal HTML files and the sitemap are not rewritten away.
- Apex domain → www should also be set up (Amplify Console → Domain management). Add the apex domain (`brandscaling.co.uk`) and let Amplify create a permanent redirect to `www.brandscaling.co.uk`.

After saving, redeploy from the Amplify console or push any commit to `main` and wait for the deploy to finish.

---

## 2. If the site is on S3 + CloudFront directly (no Amplify)

You have two solid options. Pick **A** for the cleanest behaviour; **B** is fine as a quick patch.

### Option A &mdash; Use S3 Static Website Hosting endpoint as the CloudFront origin (recommended)

1. **S3 bucket → Properties → Static website hosting → Enable.**
2. **Index document:** `index.html`
3. **Error document:** `index.html` (so unknown paths fall back to the SPA, returning HTTP 200 with `/index.html`).
4. Use the bucket&rsquo;s **website endpoint URL** (e.g. `bucket-name.s3-website-eu-west-1.amazonaws.com`) as the CloudFront origin &mdash; **not** the REST endpoint.
5. The bucket must be world-readable (`s3:GetObject`) or use an OAC compatible with the website endpoint.

With this in place, requests for `/privacy-policy/` are automatically resolved by S3 to `/privacy-policy/index.html` and returned with `HTTP/2 200`.

### Option B &mdash; CloudFront Function that maps folder URLs to `index.html`

In CloudFront, create a **viewer request CloudFront Function** with the code below and associate it with the distribution&rsquo;s default cache behaviour (and any others you need).

```js
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // /delete-account/  ->  /delete-account/index.html
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
    return request;
  }

  // /delete-account  ->  /delete-account/index.html
  if (!uri.includes('.')) {
    request.uri = uri + '/index.html';
    return request;
  }

  return request;
}
```

Then either keep your SPA fallback or replace it with the cleaner setup above. If you keep a 403/404 → `/index.html` (200) custom error response, leave it for routes that genuinely do not exist as static files; the static legal files will resolve before that fallback fires.

### Apex (non-www) → www

In Route 53 / CloudFront / S3, add a permanent redirect (HTTP 301) so:

- `https://brandscaling.co.uk/privacy-policy/` &rarr; `https://www.brandscaling.co.uk/privacy-policy/`
- `https://brandscaling.co.uk/terms-of-service/` &rarr; `https://www.brandscaling.co.uk/terms-of-service/`
- `https://brandscaling.co.uk/delete-account/` &rarr; `https://www.brandscaling.co.uk/delete-account/`

This is usually done by creating a second S3 bucket named `brandscaling.co.uk` with **Static website hosting &rarr; Redirect requests for an object &rarr; Target host name: `www.brandscaling.co.uk`, Protocol: `https`**, fronted by a CloudFront distribution that owns the apex certificate.

---

## 3. After deployment

Run a CloudFront cache invalidation so the new files are picked up immediately:

```
Distribution &rarr; Invalidations &rarr; Create invalidation
Paths: /*
```

Or with the AWS CLI:

```bash
aws cloudfront create-invalidation \
  --distribution-id <YOUR_DIST_ID> \
  --paths "/*"
```

## 4. Validation

Each URL must return `HTTP/2 200` and the **raw HTML** must contain the legal text (not just `<div id="root"></div>`).

```bash
curl -I https://www.brandscaling.co.uk/privacy-policy/
curl -I https://www.brandscaling.co.uk/terms-of-service/
curl -I https://www.brandscaling.co.uk/delete-account/

curl -L https://www.brandscaling.co.uk/privacy-policy/ | head
curl -L https://www.brandscaling.co.uk/terms-of-service/ | head
curl -L https://www.brandscaling.co.uk/delete-account/ | head
```

Expected:

- `HTTP/2 200`
- The response body must contain phrases such as **&ldquo;Privacy policy&rdquo;**, **&ldquo;Brand Scaling Ltd&rdquo;**, **&ldquo;support@brandscaling.co.uk&rdquo;**, **&ldquo;Terms of Service&rdquo;**, and **&ldquo;Delete Your BrandScaling Account&rdquo;** &mdash; not only the React shell.

If any URL still returns `404` or only the SPA shell after deploying and invalidating, re-check that the rewrite rules listed above are in the correct order and that the bucket actually contains `privacy-policy/index.html`, `terms-of-service/index.html`, and `delete-account/index.html` after the latest deploy.
