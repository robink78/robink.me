import os
from bs4 import BeautifulSoup

# We will extract lines 1 to 204 from style.css
with open("style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()
    
critical_css = "".join(lines[:204])

files = ["index.html", "contact.html", "infographics.html", "about.html", "terms.html", "privacy.html"]

for filename in files:
    if not os.path.exists(filename): continue
    
    with open(filename, "r", encoding="utf-8") as f:
        html = f.read()
        
    soup = BeautifulSoup(html, "html.parser")
    
    # Check if we already have critical-css
    if soup.find("style", id="critical-css"):
        continue
        
    # Find the <head>
    head = soup.find("head")
    if not head: continue
    
    # Create the inline style tag
    style_tag = soup.new_tag("style", id="critical-css")
    style_tag.string = "\n" + critical_css + "\n"
    
    # Insert it before the style.css link
    style_link = soup.find("link", href="style.css")
    if style_link:
        style_link.insert_before(style_tag)
        
        # Modify the style.css link to be asynchronous
        style_link["rel"] = "preload"
        style_link["as"] = "style"
        style_link["onload"] = "this.onload=null;this.rel='stylesheet'"
        
        # Add a noscript fallback for style.css
        noscript = soup.new_tag("noscript")
        fallback_link = soup.new_tag("link", rel="stylesheet", href="style.css")
        noscript.append(fallback_link)
        style_link.insert_after(noscript)
        
    with open(filename, "w", encoding="utf-8") as f:
        f.write(str(soup))
        
    print(f"Applied Critical CSS to {filename}")
