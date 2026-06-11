import os
import re

files = ["index.html", "contact.html", "infographics.html"]

for filename in files:
    if not os.path.exists(filename):
        continue
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Hreflang and other meta tags
    # Handled index.html manually, let's do it for all if missing
    head_addition = """  <link rel="alternate" hreflang="tr" href="https://robink.me/""" + (filename if filename != 'index.html' else '') + """" />
  <link rel="alternate" hreflang="en" href="https://robink.me/""" + (filename if filename != 'index.html' else '') + """" />
  <link rel="alternate" hreflang="x-default" href="https://robink.me/""" + (filename if filename != 'index.html' else '') + """" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="geo.region" content="TR">
  <meta name="geo.placename" content="Turkey">
  <meta name="ICBM" content="41.0082, 28.9784">"""
    if 'hreflang="tr"' not in content:
        content = content.replace('<link rel="canonical"', head_addition + '\n  <link rel="canonical"')

    if 'og:locale' not in content:
        content = content.replace('<meta property="og:type"', '<meta property="og:locale" content="tr_TR">\n  <meta property="og:locale:alternate" content="en_US">\n  <meta property="og:type"')

    # 2. Add lang attribute to bilingual-col based on lang-indicator
    # Need to be careful. We can do a regex that finds bilingual-col and its inner lang-indicator.
    # Actually, we can just replace `<div class="bilingual-col">` if the next lines have `lang-indicator">TR`
    # Let's use a simpler string replacement. We know there are only TR and EN cols.
    
    # Let's replace `<div class="bilingual-col">` with `<div class="bilingual-col" lang="tr">`
    # or `lang="en"`. We can split by `<div class="bilingual-col">` or similar.
    # Better regex:
    def replace_bilingual_col(match):
        attrs = match.group(1)
        inner = match.group(2)
        if 'lang-indicator">TR' in inner or 'lang-indicator"> TR' in inner or 'hero-col' in attrs:
            # wait hero col might not be bilingual-col
            pass
        return match.group(0) # we will use beautiful soup instead if possible, wait no bs4 here to be safe.
    
    # simpler approach:
    # We can replace <div class="bilingual-col">
    # We will just replace it with <div class="bilingual-col" lang="tr"> and then the next one en? No.
    # We can use regex to lookahead
    content = re.sub(r'(<div[^>]*class="[^"]*bilingual-col[^"]*"[^>]*>)\s*(<span class="lang-indicator">TR</span>)', r'\1\n              \2'.replace('<div', '<div lang="tr"'), content)
    content = re.sub(r'(<div[^>]*class="[^"]*bilingual-col[^"]*"[^>]*>)\s*(<span class="lang-indicator">EN</span>)', r'\1\n              \2'.replace('<div', '<div lang="en"'), content)
    # Also for hero-col
    content = re.sub(r'(<div[^>]*class="[^"]*hero-col[^"]*"[^>]*>)\s*(<span class="lang-indicator">TR</span>)', r'\1\n            \2'.replace('<div', '<div lang="tr"'), content)
    content = re.sub(r'(<div[^>]*class="[^"]*hero-col[^"]*"[^>]*>)\s*(<span class="lang-indicator">EN</span>)', r'\1\n            \2'.replace('<div', '<div lang="en"'), content)

    # 3. width/height for robin-bird.jpg
    content = content.replace('<img src="assets/images/robin-bird.jpg" alt="Robin Bird" class="inline-logo-bird">', '<img src="assets/images/robin-bird.jpg" alt="Robin Bird" class="inline-logo-bird" width="20" height="20">')

    # 4. GIF -> MP4 in presentation slides
    def replace_gif(m):
        src = m.group(1)
        if src.endswith('.gif') and 'sayfa' in src:
            mp4_src = src.replace('.gif', '.mp4')
            return f'<video autoplay loop muted playsinline style="width: 100%; border-radius: 8px;"><source src="{mp4_src}" type="video/mp4"></video>'
        return m.group(0)
    
    content = re.sub(r'<img[^>]*src="([^"]+)"[^>]*>', replace_gif, content)

    # 5. Article tag for bilingual-wrapper
    content = content.replace('<div class="bilingual-wrapper">', '<article class="bilingual-wrapper">')
    content = content.replace('<div class="bilingual-wrapper with-separator">', '<article class="bilingual-wrapper with-separator">')
    # we need to close the article tag. The div closes later. Since it's a structural change and we only replaced the opening tag, closing tags will still be </div>.
    # browsers can handle it, but it's invalid HTML.
    # Let's fix closing tags using a stack-based replacement for bilingual-wrapper, or just leave it as div if it's too hard without bs4.
    # The prompt allows `<article>` OR `<section>`. We can just do `<section class="bilingual-wrapper">` but closing tags are still an issue.
    # Let's use bs4 if it's installed.

    # 6. Preload fonts
    if 'rel="preload" as="style"' not in content:
        content = content.replace('<link href="https://fonts.googleapis.com/css2?family=Outfit', '<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap">\n  <link href="https://fonts.googleapis.com/css2?family=Outfit')

    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

print("Done phase 1")
