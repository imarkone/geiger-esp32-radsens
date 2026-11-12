# Geiger ESP32 · SBM-20 · RadSens

> **Aktuálne zadanie** · [Dva moduly v strešnom uzle](Geiger-stresny-uzol.md). XIAO s LoRa komunikuje cez Meshtastic a samostatný ESP32 na MultiGeigeri obsluhuje SBM-20 a emuluje RadSens cez I²C. Staršie odkazy na T096 zachytávajú historickú skúšku.

Projektový handover pre snímač s trubicou SBM-20, XIAO ESP32-S3 a nosnou doskou MultiGeiger Rev. C. XIAO má poskytovať telemetriu po I²C na adrese `0x66`. Hostiteľom je Heltec T096 s Meshtasticom.

## Stav k 12. novembru 2026

- Zdrojový ovládač Meshtasticu číta tri bajty od registra `0x06`. Prvým cieľom je zobraziť na T096 kontrolnú hodnotu `6.0` pri odpovedi `00 00 3C`.
- Balík obsahuje návrh firmvéru, protokol, skúšobný postup, podklady na nacenenie a spustiteľný model protokolu. Na nahratie do XIAO ešte treba doplniť a otestovať ovládač ESP-IDF.
- Pre Rev. C je pracovná voľba zverejnená V2 s obyčajným XIAO ESP32-S3. Mechaniku SBM-20 a rozsah osadenia musí potvrdiť ponuka a skúška.

## Pokračovanie

1. Prečítať [technický handover](HANDOVER.md) a [kontrakt I²C](PROTOCOL.md).
2. Spustiť `node --test` v koreňovom priečinku (Node.js 22+). Model a testy slúžia ako referenčné správanie pre port do C.
3. Postaviť skúšku `bench-i2c` na samostatnom XIAO a prejsť etapy A a B v [testovacom pláne](VALIDATION.md).
4. Súbežne pripraviť cenu Rev. C podľa [výrobného listu](PCB.md). Po doručení urobiť etapy C a D.

[ZIP s pôvodnou štruktúrou priečinkov](geiger-esp32-radsens.zip)
