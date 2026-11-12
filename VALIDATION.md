# Skúšobný plán a kritériá prijatia

Záznam každej skúšky má obsahovať dátum, revíziu dosky, verziu ESP-IDF a Meshtasticu, mapovanie pinov, frekvenciu I²C, napájanie, očakávaný a skutočný výsledok a cestu k snímke analyzátora. Použiť `node --test` pre model.

| Etapa | Skúška | Podmienka pokračovania |
| --- | --- | --- |
| A · XIAO bez HV | Samostatný 3,3 V I²C master, najprv 100 kHz. Overiť ACK na `66`, čítanie `00` a `06`, raz STOP + START, raz repeated START. Opakovať krátke a dlhé čítania, rôzne ukazovatele a reštart. | 1000 po sebe idúcich čítaní `06` bez timeoutov a chybných dát pri vzore `00 00 3C`. Pre širšiu kompatibilitu rovnaký výsledok pri repeated START. |
| B · T096 bez HV | Zapnúť environmentálnu telemetriu, pripojiť target pred štartom hosta. V logu sledovať detekciu a na prijímači pole `radiation`. Zmeniť vzor z `00 00 3C` na `00 00 78`. | Detekcia po opakovanom studenom štarte, prenos čísel 6,0 a 12,0, bez zlyhania ostatných zariadení na I²C. Zaznamenať jednotku, ktorú uvádza klient. |
| C · Počítanie bez HV | Generátor 3,3 V na overenom pulznom vstupe. 1 Hz počas 60 s, potom 0 Hz. Samostatne páry pod a nad holdoffom, presne na hrane limitu a pri hraničnom čase sekundy. Čítať register impulzov medzi vzorkami. | 60 prijatých pulzov, pri 1 Hz a S=65 statická hodnota `553` (`00 02 29`), správne vyprázdňovanie statického okna, bez vplyvu odčítania na CPM. Kritické je overiť, či target eviduje skutočne odoslané bajty. |
| D · Rev. C s HV | Overiť prepojenia bez napájania a mechaniku SBM-20. Skontrolovať vypnutý FET pri štarte a odpojení MCU, nabíjanie a stav CAP_FULL, chybový timeout, ochranu pred nárastom napätia a bezpečné vybitie. Sledovať falošné pulzy synchronizované s HV, potom porovnať s prístrojom pri stabilnom pozadí. | Napätie a signály zodpovedajú doske a trubici. Pri poruche výstup bezpečne vypne. Z nameraných falošných hrán vyplýva prijatý filter. T096 stabilne vysiela a výsledok má zapísaný kalibračný profil a neistotu. |

## Príkazy pre 3,3 V Linux I²C master

`BUS` nastav podľa `i2cdetect -l`. Na samostatnej skúšobnej zbernici spusti:

```sh
i2ctransfer -y "$BUS" w1@0x66 0x00 r2
i2ctransfer -y "$BUS" w1@0x66 0x06
i2ctransfer -y "$BUS" r3@0x66
i2ctransfer -y "$BUS" w1@0x66 0x06 r3
```

Druhý a tretí príkaz napodobnia STOP + START, štvrtý repeated START. Pri zlyhaní najprv skontroluj ACK, smer adresy a poradie bajtov. Na úspešný ACK bez správnych dát nadväzuje kontrola spracovania ukazovateľa, FIFO a latencie targetu. Ak analyzátor vidí správny rámec, ale T096 nevysiela, skontroluj build, štartovaciu detekciu I²C a konfiguráciu environmentálnej telemetrie.
