export type PhraseCategory = "greetings" | "office" | "shopping" | "dining" | "transit" | "social" | "emergency" | "culture" | "smalltalk";

export interface PhraseData {
  id: string;
  category: PhraseCategory;
  swiss: string;
  standardGerman: string;
  english: string;
  pronunciation: string;
  culturalNote?: string;
  difficulty: 1 | 2 | 3;
}

export const CATEGORY_CONFIG: Record<PhraseCategory, { label: string; color: string; emoji: string }> = {
  greetings: { label: "Greetings", color: "#22c55e", emoji: "👋" },
  office: { label: "Office", color: "#3b82f6", emoji: "💼" },
  shopping: { label: "Shopping", color: "#f59e0b", emoji: "🛍" },
  dining: { label: "Dining", color: "#f97316", emoji: "🍽" },
  transit: { label: "Transit", color: "#06b6d4", emoji: "🚃" },
  social: { label: "Social", color: "#e879f9", emoji: "🎉" },
  emergency: { label: "Emergency", color: "#ef4444", emoji: "🚨" },
  culture: { label: "Culture", color: "#8b5cf6", emoji: "🏔" },
  smalltalk: { label: "Smalltalk", color: "#64748b", emoji: "💬" },
};

export const PHRASES: PhraseData[] = [
  // GREETINGS (10)
  { id: "p-001", category: "greetings", swiss: "Grüezi", standardGerman: "Guten Tag", english: "Hello (formal)", pronunciation: "GROO-et-see", culturalNote: "The most important word in Switzerland. Always greet people.", difficulty: 1 },
  { id: "p-002", category: "greetings", swiss: "Grüezi mitenand", standardGerman: "Guten Tag zusammen", english: "Hello everyone", pronunciation: "GROO-et-see MIT-en-and", culturalNote: "Use when entering a shop or meeting a group.", difficulty: 1 },
  { id: "p-003", category: "greetings", swiss: "Hoi", standardGerman: "Hallo", english: "Hi (informal)", pronunciation: "HOY", difficulty: 1 },
  { id: "p-004", category: "greetings", swiss: "Hoi zäme", standardGerman: "Hallo zusammen", english: "Hi everyone (informal)", pronunciation: "HOY ZAH-meh", difficulty: 1 },
  { id: "p-005", category: "greetings", swiss: "Ade", standardGerman: "Auf Wiedersehen", english: "Goodbye", pronunciation: "AH-deh", difficulty: 1 },
  { id: "p-006", category: "greetings", swiss: "Tschau", standardGerman: "Tschüss", english: "Bye (informal)", pronunciation: "CHOW", difficulty: 1 },
  { id: "p-007", category: "greetings", swiss: "Guete Morge", standardGerman: "Guten Morgen", english: "Good morning", pronunciation: "GOO-teh MOR-geh", difficulty: 1 },
  { id: "p-008", category: "greetings", swiss: "Guete Abig", standardGerman: "Guten Abend", english: "Good evening", pronunciation: "GOO-teh AH-big", difficulty: 1 },
  { id: "p-009", category: "greetings", swiss: "Wie gaats?", standardGerman: "Wie geht es?", english: "How are you?", pronunciation: "WEE GAATS", difficulty: 1 },
  { id: "p-010", category: "greetings", swiss: "Merci vilmal", standardGerman: "Vielen Dank", english: "Thank you very much", pronunciation: "MAIR-see VILL-mal", culturalNote: "Swiss German mixes French 'merci' naturally.", difficulty: 1 },

  // OFFICE (10)
  { id: "p-011", category: "office", swiss: "Ich schaffe bi de Züri Versicherig", standardGerman: "Ich arbeite bei der Zürich Versicherung", english: "I work at Zurich Insurance", pronunciation: "ICH SHAF-feh bee deh ZOO-ri fair-SICH-er-ig", difficulty: 2 },
  { id: "p-012", category: "office", swiss: "Chönd mir en Sitzig mache?", standardGerman: "Können wir ein Meeting machen?", english: "Can we have a meeting?", pronunciation: "KHUND meer en SIT-zig MAH-kheh", difficulty: 2 },
  { id: "p-013", category: "office", swiss: "Das isch guet", standardGerman: "Das ist gut", english: "That's good", pronunciation: "DAS ISH GOOT", difficulty: 1 },
  { id: "p-014", category: "office", swiss: "Ich bi nöi da", standardGerman: "Ich bin neu hier", english: "I'm new here", pronunciation: "ICH BEE NOY DA", difficulty: 1 },
  { id: "p-015", category: "office", swiss: "Wo isch d Kaffimaschine?", standardGerman: "Wo ist die Kaffeemaschine?", english: "Where is the coffee machine?", pronunciation: "WO ISH d KAF-fee-ma-SHEE-neh", culturalNote: "Coffee culture is serious in Swiss offices.", difficulty: 2 },
  { id: "p-016", category: "office", swiss: "Chönd Sie das wiederhole?", standardGerman: "Können Sie das wiederholen?", english: "Can you repeat that?", pronunciation: "KHUND SEE das WEE-der-HO-leh", culturalNote: "Essential phrase when learning!", difficulty: 2 },
  { id: "p-017", category: "office", swiss: "Mir gönd go Zmittag ässe", standardGerman: "Wir gehen Mittagessen", english: "We're going for lunch", pronunciation: "MEER GUND go ZMIT-tag ESS-eh", difficulty: 2 },
  { id: "p-018", category: "office", swiss: "De Sitzigszimmer isch bsetzt", standardGerman: "Der Meetingraum ist besetzt", english: "The meeting room is occupied", pronunciation: "DEH SIT-zigs-ZIM-mer ish BSETZT", difficulty: 3 },
  { id: "p-019", category: "office", swiss: "Ich schaffe vo dihei", standardGerman: "Ich arbeite von zu Hause", english: "I'm working from home", pronunciation: "ICH SHAF-feh fo dee-HAY", difficulty: 2 },
  { id: "p-020", category: "office", swiss: "Schöne Firabig!", standardGerman: "Schönen Feierabend!", english: "Have a nice evening! (end of work)", pronunciation: "SHUH-neh FEER-ah-big", culturalNote: "Said when leaving the office. Very Swiss.", difficulty: 1 },

  // SHOPPING (10)
  { id: "p-021", category: "shopping", swiss: "Was chostet das?", standardGerman: "Was kostet das?", english: "How much does this cost?", pronunciation: "VAS KOSH-tet DAS", difficulty: 1 },
  { id: "p-022", category: "shopping", swiss: "Händ Sie das au grösser?", standardGerman: "Haben Sie das auch größer?", english: "Do you have this bigger?", pronunciation: "HAND SEE das ow GRUS-ser", difficulty: 2 },
  { id: "p-023", category: "shopping", swiss: "Wo isch de Migros?", standardGerman: "Wo ist der Migros?", english: "Where is the Migros?", pronunciation: "WO ISH deh MEE-gros", culturalNote: "Migros and Coop are the two main supermarkets.", difficulty: 1 },
  { id: "p-024", category: "shopping", swiss: "Ich bruche en Sagg", standardGerman: "Ich brauche eine Tüte", english: "I need a bag", pronunciation: "ICH BROO-kheh en SAGG", difficulty: 1 },
  { id: "p-025", category: "shopping", swiss: "Isch das im Aagebot?", standardGerman: "Ist das im Angebot?", english: "Is this on sale?", pronunciation: "ISH das im AH-geh-bot", difficulty: 2 },
  { id: "p-026", category: "shopping", swiss: "Chani mit Charte zahle?", standardGerman: "Kann ich mit Karte zahlen?", english: "Can I pay by card?", pronunciation: "KHAN-ee mit KHAR-teh TSAH-leh", difficulty: 2 },
  { id: "p-027", category: "shopping", swiss: "De Lade macht um achti zue", standardGerman: "Der Laden schließt um acht", english: "The shop closes at eight", pronunciation: "DEH LAH-deh MAKHT um AKH-tee TSOO-eh", culturalNote: "Swiss shops close early! Saturdays often by 5pm.", difficulty: 2 },
  { id: "p-028", category: "shopping", swiss: "Ich luege nur", standardGerman: "Ich schaue nur", english: "I'm just looking", pronunciation: "ICH LOO-eh-geh NOOR", difficulty: 1 },
  { id: "p-029", category: "shopping", swiss: "Das isch z tüür", standardGerman: "Das ist zu teuer", english: "That's too expensive", pronunciation: "DAS ISH z TOOR", culturalNote: "You'll say this a lot in Switzerland.", difficulty: 1 },
  { id: "p-030", category: "shopping", swiss: "Händ Sie Quittunge?", standardGerman: "Haben Sie eine Quittung?", english: "Do you have a receipt?", pronunciation: "HAND SEE KVIT-tung-eh", difficulty: 2 },

  // DINING (10)
  { id: "p-031", category: "dining", swiss: "En Tisch für zwei, bitte", standardGerman: "Einen Tisch für zwei, bitte", english: "A table for two, please", pronunciation: "EN TISH foor TSVAY BIT-teh", difficulty: 1 },
  { id: "p-032", category: "dining", swiss: "D Charte, bitte", standardGerman: "Die Karte, bitte", english: "The menu, please", pronunciation: "d KHAR-teh BIT-teh", difficulty: 1 },
  { id: "p-033", category: "dining", swiss: "Ich nimm...", standardGerman: "Ich nehme...", english: "I'll have...", pronunciation: "ICH NIM...", difficulty: 1 },
  { id: "p-034", category: "dining", swiss: "Es Bier, bitte", standardGerman: "Ein Bier, bitte", english: "A beer, please", pronunciation: "ES BEER BIT-teh", difficulty: 1 },
  { id: "p-035", category: "dining", swiss: "Zahle, bitte", standardGerman: "Zahlen, bitte", english: "Check, please", pronunciation: "TSAH-leh BIT-teh", difficulty: 1 },
  { id: "p-036", category: "dining", swiss: "Isch de Platz no frei?", standardGerman: "Ist der Platz noch frei?", english: "Is this seat taken?", pronunciation: "ISH deh PLATS no FRAY", difficulty: 2 },
  { id: "p-037", category: "dining", swiss: "En Guete!", standardGerman: "Guten Appetit!", english: "Enjoy your meal!", pronunciation: "EN GOO-teh", culturalNote: "Always said before eating. Wait for everyone to be served.", difficulty: 1 },
  { id: "p-038", category: "dining", swiss: "Zum Wohl!", standardGerman: "Zum Wohl!", english: "Cheers!", pronunciation: "TSUM VOHL", culturalNote: "Make eye contact with everyone when clinking glasses!", difficulty: 1 },
  { id: "p-039", category: "dining", swiss: "Ohni Fleisch, bitte", standardGerman: "Ohne Fleisch, bitte", english: "Without meat, please", pronunciation: "OH-nee FLYSH BIT-teh", difficulty: 1 },
  { id: "p-040", category: "dining", swiss: "Das isch fein gsi", standardGerman: "Das war lecker", english: "That was delicious", pronunciation: "DAS ISH FYNE GSEE", difficulty: 2 },

  // TRANSIT (10)
  { id: "p-041", category: "transit", swiss: "Wo isch d nöchsti Haltestell?", standardGerman: "Wo ist die nächste Haltestelle?", english: "Where is the nearest stop?", pronunciation: "WO ISH d NUKH-stee HAL-teh-shtel", difficulty: 2 },
  { id: "p-042", category: "transit", swiss: "Wänn fahrt de nöchscht Zug?", standardGerman: "Wann fährt der nächste Zug?", english: "When does the next train leave?", pronunciation: "WANN FART deh NUKH-sht TSOOG", difficulty: 2 },
  { id: "p-043", category: "transit", swiss: "Ich bruche es Billett nach Wien", standardGerman: "Ich brauche ein Ticket nach Wien", english: "I need a ticket to Vienna", pronunciation: "ICH BROO-kheh es BEE-yet nakh VEEN", difficulty: 2 },
  { id: "p-044", category: "transit", swiss: "Eifach oder retour?", standardGerman: "Einfach oder hin und zurück?", english: "One way or return?", pronunciation: "AY-fakh OH-der reh-TOOR", difficulty: 1 },
  { id: "p-045", category: "transit", swiss: "Gleis drü", standardGerman: "Gleis drei", english: "Platform three", pronunciation: "GLYSS DROO", difficulty: 1 },
  { id: "p-046", category: "transit", swiss: "De Zug hät Verspätig", standardGerman: "Der Zug hat Verspätung", english: "The train is delayed", pronunciation: "DEH TSOOG HAT fair-SHPAY-tig", culturalNote: "Rare in Switzerland. If it happens, it's big news.", difficulty: 2 },
  { id: "p-047", category: "transit", swiss: "Muess ich umsteige?", standardGerman: "Muss ich umsteigen?", english: "Do I need to transfer?", pronunciation: "MOOS ICH UM-shtay-geh", difficulty: 2 },
  { id: "p-048", category: "transit", swiss: "Ich ha es Halbtax", standardGerman: "Ich habe ein Halbtax", english: "I have a half-fare card", pronunciation: "ICH HA es HALP-tax", culturalNote: "Halbtax = 50% off all public transport. Essential.", difficulty: 1 },
  { id: "p-049", category: "transit", swiss: "Zwoiti Klass, bitte", standardGerman: "Zweite Klasse, bitte", english: "Second class, please", pronunciation: "TSVOY-tee KLAS BIT-teh", difficulty: 1 },
  { id: "p-050", category: "transit", swiss: "Wo muess ich uus?", standardGerman: "Wo muss ich raus?", english: "Where do I get off?", pronunciation: "WO MOOS ICH OOS", difficulty: 1 },

  // SOCIAL (10)
  { id: "p-051", category: "social", swiss: "Ich bi de Peter", standardGerman: "Ich bin Peter", english: "I'm Peter", pronunciation: "ICH BEE deh PEH-ter", difficulty: 1 },
  { id: "p-052", category: "social", swiss: "Wotsch öppis go trinke?", standardGerman: "Willst du etwas trinken gehen?", english: "Want to go for a drink?", pronunciation: "VOTSH UP-pis go TRIN-keh", difficulty: 2 },
  { id: "p-053", category: "social", swiss: "Ich chume us Ungarn", standardGerman: "Ich komme aus Ungarn", english: "I'm from Hungary", pronunciation: "ICH KHOO-meh us UN-garn", difficulty: 1 },
  { id: "p-054", category: "social", swiss: "Ich wohne sit kurzem z Züri", standardGerman: "Ich wohne seit kurzem in Zürich", english: "I've recently moved to Zurich", pronunciation: "ICH VOH-neh sit KOOR-tsem z ZOO-ri", difficulty: 2 },
  { id: "p-055", category: "social", swiss: "Das isch mega cool", standardGerman: "Das ist mega cool", english: "That's really cool", pronunciation: "DAS ISH MEH-gah COOL", difficulty: 1 },
  { id: "p-056", category: "social", swiss: "Ich ha en Tochter", standardGerman: "Ich habe eine Tochter", english: "I have a daughter", pronunciation: "ICH HA en TOKH-ter", difficulty: 1 },
  { id: "p-057", category: "social", swiss: "Am Wuchenänd bin ich i Wien", standardGerman: "Am Wochenende bin ich in Wien", english: "I'm in Vienna this weekend", pronunciation: "am VOO-khen-and bin ICH ee VEEN", difficulty: 2 },
  { id: "p-058", category: "social", swiss: "Gömer go Wandere?", standardGerman: "Gehen wir wandern?", english: "Shall we go hiking?", pronunciation: "GUH-mer go VAN-deh-reh", culturalNote: "Hiking is THE Swiss social activity.", difficulty: 2 },
  { id: "p-059", category: "social", swiss: "Ich spille Schach", standardGerman: "Ich spiele Schach", english: "I play chess", pronunciation: "ICH SHPIL-leh SHAKH", difficulty: 1 },
  { id: "p-060", category: "social", swiss: "D Party isch am Samstig", standardGerman: "Die Party ist am Samstag", english: "The party is on Saturday", pronunciation: "d PAR-tee ISH am SAM-shtig", difficulty: 2 },

  // EMERGENCY (8)
  { id: "p-061", category: "emergency", swiss: "Ich bruche Hilf!", standardGerman: "Ich brauche Hilfe!", english: "I need help!", pronunciation: "ICH BROO-kheh HILF", difficulty: 1 },
  { id: "p-062", category: "emergency", swiss: "Rüefed d Polizei!", standardGerman: "Rufen Sie die Polizei!", english: "Call the police!", pronunciation: "ROO-eh-fed d po-lee-TSAY", difficulty: 2 },
  { id: "p-063", category: "emergency", swiss: "Ich bruche en Dokter", standardGerman: "Ich brauche einen Arzt", english: "I need a doctor", pronunciation: "ICH BROO-kheh en DOK-ter", difficulty: 1 },
  { id: "p-064", category: "emergency", swiss: "Wo isch s Spital?", standardGerman: "Wo ist das Krankenhaus?", english: "Where is the hospital?", pronunciation: "WO ISH s SHPI-tal", difficulty: 1 },
  { id: "p-065", category: "emergency", swiss: "Mis Chnü tuet weh", standardGerman: "Mein Knie tut weh", english: "My knee hurts", pronunciation: "MEES KHNOO TOOT VEH", culturalNote: "Very relevant for Peter!", difficulty: 1 },
  { id: "p-066", category: "emergency", swiss: "Ich bi allergisch uf...", standardGerman: "Ich bin allergisch auf...", english: "I'm allergic to...", pronunciation: "ICH BEE ah-LAIR-gish uf...", difficulty: 2 },
  { id: "p-067", category: "emergency", swiss: "D Ambulanz, bitte!", standardGerman: "Den Krankenwagen, bitte!", english: "An ambulance, please!", pronunciation: "d am-boo-LANTS BIT-teh", difficulty: 1 },
  { id: "p-068", category: "emergency", swiss: "Ich ha mich verletzt", standardGerman: "Ich habe mich verletzt", english: "I've injured myself", pronunciation: "ICH HA mich fair-LETST", difficulty: 2 },

  // CULTURE (8)
  { id: "p-069", category: "culture", swiss: "Schwiizerdütsch isch schwer", standardGerman: "Schweizerdeutsch ist schwer", english: "Swiss German is hard", pronunciation: "SHVEET-ser-DOOTSH ISH SHVAIR", culturalNote: "Everyone will laugh and appreciate the effort.", difficulty: 2 },
  { id: "p-070", category: "culture", swiss: "Ich lerne no", standardGerman: "Ich lerne noch", english: "I'm still learning", pronunciation: "ICH LAIR-neh NO", difficulty: 1 },
  { id: "p-071", category: "culture", swiss: "Chönd Sie Hochdütsch rede?", standardGerman: "Können Sie Hochdeutsch reden?", english: "Can you speak High German?", pronunciation: "KHUND SEE HOKH-dootsh REH-deh", culturalNote: "Useful escape hatch. Swiss people understand Hochdeutsch.", difficulty: 2 },
  { id: "p-072", category: "culture", swiss: "Gopfertami!", standardGerman: "Verdammt!", english: "Damn! (mild Swiss swear)", pronunciation: "GOPF-er-TAH-mee", culturalNote: "Classic Swiss German exclamation. Use sparingly.", difficulty: 1 },
  { id: "p-073", category: "culture", swiss: "Es isch typisch Schwiz", standardGerman: "Es ist typisch Schweiz", english: "It's typically Swiss", pronunciation: "ES ISH TYP-ish SHVEETS", difficulty: 2 },
  { id: "p-074", category: "culture", swiss: "Mir gönd go Fondue ässe", standardGerman: "Wir gehen Fondue essen", english: "We're going for fondue", pronunciation: "MEER GUND go fon-DOO ESS-eh", culturalNote: "Fondue season: October to March. Don't order it in summer.", difficulty: 2 },
  { id: "p-075", category: "culture", swiss: "De Seä isch schön hüt", standardGerman: "Der See ist schön heute", english: "The lake is beautiful today", pronunciation: "DEH SAY ISH SHUN HOOT", difficulty: 1 },
  { id: "p-076", category: "culture", swiss: "Ich liebe d Bärge", standardGerman: "Ich liebe die Berge", english: "I love the mountains", pronunciation: "ICH LEE-beh d BAIR-geh", difficulty: 1 },

  // SMALLTALK (9)
  { id: "p-077", category: "smalltalk", swiss: "Wie heissed Sie?", standardGerman: "Wie heißen Sie?", english: "What's your name? (formal)", pronunciation: "WEE HAYS-sed SEE", difficulty: 1 },
  { id: "p-078", category: "smalltalk", swiss: "Was mached Sie berüeflich?", standardGerman: "Was machen Sie beruflich?", english: "What do you do for work?", pronunciation: "VAS MAH-khed SEE beh-ROOF-likh", difficulty: 2 },
  { id: "p-079", category: "smalltalk", swiss: "Ich schaffe im Finance", standardGerman: "Ich arbeite im Finanzbereich", english: "I work in finance", pronunciation: "ICH SHAF-feh im fee-NANTS", difficulty: 1 },
  { id: "p-080", category: "smalltalk", swiss: "Mir hät s Wätter gfalle", standardGerman: "Das Wetter gefällt mir", english: "I like the weather", pronunciation: "MEER HAT s VET-ter g-FAL-leh", difficulty: 2 },
  { id: "p-081", category: "smalltalk", swiss: "Sind Sie vo do?", standardGerman: "Sind Sie von hier?", english: "Are you from here?", pronunciation: "SIND SEE fo DO", difficulty: 1 },
  { id: "p-082", category: "smalltalk", swiss: "Ich ha gern Züri", standardGerman: "Ich mag Zürich", english: "I like Zurich", pronunciation: "ICH HA GAIRN ZOO-ri", difficulty: 1 },
  { id: "p-083", category: "smalltalk", swiss: "Woher chömed Sie?", standardGerman: "Woher kommen Sie?", english: "Where are you from?", pronunciation: "WO-hair KHUH-med SEE", difficulty: 2 },
  { id: "p-084", category: "smalltalk", swiss: "S Wätter isch schön", standardGerman: "Das Wetter ist schön", english: "The weather is nice", pronunciation: "s VET-ter ISH SHUN", difficulty: 1 },
  { id: "p-085", category: "smalltalk", swiss: "Das fröit mi", standardGerman: "Das freut mich", english: "That makes me happy / Pleased to meet you", pronunciation: "DAS FROYT MEE", difficulty: 1 },
];
