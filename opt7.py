import os
from bs4 import BeautifulSoup

base_file = "contact.html"
with open(base_file, "r", encoding="utf-8") as f:
    base_html = f.read()

pages = {
    "about.html": {
        "title": "RobinK.me | Hakkımızda / About Us",
        "desc": "RobinK.me manifesto ve hakkımızda bilgileri.",
        "id_to_extract": "manifesto-drawer", # Wait, in index.html it is manifesto-drawer, wait, no, it's terms-drawer for terms. Let's look at contact.html to extract the contents.
        "heading_tr": "HAKKIMIZDA",
        "heading_en": "ABOUT US"
    },
    "terms.html": {
        "title": "RobinK.me | Kullanım Koşulları / Terms of Use",
        "desc": "RobinK.me kullanım koşulları ve kuralları.",
        "id_to_extract": "terms-drawer",
        "heading_tr": "KULLANIM KOŞULLARI",
        "heading_en": "TERMS OF USE"
    },
    "privacy.html": {
        "title": "RobinK.me | Gizlilik Politikası / Privacy Policy",
        "desc": "RobinK.me gizlilik politikası ve veri koruma.",
        "id_to_extract": "privacy-drawer",
        "heading_tr": "GİZLİLİK POLİTİKASI",
        "heading_en": "PRIVACY POLICY"
    }
}

# The manifesto content is actually in the drawer with id="manifesto-drawer" in index.html
with open("index.html", "r", encoding="utf-8") as f:
    index_soup = BeautifulSoup(f.read(), "html.parser")

for filename, meta in pages.items():
    soup = BeautifulSoup(base_html, "html.parser")
    
    # Update title and meta description
    soup.title.string = meta["title"]
    desc_tag = soup.find("meta", {"name": "description"})
    if desc_tag:
        desc_tag["content"] = meta["desc"]
    
    og_title = soup.find("meta", {"property": "og:title"})
    if og_title: og_title["content"] = meta["title"]
    og_desc = soup.find("meta", {"property": "og:description"})
    if og_desc: og_desc["content"] = meta["desc"]
    og_url = soup.find("meta", {"property": "og:url"})
    if og_url: og_url["content"] = f"https://robink.me/{filename}"
    
    twitter_title = soup.find("meta", {"property": "twitter:title"})
    if twitter_title: twitter_title["content"] = meta["title"]
    twitter_desc = soup.find("meta", {"property": "twitter:description"})
    if twitter_desc: twitter_desc["content"] = meta["desc"]
    twitter_url = soup.find("meta", {"property": "twitter:url"})
    if twitter_url: twitter_url["content"] = f"https://robink.me/{filename}"

    # Extract the content from index.html
    drawer = index_soup.find(id=meta["id_to_extract"])
    content_area = None
    if drawer:
        content_area = drawer.find(class_="manifesto-content")
    
    # Replace the main content in the new file
    main_tag = soup.find("main")
    if main_tag:
        main_tag.clear()
        
        section = soup.new_tag("section", id="content-section", style="padding: 4rem 2rem;")
        
        header_block = soup.new_tag("div", style="max-width: 1000px; margin: 0 auto;")
        
        # We put the content directly
        if content_area:
            header_block.append(content_area)
            
        section.append(header_block)
        main_tag.append(section)
        
    with open(filename, "w", encoding="utf-8") as f:
        f.write(str(soup))
    
    print(f"Created {filename}")
