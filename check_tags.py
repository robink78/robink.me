from html.parser import HTMLParser
import os

class TagCounter(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = {}
        self.stack = []
        self.errors = []
        # void elements that don't need closing
        self.voids = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def handle_starttag(self, tag, attrs):
        if tag not in self.voids:
            self.stack.append(tag)
        self.tags[tag] = self.tags.get(tag, 0) + 1

    def handle_endtag(self, tag):
        if tag not in self.voids:
            if not self.stack:
                self.errors.append(f"Extra closing tag: {tag}")
            else:
                top = self.stack.pop()
                if top != tag:
                    self.errors.append(f"Mismatched tag: expected {top}, got {tag}")

files = ["index.html", "about.html", "contact.html", "infographics.html", "terms.html", "privacy.html", "faq.html"]

for filename in files:
    if not os.path.exists(filename):
        continue
    parser = TagCounter()
    with open(filename, "r", encoding="utf-8") as f:
        parser.feed(f.read())
        
    print(f"Checking {filename}...")
    print("  Stack size at end:", len(parser.stack))
    if parser.stack:
        print("  Unclosed tags:", parser.stack)
    if parser.errors:
        print("  Errors:")
        for err in parser.errors[:5]: # show first 5 errors
            print("    ", err)
    print()
