# MultiGeiger Rev. C V2 · podklady pre cenovú ponuku

## Návrh konfigurácie

Naceniť **2 plne osadené prototypy Rev. C V2**, prípadne najbližšie vyššie minimum výrobcu, s dodaním na Slovensko. Kontrolná alternatíva je 5 holých PCB. Obyčajný Seeed XIAO ESP32-S3 sa zasunie do pätice pri kompletizácii a použije sa existujúca SBM-20. Zverejnený návrh Rev. C je V2. Hardvérové README uvádza, že výrobné dáta V3 ešte neboli publikované. V2 má výstup impulzov na `D8/GPIO7` a pre upstream firmware vyžaduje najmenej `V2.6.34`. [Hardvérová dokumentácia](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/README.md)

| Parameter | Podklad pre cenovú ponuku |
| --- | --- |
| PCB | 2 vrstvy, približne 95,45 × 31,94 mm podľa obrysu KiCad, hrúbka návrhu 1,6 mm. Overiť podľa náhľadu Gerberov. |
| Pracovné voľby pre cenu | Pevná FR-4, 1 oz vonkajšia meď, zelená maska, bezolovnatý HASL, jednotlivé dosky. Toto sú voľby pre nacenenie. Pred výrobou skontrolovať elektrické odstupy a povrch podľa konkrétnej aplikácie. |
| SMD | Horná strana. `J2` (3,3 V I²C) a `U3` (HV MOSFET). V exporte je aj `J1` (konektor označený I²C 5 V). Pre tento prototyp ho vynechať a overiť túto zmenu v ponuke. |
| THT a ručné práce | Naceniť kondenzátory, diódy, rezistory, tlmivku, päticu U1 a vhodnú montáž trubice. Od výrobcu vyžiadať presný zoznam osadených a neosadených pozícií. |
| Trubica a pätice | SBM-20 sa použije z vlastných zásob. BOM uvádza dva klipy `8040.0003`, jeden na doske a jeden s káblovým návratom k J3. Overiť mechanickú fixáciu, izoláciu a vzdialenosti podľa schémy a puzdra. |
| Osadenie pre SBM-20 | BOM uvádza pre `R3/R4` 2,7 MΩ namiesto 4,7 MΩ pre Si22G. Exportované MPN pri `R3/R4` je pre 4,7 MΩ. Pred nahratím upraviť osadzovací BOM po kontrole schémy a vybrať 2,7 MΩ s vyhovujúcim pracovným a impulzným napätím a rozmermi. |
| Kritické diely | Skontrolovať konkrétne MPN a orientáciu `U3`, `D1/D2`, `D4`, `L1`, `C3/C4` a HV rezistorov. Pri `D3` BOM výslovne uvádza rozdiel medzi hodnotou na doske a odporúčaným dielom. Nahrádzanie iba po kontrole parametrov a schémy. |
| Cena na schválenie | Počet hotových PCBA, počet holých PCB, diely a práce, položky na lokálne osadenie, doprava, DPH/poplatky a termín. Konečná cena a dostupnosť dielov neboli zistené. |

## Overené výrobné súbory

| Vstup | Súbor | Git blob pri analýze |
| --- | --- | --- |
| PCB | [Gerber Files.zip](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/Revision_C/Deliverables/Gerber%20Files.zip) | `d83f6a00d092de442989701df85db0802a599750` |
| Úplný zoznam dielov | [geiger.csv](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/Revision_C/Deliverables/BOM/geiger.csv) | `649142f9c091fd9f3d167426b226897aac10a51f` |
| SMD podmnožina | [SMD-geiger.csv](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/Revision_C/Deliverables/BOM/SMD-geiger.csv) | `ba66a8b6c293901cda40659f97022949110b6545` |
| CPL / Pick and Place | [geiger-all-pos.csv](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/Revision_C/Deliverables/Pick%20And%20Place%20Files/geiger-all-pos.csv) | `bac128b16ca4ad87145b3688d8e675121da4e77e` |
| Schéma | [geiger.pdf](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/Revision_C/Deliverables/Schematic/geiger.pdf) | `0705c726c7ee2769242cfcd9ab3ef05ec7235865` |

Názov `geiger-all-pos.csv` zahŕňa tri pozície `J1`, `J2`, `U3`. Riadky v SMD BOM obsahujú katalógové čísla LCSC, ktoré treba v portáli skontrolovať. V KiCad exporte je strana zapísaná `T` a sú použité záporné súradnice Y aj záporné rotácie. Pred schválením skontrolovať import stĺpcov, jednotky, stranu a skutočnú polohu a orientáciu v náhľade. THT osadenie potrebuje dohodnutý formát podkladov pre ručnú montáž.

## Cesta k cene

1. [JLCPCB PCBA](https://jlcpcb.com/help/article/how-do-i-place-a-pcba-order). Nahrať pôvodný Gerber ZIP, porovnať náhľad, zapnúť osadenie a importovať upravený SMD BOM/CPL. Pre kompletné osadenie treba preveriť [podporu konkrétnych vývodových dielov](https://jlcpcb.com/help/article/pcb-assembly-faqs). Samotný SMD export necháva väčšinu dosky na ručnú montáž.
2. [PCBWay PCBA](https://www.pcbway.com/helpcenter/pcb_assembly_ordering/How_to_Upload_PCB_Assembly_PCBA__Inquiry.html). Použiť plný opravený BOM, CPL a schému s požiadavkou na SMT aj THT a s výnimkami vyššie. Vyžiadať konečnú sumu a zoznam ručných prác. [PCBWay partnerské API](https://api-partner.pcbway.com/PCBWay%20API%20for%20Partners.pdf) opisuje partnerský tok vrátane pridania do košíka. Prístup z tohto prostredia ani podpora tejto konkrétnej PCBA konfigurácie cez API neboli potvrdené.
3. Vyhľadanie dostupných integrácií pre JLCPCB/PCBWay nevrátilo špecializovaný konektor na zákazkovú výrobu. Cenovú ponuku možno pripraviť vo webovom formulári po overení kusovníka. V tomto kroku sa objednávka nezadala.
