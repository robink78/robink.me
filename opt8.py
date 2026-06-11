import os
from bs4 import BeautifulSoup

files = ["index.html", "contact.html", "infographics.html", "about.html", "terms.html", "privacy.html"]

for filename in files:
    if not os.path.exists(filename): continue
    
    with open(filename, "r", encoding="utf-8") as f:
        html = f.read()
        
    soup = BeautifulSoup(html, "html.parser")
    
    # Update About links
    for a in soup.find_all("a", attrs={"data-action": "about"}):
        a["href"] = "about.html"
        
    # Update Terms links
    for a in soup.find_all("a", class_="js-terms-trigger"):
        a["href"] = "terms.html"
        
    # Update Privacy links
    for a in soup.find_all("a", class_="js-privacy-trigger"):
        a["href"] = "privacy.html"
        
    with open(filename, "w", encoding="utf-8") as f:
        f.write(str(soup))
        
    print(f"Updated links in {filename}")
