export function shortenText(text: string, maxLength: number): string {
    const words = text.split(' ');
    if (words.length <= maxLength) return text;
    return words.slice(0, maxLength - 3) + '...';
}
export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
// this will shorten a book ofthe Bible to its common abbreviation
// Define the map outside the function so it is only created once in memory

const bookMap = new Map<string, string>([
    ['Genesis', 'Gen'], // Added Genesis
    ['Exodus', 'Exod'], // Added Exodus
    ['Leviticus', 'Lev'], // Added Leviticus
    ['Numbers', 'Num'], // Added Numbers
    ['Deuteronomy', 'Deut'], // Added Deuteronomy
    ['Joshua', 'Josh'], // Added Joshua
    ['Judges', 'Judg'], // Added Judges
    ['Ruth', 'Ruth'], // Added Ruth
    ['1 Samuel', '1 Sam'], // Added 1 Samuel
    ['2 Samuel', '2 Sam'], // Added 2 Samuel
    ['1 Kings', '1 Kgs'], // Added 1 Kings
    ['2 Kings', '2 Kgs'], // Added 2 Kings
    ['1 Chronicles', '1 Chr'], // Added 1 Chronicles
    ['2 Chronicles', '2 Chr'], // Added 2 Chronicles
    ['Ezra', 'Ezra'], // Added Ezra
    ['Nehemiah', 'Neh'], // Added Nehemiah
    ['Esther', 'Esth'], // Added Esther
    ['Job', 'Job'], // Added Job
    ['Psalms', 'Ps'], // Added Psalms
    ['Proverbs', 'Prov'], // Added Proverbs
    ['Ecclesiastes', 'Eccl'], // Added Ecclesiastes
    ['Song of Solomon', 'Song'], // Added Song of Solomon
    ['Isaiah', 'Isa'], // Added Isaiah
    ['Jeremiah', 'Jer'], // Added Jeremiah
    ['Lamentations', 'Lam'], // Added Lamentations
    ['Ezekiel', 'Ezek'], // Added Ezekiel
    ['Daniel', 'Dan'], // Added Daniel
    ['Hosea', 'Hos'], // Added Hosea
    ['Joel', 'Joel'], // Added Joel
    ['Amos', 'Amos'], // Added Amos
    ['Obadiah', 'Obad'], // Added Obadiah
    ['Jonah', 'Jonah'], // Added Jonah
    ['Micah', 'Mic'], // Added Micah
    ['Nahum', 'Nah'], // Added Nahum
    ['Habakkuk', 'Hab'], // Added Habakkuk
    ['Zephaniah', 'Zeph'], // Added Zephaniah
    ['Haggai', 'Hag'], // Added Haggai
    ['Zechariah', 'Zech'], // Added Zechariah
    ['Malachi', 'Mal'], // Added Malachi
    ['Matthew', 'Matt'], // Added Matthew
    ['Mark', 'Mark'], // Added Mark
    ['Luke', 'Luke'], // Added Luke
    ['John', 'John'], // Added John
    ['Acts', 'Acts'], // Added Acts
    ['Romans', 'Rom'], // Added Romans
    ['1 Corinthians', '1 Cor'], // Added 1 Corinthians
    ['2 Corinthians', '2 Cor'], // Added 2 Corinthians
    ['Galatians', 'Gal'], // Added Galatians
    ['Ephesians', 'Eph'], // Added Ephesians
    ['Philippians', 'Phil'], // Added Philippians
    ['Colossians', 'Col'], // Added Colossians
    ['1 Thessalonians', '1 Thess'], // Added 1 Thessalonians
    ['2 Thessalonians', '2 Thess'], // Added 2 Thessalonians
    ['1 Timothy', '1 Tim'], // Added 1 Timothy
    ['2 Timothy', '2 Tim'], // Added 2 Timothy
    ['Titus', 'Titus'], // Added Titus
    ['Philemon', 'Phlm'], // Added Philemon
    ['Hebrews', 'Heb'], // Added Hebrews
    ['James', 'Jas'], // Added James
    ['1 Peter', '1 Pet'], // Added 1 Peter
    ['2 Peter', '2 Pet'], // Added 2 Peter
    ['1 John', '1 John'], // Added 1 John
    ['2 John', '2 John'], // Added 2 John
    ['3 John', '3 John'], // Added 3 John
    ['Jude', 'Jude'], // Added Jude
    ['Revelation', 'Rev'] // Added Revelation
]);
export function capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
 
export function abbreviateBook(book: string): string {
    return bookMap.get(book.at(0)?.toUpperCase()+book.toLowerCase().slice(1, )) ?? book; // Returns the abbreviation or the original string if not found
}
