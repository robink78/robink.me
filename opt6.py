from bs4 import BeautifulSoup

for filename in ["index.html", "contact.html", "infographics.html"]:
    with open(filename, "r", encoding="utf-8") as f:
        html = f.read()
    
    # We will use BeautifulSoup to parse and write. 
    # BUT wait, BeautifulSoup already parsed it and balanced the tags!
    # Let's check if app-wrapper contains the main content.
    soup = BeautifulSoup(html, "html.parser")
    app_wrapper = soup.find(id="app-wrapper")
    
    if app_wrapper:
        main_content = soup.find("main")
        footer = soup.find("footer")
        
        # If main and footer are NOT inside app_wrapper, move them inside.
        if main_content and main_content.parent != app_wrapper:
            app_wrapper.append(main_content)
        if footer and footer.parent != app_wrapper:
            app_wrapper.append(footer)
            
        with open(filename, "w", encoding="utf-8") as f:
            f.write(str(soup))
        print(f"Fixed layout for {filename}")
