# Strešný uzol SBM-20 · XIAO ESP32 a LoRa

Toto je aktuálne zadanie projektu. Strešný uzol používa XIAO ESP32 s LoRa a existujúcu trubicu SBM-20. Požiadavka na montáž je bez ručného spájkovania SMD. Starší handover opisuje skúšku RadSens cez I²C s T096. Táto skúška je referenciou pre protokol a nie je súčasťou strešného zapojenia. Pred výberom firmvéru overiť presný LoRa modul a sieťový protokol. Podpora rádia SX1262 sama o sebe neurčuje, či ide o LoRaWAN alebo Meshtastic.

## Doska a montáž

- Zverejnený export MultiGeiger Rev. C je V2. Má povinný SMD MOSFET BSP125 a impulzný signál na D8/SCK. Pre konkrétnu kombináciu XIAO ESP32-S3 + Wio-SX1262 upstream uvádza Rev. C V3, ktorá vedie impulz na D7/RX, lebo D8 je súčasťou SPI rádia. Hardvérové README V3 označuje za zatiaľ nezverejnenú. V3 rieši trasu impulzov. Vývodové osadenie tým nie je doložené. [MultiGeiger hardware](https://github.com/MMBytes/MultiGeiger-V2/blob/main/Hardware/README.md) · [Seeed Wio kit](https://wiki.seeedstudio.com/wio_sx1262_with_xiao_esp32s3_kit/)
- Vývodová cesta je samostatný Geiger modul pre SBM-20 s impulzným výstupom do voľného GPIO XIAO. MightyOhm dokumentuje SBM-20 a vyvedený impulz. RH Electronics uvádza vývodovú stavebnicu pre SBM-20 bez trubice. Pri konkrétnom module pred nákupom preveriť dostupnosť, napájanie, logické úrovne výstupu a potrebnú úpravu pre 3,3 V GPIO. [MightyOhm](https://mightyohm.com/blog/products/geiger-counter/) · [RH Electronics](https://www.rhelectronics.store/arduino-ide-geiger-counter-dosimeter-diy-kit-with-lcd)
- Výrobný ZIP a kalkulácia PCBWay z predchádzajúceho kroku patria Rev. C V2. Pre strešný uzol ich nepoužívať ako schválený výrobný návrh.
