# Strešný uzol SBM-20 · dva moduly ESP32

Toto je záväzné zadanie projektu. Strešný uzol má dva samostatné moduly a pri montáži sa nemá ručne spájkovať SMD.

```text
SBM-20 → MultiGeiger + samostatný ESP32 → I²C RadSens 0x66 → XIAO s LoRa → Meshtastic
```

| Modul | Úloha |
| --- | --- |
| Samostatný ESP32 na doske MultiGeiger | Riadi vysokonapäťový zdroj pre SBM-20, počíta impulzy a emuluje ClimateGuard RadSens ako I²C target na `0x66`. |
| XIAO s LoRa | Je I²C master. Číta RadSens a odosiela telemetriu cez Meshtastic. |

Oba moduly zdieľajú zem a používajú 3,3 V logiku na SDA a SCL. Presné GPIO na strane XIAO vyberieme podľa konkrétnej varianty rádia a buildu Meshtasticu. Pre emuláciu ostáva referenciou pôvodný kontrakt RadSens vrátane statického registra `0x06`. Staršie odkazy na T096 označujú historickú skúšku hostiteľa.

## Nosná doska pre ESP32 pri trubici

Rev. C V2 má päticu pre obyčajný XIAO ESP32-S3 alebo QT Py ESP32-PICO a jej povinný MOSFET U3 je SMD. Rev. B V2 má väčšiu päticu a tiež SMD BSP125. Rev. A má modul Heltec a v Eagle návrhu je U4 BSP125 v puzdre SOT-223. Všetky tri zverejnené revízie teda obsahujú SMD v časti detektora. [Hardvér MultiGeiger](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/README.md) · [Rev. A PCB](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/Revision_A/geiger-v2.brd) · [Rev. B BOM](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/Revision_B/Deliverables/BOM/geiger.csv) · [Rev. C BOM](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/Revision_C/Deliverables/BOM/SMD-geiger.csv)

Rev. C V3 presúva impulzný vstup, keď je Wio-SX1262 na tom istom ESP32 ako snímač. Pri dvoch oddelených moduloch tento konflikt na doske MultiGeiger nevzniká, takže Rev. C V2 je vhodným kandidátom pre samostatný ESP32 bez rádia. Pre montáž bez ručného SMD spájkovania naceniť Rev. C V2 s predosadeným U3 a podľa použitého pripojenia aj J2. Zvyšok možno osadiť vývodovo a ESP32 vložiť do pätice. J1 sa pre 3,3 V I²C nepoužije.

Pred objednaním potvrdiť výrobcovi rozsah čiastočného osadenia, rozmery a množstvo. Predchádzajúca kalkulácia PCBWay bola na holé dosky. Objednávka nebola zadaná.
