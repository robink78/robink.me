import os
from bs4 import BeautifulSoup

filename = "infographics.html"
if not os.path.exists(filename):
    print("infographics.html not found.")
    exit(1)

with open(filename, "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

transcripts = {
    "2026_Operasyonel_Otonomizasyon_Cagi.jpg": {
        "tr": "Yapay zeka odaklı iş dünyasında operasyonel dönüşümün ana evreleri ve gelecek vizyonunu gösteren bu şemada, geleneksel manuel süreçlerin otonom sistemlere devri, 14 adımlı çerçeve ve akıllı karar alma mekanizmaları detaylandırılmaktadır. Ajan-insan işbirliği (Human-in-the-loop) döngüsüyle verimliliğin yatay ve dikey ölçeklenmesi hedeflenmektedir.",
        "en": "In this diagram showing the main phases and future vision of operational transformation in the AI-driven business world, the delegation of traditional manual processes to autonomous systems, the 14-step framework, and smart decision-making mechanisms are detailed. Horizontal and vertical scaling of efficiency is targeted through the agent-human collaboration (Human-in-the-loop) loop."
    },
    "2026_Yapay_Zeka_Ajanlari_Rehberi.jpg": {
        "tr": "Şirketlerdeki farklı departmanlara (Operasyon, İletişim, Veri Analitiği, Entegrasyon vb.) yerleştirilen yapay zeka ajan tiplerini ve görev tanımları açıklamaktadır. Her bir ajan, bilişsel iş yükünü üstlenerek kendi sınırları dahilinde karar alabilme ve sistem araçlarını (API, veritabanı) kullanabilme yeteneğine sahiptir.",
        "en": "Explains the types of AI agents and their job descriptions deployed across different corporate departments (Operations, Communication, Data Analytics, Integration, etc.). Each agent has the ability to make decisions within its boundaries and utilize system tools (APIs, databases) by taking on cognitive workloads."
    },
    "Otonom_Yapay_Zeka_Asistan_Ozellikleri.jpg": {
        "tr": "Bir akıllı ajanın karar alma, entegrasyon ve problem çözme yeteneklerinin mimari dökümüdür. Ajanın hafıza yönetimi (bellek), planlama yeteneği, araç çağırma (tool call) mekanizmaları ve güvenlik sınırları şematize edilmiştir.",
        "en": "Architectural breakdown of an intelligent agent's decision-making, integration, and problem-solving capabilities. The agent's memory management, planning skills, tool calling mechanisms, and security boundaries are diagrammed."
    },
    "Otonom_Is_Gucu_Mimari_Semasi.jpg": {
        "tr": "İnsan-yapay zeka ortak iş gücü modelinin altyapı ve çalışma prensipleri mimarisidir. Ajanların veritabanları, API bağlantı katmanları, mesajlaşma kanalları (Telegram, WhatsApp) ve güvenlik protokolleri (KVKK, GDPR) ile nasıl güvenli bir şekilde entegre olduğu gösterilmektedir.",
        "en": "Infrastructure and operating principles architecture of the collaborative human-AI workforce model. It demonstrates how agents integrate securely with databases, API connection layers, communication channels (Telegram, WhatsApp), and security protocols (KVKK, GDPR)."
    },
    "Otonom_Is_Surecleri_Olceklendirme_Semasi.jpg": {
        "tr": "Otonom süreçlerin şirket geneline yayılması ve verimliliğin yatay/dikey ölçeklenme grafiklerini göstermektedir. Süreçlerin otonomlaşmasıyla zaman maliyetlerinin nasıl azaldığı ve bilişsel görev kapasitesinin nasıl katlanarak arttığı modellenmiştir.",
        "en": "Displays the diffusion of autonomous processes company-wide and the horizontal/vertical scalability curves of efficiency. It models how time costs decrease and cognitive task capacity multiplies exponentially as processes become autonomous."
    }
}

for card in soup.find_all("div", class_="infographic-card"):
    img_path = card.get("data-image", "")
    img_filename = os.path.basename(img_path)
    
    if img_filename in transcripts:
        meta = card.find("div", class_="info-card-meta")
        if not meta:
            continue
            
        # Clean up any class_ elements from the previous run
        for old in meta.find_all("details"):
            old.decompose()
            
        # Create details block
        details = soup.new_tag("details", attrs={"class": "infographic-details"})
        
        summary = soup.new_tag("summary")
        summary.string = "Şema Detayları / Diagram Transcripts"
        details.append(summary)
        
        content = soup.new_tag("div", attrs={"class": "details-content"})
        
        tr_p = soup.new_tag("p", lang="tr")
        tr_strong = soup.new_tag("strong")
        tr_strong.string = "TR: "
        tr_p.append(tr_strong)
        tr_p.append(transcripts[img_filename]["tr"])
        content.append(tr_p)
        
        en_p = soup.new_tag("p", lang="en")
        en_strong = soup.new_tag("strong")
        en_strong.string = "EN: "
        en_p.append(en_strong)
        en_p.append(transcripts[img_filename]["en"])
        content.append(en_p)
        
        details.append(content)
        meta.append(details)

with open(filename, "w", encoding="utf-8") as f:
    f.write(str(soup))
    
print("Infographics transcripts updated with correct class attributes.")
