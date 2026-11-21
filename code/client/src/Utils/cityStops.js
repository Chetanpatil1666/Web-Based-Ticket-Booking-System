/**
 * Comprehensive Authentic Indian Cities, Boarding Points & Dropping Points Directory
 * Used consistently across SelectBus, Bookseat, Details, Myticket & OriginalTicket.
 */

export const CITY_DIRECTORY = {
  pune: {
    city: "Pune",
    state: "Maharashtra",
    boarding: [
      { name: "Nigdi Bhakti Shakti Chowk", landmark: "Near Pillar No. 4, Old Mumbai-Pune Highway", offsetMin: -25 },
      { name: "Wakad Ginger Hotel Bridge", landmark: "Hinjewadi Flyover End, NH-48 Bypass", offsetMin: -10 },
      { name: "Swargate ST Stand / Jedhe Chowk", landmark: "Near Natraj Hotel / Metro Gate 2", offsetMin: 0 },
      { name: "Shivajinagar Sangamwadi", landmark: "Sangamwadi Parking Terminal Bay 3", offsetMin: 10 },
      { name: "Hadapsar Gadital Hub", landmark: "Near Akashwani Kendra, Pune-Solapur Hwy", offsetMin: 25 },
      { name: "Viman Nagar Phoenix Mall", landmark: "Opposite Gate 1, Nagar Road", offsetMin: 35 },
    ],
    dropping: [
      { name: "Hadapsar Gadital Terminal", landmark: "Opp. Akashwani, Solapur Highway", offsetMin: -30 },
      { name: "Swargate Central Hub", landmark: "Jedhe Chowk Bus Bay", offsetMin: -15 },
      { name: "Shivajinagar Sangamwadi", landmark: "Private Travels Bay 2", offsetMin: 0 },
      { name: "Wakad Hinjewadi Flyover", landmark: "Below Ginger Hotel Bridge", offsetMin: 15 },
      { name: "Nigdi Bhakti Shakti Chowk", landmark: "Near BRTS Terminal", offsetMin: 30 },
    ],
  },
  jalgaon: {
    city: "Jalgaon",
    state: "Maharashtra",
    boarding: [
      { name: "Ajanta Chowfuli Bypass", landmark: "Near NH-6 Flyover Junction", offsetMin: -15 },
      { name: "Iccha Devi Chowk", landmark: "Main Highway Circle", offsetMin: 0 },
      { name: "Akashwani Chowk", landmark: "Adjacent to Govt. Telecom Office", offsetMin: 10 },
      { name: "Jalgaon Old ST Bus Stand", landmark: "Near Central Market Square", offsetMin: 20 },
      { name: "Pratap Nagar Chowk", landmark: "Ring Road Crossing", offsetMin: 30 },
    ],
    dropping: [
      { name: "Ajanta Chowfuli Highway Junction", landmark: "NH-6 & Ajanta Road Point", offsetMin: -20 },
      { name: "Iccha Devi Chowk", landmark: "Opposite Landmark Towers", offsetMin: -10 },
      { name: "Akashwani Chowk Terminal", landmark: "Near Shivaji Putala Road", offsetMin: 0 },
      { name: "Old ST Bus Stand", landmark: "Station Road Junction", offsetMin: 12 },
      { name: "Pratap Nagar Bypass", landmark: "Ring Road Exit", offsetMin: 20 },
    ],
  },
  mumbai: {
    city: "Mumbai",
    state: "Maharashtra",
    boarding: [
      { name: "Borivali East National Park", landmark: "Western Express Highway Gate", offsetMin: -35 },
      { name: "Andheri East Gundavali", landmark: "Near Bisleri Junction Metro", offsetMin: -20 },
      { name: "Dadar East Swami Narayan Mandir", landmark: "Opposite Dadar TT Circle", offsetMin: 0 },
      { name: "Sion Circle Highway", landmark: "Below Chunabhatti Flyover", offsetMin: 12 },
      { name: "Chembur Maitri Park", landmark: "RK Studio / Sion-Trombay Road", offsetMin: 22 },
      { name: "Vashi Plaza Toll Naka", landmark: "Sector 17, Mumbai-Pune Hwy", offsetMin: 38 },
    ],
    dropping: [
      { name: "Vashi Plaza Toll", landmark: "Navi Mumbai Express Entry", offsetMin: -35 },
      { name: "Chembur Maitri Park", landmark: "Eastern Freeway Junction", offsetMin: -20 },
      { name: "Sion Circle", landmark: "Near Sion Hospital Bridge", offsetMin: -10 },
      { name: "Dadar East Terminal", landmark: "Near Chitra Cinema", offsetMin: 0 },
      { name: "Andheri East WEH", landmark: "Gundavali Bus Stop", offsetMin: 20 },
      { name: "Borivali West Highway", landmark: "Near Gokulanand Hotel", offsetMin: 35 },
    ],
  },
  goa: {
    city: "Goa",
    state: "Goa",
    boarding: [
      { name: "Madgaon KTC Bus Stand", landmark: "Opposite Rawanfond Bypass Circle", offsetMin: -35 },
      { name: "Verna Industrial Highway", landmark: "NH-66 Junction", offsetMin: -20 },
      { name: "Panjim KTC Kadamba Stand", landmark: "Patto Plaza Main Terminal Bay", offsetMin: 0 },
      { name: "Porvorim O Coqueiro Circle", landmark: "CHOGM Road Junction", offsetMin: 15 },
      { name: "Mapusa Gandhi Chowk Stand", landmark: "Near Bodgeshwar Temple Gate", offsetMin: 30 },
    ],
    dropping: [
      { name: "Mapusa Central Stand", landmark: "Near Bodgeshwar Temple Highway", offsetMin: -30 },
      { name: "Porvorim O Coqueiro Circle", landmark: "Near Mall De Goa Road", offsetMin: -15 },
      { name: "Panjim KTC Bus Stand", landmark: "Patto Plaza Terminal", offsetMin: 0 },
      { name: "Verna Plateau Cross", landmark: "NH-66 Highway Drop", offsetMin: 20 },
      { name: "Madgaon KTC Stand", landmark: "Margao Bypass Junction", offsetMin: 35 },
    ],
  },
  bengaluru: {
    city: "Bengaluru",
    state: "Karnataka",
    boarding: [
      { name: "Electronic City Phase 1", landmark: "Opp. Infosys Toll Gate", offsetMin: -35 },
      { name: "Silk Board Flyover Junction", landmark: "Hosur Road Outer Ring Exit", offsetMin: -20 },
      { name: "Madiwala Police Station", landmark: "Opposite Total Mall", offsetMin: -10 },
      { name: "Majestic Kempegowda Stand", landmark: "Opposite Dhanvanthri Road / Tank Bund", offsetMin: 0 },
      { name: "Yeshwantpur Govardhan", landmark: "Near Metro Station Gate B", offsetMin: 20 },
      { name: "Hebbal Esteem Mall", landmark: "Airport Flyover Ring Junction", offsetMin: 35 },
    ],
    dropping: [
      { name: "Hebbal Esteem Mall", landmark: "Outer Ring Flyover", offsetMin: -35 },
      { name: "Yeshwantpur Metro Stand", landmark: "Near Govardhan Theatre", offsetMin: -20 },
      { name: "Majestic Bus Terminus", landmark: "Kempegowda Station Bay 4", offsetMin: 0 },
      { name: "Madiwala Circle", landmark: "Near St. John's Hospital", offsetMin: 15 },
      { name: "Silk Board Junction", landmark: "BTM Layout Side", offsetMin: 25 },
      { name: "Electronic City Toll", landmark: "Phase 1 Elevated Exit", offsetMin: 40 },
    ],
  },
  bangalore: { aliasOf: "bengaluru" },
  nashik: {
    city: "Nashik",
    state: "Maharashtra",
    boarding: [
      { name: "Adgaon Naka", landmark: "Mumbai-Agra Highway NH-3", offsetMin: -20 },
      { name: "Panchavati Nimani Bus Stand", landmark: "Near Kalika Temple Cross", offsetMin: -10 },
      { name: "Dwarka Circle Terminal", landmark: "Opposite KTHM Bridge Approach", offsetMin: 0 },
      { name: "Mumbai Naka", landmark: "Near Mahamarg Bus Station", offsetMin: 10 },
      { name: "Pathardi Phata", landmark: "Beside Hotel Express Inn", offsetMin: 22 },
    ],
    dropping: [
      { name: "Pathardi Phata Bypass", landmark: "Near Hotel Express Inn", offsetMin: -20 },
      { name: "Mumbai Naka Mahamarg Stand", landmark: "Main Highway Bus Stop", offsetMin: -10 },
      { name: "Dwarka Circle", landmark: "Near Pune Highway Exit", offsetMin: 0 },
      { name: "Panchavati Karanja", landmark: "Adgaon Road Junction", offsetMin: 15 },
    ],
  },
  aurangabad: {
    city: "Aurangabad",
    state: "Maharashtra",
    boarding: [
      { name: "Waluj MIDC Toll Plaza", landmark: "Pune Highway Junction", offsetMin: -20 },
      { name: "Baba Petrol Pump", landmark: "Near Railway Station Flyover", offsetMin: 0 },
      { name: "Kranti Chowk", landmark: "Adalat Road Corner", offsetMin: 10 },
      { name: "CIDCO Central Bus Stand", landmark: "Jalgaon Highway Terminal", offsetMin: 20 },
      { name: "Chikalthana Cambridge Square", landmark: "Airport Road", offsetMin: 32 },
    ],
    dropping: [
      { name: "Chikalthana Airport Gate", landmark: "Jalna Highway", offsetMin: -25 },
      { name: "CIDCO Bus Stand", landmark: "Opposite Prozone Mall Road", offsetMin: -10 },
      { name: "Baba Petrol Pump", landmark: "Central Flyover", offsetMin: 0 },
      { name: "Waluj MIDC Corner", landmark: "Pune Highway Bypass", offsetMin: 20 },
    ],
  },
  "chhatrapati sambhajinagar": { aliasOf: "aurangabad" },
  kolhapur: {
    city: "Kolhapur",
    state: "Maharashtra",
    boarding: [
      { name: "Rankala Stand / Rajarampuri", landmark: "Central Market Square", offsetMin: -15 },
      { name: "CBS Kolhapur Bus Stand", landmark: "Near Venus Corner", offsetMin: 0 },
      { name: "Kawala Naka Circle", landmark: "Tarabai Park Entry", offsetMin: 10 },
      { name: "Hotel Tawade NH-48", landmark: "Poona-Bangalore Highway Bypass", offsetMin: 22 },
      { name: "Shiroli MIDC Phata", landmark: "Highway Toll Gate", offsetMin: 35 },
    ],
    dropping: [
      { name: "Shiroli MIDC Phata", landmark: "NH-48 Entrance", offsetMin: -25 },
      { name: "Hotel Tawade Highway", landmark: "Near Panchganga Bridge", offsetMin: -12 },
      { name: "Kawala Naka Stand", landmark: "Central City Terminal", offsetMin: 0 },
      { name: "CBS Bus Terminal", landmark: "Station Road", offsetMin: 12 },
    ],
  },
  nagpur: {
    city: "Nagpur",
    state: "Maharashtra",
    boarding: [
      { name: "Dharampeth Ravi Nagar", landmark: "Amravati Road Square", offsetMin: -20 },
      { name: "Ganeshpeth Central Stand", landmark: "Near Agyaram Devi Mandir", offsetMin: 0 },
      { name: "Cotton Market / Gitanjali Talkies", landmark: "CA Road Terminal", offsetMin: 10 },
      { name: "Chatrapati Square", landmark: "Wardha Road Flyover", offsetMin: 20 },
      { name: "Hingna T-Point", landmark: "Ring Road Junction", offsetMin: 32 },
    ],
    dropping: [
      { name: "Chatrapati Square", landmark: "Wardha Highway", offsetMin: -20 },
      { name: "Ganeshpeth ST Stand", landmark: "Near Railway Station East", offsetMin: 0 },
      { name: "Gitanjali Talkies CA Road", landmark: "Cotton Market", offsetMin: 10 },
      { name: "Wadi / Ravi Nagar", landmark: "Amravati Highway", offsetMin: 22 },
    ],
  },
  shirdi: {
    city: "Shirdi",
    state: "Maharashtra",
    boarding: [
      { name: "Sai Baba Temple Gate No. 3", landmark: "Opposite Prasadahalaya", offsetMin: 0 },
      { name: "Hotel Goradia / Pimpalwadi Road", landmark: "Near Wet N Joy Road", offsetMin: 10 },
      { name: "Rahata ST Bus Stand", landmark: "Nagar-Manmad Highway", offsetMin: 20 },
      { name: "Nimgaon Korhale Bypass", landmark: "Sinnar Road Cross", offsetMin: 30 },
    ],
    dropping: [
      { name: "Nimgaon Bypass", landmark: "Highway Cross", offsetMin: -15 },
      { name: "Sai Baba Temple Complex", landmark: "Pimpalwadi Bus Bay", offsetMin: 0 },
      { name: "Shirdi Sai Ashram Gate", landmark: "Main Ring Road", offsetMin: 10 },
    ],
  },
  thane: {
    city: "Thane",
    state: "Maharashtra",
    boarding: [
      { name: "Ghodbunder Kasarvadavali", landmark: "Near Hypercity Mall", offsetMin: -20 },
      { name: "Majiwada Junction", landmark: "Below Eastern Express Flyover", offsetMin: 0 },
      { name: "Cadbury Junction", landmark: "Eastern Express Highway", offsetMin: 10 },
      { name: "Teen Hath Naka", landmark: "Near Eternity Mall", offsetMin: 18 },
      { name: "Kalwa Naka Bridge", landmark: "Navi Mumbai Connector", offsetMin: 28 },
    ],
    dropping: [
      { name: "Kalwa Junction", landmark: "Thane-Belapur Exit", offsetMin: -15 },
      { name: "Teen Hath Naka", landmark: "Opposite Raheja Gardens", offsetMin: -5 },
      { name: "Majiwada Junction", landmark: "Viviana Mall Highway", offsetMin: 0 },
      { name: "Ghodbunder Kapurbawdi", landmark: "Circle Terminus", offsetMin: 15 },
    ],
  },
  solapur: {
    city: "Solapur",
    state: "Maharashtra",
    boarding: [
      { name: "Saat Rasta Chowk", landmark: "Near District Collector Office", offsetMin: 0 },
      { name: "Puna Naka ST Stand", landmark: "Pune Highway Entry", offsetMin: 12 },
      { name: "Market Yard Gate", landmark: "Hyderabad Road", offsetMin: 22 },
      { name: "Kondhi Toll Bypass", landmark: "NH-65 Expressway", offsetMin: 35 },
    ],
    dropping: [
      { name: "Kondhi Bypass", landmark: "NH-65 Toll", offsetMin: -20 },
      { name: "Puna Naka Stand", landmark: "Near Balaji Sarovar Hotel", offsetMin: -8 },
      { name: "Saat Rasta Bus Terminal", landmark: "City Center Square", offsetMin: 0 },
    ],
  },
  satara: {
    city: "Satara",
    state: "Maharashtra",
    boarding: [
      { name: "Bombay Restaurant Chowk", landmark: "NH-48 Expressway Cross", offsetMin: 0 },
      { name: "Powai Naka ST Stand", landmark: "Near Collector Office", offsetMin: 12 },
      { name: "Nagthane Bypass", landmark: "Kolhapur Highway", offsetMin: 25 },
    ],
    dropping: [
      { name: "Bombay Restaurant Chowk", landmark: "NH-48 Highway Drop", offsetMin: 0 },
      { name: "Powai Naka Terminal", landmark: "City Bus Stand", offsetMin: 10 },
    ],
  },
  sangli: {
    city: "Sangli",
    state: "Maharashtra",
    boarding: [
      { name: "Vishrambag Chowk", landmark: "Near Walchand College Gate", offsetMin: 0 },
      { name: "Sangli New ST Stand", landmark: "Station Road Junction", offsetMin: 12 },
      { name: "Miraj Mission Junction", landmark: "Kolhapur Road", offsetMin: 25 },
    ],
    dropping: [
      { name: "Miraj Junction Circle", landmark: "Highway Cross", offsetMin: -12 },
      { name: "Vishrambag Terminal", landmark: "Main College Road", offsetMin: 0 },
      { name: "Sangli Central Stand", landmark: "Market Yard Road", offsetMin: 10 },
    ],
  },
  amravati: {
    city: "Amravati",
    state: "Maharashtra",
    boarding: [
      { name: "Rajkamal Chowk", landmark: "Central Market Terminal", offsetMin: 0 },
      { name: "Irwin Hospital Square", landmark: "Near Camp Road", offsetMin: 10 },
      { name: "Badnera Bypass", landmark: "NH-53 Junction", offsetMin: 22 },
    ],
    dropping: [
      { name: "Badnera Junction", landmark: "Nagpur-Akola Highway", offsetMin: -12 },
      { name: "Rajkamal Chowk", landmark: "Main City Bus Bay", offsetMin: 0 },
      { name: "Panchvati Square", landmark: "Morshi Road", offsetMin: 10 },
    ],
  },
  akola: {
    city: "Akola",
    state: "Maharashtra",
    boarding: [
      { name: "Ratanlal Plot Chowk", landmark: "Near Gandhi Jawahar Bagh", offsetMin: 0 },
      { name: "Akola ST Bus Stand", landmark: "Railway Station Road", offsetMin: 10 },
      { name: "NH-53 Nimwadi Bypass", landmark: "Khamgaon Highway Cross", offsetMin: 22 },
    ],
    dropping: [
      { name: "Nimwadi Bypass", landmark: "NH-53 Exit", offsetMin: -10 },
      { name: "Ratanlal Plot", landmark: "City Center Square", offsetMin: 0 },
    ],
  },
  dhule: {
    city: "Dhule",
    state: "Maharashtra",
    boarding: [
      { name: "Chalisgaon Choufuli", landmark: "NH-3 & NH-6 Crossing", offsetMin: 0 },
      { name: "Dhule Central ST Stand", landmark: "Agra Road", offsetMin: 10 },
      { name: "Songir Toll Plaza", landmark: "Indore Highway", offsetMin: 22 },
    ],
    dropping: [
      { name: "Chalisgaon Choufuli Bypass", landmark: "Highway Flyover", offsetMin: 0 },
      { name: "Agra Road ST Depot", landmark: "Station Road", offsetMin: 10 },
    ],
  },
  nanded: {
    city: "Nanded",
    state: "Maharashtra",
    boarding: [
      { name: "Hingoli Gate Corner", landmark: "Near Railway Station", offsetMin: 0 },
      { name: "ITI Corner Terminal", landmark: "Vazirabad Main Road", offsetMin: 12 },
      { name: "Wajegaon Bypass", landmark: "Degloor Naka Highway", offsetMin: 22 },
    ],
    dropping: [
      { name: "Wajegaon Bypass", landmark: "Main Ring Road", offsetMin: -10 },
      { name: "Hingoli Gate Stand", landmark: "City Center Terminal", offsetMin: 0 },
    ],
  },
  ahmedabad: {
    city: "Ahmedabad",
    state: "Gujarat",
    boarding: [
      { name: "Iskcon Cross Road", landmark: "S.G. Highway Flyover", offsetMin: -25 },
      { name: "Nehru Nagar Circle", landmark: "BRTS Corridor Terminal", offsetMin: -12 },
      { name: "Paldi Vishwakarma Hall", landmark: "Near Sharda Mandir Cross", offsetMin: 0 },
      { name: "Gita Mandir Central Stand", landmark: "Astodia Gate Ring Road", offsetMin: 15 },
      { name: "C.T.M Express Highway", landmark: "Below Ring Flyover", offsetMin: 28 },
    ],
    dropping: [
      { name: "C.T.M Express Cross Road", landmark: "Baroda Expressway Exit", offsetMin: -25 },
      { name: "Gita Mandir Bus Port", landmark: "Platform 3", offsetMin: -10 },
      { name: "Paldi Cross Road", landmark: "Near Sanskar Kendra", offsetMin: 0 },
      { name: "Iskcon Temple S.G. Hwy", landmark: "Satellite Road", offsetMin: 20 },
    ],
  },
  surat: {
    city: "Surat",
    state: "Gujarat",
    boarding: [
      { name: "Adajan Hazira Road", landmark: "Near Prime Arcade", offsetMin: -20 },
      { name: "Central Bus Station", landmark: "Opposite Railway Station Delhi Gate", offsetMin: 0 },
      { name: "Varachha Hirabaug Circle", landmark: "Mini Bazar Road", offsetMin: 12 },
      { name: "Kamrej Chokdi Highway", landmark: "NH-48 Flyover End", offsetMin: 25 },
      { name: "Kadodara Toll Junction", landmark: "Bardoli Highway Cross", offsetMin: 35 },
    ],
    dropping: [
      { name: "Kadodara Char Rasta", landmark: "NH-48 Bypass", offsetMin: -30 },
      { name: "Kamrej Chokdi", landmark: "Near Tapi Bridge", offsetMin: -18 },
      { name: "Delhi Gate Bus Station", landmark: "Main Railway Square", offsetMin: 0 },
      { name: "Adajan Circle", landmark: "Pal Hazira Road", offsetMin: 18 },
    ],
  },
  vadodara: {
    city: "Vadodara",
    state: "Gujarat",
    boarding: [
      { name: "Pandya Bridge Junction", landmark: "Near Fatehgunj Circle", offsetMin: -12 },
      { name: "Central GSRTC Bus Port", landmark: "Sayajigunj Station Square", offsetMin: 0 },
      { name: "Amit Nagar Circle", landmark: "VIP Road", offsetMin: 12 },
      { name: "Golden Chokdi Highway", landmark: "NH-48 Express Entry", offsetMin: 24 },
    ],
    dropping: [
      { name: "Golden Chokdi", landmark: "NH-48 Bypass", offsetMin: -20 },
      { name: "Amit Nagar Circle", landmark: "Harni Road", offsetMin: -10 },
      { name: "Central Bus Port", landmark: "Station Road", offsetMin: 0 },
    ],
  },
  rajkot: {
    city: "Rajkot",
    state: "Gujarat",
    boarding: [
      { name: "Indira Circle", landmark: "University Road", offsetMin: -12 },
      { name: "Rajkot Central Bus Port", landmark: "Dhebar Road Terminal", offsetMin: 0 },
      { name: "Greenland Chokdi", landmark: "Ahmedabad Highway Cross", offsetMin: 15 },
      { name: "Gondal Chokdi", landmark: "Bypass Ring Road", offsetMin: 25 },
    ],
    dropping: [
      { name: "Greenland Chokdi", landmark: "NH-47 Entry", offsetMin: -15 },
      { name: "Central Bus Port", landmark: "Shastri Maidan", offsetMin: 0 },
    ],
  },
  delhi: {
    city: "Delhi",
    state: "Delhi",
    boarding: [
      { name: "Majnu Ka Tilla", landmark: "Outer Ring Road Aruna Nagar", offsetMin: -15 },
      { name: "Kashmere Gate ISBT", landmark: "Platform 4 / Metro Gate 6", offsetMin: 0 },
      { name: "RK Ashram Marg", landmark: "Near Metro Gate 2", offsetMin: 15 },
      { name: "Akshardham Temple Metro", landmark: "NH-24 Noida Link Road", offsetMin: 28 },
      { name: "Dhaula Kuan Ring Road", landmark: "Below Airport Flyover Pillar 12", offsetMin: 40 },
    ],
    dropping: [
      { name: "Dhaula Kuan Metro", landmark: "Gurugram Highway Entry", offsetMin: -30 },
      { name: "Akshardham Metro", landmark: "NH-24 Junction", offsetMin: -15 },
      { name: "Kashmere Gate ISBT", landmark: "Main Terminal Arrival Bay", offsetMin: 0 },
      { name: "Majnu Ka Tilla", landmark: "North Campus Road", offsetMin: 12 },
    ],
  },
  jaipur: {
    city: "Jaipur",
    state: "Rajasthan",
    boarding: [
      { name: "Transport Nagar Circle", landmark: "Agra Road Bypass", offsetMin: -20 },
      { name: "Narayan Singh Circle", landmark: "Tonk Road Central Point", offsetMin: -10 },
      { name: "Sindhi Camp Bus Stand", landmark: "Platform 3 Opp. Polovictory", offsetMin: 0 },
      { name: "200 Feet Bypass Ajmer Rd", landmark: "Below Flyover Pillar 8", offsetMin: 22 },
      { name: "Durgapura Bus Bay", landmark: "Tonk Road Highway", offsetMin: 30 },
    ],
    dropping: [
      { name: "200 Feet Bypass", landmark: "Ajmer Expressway Exit", offsetMin: -20 },
      { name: "Sindhi Camp Terminus", landmark: "Station Road Terminal", offsetMin: 0 },
      { name: "Narayan Singh Circle", landmark: "Rambagh Crossing", offsetMin: 10 },
      { name: "Transport Nagar", landmark: "Delhi-Agra Bypass", offsetMin: 22 },
    ],
  },
  udaipur: {
    city: "Udaipur",
    state: "Rajasthan",
    boarding: [
      { name: "Fatehpura Circle", landmark: "Badi Road Cross", offsetMin: -12 },
      { name: "Udiapole Central Bus Stand", landmark: "Platform 1 Main Gate", offsetMin: 0 },
      { name: "Reti Stand Square", landmark: "Hiran Magri Sector 3", offsetMin: 12 },
      { name: "Pratap Nagar Bypass", landmark: "Chittor Highway Cross", offsetMin: 25 },
    ],
    dropping: [
      { name: "Pratap Nagar", landmark: "Highway Junction", offsetMin: -18 },
      { name: "Udiapole Bus Stand", landmark: "Central City Terminal", offsetMin: 0 },
      { name: "Reti Stand", landmark: "South Station Road", offsetMin: 10 },
    ],
  },
  jodhpur: {
    city: "Jodhpur",
    state: "Rajasthan",
    boarding: [
      { name: "Paota Circle Terminal", landmark: "Opposite Govt. Bus Depot", offsetMin: 0 },
      { name: "12th Road Circle", landmark: "Sardarpura Main Road", offsetMin: 12 },
      { name: "Jhalamand Bypass", landmark: "Pali Highway Ring Road", offsetMin: 25 },
    ],
    dropping: [
      { name: "Jhalamand Circle", landmark: "Pali Bypass", offsetMin: -15 },
      { name: "Paota Circle", landmark: "Main Terminal Bay", offsetMin: 0 },
    ],
  },
  agra: {
    city: "Agra",
    state: "Uttar Pradesh",
    boarding: [
      { name: "Idgah Central Bus Stand", landmark: "Near Sadar Bazar", offsetMin: 0 },
      { name: "ISBT Transport Nagar", landmark: "NH-19 Highway", offsetMin: 15 },
      { name: "Water Works Chauraha", landmark: "Yamuna Expressway Link", offsetMin: 25 },
      { name: "Kuberpur Interchange", landmark: "Expressway Toll Entry", offsetMin: 40 },
    ],
    dropping: [
      { name: "Kuberpur Toll Plaza", landmark: "Yamuna Expressway Exit", offsetMin: -25 },
      { name: "Water Works Circle", landmark: "Rambagh Crossing", offsetMin: -12 },
      { name: "ISBT / Idgah Stand", landmark: "Central Arrival Bay", offsetMin: 0 },
    ],
  },
  lucknow: {
    city: "Lucknow",
    state: "Uttar Pradesh",
    boarding: [
      { name: "Gomti Nagar Kamta Stand", landmark: "Faizabad Road Square", offsetMin: -20 },
      { name: "Charbagh Railway Stand", landmark: "Opposite Station Gate 1", offsetMin: -10 },
      { name: "Alambagh ISBT Bus Port", landmark: "Main Kanpur Road Terminal", offsetMin: 0 },
      { name: "Nahariya / Shaheed Path", landmark: "Expressway Flyover", offsetMin: 18 },
    ],
    dropping: [
      { name: "Nahariya Chowk", landmark: "Kanpur Road Exit", offsetMin: -15 },
      { name: "Alambagh ISBT Terminal", landmark: "Metro Connected Arrival Bay", offsetMin: 0 },
      { name: "Charbagh Stand", landmark: "City Railway Junction", offsetMin: 12 },
    ],
  },
  kanpur: {
    city: "Kanpur",
    state: "Uttar Pradesh",
    boarding: [
      { name: "Jhakarkati ISBT Terminal", landmark: "GT Road Central Stand", offsetMin: 0 },
      { name: "Fazalganj Chauraha", landmark: "Kalpi Road", offsetMin: 12 },
      { name: "Rama Devi Flyover", landmark: "NH-19 Agra Highway", offsetMin: 24 },
      { name: "Naubasta Bypass", landmark: "Hamirpur Highway Cross", offsetMin: 35 },
    ],
    dropping: [
      { name: "Rama Devi Crossing", landmark: "Highway Exit", offsetMin: -18 },
      { name: "Jhakarkati ISBT", landmark: "Main Terminal", offsetMin: 0 },
    ],
  },
  prayagraj: {
    city: "Prayagraj",
    state: "Uttar Pradesh",
    boarding: [
      { name: "Civil Lines Bus Stand", landmark: "Mahatma Gandhi Marg", offsetMin: 0 },
      { name: "Zero Road Depot", landmark: "Near Clock Tower", offsetMin: 12 },
      { name: "Alopibagh Chungi", landmark: "Varanasi Highway Bridge", offsetMin: 22 },
      { name: "Naini Bridge Bypass", landmark: "Rewa Road Cross", offsetMin: 35 },
    ],
    dropping: [
      { name: "Alopibagh Junction", landmark: "Shastri Bridge Entry", offsetMin: -15 },
      { name: "Civil Lines Terminal", landmark: "City Center", offsetMin: 0 },
    ],
  },
  varanasi: {
    city: "Varanasi",
    state: "Uttar Pradesh",
    boarding: [
      { name: "Cantt Railway Bus Stand", landmark: "Platform 1 Roadway Depot", offsetMin: 0 },
      { name: "Lahartara Crossing", landmark: "Near Flyover Pillar 4", offsetMin: 12 },
      { name: "Mohansarai Bypass", landmark: "NH-19 GT Road", offsetMin: 25 },
    ],
    dropping: [
      { name: "Mohansarai Toll", landmark: "NH-19 Exit", offsetMin: -20 },
      { name: "Cantt Bus Terminal", landmark: "Central Station Square", offsetMin: 0 },
    ],
  },
  indore: {
    city: "Indore",
    state: "Madhya Pradesh",
    boarding: [
      { name: "Vijay Nagar Square", landmark: "Near Sayaji Hotel Gate", offsetMin: -20 },
      { name: "Radisson Blu Square", landmark: "Ring Road Bypass", offsetMin: -10 },
      { name: "Teen Imli Bus Stand", landmark: "Navlakha Ring Highway", offsetMin: 0 },
      { name: "Navlakha Terminal", landmark: "AB Road Central Hub", offsetMin: 12 },
      { name: "Rau Circle Bypass", landmark: "Mumbai-Agra Highway Toll", offsetMin: 28 },
    ],
    dropping: [
      { name: "Rau Circle", landmark: "Pithampur Highway Junction", offsetMin: -22 },
      { name: "Navlakha Terminal", landmark: "AB Road", offsetMin: -10 },
      { name: "Teen Imli Stand", landmark: "Main Highway Bay", offsetMin: 0 },
      { name: "Radisson / Vijay Nagar", landmark: "Eastern Ring Road", offsetMin: 18 },
    ],
  },
  bhopal: {
    city: "Bhopal",
    state: "Madhya Pradesh",
    boarding: [
      { name: "Nadra Bus Stand", landmark: "Near Bhopal Junction Station", offsetMin: -15 },
      { name: "ISBT Habibganj", landmark: "Opposite Rani Kamalapati Mall Road", offsetMin: 0 },
      { name: "Lalghati Circle", landmark: "Indore Highway Exit", offsetMin: 20 },
      { name: "Bairagarh Bypass", landmark: "NH-46 Toll Road", offsetMin: 32 },
    ],
    dropping: [
      { name: "Lalghati Square", landmark: "VIP Airport Link", offsetMin: -18 },
      { name: "ISBT Habibganj", landmark: "Central Arrival Terminal", offsetMin: 0 },
      { name: "Nadra Stand", landmark: "Old City Junction", offsetMin: 12 },
    ],
  },
  hyderabad: {
    city: "Hyderabad",
    state: "Telangana",
    boarding: [
      { name: "Gachibowli ORR Junction", landmark: "Adjacent to Care Hospital", offsetMin: -30 },
      { name: "Miyapur Allwyn Cross", landmark: "Near Metro Station Pillar", offsetMin: -18 },
      { name: "Kukatpally KPHB", landmark: "Opp. JNTU Metro Gate", offsetMin: -8 },
      { name: "Ameerpet Metro Station", landmark: "Mythrivanam Complex", offsetMin: 0 },
      { name: "Lakdikapul Stand", landmark: "Near Global Hospital", offsetMin: 12 },
      { name: "MGBS Imlibun Terminal", landmark: "Gowliguda Island Stand", offsetMin: 25 },
      { name: "LB Nagar Ring Road", landmark: "Vijayawada Highway Flyover", offsetMin: 38 },
    ],
    dropping: [
      { name: "Miyapur Allwyn X-Roads", landmark: "NH-65 Entry", offsetMin: -30 },
      { name: "Kukatpally KPHB", landmark: "Near Metro Pillar 715", offsetMin: -18 },
      { name: "Ameerpet / Lakdikapul", landmark: "Central Metro Route", offsetMin: 0 },
      { name: "MGBS Imlibun Terminal", landmark: "Central River Bay", offsetMin: 15 },
      { name: "LB Nagar Circle", landmark: "Inner Ring Exit", offsetMin: 28 },
    ],
  },
  chennai: {
    city: "Chennai",
    state: "Tamil Nadu",
    boarding: [
      { name: "T. Nagar Panagal Park", landmark: "Usman Road Junction", offsetMin: -20 },
      { name: "Koyambedu CMBT Terminus", landmark: "Omni Bus Terminal Bay 5", offsetMin: 0 },
      { name: "Guindy Kathipara Flyover", landmark: "Near Metro Circle", offsetMin: 18 },
      { name: "Perungalathur Stand", landmark: "GST Road Bus Bay", offsetMin: 35 },
      { name: "Kilambakkam KCBT Terminus", landmark: "Vandalur Highway Terminal", offsetMin: 45 },
    ],
    dropping: [
      { name: "Kilambakkam Terminus", landmark: "GST Road Arrival Bay", offsetMin: -35 },
      { name: "Perungalathur / Guindy", landmark: "Outer Bypass Drop", offsetMin: -18 },
      { name: "Koyambedu CMBT Bus Port", landmark: "Main Terminal Exit", offsetMin: 0 },
    ],
  },
  coimbatore: {
    city: "Coimbatore",
    state: "Tamil Nadu",
    boarding: [
      { name: "Gandhipuram Omni Bus Stand", landmark: "Sathy Road Bay 2", offsetMin: 0 },
      { name: "Lakshmi Mills Circle", landmark: "Avinashi Main Road", offsetMin: 12 },
      { name: "Neelambur Bypass", landmark: "L&T Toll Highway Cross", offsetMin: 28 },
    ],
    dropping: [
      { name: "Neelambur Bypass", landmark: "Highway Exit", offsetMin: -20 },
      { name: "Gandhipuram Omni Terminus", landmark: "City Center Hub", offsetMin: 0 },
    ],
  },
  madurai: {
    city: "Madurai",
    state: "Tamil Nadu",
    boarding: [
      { name: "Mattuthavani MGR Terminus", landmark: "Ring Road Omni Bus Bay", offsetMin: 0 },
      { name: "Periyar Bus Stand", landmark: "Opposite Railway Station", offsetMin: 15 },
      { name: "Arappalayam Junction", landmark: "Theni Main Highway", offsetMin: 25 },
    ],
    dropping: [
      { name: "Mattuthavani MGR Stand", landmark: "Arrival Bay", offsetMin: 0 },
      { name: "Periyar Central Stand", landmark: "Central Station", offsetMin: 15 },
    ],
  },
  kochi: {
    city: "Kochi",
    state: "Kerala",
    boarding: [
      { name: "Aluva Bypass Terminal", landmark: "Near Metro Station NH-544", offsetMin: -20 },
      { name: "Edappally Toll Junction", landmark: "Opposite Lulu Mall Gate", offsetMin: -10 },
      { name: "Vyttila Mobility Hub", landmark: "Main Interstate Terminal Bay", offsetMin: 0 },
      { name: "Kaloor Stadium Junction", landmark: "Banerji Road", offsetMin: 12 },
    ],
    dropping: [
      { name: "Aluva / Edappally", landmark: "NH-544 Highway", offsetMin: -18 },
      { name: "Vyttila Mobility Hub", landmark: "Main Arrival Terminal", offsetMin: 0 },
    ],
  },
  thiruvananthapuram: {
    city: "Thiruvananthapuram",
    state: "Kerala",
    boarding: [
      { name: "Thampanoor KSRTC Terminal", landmark: "Opposite Central Station", offsetMin: 0 },
      { name: "Kesavadasapuram Junction", landmark: "MC Road Square", offsetMin: 12 },
      { name: "Kazhakootam Technopark", landmark: "NH-66 Bypass Flyover", offsetMin: 25 },
    ],
    dropping: [
      { name: "Kazhakootam Bypass", landmark: "Technopark Gate", offsetMin: -20 },
      { name: "Thampanoor Terminus", landmark: "City Station Hub", offsetMin: 0 },
    ],
  },
  mysuru: {
    city: "Mysuru",
    state: "Karnataka",
    boarding: [
      { name: "Suburban KSRTC Bus Stand", landmark: "Bangalore-Nilgiri Road", offsetMin: 0 },
      { name: "Columbia Asia Ring Road", landmark: "Bengaluru Highway Cross", offsetMin: 12 },
      { name: "Hootagalli Industrial Gate", landmark: "Ring Junction", offsetMin: 22 },
    ],
    dropping: [
      { name: "Columbia Asia Ring Cross", landmark: "City Entry", offsetMin: -12 },
      { name: "Mysuru Suburban Stand", landmark: "Main Terminal", offsetMin: 0 },
    ],
  },
  mangaluru: {
    city: "Mangaluru",
    state: "Karnataka",
    boarding: [
      { name: "KSRTC Bejai Bus Stand", landmark: "Lalbagh Main Road", offsetMin: 0 },
      { name: "Jyothi Circle / Hampankatta", landmark: "Central Market Square", offsetMin: 10 },
      { name: "Pumpwell Mahaveer Circle", landmark: "NH-66 Flyover Crossing", offsetMin: 20 },
      { name: "Surathkal NITK Junction", landmark: "Udupi Highway", offsetMin: 35 },
    ],
    dropping: [
      { name: "Pumpwell Circle", landmark: "NH-66 Entry", offsetMin: -12 },
      { name: "Bejai / Lalbagh Stand", landmark: "Main Terminal", offsetMin: 0 },
    ],
  },
  kolkata: {
    city: "Kolkata",
    state: "West Bengal",
    boarding: [
      { name: "Salt Lake Karunamoyee", landmark: "Central Park International Stand", offsetMin: -20 },
      { name: "Esplanade Bus Terminus", landmark: "Opposite Metro Channel Crossing", offsetMin: 0 },
      { name: "Babughat Strand Road", landmark: "Near Eden Gardens River Bay", offsetMin: 10 },
      { name: "Howrah Santragachi", landmark: "Kona Expressway Flyover", offsetMin: 25 },
    ],
    dropping: [
      { name: "Santragachi Kona Gate", landmark: "NH-16 Entry", offsetMin: -20 },
      { name: "Esplanade Terminus", landmark: "Central Dharmatala Hub", offsetMin: 0 },
      { name: "Karunamoyee Salt Lake", landmark: "Sector V Link", offsetMin: 18 },
    ],
  },
  patna: {
    city: "Patna",
    state: "Bihar",
    boarding: [
      { name: "Gandhi Maidan Terminal", landmark: "Opposite Kargil Chowk", offsetMin: -15 },
      { name: "Patliputra ISBT Bairiya", landmark: "New Zero Mile Expressway Bay", offsetMin: 0 },
      { name: "Zero Mile Bypass", landmark: "NH-31 Highway Point", offsetMin: 12 },
    ],
    dropping: [
      { name: "Zero Mile", landmark: "Highway Flyover", offsetMin: -10 },
      { name: "Patliputra ISBT", landmark: "Main Arrival Terminal", offsetMin: 0 },
    ],
  },
  chandigarh: {
    city: "Chandigarh",
    state: "Chandigarh",
    boarding: [
      { name: "Sector 17 ISBT", landmark: "City Center Parade Ground", offsetMin: -15 },
      { name: "Sector 43 ISBT Terminal", landmark: "Interstate Bay Counter 6", offsetMin: 0 },
      { name: "Tribune Chowk Flyover", landmark: "Dakshin Marg Cross", offsetMin: 12 },
      { name: "Zirakpur Patiala Flyover", landmark: "Ambala Highway Crossing", offsetMin: 25 },
    ],
    dropping: [
      { name: "Zirakpur Flyover", landmark: "Delhi Highway Entry", offsetMin: -20 },
      { name: "Tribune Chowk", landmark: "Industrial Area Phase II", offsetMin: -10 },
      { name: "Sector 43 ISBT", landmark: "Main Arrival Platform", offsetMin: 0 },
    ],
  },
  bhubaneswar: {
    city: "Bhubaneswar",
    state: "Odisha",
    boarding: [
      { name: "Baramunda ISBT Terminal", landmark: "NH-16 Fire Station Flyover", offsetMin: 0 },
      { name: "Khandagiri Square", landmark: "Opposite Udayagiri Caves Rd", offsetMin: 10 },
      { name: "Jaydev Vihar Circle", landmark: "Nandankanan Link Road", offsetMin: 20 },
      { name: "Vani Vihar Square", landmark: "Cuttack Highway Exit", offsetMin: 30 },
    ],
    dropping: [
      { name: "Vani Vihar / Jaydev Vihar", landmark: "NH-16 Exit", offsetMin: -15 },
      { name: "Baramunda ISBT", landmark: "Main Terminal Arrival", offsetMin: 0 },
    ],
  },
};

function parseMinutesFromTime(t) {
  if (t === undefined || t === null || t === "") return 1380; // 11:00 PM fallback
  const str = String(t).trim().toUpperCase();
  const ampmMatch = str.match(/(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)/);
  if (ampmMatch) {
    let h = parseInt(ampmMatch[1], 10);
    const m = parseInt(ampmMatch[2] || "0", 10);
    const isPm = ampmMatch[3] === "PM";
    if (isPm && h !== 12) h += 12;
    if (!isPm && h === 12) h = 0;
    return h * 60 + m;
  }
  const parts = str.split(":");
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1] || "0", 10) || 0;
  return h * 60 + m;
}

export function addMinutesFormatted(baseTimeStr, offsetMin = 0) {
  const baseMin = parseMinutesFromTime(baseTimeStr);
  let total = (baseMin + offsetMin) % (24 * 60);
  if (total < 0) total += 24 * 60;
  const h = Math.floor(total / 60);
  const m = total % 60;
  const ampm = h >= 12 && h < 24 ? "PM" : "AM";
  const dispH = h % 12 === 0 ? 12 : h % 12;
  const dispM = m < 10 ? `0${m}` : `${m}`;
  return `${dispH}:${dispM} ${ampm}`;
}

function findCityRecord(cityName) {
  const clean = String(cityName || "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  if (!clean) return null;
  if (CITY_DIRECTORY[clean]) {
    const rec = CITY_DIRECTORY[clean];
    return rec.aliasOf ? CITY_DIRECTORY[rec.aliasOf] : rec;
  }
  const matchedKey = Object.keys(CITY_DIRECTORY).find((k) => clean.includes(k));
  if (matchedKey) {
    const rec = CITY_DIRECTORY[matchedKey];
    return rec.aliasOf ? CITY_DIRECTORY[rec.aliasOf] : rec;
  }
  return null;
}

export function getCityBoardingPoints(cityName, departureTime = "23:30") {
  const rec = findCityRecord(cityName);
  const displayCity = rec?.city || (cityName ? cityName.trim() : "City");
  const rawPoints = rec?.boarding || [
    { name: `${displayCity} Central Bus Stand (ST)`, landmark: `Main Market Square, ${displayCity}`, offsetMin: -15 },
    { name: `${displayCity} Highway Toll Plaza`, landmark: `National Highway Bypass Junction`, offsetMin: 0 },
    { name: `${displayCity} Railway Station Road`, landmark: `Opposite Platform 1 Gate`, offsetMin: 15 },
    { name: `${displayCity} Express Flyover`, landmark: `Ring Road Pick-up Bay`, offsetMin: 25 },
  ];

  return rawPoints.map((pt) => {
    const time = addMinutesFormatted(departureTime, pt.offsetMin || 0);
    return {
      name: pt.name,
      landmark: pt.landmark,
      time,
      formatted: `${pt.name} (${time})`,
    };
  });
}

export function getCityDroppingPoints(cityName, arrivalTime = "06:00") {
  const rec = findCityRecord(cityName);
  const displayCity = rec?.city || (cityName ? cityName.trim() : "City");
  const rawPoints = rec?.dropping || [
    { name: `${displayCity} Highway Bypass Junction`, landmark: `Main City Entry Flyover`, offsetMin: -20 },
    { name: `${displayCity} Central Bus Terminus`, landmark: `Opposite Old Bus Stand Square`, offsetMin: 0 },
    { name: `${displayCity} Railway Station Gate`, landmark: `Auto & Cab Prepaid Booth`, offsetMin: 12 },
    { name: `${displayCity} City Ring Road`, landmark: `Outer Transit Hub`, offsetMin: 25 },
  ];

  return rawPoints.map((pt) => {
    const time = addMinutesFormatted(arrivalTime, pt.offsetMin || 0);
    return {
      name: pt.name,
      landmark: pt.landmark,
      time,
      formatted: `${pt.name} (${time})`,
    };
  });
}

