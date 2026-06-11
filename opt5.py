import json

for filename in ["contact.html", "infographics.html"]:
    with open(filename, "r", encoding="utf-8") as f:
        text = f.read()

    start = text.find('<script type="application/ld+json">')
    end = text.find('</script>', start)

    if start != -1 and end != -1:
        json_str = text[start + len('<script type="application/ld+json">'):end].strip()
        try:
            data = json.loads(json_str)
            if isinstance(data, list):
                new_data = {
                    "@context": "https://schema.org",
                    "@graph": data
                }
                # Remove @context from individual items to clean up
                for item in new_data["@graph"]:
                    if "@context" in item:
                        del item["@context"]
                        
                new_json_str = json.dumps(new_data, indent=2, ensure_ascii=False)
                text = text[:start] + '<script type="application/ld+json">\n' + new_json_str + '\n</script>' + text[end+len('</script>'):]
                
                with open(filename, "w", encoding="utf-8") as f:
                    f.write(text)
                print(f"Fixed {filename} JSON-LD to use @graph")
        except Exception as e:
            print(f"Parse error in {filename}:", e)
