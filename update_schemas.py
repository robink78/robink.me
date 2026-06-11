import os
import json
from bs4 import BeautifulSoup

files = ["index.html", "about.html", "contact.html", "infographics.html", "terms.html", "privacy.html", "faq.html"]

org_data = {
    "@type": "Organization",
    "@id": "https://robink.me/#organization",
    "name": "ROBINK.ME",
    "url": "https://robink.me",
    "logo": {
        "@type": "ImageObject",
        "url": "https://robink.me/assets/images/robin-bird.jpg",
        "caption": "ROBINK.ME Logo"
    },
    "description": "RobinK, şirketler için otonom yapay zeka ajanları (Hermes Agent) kurulumu, kurumsal iş akışı otomasyonu ve sistem entegrasyonu hizmetleri sunan bir teknoloji ve danışmanlık platformudur.",
    "telephone": "+905555548800",
    "sameAs": [
        "https://x.com/robinkme",
        "https://www.linkedin.com/in/robink-me/"
    ]
}

software_data = {
    "@type": "SoftwareApplication",
    "@id": "https://robink.me/#software",
    "name": "Hermes OS",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Cloud, Linux, Ubuntu, Docker",
    "description": "Şirketler için otonom iş süreçleri işletim sistemi. Kurumsal iş akışlarının, veri entegrasyonlarının ve yapay zeka ajanlarının tek bir merkezde orkestre edilmesini sağlar. RESTful ve GraphQL entegrasyonlarını destekler.",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "TRY",
        "availability": "https://schema.org/ComingSoon"
    },
    "featureList": [
        "Autonomous Workflow Design (SOP to AI-driven processes)",
        "AI Agent Deployment (cognitive task allocation & Hermes Agent)",
        "Process Integration (RESTful & GraphQL API connectivity)",
        "Operational Analytics & Real-time performance monitoring"
    ],
    "releaseNotes": "Ubuntu & Docker tabanlı kalıcı konteyner mimarisi ile 7/24 kesintisiz otonom operasyonlar."
}

for filename in files:
    if not os.path.exists(filename):
        continue
        
    with open(filename, "r", encoding="utf-8") as f:
        html = f.read()
        
    soup = BeautifulSoup(html, "html.parser")
    
    script = soup.find("script", type="application/ld+json")
    if not script:
        print(f"No JSON-LD schema found in {filename}")
        continue
        
    try:
        data = json.loads(script.string)
        if isinstance(data, dict) and "@graph" in data:
            graph = data["@graph"]
            
            # Find and update Organization
            org_index = -1
            for i, item in enumerate(graph):
                if item.get("@type") == "Organization":
                    org_index = i
                    break
            if org_index != -1:
                graph[org_index] = org_data
            else:
                graph.append(org_data)
                
            # If index.html, faq.html, or about.html, make sure SoftwareApplication is included
            if filename in ["index.html", "faq.html", "about.html"]:
                sw_index = -1
                for i, item in enumerate(graph):
                    if item.get("@type") == "SoftwareApplication":
                        sw_index = i
                        break
                if sw_index != -1:
                    graph[sw_index] = software_data
                else:
                    graph.append(software_data)
                    
            # Ensure context is registered at root
            data["@context"] = "https://schema.org"
            
            # Write back
            script.string = "\n" + json.dumps(data, indent=2, ensure_ascii=False).replace('\n', '\n') + "\n"
            
    except Exception as e:
        print(f"Error parsing schema in {filename}:", e)
        
    with open(filename, "w", encoding="utf-8") as f:
        f.write(str(soup))
        
    print(f"Updated JSON-LD schema in {filename}")
