# Agenten-Richtlinien

## Sprache
Alle Dokumentationen, Kommentare, Beschreibungen und die Kommunikation in diesem Repository müssen auf Deutsch verfasst werden. Technische Bezeichner (z.B. API-Pfade, Schema-Keys) bleiben in Englisch.

## API-Validierung und Dokumentation
Das Repository enthält einen GitHub Actions Workflow, der die OpenAPI-Spezifikation bei jedem Push und Merge validiert.
Bei Pushes auf den `main`-Branch wird automatisch eine menschenlesbare API-Dokumentation generiert und auf GitHub Pages veröffentlicht.

## Zielmarkt
Das Zielland der Applikation ist die Schweiz. Alle fachlichen Anforderungen und Regularien orientieren sich am Schweizer Markt.

## Daten-Verwaltung
Bei jeder Aktualisierung der Excel-Quelldateien (z.B. TARDOC, Ambulante Pauschalen) im Verzeichnis `docs/` muss die Datei `docs/codes.json` neu generiert werden. Hierfür soll ein entsprechendes Skript verwendet werden, um die Maschinenlesbarkeit sicherzustellen.
