import os
from bs4 import BeautifulSoup

files = ["index.html", "about.html", "contact.html", "infographics.html", "terms.html", "privacy.html", "faq.html"]

for filename in files:
    if not os.path.exists(filename):
        continue
        
    with open(filename, "r", encoding="utf-8") as f:
        html = f.read()
        
    soup = BeautifulSoup(html, "html.parser")
    
    nav_list = soup.find("ul", class_="nav-links-list")
    if not nav_list:
        print(f"No menu list found in {filename}")
        continue
        
    # Check if FAQ link is already there
    faq_li = None
    for li in nav_list.find_all("li"):
        a = li.find("a")
        if a and ("faq.html" in a.get("href", "") or a.find(string=lambda text: text and "Sıkça Sorulan Sorular" in text)):
            faq_li = li
            break
            
    # Remove old one if exists to insert clean one
    if faq_li:
        faq_li.decompose()
        
    # Create the new menu item
    new_li = soup.new_tag("li")
    
    if filename == "faq.html":
        # Active state on faq page itself
        new_a = soup.new_tag("a", **{"class": "nav-link-item active", "href": "#", "role": "button", "data-action": "close-menu"})
    else:
        new_a = soup.new_tag("a", **{"class": "nav-link-item", "href": "faq.html"})
        
    bracket = soup.new_tag("span", **{"class": "link-bracket"})
    bracket.string = "(S)"
    new_a.append(bracket)
    
    text_span = soup.new_tag("span", **{"class": "link-text"})
    text_span.string = "Sıkça Sorulan Sorular / FAQ"
    new_a.append(text_span)
    
    svg = soup.new_tag("svg", **{"class": "nav-link-sketch", "fill": "none", "viewbox": "0 0 200 20"})
    path = soup.new_tag("path", d="M5 10 C 60 2, 120 2, 195 10", stroke="currentColor", **{"stroke-linecap": "round", "stroke-width": "2"})
    svg.append(path)
    new_a.append(svg)
    
    new_li.append(new_a)
    
    # We want to insert the FAQ item before the "Contact" item (which has bracket (C) or href contact.html)
    contact_li = None
    for li in nav_list.find_all("li"):
        a = li.find("a")
        if a and ("contact.html" in a.get("href", "") or (a.find(string=lambda text: text and "İletişim" in text) and not a.find(string=lambda text: text and "Hakkımızda" in text))):
            contact_li = li
            break
            
    if contact_li:
        contact_li.insert_before(new_li)
    else:
        nav_list.append(new_li)
        
    # Also make sure other pages contact items are set properly (not active on other pages, etc.)
    # For example, on faq.html the contact link should go to contact.html (not close-menu)
    if filename == "faq.html":
        for li in nav_list.find_all("li"):
            a = li.find("a")
            if a and a.get("data-action") == "close-menu" and a != new_a:
                # Revert it to normal link
                if "(C)" in a.text or "İletişim" in a.text:
                    a["href"] = "contact.html"
                    del a["data-action"]
                    del a["role"]
                    if "active" in a["class"]:
                        a["class"].remove("active")
                elif "Hakkımızda" in a.text:
                    a["href"] = "about.html"
                    del a["data-action"]
                    del a["role"]
                    if "active" in a["class"]:
                        a["class"].remove("active")
                elif "İnfografikler" in a.text:
                    a["href"] = "infographics.html"
                    del a["data-action"]
                    del a["role"]
                    if "active" in a["class"]:
                        a["class"].remove("active")
                        
    with open(filename, "w", encoding="utf-8") as f:
        f.write(str(soup))
        
    print(f"Updated navigation menu in {filename}")
