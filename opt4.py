import json
import re

with open("contact.html", "r", encoding="utf-8") as f:
    text = f.read()

start = text.find('<script type="application/ld+json">')
end = text.find('</script>', start)

if start != -1 and end != -1:
    json_str = text[start + len('<script type="application/ld+json">'):end].strip()
    try:
        data = json.loads(json_str)
        if isinstance(data, dict):
            new_data = [
                data,
                {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://robink.me/" },
                        { "@type": "ListItem", "position": 2, "name": "İletişim", "item": "https://robink.me/contact.html" }
                    ]
                }
            ]
            new_json_str = json.dumps(new_data, indent=2, ensure_ascii=False)
            text = text[:start] + '<script type="application/ld+json">\n' + new_json_str + '\n</script>' + text[end+len('</script>'):]
            
            with open("contact.html", "w", encoding="utf-8") as f:
                f.write(text)
            print("Fixed contact.html")
    except Exception as e:
        print("Parse error", e)
