# Metamodell der sichtbaren Felder

Dieses Dokument fasst die sichtbaren und relevanten Datenfelder der beteiligten Systeme zusammen, basierend auf öffentlichen Informationen und der Systemanalyse.

## Übersicht der Entitäten

| Entität | Beschreibung | Primäres System | Verteilte Systeme |
| :--- | :--- | :--- | :--- |
| **Bewohner** | Stammdaten der Bewohner | Nexus | EasyDOK, Rai LTCF |
| **Mitarbeiter** | Stammdaten und Vertragsdaten | Nexus / Polypoint | Polypoint, Nexus |
| **Dienstplan** | Geplante und geleistete Dienste | Polypoint | - |
| **Pflegedaten** | Planung, Durchführung, Protokolle | EasyDOK | - |
| **Assessment** | Bedarfserklärung und Pflegestufe | Rai LTCF | Nexus (Rückfluss Pflegestufe) |
| **Finanzen** | Rechnungen, Lohn | Nexus | - |

---

## Detaillierte Feldliste pro System

### 1. Nexus (Heimverwaltung - Master)

Zuständig für die zentrale Verwaltung von Bewohnern und Finanzen.

#### Entität: Bewohner (Stamm)
*   `BewohnerID` (Interner Schlüssel)
*   `Name`
*   `Vorname`
*   `Geburtsdatum`
*   `Geschlecht`
*   `Versicherungsnummer` (AHV / VeKa)
*   `Eintrittsdatum`
*   `Austrittsdatum`
*   `ZimmerNummer`
*   `Pflegestufe` (Importiert)
*   `Kostenträger` (Krankenkasse, Kanton)
*   `TaschengeldSaldo`

#### Entität: Finanzen
*   `RechnungsID`
*   `Rechnungsdatum`
*   `Betrag`
*   `Leistungspositionen` (Hotellerie, Pflege, Betreuung)

---

### 2. Polypoint PEP (Einsatzplanung)

Zuständig für die Personalplanung. Aktuell keine Schnittstelle zu Nexus.

#### Entität: Mitarbeiter (Resource)
*   `Personalnummer`
*   `Name`
*   `Vorname`
*   `Kürzel`
*   `Sollstunden` (Vertrag)
*   `Qualifikation` (Skill Level)

#### Entität: Dienst (Shift)
*   `Datum`
*   `Startzeit`
*   `Endzeit`
*   `Pausendauer`
*   `DienstTyp` (F = Früh, S = Spät, N = Nacht, etc.)
*   `Abteilung` / `Kostenstelle`
*   `Status` (Geplant, Ist/Gestempelt)

#### Entität: Absenz
*   `Typ` (Ferien, Krankheit, Unfall)
*   `VonDatum`
*   `BisDatum`

---

### 3. EasyDOK (Pflegedokumentation)

Empfängt Bewohnerdaten aus Nexus. Führt die Pflegeplanung.

#### Entität: Pflegeplanung
*   `Pflegediagnose` (NANDA / POP / Freitext)
*   `Pflegeziel`
*   `Massnahme` (Beschreibung, Intervall)
*   `Durchführungsnachweis` (Datum, Zeit, Handzeichen)

#### Entität: Vitalwerte & Protokolle
*   `Blutdruck` (Sys/Dia)
*   `Puls`
*   `Gewicht`
*   `Blutzucker`
*   `Sturz` (Datum, Ort, Hergang)
*   `Wunde` (Lokalisation, Stadium, Foto)

---

### 4. Rai LTCF (Bedarfserfassung)

Empfängt Bewohnerdaten aus Nexus. Ermittelt den Pflegebedarf.

#### Entität: Assessment (MDS - Minimum Data Set)
*   `AssessmentDatum`
*   `AssessmentGrund` (Eintritt, Halbjährlich, Veränderung)
*   **ADL Scores** (0-4):
    *   `Essen`
    *   `Körperpflege`
    *   `Ankleiden`
    *   `Toilettengang`
    *   `Transfer`
*   **Kognition**:
    *   `CPS` (Cognitive Performance Scale)
    *   `Gedächtnis`
    *   `Entscheidungsfähigkeit`
*   **Weitere Indikatoren**:
    *   `Schmerz` (Häufigkeit, Intensität)
    *   `Stimmung` (Depressionsskala)
    *   `Kontinenz`

#### Entität: Output (Resultat)
*   `RUG-Gruppe` (Resource Utilization Group - z.B. PA1, BA2)
*   `CH-Index` (Punktwert für Abrechnung)
*   `Pflegeaufwand` (Minuten/Tag)
