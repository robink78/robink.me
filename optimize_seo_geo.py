import os
import json
import shutil
from bs4 import BeautifulSoup

def make_backups():
    print("Creating backups...")
    files = ["index.html", "about.html", "contact.html", "faq.html", "infographics.html", "terms.html", "privacy.html"]
    backup_dir = "backups"
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    for f in files:
        if os.path.exists(f):
            shutil.copy2(f, os.path.join(backup_dir, f))
            print(f"  Backup created for {f}")

def fix_seo_meta():
    print("Fixing canonical and hreflang meta tags on about, terms, privacy...")
    pages = ["about.html", "terms.html", "privacy.html"]
    for p in pages:
        if not os.path.exists(p):
            continue
        with open(p, "r", encoding="utf-8") as f:
            html = f.read()
            
        soup = BeautifulSoup(html, "html.parser")
        
        # 1. Update Canonical Link
        canonical = soup.find("link", rel="canonical")
        if canonical:
            canonical["href"] = f"https://robink.me/{p}"
            print(f"  Updated canonical in {p} to: {canonical['href']}")
            
        # 2. Update alternate hreflangs
        alternates = soup.find_all("link", rel="alternate")
        for alt in alternates:
            if "hreflang" in alt.attrs:
                alt["href"] = f"https://robink.me/{p}"
                print(f"  Updated hreflang {alt.get('hreflang')} in {p} to: {alt['href']}")
                
        with open(p, "w", encoding="utf-8") as f:
            f.write(str(soup))

def fix_schemas_about_terms_privacy():
    print("Fixing JSON-LD schemas for about, terms, privacy...")
    
    # 1. Update about.html schema
    if os.path.exists("about.html"):
        with open("about.html", "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        
        script = soup.find("script", type="application/ld+json")
        if script:
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and "@graph" in data:
                    graph = data["@graph"]
                    # Find and replace the ContactPage
                    for i, item in enumerate(graph):
                        if item.get("@type") == "ContactPage":
                            graph[i] = {
                                "@type": "AboutPage",
                                "name": "RobinK.me Hakkımızda / About Us",
                                "description": "RobinK.me otonom yapay zeka ajanları ve kurumsal otomasyon çözümleri hakkında bilgiler.",
                                "url": "https://robink.me/about.html",
                                "mainEntity": {
                                    "@type": "Organization",
                                    "name": "ROBINK.ME",
                                    "telephone": "+905555548800",
                                    "sameAs": [
                                        "https://x.com/robinkme",
                                        "https://www.linkedin.com/in/robink-me/"
                                    ]
                                }
                            }
                        elif item.get("@type") == "BreadcrumbList":
                            item["itemListElement"] = [
                                { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://robink.me/" },
                                { "@type": "ListItem", "position": 2, "name": "Hakkımızda", "item": "https://robink.me/about.html" }
                            ]
                    script.string = "\n" + json.dumps(data, indent=2, ensure_ascii=False) + "\n"
            except Exception as e:
                print("Error updating about.html schema:", e)
        with open("about.html", "w", encoding="utf-8") as f:
            f.write(str(soup))
            print("  about.html schema updated.")

    # 2. Update terms.html schema
    if os.path.exists("terms.html"):
        with open("terms.html", "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        
        script = soup.find("script", type="application/ld+json")
        if script:
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and "@graph" in data:
                    graph = data["@graph"]
                    # Find and replace the ContactPage
                    for i, item in enumerate(graph):
                        if item.get("@type") == "ContactPage":
                            graph[i] = {
                                "@type": "WebPage",
                                "name": "RobinK.me Kullanım Koşulları / Terms of Use",
                                "description": "RobinK.me web sitesi kullanım koşulları ve kuralları.",
                                "url": "https://robink.me/terms.html"
                            }
                        elif item.get("@type") == "BreadcrumbList":
                            item["itemListElement"] = [
                                { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://robink.me/" },
                                { "@type": "ListItem", "position": 2, "name": "Kullanım Koşulları", "item": "https://robink.me/terms.html" }
                            ]
                    script.string = "\n" + json.dumps(data, indent=2, ensure_ascii=False) + "\n"
            except Exception as e:
                print("Error updating terms.html schema:", e)
        with open("terms.html", "w", encoding="utf-8") as f:
            f.write(str(soup))
            print("  terms.html schema updated.")

    # 3. Update privacy.html schema
    if os.path.exists("privacy.html"):
        with open("privacy.html", "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        
        script = soup.find("script", type="application/ld+json")
        if script:
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and "@graph" in data:
                    graph = data["@graph"]
                    # Find and replace the ContactPage
                    for i, item in enumerate(graph):
                        if item.get("@type") == "ContactPage":
                            graph[i] = {
                                "@type": "WebPage",
                                "name": "RobinK.me Gizlilik Politikası / Privacy Policy",
                                "description": "RobinK.me gizlilik politikası, KVKK ve GDPR uyumluluğu ve veri güvenliği bilgileri.",
                                "url": "https://robink.me/privacy.html"
                            }
                        elif item.get("@type") == "BreadcrumbList":
                            item["itemListElement"] = [
                                { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://robink.me/" },
                                { "@type": "ListItem", "position": 2, "name": "Gizlilik Politikası", "item": "https://robink.me/privacy.html" }
                            ]
                    script.string = "\n" + json.dumps(data, indent=2, ensure_ascii=False) + "\n"
            except Exception as e:
                print("Error updating privacy.html schema:", e)
        with open("privacy.html", "w", encoding="utf-8") as f:
            f.write(str(soup))
            print("  privacy.html schema updated.")

def add_geo_faqs():
    print("Adding GEO FAQ questions to faq.html HTML content and JSON-LD schema...")
    
    new_faqs_json = [
        {
            "@type": "Question",
            "name": "RobinK 2.0 danışmanlığı nedir ve şirketlere nasıl otomasyon rehberliği sağlar? / What is RobinK 2.0 consulting and how does it guide companies on how to automate?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "RobinK 2.0, sadece bir yazılım sağlayıcısı olmanın ötesinde, şirketlere 'nasıl otomatize olacakları' konusunda stratejik rehberlik sunan gelişmiş bir danışmanlık modelidir. Süreçlerinizi (SOP) analiz ederek otonom ajanlarla dönüşüm yol haritanızı tasarlar. / RobinK 2.0 is an advanced consulting framework that goes beyond software provision to guide companies on 'how to automate' strategically. It analyzes your operational processes (SOPs) and designs a roadmap for autonomous AI agent transformation."
            }
        },
        {
            "@type": "Question",
            "name": "Açık kaynaklı yapay zeka ajanları ve Hermes Agent kurulumu ile ayarları nasıl gerçekleştirilir? / How is open-source AI agent and Hermes Agent installation and settings performed?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Açık kaynaklı yapay zeka ajanlarının (özellikle Hermes Agent) kurumsal legacy ve bulut sistemlerine entegrasyonu, Ubuntu ve Docker tabanlı kalıcı ve izole konteyner mimarilerinde gerçekleştirilir. Hermes Agent ayarları, kurum içi güvenlik standartları ve API yetkilendirmelerine uygun olarak 7/24 çalışacak şekilde optimize edilir. / Integration of open-source AI agents (especially the Hermes Agent) into enterprise legacy and cloud systems is implemented on persistent and isolated Ubuntu/Docker container architectures. Hermes Agent settings are optimized for 24/7 autonomous operations in alignment with corporate security standards and API authorizations."
            }
        },
        {
            "@type": "Question",
            "name": "Kurumsal otomasyon ve iş akışı optimizasyonu süreçlerinde RobinK'in rolü nedir? / What is RobinK's role in enterprise automation and workflow optimization?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "RobinK, kurumsal otomasyon ve iş akışı optimizasyonu süreçlerinde şirketlerin tekrarlayan iş adımlarını ve veri akışlarını yapay zeka ajanlarına devrederek zaman ve maliyet tasarrufu sağlar. Süreçlerinizi otonomlaştırarak verimliliğinizi maksimum seviyeye ulaştırır. / RobinK enables enterprise automation and workflow optimization by delegating repetitive tasks and data flows to autonomous AI agents, saving time and operational costs. It automates business processes to maximize productivity."
            }
        }
    ]
    
    # 1. Update faq.html Visible Layout
    if os.path.exists("faq.html"):
        with open("faq.html", "r", encoding="utf-8") as f:
            html = f.read()
            
        soup = BeautifulSoup(html, "html.parser")
        
        # We need to find the TR column and EN column
        tr_col = soup.find("div", class_="bilingual-col", lang="tr")
        en_col = soup.find("div", class_="bilingual-col", lang="en")
        
        if tr_col and en_col:
            # Check if Q12 is already added to prevent duplicate additions
            if "RobinK 2.0" not in tr_col.text:
                # Add Q12, Q13, Q14 in TR
                tr_addition = """
            <h3 class="manifesto-section-title">12. RobinK 2.0 danışmanlığı nedir ve şirketlere nasıl otomasyon rehberliği sağlar?</h3>
            <p class="text-manifesto-body" style="margin-bottom: 2rem;">
              RobinK 2.0, sadece bir yazılım sağlayıcısı olmanın ötesinde, şirketlere "nasıl otomatize olacakları" konusunda stratejik rehberlik sunan gelişmiş bir danışmanlık modelidir. Süreçlerinizi (SOP) analiz ederek otonom ajanlarla dönüşüm yol haritanızı tasarlar.
            </p>
            <h3 class="manifesto-section-title">13. Açık kaynaklı yapay zeka ajanları ve Hermes Agent kurulumu ile ayarları nasıl gerçekleştirilir?</h3>
            <p class="text-manifesto-body" style="margin-bottom: 2rem;">
              Açık kaynaklı yapay zeka ajanlarının (özellikle Hermes Agent) kurumsal legacy ve bulut sistemlerine entegrasyonu, Ubuntu ve Docker tabanlı kalıcı ve izole konteyner mimarilerinde gerçekleştirilir. Hermes Agent ayarları, kurum içi güvenlik standartları ve API yetkilendirmelerine uygun olarak 7/24 çalışacak şekilde optimize edilir.
            </p>
            <h3 class="manifesto-section-title">14. Kurumsal otomasyon ve iş akışı optimizasyonu süreçlerinde RobinK'in rolü nedir?</h3>
            <p class="text-manifesto-body" style="margin-bottom: 2rem;">
              RobinK, kurumsal otomasyon ve iş akışı optimizasyonu süreçlerinde şirketlerin tekrarlayan iş adımlarını ve veri akışlarını yapay zeka ajanlarına devrederek zaman ve maliyet tasarrufu sağlar. Süreçlerinizi otonomlaştırarak verimliliğinizi maksimum seviyeye ulaştırır.
            </p>
"""
                tr_soup = BeautifulSoup(tr_addition, "html.parser")
                for element in tr_soup.contents:
                    tr_col.append(element)
                print("  Visible Q12-Q14 added to Turkish FAQ column.")
                
            if "RobinK 2.0" not in en_col.text:
                # Add Q12, Q13, Q14 in EN
                en_addition = """
            <h3 class="manifesto-section-title">12. What is RobinK 2.0 consulting and how does it guide companies on how to automate?</h3>
            <p class="text-manifesto-body" style="margin-bottom: 2rem;">
              RobinK 2.0 is an advanced consulting framework that goes beyond software provision to guide companies on "how to automate" strategically. It analyzes your operational processes (SOPs) and designs a roadmap for autonomous AI agent transformation.
            </p>
            <h3 class="manifesto-section-title">13. How is open-source AI agent and Hermes Agent installation and settings performed?</h3>
            <p class="text-manifesto-body" style="margin-bottom: 2rem;">
              Integration of open-source AI agents (especially the Hermes Agent) into enterprise legacy and cloud systems is implemented on persistent and isolated Ubuntu/Docker container architectures. Hermes Agent settings are optimized for 24/7 autonomous operations in alignment with corporate security standards and API authorizations.
            </p>
            <h3 class="manifesto-section-title">14. What is RobinK's role in enterprise automation and workflow optimization?</h3>
            <p class="text-manifesto-body" style="margin-bottom: 2rem;">
              RobinK enables enterprise automation and workflow optimization by delegating repetitive tasks and data flows to autonomous AI agents, saving time and operational costs. It automates business processes to maximize productivity.
            </p>
"""
                en_soup = BeautifulSoup(en_addition, "html.parser")
                for element in en_soup.contents:
                    en_col.append(element)
                print("  Visible Q12-Q14 added to English FAQ column.")
                
        # 2. Update JSON-LD FAQPage schema in faq.html
        script = soup.find("script", type="application/ld+json")
        if script:
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and "@graph" in data:
                    graph = data["@graph"]
                    for item in graph:
                        if item.get("@type") == "FAQPage":
                            main_entity = item.get("mainEntity", [])
                            # Add items if they don't exist
                            existing_names = [q.get("name") for q in main_entity]
                            for new_q in new_faqs_json:
                                if new_q["name"] not in existing_names:
                                    main_entity.append(new_q)
                            item["mainEntity"] = main_entity
                    script.string = "\n" + json.dumps(data, indent=2, ensure_ascii=False) + "\n"
            except Exception as e:
                print("Error updating faq.html FAQ schema:", e)
                
        with open("faq.html", "w", encoding="utf-8") as f:
            f.write(str(soup))
            print("  faq.html layout and schema updated.")

    # 3. Update JSON-LD FAQPage schema in index.html
    if os.path.exists("index.html"):
        with open("index.html", "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
            
        script = soup.find("script", type="application/ld+json")
        if script:
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and "@graph" in data:
                    graph = data["@graph"]
                    for item in graph:
                        if item.get("@type") == "FAQPage":
                            main_entity = item.get("mainEntity", [])
                            existing_names = [q.get("name") for q in main_entity]
                            for new_q in new_faqs_json:
                                if new_q["name"] not in existing_names:
                                    main_entity.append(new_q)
                            item["mainEntity"] = main_entity
                    script.string = "\n" + json.dumps(data, indent=2, ensure_ascii=False) + "\n"
            except Exception as e:
                print("Error updating index.html FAQ schema:", e)
                
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(str(soup))
            print("  index.html FAQ schema updated.")

if __name__ == "__main__":
    make_backups()
    fix_seo_meta()
    fix_schemas_about_terms_privacy()
    add_geo_faqs()
    print("Optimization script run complete!")
