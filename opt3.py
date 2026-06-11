import json
import re

with open("contact.html", "r", encoding="utf-8") as f:
    print("Contact snippet:")
    print(f.read().find("BreadcrumbList"))

with open("infographics.html", "r", encoding="utf-8") as f:
    text = f.read()

# fix the broken schema at the end
# The script block is:
# <script type="application/ld+json">
# ...
# </script>,
#         "itemListElement": [ ... ] } }

# Let's extract the valid json before </script>
start = text.find('<script type="application/ld+json">')
end = text.find('</script>', start)

if start != -1 and end != -1:
    json_str = text[start + len('<script type="application/ld+json">'):end].strip()
    try:
        data = json.loads(json_str)
        # It's an ImageGallery. Let's make it an array of schemas instead.
        if isinstance(data, dict) and data.get("@type") == "ImageGallery":
            new_data = [
                data,
                {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://robink.me/" },
                        { "@type": "ListItem", "position": 2, "name": "İnfografikler", "item": "https://robink.me/infographics.html" }
                    ]
                }
            ]
            new_json_str = json.dumps(new_data, indent=2, ensure_ascii=False)
            
            # replace the entire script block and any trailing junk
            # find where the trailing junk ends, it ends before <meta content="default-src ... Content-Security-Policy
            csp_start = text.find('<meta content="default-src', end)
            if csp_start != -1:
                text = text[:start] + '<script type="application/ld+json">\n' + new_json_str + '\n</script>\n' + text[csp_start:]
                
                with open("infographics.html", "w", encoding="utf-8") as f:
                    f.write(text)
                print("Fixed infographics.html")
    except Exception as e:
        print("Parse error", e)
