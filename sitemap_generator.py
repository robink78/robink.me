import xml.etree.ElementTree as ET
from datetime import datetime

# Register namespace to avoid 'ns0:' prefix
ET.register_namespace('', "http://www.sitemaps.org/schemas/sitemap/0.9")

urlset = ET.Element("urlset")

pages = [
    {"loc": "https://robink.me/", "priority": "1.0"},
    {"loc": "https://robink.me/about.html", "priority": "0.8"},
    {"loc": "https://robink.me/infographics.html", "priority": "0.8"},
    {"loc": "https://robink.me/faq.html", "priority": "0.8"},
    {"loc": "https://robink.me/contact.html", "priority": "0.7"},
    {"loc": "https://robink.me/terms.html", "priority": "0.5"},
    {"loc": "https://robink.me/privacy.html", "priority": "0.5"}
]

current_date = datetime.now().strftime("%Y-%m-%d")

for page in pages:
    url = ET.SubElement(urlset, "url")
    loc = ET.SubElement(url, "loc")
    loc.text = page["loc"]
    lastmod = ET.SubElement(url, "lastmod")
    lastmod.text = current_date
    priority = ET.SubElement(url, "priority")
    priority.text = page["priority"]

tree = ET.ElementTree(urlset)

with open("sitemap.xml", "wb") as f:
    f.write(b"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n")
    tree.write(f, encoding="utf-8", xml_declaration=False)

print("Sitemap generated successfully.")
