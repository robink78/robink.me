from bs4 import BeautifulSoup
import os
import json

files = ["index.html", "contact.html", "infographics.html"]

for filename in files:
    if not os.path.exists(filename):
        continue
    with open(filename, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Let's fix the infographics.html broken JSON-LD
    if filename == "infographics.html":
        # revert the wrong description replacement
        html = html.replace(
            '"description": "Kurumsal otonom iş süreçleri işletim sistemi (Hermes OS) ve yapay zeka ajan entegrasyonu."\n      },\n      {\n        "@type": "BreadcrumbList"',
            '"description": "Otonom süreçlerin şirket geneline yayılması ve verimliliğin yatay/dikey ölçeklenme grafikleri. / Diffusion of autonomous processes company-wide and horizontal/vertical scalability curves of efficiency."\n      }\n    ]\n  }\n  </script>'
        )

    soup = BeautifulSoup(html, "html.parser")

    # Change bilingual-wrapper from div to article
    wrappers = soup.find_all("article", class_="bilingual-wrapper")
    # Actually, the previous script might have left it as `<article...>` with closing `</div>`
    # BeautifulSoup parser often handles mismatched tags gracefully by auto-closing, but let's re-parse properly.
    # To fix it, we should find `<article>` tags, their parents, etc. 
    # Wait, the best way is to rename the name of the tag:
    for wrap in soup.find_all(class_="bilingual-wrapper"):
        wrap.name = "article"

    # Breadcrumbs for contact & infographics
    if filename in ["contact.html", "infographics.html"]:
        scripts = soup.find_all("script", type="application/ld+json")
        for script in scripts:
            try:
                data = json.loads(script.string)
                if "@graph" in data:
                    has_breadcrumb = any(item.get("@type") == "BreadcrumbList" for item in data["@graph"])
                    if not has_breadcrumb:
                        breadcrumb = {
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://robink.me/" },
                                { "@type": "ListItem", "position": 2, "name": "İletişim" if filename == "contact.html" else "İnfografikler", "item": f"https://robink.me/{filename}" }
                            ]
                        }
                        data["@graph"].append(breadcrumb)
                        script.string = "\n  " + json.dumps(data, indent=2, ensure_ascii=False).replace('\n', '\n  ') + "\n  "
            except:
                pass
                
    with open(filename, "w", encoding="utf-8") as f:
        # Avoid bs4 completely rewriting all html formatting, let's just write str(soup)
        # But wait, str(soup) might mess up some things.
        f.write(str(soup))

print("opt2 done")
