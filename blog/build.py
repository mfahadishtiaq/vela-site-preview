#!/usr/bin/env python3
"""Build Vela's Blog (DL-089, renamed from Notes by DL-091).

Each post is a plain text file in blog/posts/ (front matter + a small subset of Markdown: paragraphs, "## " headings,
"- " lists, **bold**, *italic*, [links](url)). This script writes:
  blog/<slug>.html    one page per post
  blog/index.html     the list of posts, newest first
  ../index.html       the three newest as cards, between <!-- NOTES:START --> and <!-- NOTES:END -->

Optional front matter "author: Name" (DL-110) gives the post a byline and a reading time instead of the
"Written with AI, checked by our team." line. A "## References" heading styles the list under it as a reference list.

Optional front matter "image: file.jpg" (DL-117) names a photo in ../media/blog/: it fills the post's card on the
blog index and the home page row (in place of the cover word) and sits as a wide photo under the article's header.

Drafts (status: draft) are built with a visible Draft tag so they can be reviewed locally. Before launch, build with
--published-only so only notes Fahad has approved (status: published) appear anywhere.

Run:  python3 build.py            (everything, drafts tagged)
      python3 build.py --published-only
Standard library only.
"""
import html, pathlib, re, sys
from datetime import date

HERE = pathlib.Path(__file__).resolve().parent
POSTS = HERE / "posts"
HOME = HERE.parent / "index.html"
PUBLISHED_ONLY = "--published-only" in sys.argv
MONTHS = "January February March April May June July August September October November December".split()


def read_post(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not m:
        sys.exit(f"{path.name}: missing front matter")
    meta = dict(line.split(":", 1) for line in m.group(1).splitlines() if ":" in line)
    meta = {k.strip(): v.strip() for k, v in meta.items()}
    # Values may come quoted, YAML style (the copywriter's files do, DL-170): drop one pair of surrounding quotes
    meta = {k: v[1:-1].replace('\\"', '"') if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'" else v for k, v in meta.items()}
    for key in ("title", "slug", "date", "cover", "summary", "status"):
        if key not in meta:
            sys.exit(f"{path.name}: front matter needs '{key}'")
    meta["body"] = m.group(2).strip()
    meta["day"] = date.fromisoformat(meta["date"])
    return meta


def nice_date(d):
    return f"{d.day} {MONTHS[d.month - 1]} {d.year}"


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*(?!\*)(.+?)\*", r"<em>\1</em>", s)
    s = re.sub(r"\[([^\[\]]+)\]\(([^)\s]+)\)", lambda m: f'<a href="{html.escape(m.group(2))}">{m.group(1)}</a>', s)
    return s


def ref_item(md):
    """One reference: the printed URL is dropped and the whole entry becomes the link (DL-110 clean-up)."""
    url = None
    m = re.search(r"\s*\[[^\[\]]+\]\(([^)\s]+)\)\s*$", md)
    if m:
        url, md = m.group(1), md[:m.start()]
        md = re.sub(r",?\s*from\s*$", ".", md).rstrip()
    body = inline(md)
    body = re.sub(r"^(.*?\(\d{4}[^)]*\)\.)", r'<span class="ref-who">\1</span>', body, count=1)
    if url:
        return f'<li><a class="ref" href="{html.escape(url)}" target="_blank" rel="noopener">{body}</a></li>'
    return f'<li><span class="ref">{body}</span></li>'


def render_body(md):
    out = []
    refs = False
    for block in re.split(r"\n\s*\n", md):
        lines = block.strip().splitlines()
        if not lines:
            continue
        if lines[0].startswith("## "):
            refs = lines[0][3:].strip().lower() == "references"
            out.append('<h2 id="sources" class="refs-h">Sources</h2><p class="refs-note">Every figure in this article was checked against these sources.</p>' if refs else f"<h2>{inline(lines[0][3:])}</h2>")
            rest = "\n".join(lines[1:]).strip()
            if rest:
                out.append(f"<p>{inline(rest)}</p>")
        elif all(l.startswith("- ") for l in lines):
            if refs:
                out.append('<ul class="refs">' + "".join(ref_item(l[2:]) for l in lines) + "</ul>")
            else:
                out.append("<ul>" + "".join(f"<li>{inline(l[2:])}</li>" for l in lines) + "</ul>")
        else:
            out.append(f"<p>{inline(' '.join(lines))}</p>")
    return "\n".join(out)


def card(p, href):
    draft = '<span class="nr-draft">Draft</span>' if p["status"] != "published" else ""
    cover = (f'<span class="nr-cover nr-photo" aria-hidden="true"><img src="media/blog/{p["image"]}" alt="" loading="lazy"></span>'
             if p.get("image") else f'<span class="nr-cover" aria-hidden="true">{html.escape(p["cover"])}</span>')
    # Author with portrait under the title, as on the Logs cards (Claim 3000's way, DL-173)
    by = ""
    if p.get("author"):
        role, photo = AUTHORS.get(p["author"], ("", ""))
        img = f'<img src="{photo.removeprefix("../")}" alt="" width="40" height="40" loading="lazy">' if photo else ""
        by = (f'<span class="nr-by">{img}<span><b>{html.escape(p["author"])}</b>'
              f'<span class="nr-role">{html.escape(role)}</span></span></span>')
    return (f'<li class="rv"><a class="nr-card" href="{href}">{cover}'
            f'<span class="nr-title">{html.escape(p["title"])}</span>{by}'
            f'<span class="nr-meta"><time datetime="{p["date"]}">{nice_date(p["day"])}</time>'
            f'<span aria-hidden="true">·</span><span>{mins(p)} min read</span>{draft}</span>'
            f'<span class="nr-sum">{html.escape(p["summary"])}</span></a></li>')


HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="icon" href="../media/logo/favicon.svg" type="image/svg+xml">
<link rel="icon" href="../media/logo/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="../media/logo/apple-touch-icon.png">
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet"><!-- DL-126: Geist for headings and body -->
<link rel="stylesheet" href="../menu.css"><!-- DL-128: Products menu -->
<link rel="stylesheet" href="notes.css">
</head>
<body>
<!-- Generated by blog/build.py from blog/posts/. Edit the post file, not this page. -->
<header class="top" id="top">
  <div class="row">
    <a class="logo" href="../index.html" aria-label="Vela Systems home"><img src="../media/logo/vela-logo.svg" alt="" width="118" height="40"></a>
    <nav aria-label="Main">
      <a class="nav-prod" href="../products.html">Products</a>
      <a href="../systems.html">Systems</a>
      <a href="../marketing.html">Marketing</a>
      <a href="index.html">Blogs</a>
      <a href="../index.html#who">About</a>
    </nav>
    <a class="btn btn-rasp cta" href="../contact.html">Talk to us</a>
  </div>
</header>
<main>
"""

FOOT = """</main>
<footer>
  <div class="wrap">
    <div class="top-row">
      <div><a class="logo" href="../index.html" aria-label="Vela Systems home"><img src="../media/logo/vela-logo.svg" alt="" width="118" height="40"></a><p class="tag">AI systems and marketing for owner-run businesses.</p></div>
      <div><h4>Pages</h4><ul><li><a href="../products.html">Products</a></li><li><a href="../systems.html">Systems</a></li><li><a href="../marketing.html">Marketing</a></li><li><a href="index.html">Blogs</a></li><li><a href="../index.html#who">About</a></li><li><a href="../contact.html">Contact</a></li></ul></div>
      <div><h4>Contact</h4><ul><li>Email: to come</li><li>Ontario, Canada</li></ul></div>
    </div>
    <div class="legal"><span>© 2026 Vela · velasystems.ca</span></div>
  </div>
</footer>
<script>
(() => {
  const top = document.getElementById('top');
  const setTop = () => top.classList.toggle('up', scrollY > 30);
  addEventListener('scroll', setTop, {passive:true}); setTop();
  const rv = [...document.querySelectorAll('.rv')];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) rv.forEach(e => e.classList.add('in'));
  else { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); e.target.classList.add('in'); } })); rv.forEach(e => io.observe(e)); }
  window.__revealAll = () => rv.forEach(e => e.classList.add('in'));
})();
</script>
<script src="../menu.js" defer></script>
</body>
</html>
"""

CLOSING = """<section class="note-talk">
  <div class="wrap center">
    <h2 class="h2">Tell us what takes your time.</h2>
    <p class="lede">One conversation, then a short written plan of what we would take off your desk first.</p>
    <p class="go"><a class="btn btn-rasp" href="../contact.html">Talk to us <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg></a></p>
  </div>
</section>
"""


AUTHORS = {
    # name: (role, portrait relative to blog/)
    "Fahad Ishtiaq": ("Founder, Vela", "../media/people/fahad-ishtiaq-sketch.jpg"),  # pencil sketch, DL-176
}
ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>'


def words(md):
    body = md.split("## References")[0]
    return len(re.findall(r"[A-Za-z0-9']+", body))


def mins(p):
    return max(1, round(words(p["body"]) / 230))


def author_block(p, size="lg"):
    """'Written by', portrait, name and role (after Claim 3000's guides, DL-111)."""
    name = p.get("author")
    if not name:
        return ""
    role, photo = AUTHORS.get(name, ("", ""))
    img = f'<img src="{photo}" alt="" width="64" height="64">' if photo else ""
    label = '<span class="art-by-l">Written by</span>' if size == "lg" else ""
    return (f'<div class="art-by art-by-{size}">{label}<span class="art-author">{img}'
            f'<span><b>{html.escape(name)}</b><span class="art-role">{html.escape(role)}</span></span></span></div>')


def gate(p):
    return '<span class="art-gate">Draft: awaiting Fahad\'s approval</span>' if p["status"] != "published" else ""


def meta_line(p):
    verb = "Published" if p["status"] == "published" else "Drafted"
    parts = [f'{verb} <time datetime="{p["date"]}">{nice_date(p["day"])}</time>', f'{mins(p)} min read']
    if not p.get("author"):
        parts.append("Written with AI, checked by our team")
    return '<p class="art-meta">' + '<span class="art-dot" aria-hidden="true"></span>'.join(f"<span>{x}</span>" for x in parts) + "</p>"


def photo(p):
    return f'<figure class="art-photo"><img src="../media/blog/{p["image"]}" alt=""></figure>' if p.get("image") else ""


def jpeg_size(path):
    """Width and height of a JPEG, read from its header (standard library only; DL-178)."""
    data = pathlib.Path(path).read_bytes()
    i = 2
    while i < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            h = int.from_bytes(data[i + 5:i + 7], "big")
            w = int.from_bytes(data[i + 7:i + 9], "big")
            return w, h
        i += 2 + int.from_bytes(data[i + 2:i + 4], "big")
    return 3, 2


def post_page(p):
    if p.get("image"):
        # DL-177: the post's photo is a hero banner behind the title (rounded panel, title and date bottom left in white
        # over a soft shade); the "Written by" byline sits under it, since the sketch portrait is drawn on white
        # DL-180: a wide banner photo (media/blog/wide/<image>, about 21:9) if there is one, else the card photo;
        # on desktop the banner takes the photo's exact shape at full width (see notes.css)
        wide = HERE.parent / "media" / "blog" / "wide" / p["image"]
        src = f'../media/blog/wide/{p["image"]}' if wide.exists() else f'../media/blog/{p["image"]}'
        w, h = jpeg_size(wide if wide.exists() else HERE.parent / "media" / "blog" / p["image"])
        head = f"""<header class="art-hero" style="--ar:{w}/{h}">
    <img src="{src}" alt="">
    <div class="art-hero-in">
      <h1 class="art-h1">{html.escape(p["title"])}</h1>
      {meta_line(p)}
    </div>
  </header>
  <div class="art-head art-head-after">
    {author_block(p)}
    {gate(p)}
  </div>"""
    else:
        head = f"""<header class="art-head">
    <h1 class="art-h1">{html.escape(p["title"])}</h1>
    {author_block(p)}
    {meta_line(p)}
    {gate(p)}
  </header>"""
    return (HEAD.format(title=f'{html.escape(p["title"])} · Vela', desc=html.escape(p["summary"], quote=True)) +
            f"""<article class="art{' art-has-hero' if p.get('image') else ''}">
  {head}
  <div class="note-body art-body">
{render_body(p["body"])}
  </div>
  <p class="art-back"><a class="btn btn-line" href="index.html">All posts</a></p>
</article>
""" + CLOSING + FOOT)


def index_card(p, n):
    """A blog card after Claim 3000's guide cards: cover, title, author, date, intro, link (no "Post 01" number tag, DL-171)."""
    href = f'{p["slug"]}.html'
    by = author_block(p, size="sm") or '<div class="art-by art-by-sm"><span class="art-role">Written with AI, checked by our team</span></div>'
    return (f'<li class="ga-card rv"><a class="ga-link" href="{href}">'
            f'<span class="ga-cover{" ga-photo" if p.get("image") else ""}" aria-hidden="true">'
            + (f'<img src="../media/blog/{p["image"]}" alt="" loading="lazy">' if p.get("image") else f'<span class="ga-word">{html.escape(p["cover"])}</span>')
            + '</span>'
            f'<span class="ga-in"><span class="ga-h">{html.escape(p["title"])}</span>{by}'
            f'<span class="ga-date">{nice_date(p["day"])} · {mins(p)} min read</span>'
            f'<span class="ga-intro">{html.escape(p["summary"])}</span>'
            f'<span class="ga-go">Read the post <i></i></span>{gate(p)}</span></a></li>')


def index_page(posts):
    cards = "\n".join(index_card(p, i + 1) for i, p in enumerate(posts)) or '<li class="note-empty">The first posts are on their way.</li>'
    return (HEAD.format(title="Blogs · Vela", desc="A plain guide to the age of artificial intelligence, from Vela's blogs.") +
            f"""<section class="gi">
  <div class="gi-head">
    <p class="gi-eyebrow">Blogs</p>
    <h1 class="gi-h">A plain guide to the age of artificial intelligence.</h1>
    <p class="gi-lede">Research-led articles on how AI is changing work, business and the economy, and what it means for the people in it.</p>
  </div>
  <ul class="ga">
{cards}
  </ul>
</section>
""" + CLOSING + FOOT)


def main():
    posts = [read_post(f) for f in sorted(POSTS.glob("*.md"))]
    posts = [p for p in posts if p["status"] == "published" or not PUBLISHED_ONLY]
    posts.sort(key=lambda p: (p["day"], p["slug"]), reverse=True)
    for p in posts:
        (HERE / f'{p["slug"]}.html').write_text(post_page(p), encoding="utf-8")
    (HERE / "index.html").write_text(index_page(posts), encoding="utf-8")
    home = HOME.read_text(encoding="utf-8")
    a, b = "<!-- NOTES:START -->", "<!-- NOTES:END -->"
    if a not in home or b not in home:
        sys.exit("home page: NOTES markers not found")
    latest = "\n".join("    " + card(p, f'blog/{p["slug"]}.html') for p in posts[:3])
    block = f'{a}\n    <ul class="nr-grid">\n{latest}\n    </ul>\n    {b}' if posts else f"{a}\n    {b}"
    home = home[:home.index(a)] + block + home[home.index(b) + len(b):]
    HOME.write_text(home, encoding="utf-8")
    drafts = sum(p["status"] != "published" for p in posts)
    print(f"built {len(posts)} posts ({drafts} drafts), the blog index, and the home page row")


if __name__ == "__main__":
    main()
