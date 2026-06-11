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
    
    style_link = soup.find("link", href="style.css")
    if style_link:
        style_link.insert_before(style_tag)
        style_link["rel"] = "stylesheet"
        if "as" in style_link.attrs: del style_link["as"]
        if "onload" in style_link.attrs: del style_link["onload"]
    with open(filename, "w", encoding="utf-8") as f:
        f.write(str(soup))
        
    print(f"Applied Critical CSS to {filename}")
