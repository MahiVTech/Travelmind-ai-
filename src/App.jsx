import React, { useState, useEffect } from "react";
import {
  Plane, MapPin, FileText, ShieldAlert, ShieldCheck, Sparkles, Sun, Moon,
  Compass, Utensils, ChevronRight, Check, Camera, Ticket, Car, Phone,
  AlertTriangle, Clock, Navigation, Globe2, Info, Zap, DollarSign, CloudRain,
  Users, Shield, Wallet, Filter, X, CalendarClock
} from "lucide-react";

/* ---------------------------------------------------------------
   DESIGN TOKENS
   Saffron #E8933C (city/food accent), Teal #2DD4BF (safety/positive),
   Coral #FF6B5D (caution/alert only), Ink/Sub per theme below.
   NOTE ON DATA SCOPE: this is a curated sample database (20 Indian
   cities across every region + 20 international destinations across
   6 continents) — not an exhaustive record of every city on earth.
   A truly exhaustive, kept-current dataset needs a real backend fed
   by verified travel/safety data sources, not hand-authored content.
------------------------------------------------------------------*/

const FONT_LINK_ID = "travelmind-fonts";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ---------------- Split-flap ticker ---------------- */
const FLAP_CHARS = "0123456789";
function FlapDigit({ target, dark }) {
  const [display, setDisplay] = useState(target);
  useEffect(() => {
    let frame = 0;
    const start = Math.floor(Math.random() * 10);
    const seq = [];
    for (let i = 0; i < 6; i++) seq.push(FLAP_CHARS[(start + i) % 10]);
    seq.push(target);
    const id = setInterval(() => {
      setDisplay(seq[frame]);
      frame++;
      if (frame >= seq.length) clearInterval(id);
    }, 70);
    return () => clearInterval(id);
  }, [target]);
  return (
    <div className="relative w-[1.15em] h-[1.5em] rounded-[3px] flex items-center justify-center overflow-hidden font-mono text-[1em] font-semibold"
      style={{ background: dark ? "#1B2438" : "#10131A", color: "#E8933C", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)" }}>
      <span>{display}</span>
      <div className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-black/40" />
    </div>
  );
}
function FlapNumber({ value, digits = 2, dark }) {
  const str = String(value).padStart(digits, "0").split("");
  return <div className="flex gap-[2px]">{str.map((d, i) => <FlapDigit key={i} target={d} dark={dark} />)}</div>;
}

/* ------------------------------------------------------------
   DATABASE — 20 India + 20 International destinations
   Each: id, name, country, region, emergency[], hidden[2], food[2],
   safetyAreas[2], tips[2], transport[2]
------------------------------------------------------------ */

const INDIA_CITIES = [
  { id: "delhi", name: "Delhi", country: "India", region: "North India",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Hauz Khas Village ruins", d: "14th-c. madrasa & tank behind the cafés.", t: "Morning or early evening" }, { n: "Lodhi Art District", d: "Open-air murals across a residential colony.", t: "Daytime" }],
    food: [{ n: "Karim's, Jama Masjid", d: "Century-old Mughlai kebabs & korma.", p: "₹300–500" }, { n: "Paranthe Wali Gali", d: "Stuffed parathas, old-Delhi style.", p: "₹100–200" }],
    safety: [{ a: "Connaught Place / Lodhi Colony", r: "Generally safe", note: "Well-lit, tourist police present." }, { a: "Old Delhi lanes after 9 PM", r: "Caution", note: "Narrow, poorly lit — go in groups." }],
    tips: ["Use the Metro's reserved women's coach (marked pink, first coach).", "Prepaid taxi booths at the airport/station are safer than street hailing."],
    transport: [{ n: "Delhi Metro (women's coach)", note: "Fast, cheap, clearly marked reserved coach." }, { n: "App cabs (Uber/Ola)", note: "Trackable, preferred after dark." }] },
  { id: "mumbai", name: "Mumbai", country: "India", region: "West India",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Khotachiwadi lane", d: "Portuguese-era wooden houses in Girgaon.", t: "Daytime" }, { n: "Kanheri Caves, SGNP", d: "2,000-yr-old rock-cut caves inside the national park.", t: "Morning" }],
    food: [{ n: "Bademiya, Colaba", d: "Legendary late-night kebab rolls.", p: "₹200–400" }, { n: "Trishna, Kala Ghoda", d: "Renowned Mangalorean seafood.", p: "₹1200–2000" }],
    safety: [{ a: "Marine Drive / Bandra promenade", r: "Generally safe", note: "Busy late into the night." }, { a: "Local trains after 11 PM", r: "Caution", note: "Use the reserved women's compartment." }],
    tips: ["Local trains have a dedicated, clearly marked women's compartment.", "App cabs are widely trusted; share trip status with someone."],
    transport: [{ n: "Local trains (women's compartment)", note: "Fastest way across the city." }, { n: "App cabs", note: "Widely available, trackable." }] },
  { id: "jaipur", name: "Jaipur", country: "India", region: "Rajasthan",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Panna Meena ka Kund", d: "Symmetric stepwell near Amer, far less crowded than the fort.", t: "Early morning" }, { n: "Nahargarh sunset viewpoint", d: "Walk past the main crowd for a quieter Pink City view.", t: "Late afternoon, in a group" }],
    food: [{ n: "LMB, Johari Bazaar", d: "Rajasthani thali & sweets since 1954.", p: "₹400–700" }, { n: "Rawat Mishthan Bhandar", d: "Famous pyaaz kachori, go before 10 AM.", p: "₹50–150" }],
    safety: [{ a: "MI Road / Johari Bazaar (day)", r: "Generally safe", note: "Heavy tourist police presence." }, { a: "Old City lanes after dark", r: "Caution", note: "Stick to main bazaar roads." }],
    tips: ["Rajasthan Police runs a visible 'Pink Patrol' near major markets.", "Pre-book cabs via your hotel for fort visits."],
    transport: [{ n: "Hotel-arranged cabs", note: "Best for fort/outskirt trips." }, { n: "App autos", note: "Common and metered." }] },
  { id: "goa", name: "Goa (Panaji)", country: "India", region: "West Coast",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Kakolem (Cola) Beach", d: "Secluded lagoon-beach via a short trek.", t: "Daytime, with a group" }, { n: "Fontainhas Latin Quarter", d: "Pastel Portuguese-colonial streets.", t: "Morning" }],
    food: [{ n: "Fisherman's Wharf", d: "Goan seafood thali with river views.", p: "₹600–1000" }, { n: "Mum's Kitchen", d: "Home-style xacuti & sorpotel.", p: "₹700–1200" }],
    safety: [{ a: "Panaji / Candolim strip", r: "Generally safe", note: "Well-lit, active police beats." }, { a: "Isolated beaches after dark", r: "Caution", note: "Minimal lighting past sunset." }],
    tips: ["Verify helmet/license rules if renting a scooter; avoid isolated roads at night.", "Prefer busy beach shacks over empty stretches after sunset."],
    transport: [{ n: "Scooter rental", note: "Popular, verify safety gear/license norms." }, { n: "App cabs", note: "Growing availability in main towns." }] },
  { id: "bangalore", name: "Bangalore", country: "India", region: "South India",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Hesaraghatta Lake", d: "Quiet wetland escape, popular with birdwatchers.", t: "Early morning, in a group" }, { n: "Gavi Gangadhareshwara Cave Temple", d: "Rock-cut temple aligned to Makar Sankranti sunlight.", t: "Daytime" }],
    food: [{ n: "Vidyarthi Bhavan", d: "Legendary crispy masala dosa since 1943.", p: "₹80–150" }, { n: "Toit, Indiranagar", d: "Popular microbrewery, wood-fired pizza.", p: "₹800–1400" }],
    safety: [{ a: "Indiranagar / Koramangala / MG Rd", r: "Generally safe", note: "Well-lit, busy nightlife areas." }, { a: "Outer ring road late at night", r: "Caution", note: "Poor lighting in patches." }],
    tips: ["Namma Yatri and other app autos are trackable and widely trusted.", "Namma Metro has women's compartments during peak hours."],
    transport: [{ n: "App autos (Namma Yatri, etc.)", note: "Trackable, common." }, { n: "Namma Metro", note: "Women's compartment at peak hours." }] },
  { id: "kolkata", name: "Kolkata", country: "India", region: "East India",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Kumartuli potters' quarter", d: "Riverside neighborhood of clay-idol artisans.", t: "Daytime" }, { n: "Princep Ghat at sunset", d: "Colonial pavilion on the river, calmer than Howrah Bridge.", t: "Evening, populated hours" }],
    food: [{ n: "Flurys, Park Street", d: "Historic bakery-café since 1927.", p: "₹300–600" }, { n: "Kewpie's Kitchen", d: "Home-style Bengali thali.", p: "₹500–800" }],
    safety: [{ a: "Park Street / Salt Lake", r: "Generally safe", note: "Busy, well-lit, relatively calm metro." }, { a: "Narrow North Kolkata lanes at night", r: "Caution", note: "Limited lighting in older lanes." }],
    tips: ["Kolkata Metro has a designated women's section.", "App cabs give a trackable trip record vs. street-hailed taxis."],
    transport: [{ n: "Kolkata Metro", note: "Designated women's section." }, { n: "Yellow taxis / app cabs", note: "Both common." }] },
  { id: "chennai", name: "Chennai", country: "India", region: "South India",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Kapaleeshwarar back streets", d: "Traditional agraharam houses around the temple.", t: "Morning" }, { n: "DakshinaChitra village", d: "Living-museum of South Indian architecture.", t: "Daytime" }],
    food: [{ n: "Murugan Idli Shop", d: "Soft idlis, signature chutneys.", p: "₹100–200" }, { n: "Saravana Bhavan", d: "Reliable South Indian vegetarian chain.", p: "₹200–400" }],
    safety: [{ a: "Anna Nagar / T. Nagar / Besant Nagar", r: "Generally safe", note: "Well-lit, steady footfall." }, { a: "Marina Beach after 10 PM", r: "Caution", note: "Patchy lighting away from the promenade." }],
    tips: ["Suburban trains and metro have women's compartments/coaches.", "Prepaid auto stands exist at Chennai Central and the airport."],
    transport: [{ n: "Metro / suburban rail", note: "Women's coaches available." }, { n: "Prepaid autos", note: "At the airport and Central station." }] },
  { id: "varanasi", name: "Varanasi", country: "India", region: "Uttar Pradesh",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Assi Ghat morning aarti", d: "Calmer alternative to the crowded main ghat aarti.", t: "6 AM" }, { n: "Ramnagar Fort", d: "Lesser-visited fort museum across the river.", t: "Daytime" }],
    food: [{ n: "Kachori Gali", d: "Historic lane of kachori-sabzi breakfast stalls.", p: "₹50–100" }, { n: "Blue Lassi Shop", d: "Century-old lassi with fruit toppings.", p: "₹80–150" }],
    safety: [{ a: "Main ghats during daylight/aarti", r: "Generally safe", note: "Crowded, visible police during aarti." }, { a: "Old-city lanes after dark", r: "Caution", note: "Maze-like, poorly lit." }],
    tips: ["Hire boats only from official ghats with fixed-rate boards.", "A local guide genuinely helps navigate the old-city maze."],
    transport: [{ n: "Official ghat boats", note: "Fixed rates, avoid unmarked touts." }, { n: "App cabs / autos", note: "Available for longer hops." }] },
  { id: "udaipur", name: "Udaipur", country: "India", region: "Rajasthan",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Bagore ki Haveli rooftop", d: "Evening folk-dance shows, quiet lake views.", t: "Evening show" }, { n: "Ambrai Ghat", d: "Quieter lakeside ghat with City Palace views.", t: "Evening" }],
    food: [{ n: "Ambrai Restaurant", d: "Lakeside dining facing City Palace.", p: "₹1000–1800" }, { n: "Millets of Mewar", d: "Wholesome thalis, organic produce.", p: "₹300–500" }],
    safety: [{ a: "Lake Pichola ghats / City Palace", r: "Generally safe", note: "Popular, patrolled evenings." }, { a: "Roads to Monsoon Palace after dark", r: "Caution", note: "Winding, poorly lit — go by pre-booked cab." }],
    tips: ["Book cabs for hilltop sights through your hotel.", "Stick to the lit main promenade after dark."],
    transport: [{ n: "Hotel-arranged cabs", note: "Best for outskirt/hilltop sights." }, { n: "Boat rides", note: "From official ghat counters." }] },
  { id: "rishikesh", name: "Rishikesh", country: "India", region: "Uttarakhand",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Neer Garh Waterfall", d: "Short trek to a multi-tier waterfall.", t: "Morning, with a group" }, { n: "Beatles Ashram", d: "Graffiti-covered abandoned ashram.", t: "Daytime" }],
    food: [{ n: "Chotiwala, Swarg Ashram", d: "Iconic thali right by the Ganga.", p: "₹200–350" }, { n: "German Bakery, Tapovan", d: "Pastries and health bowls.", p: "₹200–400" }],
    safety: [{ a: "Laxman Jhula / Tapovan strip", r: "Generally safe", note: "Busy with pilgrims and travelers." }, { a: "Forest trails alone", r: "Caution", note: "Patchy signal, trek in groups." }],
    tips: ["Trek to waterfalls/trails in a group — signal is patchy.", "Check reviews before solo ashram stays."],
    transport: [{ n: "Shared taxis", note: "Common between ghats and ashrams." }, { n: "Walking (main strip)", note: "Very walkable by day." }] },
  { id: "hyderabad", name: "Hyderabad", country: "India", region: "Telangana",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Paigah Tombs", d: "Ornate, little-visited royal tombs with intricate stucco work.", t: "Daytime" }, { n: "Qutb Shahi Tombs", d: "Quiet domed necropolis, far fewer crowds than Golconda.", t: "Morning" }],
    food: [{ n: "Bawarchi, RTC X Roads", d: "Iconic Hyderabadi biryani.", p: "₹200–400" }, { n: "Pista House", d: "Famous for Osmania biscuits and Irani chai.", p: "₹100–200" }],
    safety: [{ a: "Banjara Hills / Jubilee Hills", r: "Generally safe", note: "Well-lit, upscale, steady police presence." }, { a: "Old City lanes late at night", r: "Caution", note: "Narrow, crowded by day but quiet after dark." }],
    tips: ["Hyderabad's metro has women-friendly, well-lit stations.", "App cabs are the norm for late-night travel."],
    transport: [{ n: "Hyderabad Metro", note: "Modern, well-lit stations." }, { n: "App cabs", note: "Widely available." }] },
  { id: "pune", name: "Pune", country: "India", region: "Maharashtra",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Pataleshwar Cave Temple", d: "8th-century rock-cut temple tucked behind a busy road.", t: "Daytime" }, { n: "Sinhagad Fort back trail", d: "Quieter approach trail away from the main tourist path.", t: "Early morning, in a group" }],
    food: [{ n: "Vaishali, FC Road", d: "Legendary South Indian breakfast spot.", p: "₹100–200" }, { n: "Bedekar Misal", d: "Iconic spicy misal pav.", p: "₹80–150" }],
    safety: [{ a: "Koregaon Park / FC Road", r: "Generally safe", note: "Busy student & expat area, well-lit." }, { a: "Fort trails alone at dusk", r: "Caution", note: "Go in a group, carry a torch." }],
    tips: ["Pune is considered relatively calm for a metro; still avoid empty stretches at night.", "App cabs and autos are both reliable here."],
    transport: [{ n: "App cabs/autos", note: "Reliable and common." }, { n: "PMPML buses", note: "Budget option, busier by day." }] },
  { id: "ahmedabad", name: "Ahmedabad", country: "India", region: "Gujarat",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Adalaj Stepwell", d: "Intricately carved 15th-century stepwell just outside the city.", t: "Daytime" }, { n: "Calico Museum of Textiles", d: "By appointment only, stunning and uncrowded.", t: "Book ahead" }],
    food: [{ n: "Agashiye rooftop", d: "Traditional Gujarati thali on a heritage rooftop.", p: "₹700–1000" }, { n: "Manek Chowk night market", d: "Street food market, very lively evenings.", p: "₹100–250" }],
    safety: [{ a: "CG Road / Law Garden", r: "Generally safe", note: "Busy commercial and market area." }, { a: "Old city lanes after dark", r: "Caution", note: "Narrow, quieter once markets close." }],
    tips: ["Gujarat is a dry state for alcohol — plan accordingly.", "App cabs cover the city well."],
    transport: [{ n: "App cabs", note: "Good coverage." }, { n: "BRTS buses", note: "Efficient dedicated bus corridor." }] },
  { id: "amritsar", name: "Amritsar", country: "India", region: "Punjab",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Partition Museum", d: "Moving, lesser-visited museum near the Golden Temple.", t: "Daytime" }, { n: "Gobindgarh Fort", d: "Restored fort with light-and-sound show, fewer crowds than Wagah.", t: "Evening" }],
    food: [{ n: "Kesar Da Dhaba", d: "Century-old Punjabi vegetarian institution.", p: "₹200–400" }, { n: "Golden Temple langar", d: "Free community meal, open to all — respectful visit, no cost.", p: "Free (donations welcome)" }],
    safety: [{ a: "Golden Temple complex", r: "Generally safe", note: "Well-lit, active 24-hour crowd and security." }, { a: "Wagah Border crowd crush", r: "Caution", note: "Extremely dense crowds — stay with your group." }],
    tips: ["The Golden Temple complex is safe and open around the clock.", "Book Wagah Border transport through your hotel to avoid the crowd scramble."],
    transport: [{ n: "Hotel-arranged cabs", note: "Best for the Wagah Border ceremony." }, { n: "Cycle-rickshaws", note: "Common for short old-city hops." }] },
  { id: "jodhpur", name: "Jodhpur", country: "India", region: "Rajasthan",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Toorji Ka Jhalra stepwell", d: "Beautifully restored stepwell in the heart of the Blue City.", t: "Daytime" }, { n: "Mandore Gardens", d: "Quiet cenotaphs and gardens, far fewer tourists than the fort.", t: "Afternoon" }],
    food: [{ n: "Janta Sweet Home", d: "Legendary mirchi bada and kachori.", p: "₹50–100" }, { n: "Indique rooftop", d: "Views of Mehrangarh Fort while dining.", p: "₹600–1000" }],
    safety: [{ a: "Blue City old town (day)", r: "Generally safe", note: "Busy lanes, tourist-friendly." }, { a: "Fort surroundings after dark", r: "Caution", note: "Quiet once shops close." }],
    tips: ["The old city's blue lanes are best explored on foot by day.", "Pre-book a cab for evening fort/sunset viewpoint visits."],
    transport: [{ n: "Hotel-arranged cabs", note: "For fort/sunset viewpoints." }, { n: "Walking", note: "Old city is very walkable by day." }] },
  { id: "agra", name: "Agra", country: "India", region: "Uttar Pradesh",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Mehtab Bagh", d: "Garden directly across the river from the Taj Mahal, far fewer crowds.", t: "Sunset" }, { n: "Itmad-ud-Daulah (Baby Taj)", d: "Delicate marble tomb, a quieter preview of the Taj's craftsmanship.", t: "Morning" }],
    food: [{ n: "Pinch of Spice", d: "Reliable North Indian & Mughlai, popular with tourists.", p: "₹500–800" }, { n: "Petha shops near Taj Ganj", d: "Agra's famous sweet, many stalls to choose from.", p: "₹50–150" }],
    safety: [{ a: "Taj Ganj tourist area", r: "Generally safe", note: "Heavy tourist police presence near the Taj." }, { a: "Touts near monument entrances", r: "Caution", note: "Persistent unofficial guides — use official guides only." }],
    tips: ["Hire only government-licensed guides at monument entrances.", "Prepaid taxi counters exist at Agra Cantt station."],
    transport: [{ n: "Prepaid taxis", note: "At the railway station." }, { n: "Cycle-rickshaws in Taj Ganj", note: "Short hops near the monument." }] },
  { id: "kochi", name: "Kochi", country: "India", region: "Kerala",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Jew Town back lanes", d: "Antique shops and spice warehouses beyond the main street.", t: "Daytime" }, { n: "Kumbalangi model fishing village", d: "Backwater village with local fishing and toddy tours.", t: "Daytime" }],
    food: [{ n: "Kayees Rahmathulla Hotel", d: "Famous biryani, Kerala-Malabar style.", p: "₹200–350" }, { n: "Fort Kochi seafood shacks", d: "Fresh catch grilled to order by the water.", p: "₹400–800" }],
    safety: [{ a: "Fort Kochi / Mattancherry", r: "Generally safe", note: "Tourist-friendly, well-lit main streets." }, { a: "Backwater areas after dark", r: "Caution", note: "Quiet and remote once daylight tours end." }],
    tips: ["Kerala is generally considered one of India's calmer states for solo travel.", "Book backwater houseboat stays through licensed operators only."],
    transport: [{ n: "Ferries", note: "Scenic and practical between Fort Kochi and Ernakulam." }, { n: "App autos", note: "Available in the main city." }] },
  { id: "mysore", name: "Mysore", country: "India", region: "Karnataka",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Devaraja Market back aisles", d: "Flower and spice market beyond the main tourist entrance.", t: "Morning" }, { n: "Chamundi Hill back steps", d: "Take the ~1000-step stone stairway instead of the road for temple views.", t: "Early morning, in a group" }],
    food: [{ n: "Vinayaka Mylari", d: "Famously soft, ghee-roasted dosa.", p: "₹50–100" }, { n: "RRR Restaurant", d: "Andhra-style thali, very popular locally.", p: "₹200–350" }],
    safety: [{ a: "Mysore Palace / Devaraja Market area", r: "Generally safe", note: "Considered a relatively calm, walkable city." }, { a: "Chamundi Hill steps alone at dusk", r: "Caution", note: "Quiet stretch, better with company." }],
    tips: ["Mysore is often cited as one of India's more walkable, laid-back cities.", "Auto-rickshaws are metered and generally reliable here."],
    transport: [{ n: "Metered auto-rickshaws", note: "Reliable, insist on the meter." }, { n: "Bicycle rentals", note: "City is flat and walkable/bikeable." }] },
  { id: "shimla", name: "Shimla", country: "India", region: "Himachal Pradesh",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Chadwick Falls trail", d: "A quiet forested walk to a waterfall, away from the Mall Road crowds.", t: "Daytime, in a group" }, { n: "Sankat Mochan Temple viewpoint", d: "Hilltop temple with panoramic views, fewer tourists than Jakhu.", t: "Morning" }],
    food: [{ n: "Wake & Bake Café", d: "Popular breakfast spot with mountain views.", p: "₹250–450" }, { n: "Ashiana, Mall Road", d: "Classic Himachali & North Indian fare.", p: "₹300–600" }],
    safety: [{ a: "Mall Road / Ridge", r: "Generally safe", note: "Busy pedestrian zone, well-lit in the evening." }, { a: "Forest trails alone", r: "Caution", note: "Can get isolated quickly outside town — go with others." }],
    tips: ["Weather changes fast — check forecasts before day treks.", "Mall Road is pedestrian-only and considered safe for evening walks."],
    transport: [{ n: "Local taxis/toy train", note: "For hill routes and nearby towns." }, { n: "Walking (Mall Road)", note: "Main area is pedestrian-only." }] },
  { id: "darjeeling", name: "Darjeeling", country: "India", region: "West Bengal",
    emergency: [{ l: "National Emergency", n: "112" }, { l: "Women's Helpline", n: "1091" }],
    hidden: [{ n: "Lebong Tea Estate trail", d: "Walk through working tea gardens away from the main viewpoints.", t: "Morning" }, { n: "Japanese Peace Pagoda", d: "Quiet hilltop pagoda with valley views, uncrowded.", t: "Daytime" }],
    food: [{ n: "Glenary's", d: "Historic bakery-café with mountain views.", p: "₹250–450" }, { n: "Kunga Restaurant", d: "Tibetan momos and thukpa.", p: "₹150–300" }],
    safety: [{ a: "Mall Road / Chowrasta", r: "Generally safe", note: "Central, well-lit, busy with tourists." }, { a: "Tea garden trails alone", r: "Caution", note: "Remote — better explored with a guide or group." }],
    tips: ["Book the early-morning Tiger Hill sunrise trip through a registered operator.", "Layer up — weather shifts quickly at this elevation."],
    transport: [{ n: "Shared jeeps", note: "Common for Tiger Hill and nearby routes." }, { n: "Toy train", note: "Scenic, mainly for short heritage rides." }] },
];

const INTERNATIONAL = [
  { id: "paris", name: "Paris", country: "France", region: "Europe",
    emergency: [{ l: "General Emergency", n: "112" }, { l: "Police", n: "17" }],
    hidden: [{ n: "Rue Crémieux", d: "Pastel-painted pedestrian lane, quiet outside Instagram peak hours.", t: "Early morning" }, { n: "Coulée Verte René-Dumont", d: "Elevated park walkway, a quieter precursor to NYC's High Line.", t: "Daytime" }],
    food: [{ n: "Marché des Enfants Rouges", d: "Paris's oldest covered market, varied stalls.", p: "€10–20" }, { n: "Breizh Café", d: "Modern take on Breton crêpes.", p: "€12–20" }],
    safety: [{ a: "Le Marais / Saint-Germain", r: "Generally safe", note: "Busy, well-lit, tourist-friendly." }, { a: "Certain Métro lines late at night", r: "Caution", note: "Stay alert for pickpocketing, especially on crowded lines." }],
    tips: ["Keep bags zipped and in front of you on the Métro and near major landmarks.", "Official taxis have a lit rooftop sign — avoid unlicensed drivers touting outside stations."],
    transport: [{ n: "Métro/RER", note: "Extensive, avoid empty carriages late at night." }, { n: "App cabs (Uber/Bolt)", note: "Reliable, trackable." }] },
  { id: "rome", name: "Rome", country: "Italy", region: "Europe",
    emergency: [{ l: "General Emergency", n: "112" }],
    hidden: [{ n: "Aventine Keyhole", d: "Famous keyhole view of St. Peter's dome from a quiet hilltop.", t: "Daytime" }, { n: "Quartiere Coppedè", d: "Eclectic, fairy-tale architecture district, off the main tourist trail.", t: "Daytime" }],
    food: [{ n: "Trattoria da Enzo, Trastevere", d: "Classic Roman cacio e pepe.", p: "€15–25" }, { n: "Testaccio Market food stalls", d: "Local, non-touristy Roman street food.", p: "€8–15" }],
    safety: [{ a: "Trastevere / Centro Storico", r: "Generally safe", note: "Busy, well-lit tourist zones." }, { a: "Termini Station area late at night", r: "Caution", note: "Watch belongings; area gets quieter and less monitored after midnight." }],
    tips: ["Stick to licensed white taxis from official ranks, not touts.", "Pickpocketing near major sights (Colosseum, Trevi Fountain) is common — stay aware."],
    transport: [{ n: "Metro/buses", note: "Good coverage of central Rome." }, { n: "Licensed white taxis", note: "Use official ranks or apps, not street touts." }] },
  { id: "barcelona", name: "Barcelona", country: "Spain", region: "Europe",
    emergency: [{ l: "General Emergency", n: "112" }],
    hidden: [{ n: "Bunkers del Carmel", d: "Old anti-aircraft bunkers with a 360° city view, popular with locals at sunset.", t: "Evening, with a group" }, { n: "Gràcia neighborhood squares", d: "Quiet plazas away from Las Ramblas crowds.", t: "Daytime/evening" }],
    food: [{ n: "La Boqueria back stalls", d: "Fresh produce and tapas away from the entrance crowds.", p: "€10–20" }, { n: "El Xampanyet, El Born", d: "Classic cava-and-tapas bar.", p: "€15–25" }],
    safety: [{ a: "Eixample / Gràcia", r: "Generally safe", note: "Residential, well-lit." }, { a: "Las Ramblas at night", r: "Caution", note: "Known pickpocketing hotspot, especially crowded evenings." }],
    tips: ["Las Ramblas and the Metro are pickpocketing hotspots — keep bags close.", "Use licensed black-and-yellow taxis or app cabs after dark."],
    transport: [{ n: "Metro", note: "Extensive, watch belongings in crowds." }, { n: "App cabs", note: "Reliable alternative at night." }] },
  { id: "london", name: "London", country: "UK", region: "Europe",
    emergency: [{ l: "Emergency", n: "999" }, { l: "Non-emergency police", n: "101" }],
    hidden: [{ n: "Postman's Park", d: "Small memorial garden tucked behind office buildings near St. Paul's.", t: "Daytime" }, { n: "Leadenhall Market", d: "Ornate Victorian arcade, quieter outside lunch hours.", t: "Weekday mornings" }],
    food: [{ n: "Borough Market", d: "Long-running food market with global stalls.", p: "£10–20" }, { n: "Dishoom", d: "Popular Bombay-café-style Indian food.", p: "£20–30" }],
    safety: [{ a: "Central Zone 1 (South Bank, Covent Garden)", r: "Generally safe", note: "Busy, well-lit, heavy CCTV coverage." }, { a: "Certain outer areas late at night", r: "Caution", note: "Check local advisories for specific boroughs." }],
    tips: ["Night Tube and licensed black cabs are reliable late-night options.", "Avoid unlicensed minicabs touting outside clubs — book through an app instead."],
    transport: [{ n: "Black cabs", note: "Licensed, trustworthy, hail on the street." }, { n: "Night Tube / buses", note: "Runs late on weekends on key lines." }] },
  { id: "bangkok", name: "Bangkok", country: "Thailand", region: "Southeast Asia",
    emergency: [{ l: "Tourist Police", n: "1155" }, { l: "General Emergency", n: "191" }],
    hidden: [{ n: "Bang Krachao ('Green Lung')", d: "Jungle-like river island reachable by ferry, popular for cycling.", t: "Daytime" }, { n: "Talat Noi", d: "Old Chinese-Thai quarter with street art, quieter than Chinatown proper.", t: "Daytime" }],
    food: [{ n: "Jay Fai", d: "Michelin-starred street-food stall (expect a wait).", p: "฿400–1000" }, { n: "Or Tor Kor Market", d: "High-quality, less touristy food market.", p: "฿100–250" }],
    safety: [{ a: "Sukhumvit / Siam area", r: "Generally safe", note: "Busy, well-lit, tourist-friendly." }, { a: "Isolated sois (side streets) late at night", r: "Caution", note: "Quieter and less monitored after midnight." }],
    tips: ["Use Grab (the regional ride app) over unmetered street taxis to avoid overcharging.", "Tourist Police (1155) speak English and are used to assisting visitors."],
    transport: [{ n: "Grab", note: "Regional app-cab equivalent of Uber." }, { n: "BTS Skytrain/MRT", note: "Fast, avoids traffic and is well-monitored." }] },
  { id: "tokyo", name: "Tokyo", country: "Japan", region: "East Asia",
    emergency: [{ l: "Police", n: "110" }, { l: "Ambulance/Fire", n: "119" }],
    hidden: [{ n: "Yanaka Ginza", d: "Old-town shopping street that survived WWII bombing, very local feel.", t: "Daytime" }, { n: "Nezu Shrine", d: "Quiet shrine with a tunnel of torii gates, far less crowded than Fushimi Inari.", t: "Morning" }],
    food: [{ n: "Tsukiji Outer Market", d: "Fresh seafood stalls and street snacks.", p: "¥1000–2500" }, { n: "Omoide Yokocho, Shinjuku", d: "Tiny alleyway yakitori bars.", p: "¥1500–3000" }],
    safety: [{ a: "Most central wards (Shibuya, Shinjuku main streets)", r: "Generally safe", note: "Japan is widely regarded as very safe even late at night, though basic caution still applies." }, { a: "Kabukicho nightlife touts", r: "Caution", note: "Avoid following touts to unlisted bars — some run scam pricing." }],
    tips: ["Trains have women-only carriages during rush hour, marked on the platform.", "Japan's low street-crime rate is well documented, but scam bars in nightlife districts still target tourists."],
    transport: [{ n: "Trains (women-only cars at rush hour)", note: "Extremely reliable and punctual." }, { n: "App taxis (GO app)", note: "Standard for late-night or luggage-heavy trips." }] },
  { id: "bali", name: "Bali (Denpasar/Ubud)", country: "Indonesia", region: "Southeast Asia",
    emergency: [{ l: "General Emergency", n: "112" }, { l: "Police", n: "110" }],
    hidden: [{ n: "Tukad Cepung Waterfall", d: "Hidden waterfall in a narrow canyon, best with a local guide.", t: "Morning" }, { n: "Sidemen Valley", d: "Rice-terrace valley far less touristy than Tegallalang.", t: "Daytime" }],
    food: [{ n: "Warung Babi Guling Ibu Oka, Ubud", d: "Famous Balinese suckling pig.", p: "Rp 50,000–100,000" }, { n: "Local warungs off the main strip", d: "Cheaper, more authentic than beach-road restaurants.", p: "Rp 30,000–70,000" }],
    safety: [{ a: "Ubud / Seminyak main areas", r: "Generally safe", note: "Tourist-friendly, busy in the evenings." }, { a: "Scooter riding at night on rural roads", r: "Caution", note: "Poor lighting and road conditions outside main towns." }],
    tips: ["Grab/Gojek are the standard app-cab options island-wide.", "If renting a scooter, an international driving permit and helmet are strongly advised — road safety standards vary."],
    transport: [{ n: "Grab / Gojek", note: "App-based cabs and bike-taxis." }, { n: "Scooter rental", note: "Popular but riskier — check road conditions." }] },
  { id: "dubai", name: "Dubai", country: "UAE", region: "Middle East",
    emergency: [{ l: "Police", n: "999" }, { l: "Ambulance", n: "998" }],
    hidden: [{ n: "Al Fahidi Historical District", d: "Wind-tower architecture and quiet courtyards near the creek.", t: "Daytime" }, { n: "Al Seef old town", d: "Recreated heritage waterfront, quieter than Downtown.", t: "Evening" }],
    food: [{ n: "Al Ustad Special Kabab", d: "Old-school Persian kebabs, a Dubai institution.", p: "AED 30–60" }, { n: "Ravi Restaurant", d: "Long-running Pakistani eatery, popular with locals.", p: "AED 20–50" }],
    safety: [{ a: "Downtown / Marina / Deira", r: "Generally safe", note: "Dubai has a low reported street-crime rate and heavy policing." }, { a: "General local laws", r: "Caution", note: "UAE has strict laws on public behavior, dress, and alcohol — worth reviewing before arrival." }],
    tips: ["Dubai is widely regarded as very safe for solo women travelers, but local laws around dress and conduct are stricter than many home countries.", "The Careem and Uber apps are both standard and reliable here."],
    transport: [{ n: "Careem / Uber", note: "Standard app-cabs, widely used." }, { n: "Dubai Metro", note: "Has a women & children-only carriage." }] },
  { id: "newyork", name: "New York City", country: "USA", region: "North America",
    emergency: [{ l: "Emergency", n: "911" }],
    hidden: [{ n: "The Little Island (Pier 55)", d: "Elevated park on the Hudson, less crowded than the High Line.", t: "Daytime" }, { n: "Green-Wood Cemetery", d: "Historic cemetery with skyline views, popular with birders.", t: "Daytime" }],
    food: [{ n: "Katz's Delicatessen", d: "Iconic pastrami sandwiches since 1888.", p: "$25–35" }, { n: "Smorgasburg (weekends)", d: "Large open-air food market in Brooklyn.", p: "$10–20" }],
    safety: [{ a: "Manhattan core (Midtown, Village, UWS)", r: "Generally safe", note: "Busy and well-lit most hours." }, { a: "Certain subway lines/stations late at night", r: "Caution", note: "Stay in populated cars, be aware of surroundings." }],
    tips: ["Standing near the conductor's car on the subway late at night is a common local habit.", "Licensed yellow cabs and app cabs are both reliable; avoid unmarked 'gypsy cabs' offered outside airports."],
    transport: [{ n: "Subway", note: "24/7 but stay alert late at night." }, { n: "Yellow cabs / app cabs", note: "Both reliable and metered/tracked." }] },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", region: "Southeast Asia",
    emergency: [{ l: "Police", n: "113" }, { l: "Ambulance", n: "115" }],
    hidden: [{ n: "Train Street", d: "Narrow residential street a train passes through daily — check current access rules on arrival.", t: "Scheduled train times only" }, { n: "Long Bien Bridge market", d: "Local morning market under the historic bridge.", t: "Early morning" }],
    food: [{ n: "Bun Cha Huong Lien", d: "Famous grilled pork noodle dish.", p: "₫60,000–100,000" }, { n: "Old Quarter street-food stalls", d: "Pho, banh mi, egg coffee — best explored with a food-tour guide first visit.", p: "₫30,000–80,000" }],
    safety: [{ a: "Old Quarter / Hoan Kiem Lake", r: "Generally safe", note: "Busy, tourist-friendly, well-lit." }, { a: "Crossing traffic-heavy streets", r: "Caution", note: "Chaotic traffic is the main hazard, not crime — cross slowly and steadily." }],
    tips: ["The biggest everyday risk here is traffic, not crime — cross streets at a steady, predictable pace.", "Grab is the standard app-cab option and helps avoid taxi meter scams."],
    transport: [{ n: "Grab", note: "Avoids common taxi-meter scams." }, { n: "Walking (Old Quarter)", note: "Compact and walkable, mind the traffic." }] },
  { id: "istanbul", name: "Istanbul", country: "Turkey", region: "Europe/Asia",
    emergency: [{ l: "General Emergency", n: "112" }],
    hidden: [{ n: "Balat neighborhood", d: "Colorful old houses and antique shops, quieter than Sultanahmet.", t: "Daytime" }, { n: "Süleymaniye Mosque courtyard", d: "Panoramic Golden Horn views with far fewer tourists than Hagia Sophia.", t: "Daytime" }],
    food: [{ n: "Karaköy Lokantası", d: "Classic Turkish meze and mains.", p: "₺400–700" }, { n: "Balık ekmek stalls, Eminönü", d: "Grilled fish sandwiches by the water.", p: "₺100–150" }],
    safety: [{ a: "Sultanahmet / Beyoğlu main streets", r: "Generally safe", note: "Busy tourist areas, well patrolled." }, { a: "Late-night bar-district touts", r: "Caution", note: "Some venues target tourists with inflated bills — confirm prices upfront." }],
    tips: ["Confirm prices before ordering in nightlife districts to avoid inflated tourist bills.", "The tram and metro are reliable and well-used by locals."],
    transport: [{ n: "Tram / Metro", note: "Reliable, connects major sights." }, { n: "BiTaksi / Uber", note: "App-based, more transparent pricing than street hails." }] },
  { id: "athens", name: "Athens", country: "Greece", region: "Europe",
    emergency: [{ l: "General Emergency", n: "112" }, { l: "Tourist Police", n: "171" }],
    hidden: [{ n: "Anafiotika", d: "Whitewashed Cycladic-style village tucked beneath the Acropolis.", t: "Daytime" }, { n: "Filopappou Hill", d: "Quiet hill with Acropolis views, far fewer crowds.", t: "Sunset, with others" }],
    food: [{ n: "O Thanasis, Monastiraki", d: "Long-running kebab and souvlaki spot.", p: "€8–15" }, { n: "Central Market (Varvakios)", d: "Local produce and meze stalls.", p: "€10–20" }],
    safety: [{ a: "Plaka / Monastiraki", r: "Generally safe", note: "Tourist-heavy, well-lit in the evenings." }, { a: "Omonia Square area at night", r: "Caution", note: "Can feel less comfortable after dark — many travelers avoid lingering there." }],
    tips: ["Greece has a dedicated Tourist Police line (171) that speaks English.", "Taxis in Athens are metered — confirm the meter is running."],
    transport: [{ n: "Metro", note: "Clean, efficient, connects the airport." }, { n: "Metered taxis", note: "Confirm the meter is on." }] },
  { id: "marrakech", name: "Marrakech", country: "Morocco", region: "North Africa",
    emergency: [{ l: "Police", n: "19" }, { l: "Ambulance", n: "15" }],
    hidden: [{ n: "Le Jardin Secret", d: "Restored historic riad gardens, quieter than Majorelle Garden.", t: "Daytime" }, { n: "Sidi Ghanem industrial art district", d: "Design studios and workshops outside the medina.", t: "Daytime" }],
    food: [{ n: "Nomad, Medina", d: "Modern Moroccan rooftop dining.", p: "150–300 MAD" }, { n: "Jemaa el-Fnaa food stalls", d: "Classic square food stalls — go with a guide the first time.", p: "50–120 MAD" }],
    safety: [{ a: "Gueliz (new town) / main medina by day", r: "Generally safe", note: "Busy, tourist-friendly." }, { a: "Medina's narrow alleys after dark", r: "Caution", note: "Easy to get lost; unofficial 'guides' sometimes pressure tourists for tips." }],
    tips: ["Politely but firmly decline unsolicited 'guides' in the medina — hire one through your riad instead.", "Dress modestly to align with local norms and reduce unwanted attention, especially outside tourist zones."],
    transport: [{ n: "Hotel/riad-arranged taxis", note: "Avoid unmetered street taxis when possible." }, { n: "Walking (medina, daytime)", note: "Very walkable but easy to lose orientation." }] },
  { id: "cairo", name: "Cairo", country: "Egypt", region: "North Africa",
    emergency: [{ l: "Police", n: "122" }, { l: "Ambulance", n: "123" }],
    hidden: [{ n: "Al-Azhar Park", d: "Green hilltop park with Old Cairo skyline views, away from crowds.", t: "Late afternoon" }, { n: "Coptic Cairo back lanes", d: "Ancient churches and quiet alleys, less touristy than Giza.", t: "Daytime" }],
    food: [{ n: "Koshary Abou Tarek", d: "Cairo's most famous koshary (lentil-rice-pasta dish).", p: "EGP 40–80" }, { n: "El Fishawy Café, Khan el-Khalili", d: "Historic café in the old bazaar.", p: "EGP 50–100" }],
    safety: [{ a: "Zamalek / Downtown by day", r: "Generally safe", note: "Busy, tourist-friendly areas." }, { a: "Crowded tourist sites (persistent vendors)", r: "Caution", note: "Persistent selling/haggling pressure is common — firm, polite refusal usually works." }],
    tips: ["Dress modestly, especially outside upscale/tourist areas, to align with local norms.", "Book a licensed guide through your hotel for Giza/Pyramids visits to avoid overcharging."],
    transport: [{ n: "Uber/Careem", note: "Common and helps avoid taxi haggling." }, { n: "Cairo Metro (women's carriage)", note: "Has a designated women-only car." }] },
  { id: "mexicocity", name: "Mexico City", country: "Mexico", region: "Latin America",
    emergency: [{ l: "Emergency", n: "911" }],
    hidden: [{ n: "Coyoacán back streets", d: "Colorful colonial neighborhood beyond the main Frida Kahlo Museum crowds.", t: "Daytime" }, { n: "Xochimilco's quieter canals", d: "Ask for a canal route away from the busiest trajinera party zone.", t: "Weekday mornings" }],
    food: [{ n: "Mercado de San Juan", d: "Gourmet market known for exotic ingredients and tastings.", p: "$150–300 MXN" }, { n: "El Moro Churrería", d: "24-hour churros-and-chocolate institution.", p: "$60–100 MXN" }],
    safety: [{ a: "Roma Norte / Condesa / Polanco", r: "Generally safe", note: "Popular with tourists and expats, well-lit." }, { a: "Certain outer boroughs at night", r: "Caution", note: "Safety varies significantly by neighborhood — check current advice before venturing far off the tourist map." }],
    tips: ["Use app-based cabs (Uber/Didi) rather than hailing taxis on the street.", "Mexico City's safety varies block by block — ask your hotel which specific streets to avoid at night."],
    transport: [{ n: "Uber / Didi", note: "Preferred over street-hailed taxis." }, { n: "Metro (women & children car)", note: "Has a reserved car during peak hours." }] },
  { id: "cusco", name: "Cusco", country: "Peru", region: "Latin America",
    emergency: [{ l: "Police", n: "105" }, { l: "Tourist Police", n: "0842-2635" }],
    hidden: [{ n: "San Blas artisan quarter", d: "Steep cobblestone streets full of small workshops, quieter than the main plaza.", t: "Daytime" }, { n: "Q'enqo ruins", d: "Lesser-visited Inca site near Sacsayhuamán, usually far less crowded.", t: "Daytime" }],
    food: [{ n: "Mercado San Pedro", d: "Local market with juice bars and traditional dishes.", p: "S/10–25" }, { n: "Chicha por Gastón Acurio", d: "Modern Andean-Peruvian cuisine.", p: "S/60–120" }],
    safety: [{ a: "Plaza de Armas / San Blas by day", r: "Generally safe", note: "Busy tourist center." }, { a: "Solo travel at high altitude/remote trails", r: "Caution", note: "Altitude sickness is a bigger practical risk than crime here — acclimatize before trekking." }],
    tips: ["Acclimatize a day or two before any trekking — altitude sickness is common and serious.", "Use officially registered tour operators for Inca Trail/Machu Picchu treks."],
    transport: [{ n: "Registered tour operators", note: "Essential for trekking routes." }, { n: "Taxis (agree fare beforehand)", note: "Not usually metered — confirm price first." }] },
  { id: "kathmandu", name: "Kathmandu", country: "Nepal", region: "South Asia",
    emergency: [{ l: "Police", n: "100" }, { l: "Ambulance", n: "102" }],
    hidden: [{ n: "Kirtipur old town", d: "Hilltop Newari town with temples, far fewer tourists than Bhaktapur.", t: "Daytime" }, { n: "Shivapuri Nagarjun National Park trails", d: "Quiet forest trails just outside the city.", t: "Morning, with a group" }],
    food: [{ n: "Thamel momo shops", d: "Nepal's beloved dumplings, many small family-run spots.", p: "NPR 150–300" }, { n: "Bhojan Griha", d: "Traditional Nepali multi-course set meal in a heritage house.", p: "NPR 800–1500" }],
    safety: [{ a: "Thamel / Durbar Square by day", r: "Generally safe", note: "Tourist-heavy, busy streets." }, { a: "Trekking alone in remote regions", r: "Caution", note: "Register your trek (TIMS) and avoid very remote solo trekking." }],
    tips: ["Register treks through TIMS and consider a licensed guide for anything beyond short day walks.", "Kathmandu's power/water infrastructure can be unpredictable — keep a backup power bank."],
    transport: [{ n: "Registered trekking guides", note: "Recommended for multi-day treks." }, { n: "App cabs (Pathao, InDrive)", note: "Common in the city." }] },
  { id: "colombo", name: "Colombo", country: "Sri Lanka", region: "South Asia",
    emergency: [{ l: "Police", n: "119" }, { l: "Ambulance", n: "1990" }],
    hidden: [{ n: "Old Dutch Hospital precinct", d: "Restored colonial building with cafés, quieter than Galle Face.", t: "Daytime" }, { n: "Beira Lake back paths", d: "Lakeside walk away from the main promenade crowds.", t: "Late afternoon" }],
    food: [{ n: "Ministry of Crab", d: "Renowned for Sri Lankan crab dishes.", p: "LKR 3000–6000" }, { n: "Local kottu roti stalls, Pettah", d: "Iconic chopped-roti street dish.", p: "LKR 300–600" }],
    safety: [{ a: "Galle Face Green / Colombo 7", r: "Generally safe", note: "Popular evening promenade, well-lit." }, { a: "Pettah market late in the day", r: "Caution", note: "Very crowded, watch belongings closely." }],
    tips: ["Sri Lanka is generally considered welcoming for solo women travelers, though basic city precautions still apply.", "App cabs (PickMe) are the standard local option."],
    transport: [{ n: "PickMe app", note: "Local Uber-equivalent, widely used." }, { n: "Tuk-tuks (agree fare or use the meter)", note: "Common for short hops." }] },
  { id: "sydney", name: "Sydney", country: "Australia", region: "Oceania",
    emergency: [{ l: "Emergency", n: "000" }],
    hidden: [{ n: "Wendy's Secret Garden", d: "Hidden harbourside garden near Lavender Bay, few tourists know of it.", t: "Daytime" }, { n: "Cockatoo Island", d: "Former shipyard/prison island, short ferry ride from the CBD.", t: "Daytime" }],
    food: [{ n: "Sydney Fish Market", d: "Fresh seafood, casual harbor-side eating.", p: "$20–40" }, { n: "Spice Alley, Chippendale", d: "Pan-Asian hawker-style laneway food.", p: "$12–20" }],
    safety: [{ a: "CBD / Circular Quay / Bondi", r: "Generally safe", note: "Well-lit, busy, low reported crime relative to many major cities." }, { a: "Kings Cross nightlife strip late at night", r: "Caution", note: "Busier bar district — stay with friends late at night." }],
    tips: ["Sydney is widely rated as one of the safer major cities for solo women travelers.", "Public transport (trains/buses) runs late on weekends with reasonable safety."],
    transport: [{ n: "Trains/buses (Opal card)", note: "Efficient, covers most of the city." }, { n: "App cabs (Uber/Didi)", note: "Standard for late-night trips." }] },
  { id: "capetown", name: "Cape Town", country: "South Africa", region: "Africa",
    emergency: [{ l: "Police", n: "10111" }, { l: "General Emergency (mobile)", n: "112" }],
    hidden: [{ n: "Bo-Kaap colorful streets", d: "Historic Cape Malay quarter, best visited respectfully with a local guide.", t: "Daytime" }, { n: "Silvermine Nature Reserve", d: "Quieter hiking than Table Mountain, good views with fewer crowds.", t: "Daytime, in a group" }],
    food: [{ n: "Mzoli's, Gugulethu", d: "Famous township braai (BBQ) — best visited with a local tour.", p: "R100–200" }, { n: "Old Biscuit Mill Market", d: "Popular Saturday food and design market.", p: "R80–200" }],
    safety: [{ a: "V&A Waterfront / City Bowl by day", r: "Generally safe", note: "Tourist-heavy, well patrolled." }, { a: "Townships and isolated areas unguided", r: "Caution", note: "Best visited with a reputable local guide/tour rather than independently, especially after dark." }],
    tips: ["Book a reputable local guide for township visits rather than going independently.", "Avoid walking alone after dark, even in central areas — use app cabs instead."],
    transport: [{ n: "App cabs (Uber/Bolt)", note: "Strongly preferred over walking alone at night." }, { n: "Guided tours", note: "Recommended for townships and hiking trails." }] },
];

const ALL_DESTINATIONS = [...INDIA_CITIES, ...INTERNATIONAL];
const COUNTRIES = [...new Set(ALL_DESTINATIONS.map((d) => d.country))];

/* ------------------------------------------------------------
   LIGHTWEIGHT "AI" REASONING LAYER
   Everything below is rule-based logic computed from the real
   destination data above (not a live model call) — but it's what
   turns static cards into something that looks like it's thinking.
------------------------------------------------------------ */

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function getMockWeather(city) {
  const seed = hashSeed(city.id);
  const conditions = ["Sunny", "Partly cloudy", "Clear skies", "Light haze", "Warm & breezy"];
  const temp = 18 + (seed % 16);
  const rain = seed % 5 === 0 ? 40 + (seed % 30) : 5 + (seed % 15);
  return { condition: conditions[seed % conditions.length], temp, rain };
}

function computeSafetyScore(city) {
  const safeCount = city.safety.filter((s) => s.r === "Generally safe").length;
  const cautionCount = city.safety.filter((s) => s.r === "Caution").length;
  let score = 72 + safeCount * 9 - cautionCount * 7;
  score = Math.max(38, Math.min(97, score));
  const notes = city.safety.map((s) => s.note).join(" ").toLowerCase();
  const pickpocket = notes.includes("pickpocket") || notes.includes("overcharg") || notes.includes("scam") ? "Medium" : "Low";
  const crowd = notes.includes("crowd") || notes.includes("busy") || notes.includes("dense") ? "Medium" : "Low";
  const goodTransport = city.transport.some((t) => /metro|train|tube|subway|rail/i.test(t.n));
  const policeVisible = notes.includes("police") || notes.includes("patrol") || notes.includes("guide");
  const cautionArea = city.safety.find((s) => s.r === "Caution");
  const recommendation = cautionArea
    ? `${cautionArea.note} Keep this in mind especially around ${cautionArea.a}.`
    : `No major caution zones flagged for ${city.name} right now — standard precautions still apply.`;
  return {
    score,
    pickpocket,
    crowd,
    weatherRisk: getMockWeather(city).rain > 35 ? "Watch for rain" : "Safe",
    transport: goodTransport ? "Good" : "Fair",
    police: policeVisible ? "High" : "Moderate",
    recommendation,
  };
}

const DISCOVERY_REASONS = [
  "Because it's far less crowded than the main tourist route",
  "Trending with locals more than with tourists",
  "A great pick if you're into photography",
  "Fits a budget-conscious traveler",
  "Best experienced early, before the crowds arrive",
];
function getDiscoveryReason(item, index) {
  const seed = hashSeed(item.n) + index;
  return DISCOVERY_REASONS[seed % DISCOVERY_REASONS.length];
}

const FOOD_FILTERS = ["Vegetarian-friendly", "Budget-friendly", "Authentic local", "Mild / not spicy"];
function matchesFoodFilter(item, filter) {
  const d = (item.n + " " + item.d).toLowerCase();
  if (filter === "Vegetarian-friendly") return !/kebab|meat|pork|crab|seafood|mutton|beef|biryani|fish|prawn/.test(d);
  if (filter === "Budget-friendly") return /street|stall|market|shop|bakery|₹5|₹1|₹2|₹3|฿1|฿2|₫/.test(d + " " + (item.p || ""));
  if (filter === "Authentic local") return /iconic|legendary|century|historic|famous|since|old/i.test(d);
  if (filter === "Mild / not spicy") return !/spicy|chili|chilli|masala|kebab/i.test(d);
  return true;
}

function getCabRecommendations(city) {
  const list = city.transport;
  if (!list.length) return null;
  const fastest = list.find((t) => /metro|train|tube|subway|rail|skytrain/i.test(t.n)) || list[0];
  const safest = list.find((t) => /app|uber|ola|grab|careem|pickme|didi|go app/i.test(t.n)) || list[0];
  const budget = list.find((t) => /bus|walk|bicycle|metro|rail/i.test(t.n)) || list[list.length - 1];
  return { fastest, safest, budget };
}

const CAB_SAFETY_CHECKLIST = [
  "Match the driver's photo, name, and plate number in the app before getting in.",
  "Share your live trip status with a friend or family member.",
  "Sit in the back seat; keep the door on your side accessible.",
  "Avoid sharing your exact home/hotel address out loud — give a nearby landmark instead.",
  "Trust your instinct: if a ride feels wrong, end it at a public, well-lit spot and rebook.",
];

const INTEREST_OPTIONS = ["Heritage & Forts", "Food & Street Food", "Spiritual", "Nature & Trekking", "Beaches", "Art & Culture", "Shopping", "Nightlife"];
const STYLE_OPTIONS = ["Budget", "Balanced", "Luxury"];

function generateItinerary({ cityName, days, interests, style, travelers }) {
  const pools = {
    "Heritage & Forts": ["Guided heritage walk with a licensed local guide", "Old-town walk through historic lanes", "Sunset viewpoint at a historic site"],
    "Food & Street Food": ["Street food crawl with a local food guide", "Cooking class in a local kitchen", "Iconic local breakfast spot"],
    Spiritual: ["Morning visit to a major temple/religious site", "Evening ceremony or prayer visit", "Guided heritage-religious site tour"],
    "Nature & Trekking": ["Short group trek to a nearby viewpoint", "Early-morning nature walk", "Lakeside or riverside walk"],
    Beaches: ["Beach morning with breakfast by the water", "Quiet beach stretch away from crowds (daytime, with others)", "Sunset by the water in a populated spot"],
    "Art & Culture": ["Local art district or gallery walk", "Traditional craft workshop visit", "Evening cultural performance"],
    Shopping: ["Local market/bazaar morning", "Artisan craft shopping", "Boutique district visit"],
    Nightlife: ["Rooftop café/lounge with a group", "Live music venue in a well-lit central area", "Early dinner at a well-reviewed spot"],
  };
  const budgetMult = style === "Luxury" ? 1.8 : style === "Budget" ? 0.55 : 1;
  const baseCosts = [35, 50, 28, 70, 45, 32, 55];
  const chosen = interests.length ? interests : ["Heritage & Forts", "Food & Street Food"];
  const plan = [];
  for (let d = 1; d <= days; d++) {
    const interest = chosen[(d - 1) % chosen.length];
    const options = pools[interest] || pools["Heritage & Forts"];
    const activity = options[(d - 1) % options.length];
    const cost = Math.round(baseCosts[(d - 1) % baseCosts.length] * budgetMult * Math.max(1, travelers * 0.6));
    plan.push({
      day: d, theme: interest,
      morning: `Explore ${cityName}'s old town / main district on foot, in daylight`,
      afternoon: activity,
      evening: d % 3 === 0 ? "Free evening — stick to well-lit, populated areas" : "Dinner at a well-reviewed local spot, app-cab back to stay",
      estCost: cost,
    });
  }
  return { plan, total: plan.reduce((s, p) => s + p.estCost, 0) };
}

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Compass },
  { id: "safety", label: "Safety Hub", icon: ShieldCheck },
  { id: "hidden", label: "Hidden Places", icon: Camera },
  { id: "food", label: "Food", icon: Utensils },
  { id: "cabs", label: "Cabs", icon: Car },
  { id: "planner", label: "AI Planner", icon: Sparkles },
  { id: "documents", label: "Documents", icon: FileText },
];

export default function TravelMindGlobal() {
  useFonts();
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState("dashboard");
  const [destId, setDestId] = useState("jaipur");
  const city = ALL_DESTINATIONS.find((c) => c.id === destId);

  const bg = dark ? "#0B1120" : "#F6F2E9";
  const surface = dark ? "#131B2E" : "#FFFFFF";
  const ink = dark ? "#E7EAF2" : "#10131A";
  const sub = dark ? "#8B9BB4" : "#5B6472";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(16,19,26,0.08)";
  const theme = { dark, surface, border, sub, ink };

  return (
    <div style={{ background: bg, color: ink, fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      <style>{`
        .display-font { font-family: 'Fraunces', serif; }
        .mono-font { font-family: 'IBM Plex Mono', monospace; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${dark ? "#2A3550" : "#DDD6C4"}; border-radius: 8px; }
        button:focus-visible, select:focus-visible, input:focus-visible { outline: 2px solid #E8933C; outline-offset: 2px; }
        .hover-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .hover-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.18); }
        .ai-card {
          position: relative;
          border-radius: 1rem;
          padding: 1px;
          background: linear-gradient(135deg, #E8933C, #FF6B5D, #2DD4BF);
          background-size: 200% 200%;
          animation: aiShimmer 6s ease infinite;
        }
        .ai-card-inner {
          border-radius: calc(1rem - 1px);
          background: ${dark ? "#131B2E" : "#FFFFFF"};
          height: 100%;
        }
        @keyframes aiShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .tab-fade { animation: tabFade 0.25s ease; }
        @keyframes tabFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .chip-btn { transition: all 0.15s ease; }
        .chip-btn:hover { transform: scale(1.03); }
      `}</style>

      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 border-b backdrop-blur-md gap-3 flex-wrap"
        style={{ borderColor: border, background: dark ? "rgba(11,17,32,0.85)" : "rgba(246,242,233,0.85)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E8933C, #FF6B5D)" }}>
            <Plane size={16} color="#10131A" strokeWidth={2.5} />
          </div>
          <span className="display-font text-lg font-semibold tracking-tight">TravelMind AI</span>
        </div>
        <div className="flex items-center gap-3">
          <select value={destId} onChange={(e) => setDestId(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 border bg-transparent max-w-[180px]" style={{ borderColor: border, color: ink }}>
            {COUNTRIES.map((country) => (
              <optgroup key={country} label={country}>
                {ALL_DESTINATIONS.filter((d) => d.country === country).map((d) => (
                  <option key={d.id} value={d.id} style={{ color: "#10131A" }}>{d.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <button onClick={() => setDark((d) => !d)} className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: border }} aria-label="Toggle dark mode">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <div className="flex max-w-6xl mx-auto">
        <nav className="hidden md:flex flex-col gap-1 w-56 p-4 shrink-0">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={{ background: active ? (dark ? "#1B2438" : "#FFF") : "transparent", color: active ? "#E8933C" : sub, boxShadow: active ? `0 0 0 1px ${border}` : "none" }}>
                <Icon size={16} />{n.label}
              </button>
            );
          })}
          <div className="mt-4 px-3 py-2.5 rounded-xl text-xs flex items-start gap-2" style={{ background: dark ? "#1B2438" : "#FFF", color: sub }}>
            <Info size={13} className="mt-0.5 shrink-0" />
            {ALL_DESTINATIONS.length} destinations · {COUNTRIES.length} countries — a curated sample, not exhaustive.
          </div>
        </nav>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex justify-around py-2 border-t backdrop-blur-md overflow-x-auto"
          style={{ borderColor: border, background: dark ? "rgba(11,17,32,0.95)" : "rgba(246,242,233,0.95)" }}>
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)} className="flex flex-col items-center gap-1 px-2 py-1 shrink-0">
                <Icon size={17} color={active ? "#E8933C" : sub} />
                <span style={{ fontSize: 9, color: active ? "#E8933C" : sub }}>{n.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </nav>

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <div key={tab + destId} className="tab-fade">
            {tab === "dashboard" && <Dashboard {...theme} city={city} setTab={setTab} />}
            {tab === "safety" && <SafetyHub {...theme} city={city} />}
            {tab === "hidden" && <HiddenPlaces {...theme} city={city} />}
            {tab === "food" && <FoodView {...theme} city={city} />}
            {tab === "cabs" && <CabsView {...theme} city={city} />}
            {tab === "planner" && <Planner {...theme} city={city} />}
            {tab === "documents" && <Documents {...theme} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function Card({ surface, border, className = "", children }) {
  return <div className={`hover-card rounded-2xl p-5 border ${className}`} style={{ background: surface, borderColor: border }}>{children}</div>;
}

function AiCard({ dark, className = "", children }) {
  return (
    <div className={`ai-card ${className}`}>
      <div className="ai-card-inner p-5">{children}</div>
    </div>
  );
}

function RatingBadge({ rating }) {
  const map = {
    "Generally safe": { bg: "rgba(45,212,191,0.14)", color: "#2DD4BF" },
    Caution: { bg: "rgba(232,147,60,0.16)", color: "#E8933C" },
  };
  const s = map[rating] || map["Caution"];
  return <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>{rating}</span>;
}

function greetingForHour(h) {
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard({ dark, surface, border, sub, ink, city, setTab }) {
  const now = new Date();
  const hour = now.getHours();
  const weather = getMockWeather(city);
  const safety = computeSafetyScore(city);
  const cabRec = getCabRecommendations(city);
  const morningSpot = city.hidden[hour % city.hidden.length];
  const foodPick = city.food[(hour + 1) % city.food.length];
  const timeLabel = hour < 12 ? "this morning" : hour < 17 ? "this afternoon" : "tonight";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* HERO */}
      <Card surface={surface} border={border} className="lg:col-span-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <p className="mono-font text-xs tracking-widest uppercase" style={{ color: "#E8933C" }}>Currently exploring</p>
            <h1 className="display-font text-2xl md:text-3xl font-semibold mt-1">{city.name}</h1>
            <p className="text-sm mt-1" style={{ color: sub }}>{city.country} · {city.region}</p>
          </div>
          <div className="flex items-center gap-3">
            <FlapNumber value={7} digits={1} dark={dark} />
            <div><p className="text-xs" style={{ color: sub }}>days until</p><p className="text-sm font-medium">departure</p></div>
          </div>
        </div>
      </Card>

      {/* AI BRIEF — the centerpiece */}
      <div className="lg:col-span-3">
        <AiCard dark={dark}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} color="#E8933C" />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#E8933C" }}>Today's AI Plan</span>
          </div>
          <h2 className="display-font text-xl mb-3">{greetingForHour(hour)} — here's how {timeLabel} in {city.name} looks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5 text-sm">
              <Camera size={15} color="#2DD4BF" className="mt-0.5 shrink-0" />
              <span style={{ color: sub }}>Visit <b style={{ color: ink }}>{morningSpot.n}</b> — {morningSpot.t.toLowerCase()}, {getDiscoveryReason(morningSpot, hour).toLowerCase()}.</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm">
              <Utensils size={15} color="#E8933C" className="mt-0.5 shrink-0" />
              <span style={{ color: sub }}>Try <b style={{ color: ink }}>{foodPick.n}</b> for a meal — around {foodPick.p}.</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm">
              <CloudRain size={15} color="#2DD4BF" className="mt-0.5 shrink-0" />
              <span style={{ color: sub }}>{weather.condition}, {weather.temp}°C, {weather.rain}% rain chance — {weather.rain > 35 ? "pack a light rain layer" : "good conditions for walking"}.</span>
            </div>
            {cabRec && (
              <div className="flex items-start gap-2.5 text-sm">
                <Navigation size={15} color="#E8933C" className="mt-0.5 shrink-0" />
                <span style={{ color: sub }}>Get around via <b style={{ color: ink }}>{cabRec.safest.n}</b> — {cabRec.safest.note.toLowerCase()}</span>
              </div>
            )}
          </div>
          <button onClick={() => setTab("planner")} className="mt-4 text-xs font-semibold flex items-center gap-1 chip-btn" style={{ color: "#E8933C" }}>
            Build a full itinerary <ChevronRight size={13} />
          </button>
        </AiCard>
      </div>

      {/* SAFETY */}
      <Card surface={surface} border={border} className="lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><ShieldCheck size={16} color="#2DD4BF" /><span className="text-sm font-medium">Safety score — {city.name}</span></div>
          <span className="display-font text-2xl" style={{ color: safety.score >= 75 ? "#2DD4BF" : safety.score >= 55 ? "#E8933C" : "#FF6B5D" }}>{safety.score}<span className="text-xs" style={{ color: sub }}>/100</span></span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
          {[
            { label: "Crowds", value: safety.crowd },
            { label: "Pickpocket risk", value: safety.pickpocket },
            { label: "Weather", value: safety.weatherRisk },
            { label: "Transport", value: safety.transport },
            { label: "Police visibility", value: safety.police },
          ].map((r) => (
            <div key={r.label} className="p-2 rounded-lg text-xs" style={{ background: dark ? "#1B2438" : "#F6F2E9" }}>
              <p style={{ color: sub }}>{r.label}</p>
              <p className="font-semibold mt-0.5">{r.value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs flex items-start gap-1.5" style={{ color: sub }}>
          <Sparkles size={12} className="mt-0.5 shrink-0" color="#E8933C" />{safety.recommendation}
        </p>
      </Card>

      <Card surface={surface} border={border}>
        <div className="flex items-center gap-2 mb-3"><Phone size={16} color="#FF6B5D" /><span className="text-sm font-medium">Emergency numbers</span></div>
        <div className="space-y-1.5">
          {city.emergency.map((e) => (
            <div key={e.l} className="flex items-center justify-between text-sm">
              <span style={{ color: sub }}>{e.l}</span>
              <span className="mono-font font-semibold" style={{ color: "#FF6B5D" }}>{e.n}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card surface={surface} border={border} className="lg:col-span-3">
        <div className="flex items-center gap-2 mb-3"><Sparkles size={16} color="#E8933C" /><span className="text-sm font-medium">Quick tips for {city.name}</span></div>
        <ul className="space-y-2 text-sm" style={{ color: sub }}>
          {city.tips.map((t, i) => <li key={i} className="flex gap-2"><ChevronRight size={14} className="mt-0.5 shrink-0" color="#2DD4BF" />{t}</li>)}
        </ul>
      </Card>
    </div>
  );
}

function SafetyHub({ dark, surface, border, sub, ink, city }) {
  const safety = computeSafetyScore(city);
  return (
    <div className="space-y-4">
      <Card surface={surface} border={border}>
        <div className="flex items-center gap-2 mb-1"><ShieldAlert size={18} color="#FF6B5D" /><h2 className="display-font text-xl">Safety Hub</h2></div>
        <p className="text-sm" style={{ color: sub }}>
          Built with women travelers in mind. Numbers and area notes below are a curated starting point — always cross-check current
          conditions with your accommodation and your home country's official travel advisory before relying on them.
        </p>
      </Card>

      <AiCard dark={dark}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1"><Sparkles size={14} color="#E8933C" /><span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#E8933C" }}>AI Safety Score</span></div>
            <p className="text-sm" style={{ color: sub }}>{city.name}, {city.country}</p>
          </div>
          <span className="display-font text-4xl" style={{ color: safety.score >= 75 ? "#2DD4BF" : safety.score >= 55 ? "#E8933C" : "#FF6B5D" }}>{safety.score}<span className="text-sm" style={{ color: sub }}>/100</span></span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
          {[
            { label: "Crowds", value: safety.crowd },
            { label: "Pickpocket risk", value: safety.pickpocket },
            { label: "Weather", value: safety.weatherRisk },
            { label: "Transport", value: safety.transport },
            { label: "Police visibility", value: safety.police },
          ].map((r) => (
            <div key={r.label} className="p-2.5 rounded-lg text-xs" style={{ background: dark ? "#1B2438" : "#F6F2E9" }}>
              <p style={{ color: sub }}>{r.label}</p>
              <p className="font-semibold mt-0.5">{r.value}</p>
            </div>
          ))}
        </div>
        <p className="text-sm mt-4 pt-3 border-t flex items-start gap-2" style={{ borderColor: border, color: ink }}>
          <Sparkles size={14} className="mt-0.5 shrink-0" color="#E8933C" /><span><b>AI Recommendation:</b> {safety.recommendation}</span>
        </p>
      </AiCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card surface={surface} border={border}>
          <h3 className="text-sm font-semibold mb-3">Emergency numbers — {city.country}</h3>
          <div className="space-y-2">
            {city.emergency.map((e) => (
              <div key={e.l} className="flex items-center justify-between p-2.5 rounded-lg text-sm" style={{ background: dark ? "#1B2438" : "#F6F2E9" }}>
                <span style={{ color: sub }}>{e.l}</span>
                <span className="mono-font font-semibold" style={{ color: "#FF6B5D" }}>{e.n}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card surface={surface} border={border}>
          <h3 className="text-sm font-semibold mb-3">Area safety — {city.name}</h3>
          <div className="space-y-2.5">
            {city.safety.map((a) => (
              <div key={a.a} className="p-3 rounded-lg" style={{ background: dark ? "#1B2438" : "#F6F2E9" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{a.a}</span>
                  <RatingBadge rating={a.r} />
                </div>
                <p className="text-xs" style={{ color: sub }}>{a.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card surface={surface} border={border}>
        <h3 className="text-sm font-semibold mb-3">General safety practices (anywhere)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Share live location / trip status with someone you trust, especially for late travel.",
            "Prefer app-based cabs or hotel-arranged transport after dark over hailing unmarked vehicles.",
            "Dress and behave with awareness of local norms, which vary a lot between destinations.",
            "Keep a physical + digital copy of your ID and hotel address; don't share your exact address with strangers.",
            "Trust your instinct over politeness — it's fine to leave a situation abruptly if something feels wrong.",
            "Ask your hotel/hostel for their read on which nearby areas to avoid at night — it changes faster than any app.",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm p-2.5 rounded-lg" style={{ background: dark ? "#1B2438" : "#F6F2E9", color: sub }}>
              <Check size={14} color="#2DD4BF" className="mt-0.5 shrink-0" />{tip}
            </div>
          ))}
        </div>
      </Card>

      <Card surface={surface} border={border}>
        <div className="flex items-center gap-2 mb-2"><AlertTriangle size={15} color="#E8933C" /><h3 className="text-sm font-semibold">{city.name}-specific tips</h3></div>
        <ul className="space-y-2 text-sm" style={{ color: sub }}>
          {city.tips.map((t, i) => <li key={i} className="flex gap-2"><ChevronRight size={14} className="mt-0.5 shrink-0" color="#E8933C" />{t}</li>)}
        </ul>
      </Card>
    </div>
  );
}

function HiddenPlaces({ dark, surface, border, sub, ink, city }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} color="#E8933C" />
        <h2 className="display-font text-lg">AI Discovery Feed — {city.name}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {city.hidden.map((h, i) => (
          <Card key={h.n} surface={surface} border={border}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(232,147,60,0.14)" }}>
                <Camera size={16} color="#E8933C" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{h.n}</h3>
                <p className="text-sm mt-1" style={{ color: sub }}>{h.d}</p>
                <p className="text-xs mt-2 flex items-center gap-1" style={{ color: sub }}><Clock size={12} />{h.t}</p>
                <div className="mt-2.5 pt-2.5 border-t flex items-start gap-1.5" style={{ borderColor: border }}>
                  <Sparkles size={11} className="mt-0.5 shrink-0" color="#2DD4BF" />
                  <span className="text-xs italic" style={{ color: "#2DD4BF" }}>{getDiscoveryReason(h, i)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FoodView({ dark, surface, border, sub, ink, city }) {
  const [active, setActive] = useState([]);
  const toggle = (f) => setActive((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  const filtered = active.length ? city.food.filter((item) => active.every((f) => matchesFoodFilter(item, f))) : city.food;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} color="#E8933C" />
        <h2 className="display-font text-lg">Tell the AI what you're craving</h2>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {FOOD_FILTERS.map((f) => (
          <button key={f} onClick={() => toggle(f)} className="chip-btn px-3 py-1.5 rounded-full text-xs border flex items-center gap-1"
            style={{ borderColor: active.includes(f) ? "#2DD4BF" : border, background: active.includes(f) ? "rgba(45,212,191,0.12)" : "transparent", color: active.includes(f) ? "#2DD4BF" : sub }}>
            {active.includes(f) && <Check size={11} />}{f}
          </button>
        ))}
        {active.length > 0 && (
          <button onClick={() => setActive([])} className="chip-btn px-3 py-1.5 rounded-full text-xs border flex items-center gap-1" style={{ borderColor: border, color: sub }}>
            <X size={11} />Clear
          </button>
        )}
      </div>

      {active.length > 0 && (
        <p className="text-xs mb-3 flex items-center gap-1.5" style={{ color: "#E8933C" }}>
          <Sparkles size={12} />Matched {filtered.length} of {city.food.length} picks for: {active.join(", ")}
        </p>
      )}

      {filtered.length === 0 && (
        <p className="text-sm p-4 rounded-xl" style={{ background: dark ? "#1B2438" : "#F6F2E9", color: sub }}>
          Nothing in {city.name}'s picks matches all of those together — try clearing one filter.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((f) => (
          <Card key={f.n} surface={surface} border={border}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,107,93,0.12)" }}>
                <Utensils size={16} color="#FF6B5D" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{f.n}</h3>
                <p className="text-sm mt-1" style={{ color: sub }}>{f.d}</p>
                <p className="mono-font text-xs mt-2" style={{ color: "#E8933C" }}>{f.p}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CabsView({ dark, surface, border, sub, ink, city }) {
  const rec = getCabRecommendations(city);
  return (
    <div className="space-y-4">
      {rec && (
        <AiCard dark={dark}>
          <div className="flex items-center gap-2 mb-3"><Sparkles size={14} color="#E8933C" /><span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#E8933C" }}>AI Recommendation</span></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg" style={{ background: dark ? "#1B2438" : "#F6F2E9" }}>
              <div className="flex items-center gap-1.5 text-xs font-semibold mb-1" style={{ color: "#2DD4BF" }}><Zap size={13} />Fastest</div>
              <p className="text-sm font-medium">{rec.fastest.n}</p>
              <p className="text-xs mt-1" style={{ color: sub }}>{rec.fastest.note}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: dark ? "#1B2438" : "#F6F2E9" }}>
              <div className="flex items-center gap-1.5 text-xs font-semibold mb-1" style={{ color: "#E8933C" }}><ShieldCheck size={13} />Safest</div>
              <p className="text-sm font-medium">{rec.safest.n}</p>
              <p className="text-xs mt-1" style={{ color: sub }}>{rec.safest.note}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: dark ? "#1B2438" : "#F6F2E9" }}>
              <div className="flex items-center gap-1.5 text-xs font-semibold mb-1" style={{ color: "#FF6B5D" }}><DollarSign size={13} />Cheapest</div>
              <p className="text-sm font-medium">{rec.budget.n}</p>
              <p className="text-xs mt-1" style={{ color: sub }}>{rec.budget.note}</p>
            </div>
          </div>
        </AiCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card surface={surface} border={border}>
          <h2 className="display-font text-xl mb-4">All options in {city.name}</h2>
          <div className="space-y-3">
            {city.transport.map((c) => (
              <div key={c.n} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: dark ? "#1B2438" : "#F6F2E9" }}>
                <Navigation size={16} color="#2DD4BF" className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{c.n}</p>
                  <p className="text-xs mt-0.5" style={{ color: sub }}>{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card surface={surface} border={border}>
          <div className="flex items-center gap-2 mb-3"><ShieldCheck size={16} color="#2DD4BF" /><h2 className="display-font text-xl">Cab safety checklist</h2></div>
          <div className="space-y-2">
            {CAB_SAFETY_CHECKLIST.map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Check size={14} color="#2DD4BF" className="mt-0.5 shrink-0" />
                <span style={{ color: sub }}>{t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Planner({ dark, surface, border, sub, city }) {
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(1);
  const [style, setStyle] = useState("Balanced");
  const [interests, setInterests] = useState(["Heritage & Forts", "Food & Street Food"]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (i) => setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const handleGenerate = () => {
    setLoading(true); setResult(null);
    setTimeout(() => {
      setResult(generateItinerary({ cityName: city.name, days, interests, style, travelers }));
      setLoading(false);
    }, 900);
  };

  const isIndia = city.country === "India";
  const currencySymbol = isIndia ? "₹" : "$";
  const currencyMult = isIndia ? 80 : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Card surface={surface} border={border} className="lg:col-span-2 h-fit">
        <h2 className="display-font text-xl mb-1">Plan your {city.name} trip</h2>
        <p className="text-xs mb-4" style={{ color: sub }}>Itinerary weaves in safety-aware timing (daylight for isolated spots, app-cabs for night moves).</p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-medium" style={{ color: sub }}>Duration (days)</label>
            <input type="number" min={1} max={14} value={days} onChange={(e) => setDays(Math.max(1, Math.min(14, Number(e.target.value))))}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm border bg-transparent" style={{ borderColor: border }} />
          </div>
          <div>
            <label className="text-xs font-medium" style={{ color: sub }}>Travelers</label>
            <input type="number" min={1} max={10} value={travelers} onChange={(e) => setTravelers(Math.max(1, Math.min(10, Number(e.target.value))))}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm border bg-transparent" style={{ borderColor: border }} />
          </div>
        </div>

        <label className="text-xs font-medium" style={{ color: sub }}>Travel style</label>
        <div className="flex gap-2 mt-1 mb-3">
          {STYLE_OPTIONS.map((s) => (
            <button key={s} onClick={() => setStyle(s)} className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border"
              style={{ borderColor: style === s ? "#E8933C" : border, background: style === s ? "rgba(232,147,60,0.12)" : "transparent", color: style === s ? "#E8933C" : sub }}>
              {s}
            </button>
          ))}
        </div>

        <label className="text-xs font-medium" style={{ color: sub }}>Interests</label>
        <div className="flex flex-wrap gap-2 mt-1 mb-4">
          {INTEREST_OPTIONS.map((i) => (
            <button key={i} onClick={() => toggleInterest(i)} className="px-2.5 py-1 rounded-full text-xs border"
              style={{ borderColor: interests.includes(i) ? "#2DD4BF" : border, background: interests.includes(i) ? "rgba(45,212,191,0.12)" : "transparent", color: interests.includes(i) ? "#2DD4BF" : sub }}>
              {i}
            </button>
          ))}
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #E8933C, #FF6B5D)", color: "#10131A" }}>
          <Sparkles size={15} />{loading ? "Generating itinerary…" : "Generate itinerary"}
        </button>
      </Card>

      <Card surface={surface} border={border} className="lg:col-span-3">
        {!result && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center py-14" style={{ color: sub }}>
            <MapPin size={28} className="mb-3" /><p className="text-sm">Set your preferences and generate a {city.name} itinerary.</p>
          </div>
        )}
        {loading && <div className="space-y-3 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl" style={{ background: border }} />)}</div>}
        {result && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="display-font text-xl">{city.name} · {days}-day plan</h2>
              <span className="mono-font text-sm px-2.5 py-1 rounded-full" style={{ background: "rgba(232,147,60,0.12)", color: "#E8933C" }}>~{currencySymbol}{result.total * currencyMult} est.</span>
            </div>
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {result.plan.map((p) => (
                <div key={p.day} className="rounded-xl p-4 border" style={{ borderColor: border }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Day {p.day} · {p.theme}</span>
                    <span className="mono-font text-xs" style={{ color: sub }}>{currencySymbol}{p.estCost * currencyMult}</span>
                  </div>
                  <p className="text-sm" style={{ color: sub }}><b>Morning:</b> {p.morning}</p>
                  <p className="text-sm mt-1" style={{ color: sub }}><b>Afternoon:</b> {p.afternoon}</p>
                  <p className="text-sm mt-1" style={{ color: sub }}><b>Evening:</b> {p.evening}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

const DOCS = [
  { name: "Passport", status: "Valid — expires in 5 months", ok: true, reminder: "Some countries require 6 months' validity — worth renewing soon." },
  { name: "Visa (if required)", status: "Check requirement for this destination", ok: true, reminder: null },
  { name: "Flight e-tickets", status: "Stored, QR code ready offline", ok: true, reminder: null },
  { name: "Hotel booking confirmations", status: "Stored offline in case of no signal", ok: true, reminder: null },
  { name: "Emergency contacts card", status: "Saved — also keep a printed copy", ok: true, reminder: null },
  { name: "Travel insurance", status: "Missing — recommended for all international travel", ok: false, reminder: "Add this before departure — most claims require proof it was active during the trip." },
];

function Documents({ dark, surface, border, sub, ink }) {
  const reminders = DOCS.filter((d) => d.reminder);
  return (
    <div className="space-y-4">
      {reminders.length > 0 && (
        <AiCard dark={dark}>
          <div className="flex items-center gap-2 mb-3"><Sparkles size={14} color="#E8933C" /><span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#E8933C" }}>Smart Reminders</span></div>
          <div className="space-y-2">
            {reminders.map((d) => (
              <div key={d.name} className="flex items-start gap-2 text-sm">
                <CalendarClock size={14} color="#E8933C" className="mt-0.5 shrink-0" />
                <span style={{ color: ink }}><b>{d.name}:</b> {d.reminder}</span>
              </div>
            ))}
          </div>
        </AiCard>
      )}

      <Card surface={surface} border={border}>
        <div className="flex items-center gap-2 mb-4"><FileText size={16} color="#E8933C" /><h2 className="display-font text-xl">AI Travel Vault</h2></div>
        <div className="space-y-2">
          {DOCS.map((d) => (
            <div key={d.name} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: border }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: d.ok ? "rgba(45,212,191,0.12)" : "rgba(255,107,93,0.12)" }}>
                  {d.ok ? <Check size={14} color="#2DD4BF" /> : <AlertTriangle size={14} color="#FF6B5D" />}
                </div>
                <span className="text-sm font-medium">{d.name}</span>
              </div>
              <span className="text-xs" style={{ color: d.ok ? sub : "#FF6B5D" }}>{d.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
