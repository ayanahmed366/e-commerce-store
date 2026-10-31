RS MODEL - RUSTAM SUPER MART POS (Billing + Khata)

KAISE CHALAYEN
1. Poora folder kisi jagah unzip karein (saari files ek hi folder me rahen).
2. index.html double-click karein (Chrome / Edge behtar hai).
3. Internet chahiye: Tailwind, icons aur fonts abhi online (CDN) se aate hain.
   Billing aur khata ka saara data aap ke browser me (localStorage) save hota hai.

FILES
- index.html  : Billing page (invoice, receipt preview, sales history)
- khata.html  : Customer khata (udhaar ledger)
- common.js   : dono pages ka shared code (storage, khata, backup, settings)
- script.js   : billing logic
- khata.js    : khata logic
- styles.css  : custom + print styles (80mm thermal receipt)
- logo.png    : navbar logo

IMPORTANT
- Data usi browser me rehta hai jis me bill bane. Browser data clear karne se data chala jata hai.
  Roz ya hafte me header ke "Download" (backup) button se backup le lein.
  "Upload" button se backup wapas restore hota hai.
- Khata page ka "Print Statement" A4 par print hota hai, bill 80mm thermal par.
- Shop ka naam, address, phone aur receipt ka footer Settings (gear icon) se badlein.
