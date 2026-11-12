# Kontrakt I²C a dávkový prepočet

Adresa `0x66` je 7-bitová (`0xCC` zápis a `0xCD` čítanie pri dekódovaní surového adresného bajtu). Master pošle jeden bajt ukazovateľa. Target ho zachová cez STOP do nasledujúceho čítania, podporí aj kombinovanú transakciu s repeated START po overení transportu. V rámci jedného čítania sa adresa zvyšuje o 1. V modeli sa pri ďalšom čítaní bez nového zápisu začína od `0x00`. Neplatný ukazovateľ od `0x15` sa mapuje na `0x00`. Bajty za koncom mapy majú hodnotu `FF`.

| Register | Šírka a formát | Správanie |
| --- | --- | --- |
| `00` | 1 B | ID `7D` |
| `01` | 1 B | Verzia emulovaného profilu `04` |
| `02` | 1 B | Nula |
| `03–05` | 3 B BE | Dynamický príkon, 0,1 µR/h na jednotku |
| `06–08` | 3 B BE | Statický príkon, 0,1 µR/h na jednotku |
| `09–0A` | 2 B BE | Impulzy od odčítania, saturácia 65 535. Pri skutočnom prenose aspoň jedného z týchto bajtov odčítať snímok raz. |
| `0B` | 1 B | Rozšírenie podľa GeigerNode. Stav HV v spodnom nibble, počet pokusov v hornom. Pre skúšobný režim nula. |
| `0C` | 1 B | Rozšírená emulácia môže uchovať požiadavku low-power `0/1`. |
| `0D–0F` | 3 B | Nuly |
| `10` | 1 B | Adresa targetu, `66` v prvom builde. Dynamický zápis až po teste prekonfigurovania. |
| `11` | 1 B | HV požiadavka `0/1`. V prvom builde nula a zápis bez účinku. |
| `12–13` | 2 B LE | Citlivosť v imp/µR, predvolené `41 00`. GeigerNode akceptuje `0–510`. Plný profil podporí jeden dvojbajtový aj dva samostatné zápisy. |
| `14` | 1 B | LED `0/1`; v skúšobnom profile vypnutá. |

`BE` znamená najvyšší bajt prvý, `LE` najnižší bajt prvý. Pri čítaní cez `0x09–0x0A` oba bajty patria k tomu istému snímku. Pri nedokončenom prenose pred `0x09` sa nič neodčíta. Na súbeh použiť monotónny súčet impulzov a hranicu posledného úspešného odčítania. Pri saturácii model odčíta celý snímok vrátane presahu a ponechá impulzy, ktoré pribudli počas čítania. Aktualizácia okna počas čítania zmení až ďalší snímok.

Pre `N` akceptovaných impulzov v `T` celých sekundách platí `CPM = 60*N/T`. Hodnota registra je `floor(36000*N/(T*S))`, kde `S` je citlivosť v imp/µR. Nulové `T` alebo `S` dáva nulu. Použiť 64-bitový medzivýsledok a limit 1 440 000 podľa profilu GeigerNode. Statika používa až 300 posledných sekúnd, pri rozbehu delí skutočným počtom celých sekúnd. Model pre dynamiku používa pevné okno do 122 s ako dočasný testovací profil. Pre širšiu zhodu možno pridať adaptívny algoritmus a porovnať ho s reálnym RadSens. Detailné prahy originálu sa nepodarilo overiť.

## Kontrolné rámce

| Zápis ukazovateľa | Čítanie | Príprava / očakávané dáta |
| --- | --- | --- |
| `00` | 2 B | `7D 04` |
| `06` | 3 B | Vložiť testovaciu hodnotu 60 → `00 00 3C` → Meshtastic 6,0 µR/h |
| `06` | 3 B | 13 impulzov za 60 s pri S=65 → `00 00 78` |
| `09` | 2 B | 258 impulzov → `01 02`, po opakovanom zápise `09` → `00 00` |
| `12` | 2 B | `41 00` |
| `14` | 2 B | V skúšobnom builde `00 FF` |
