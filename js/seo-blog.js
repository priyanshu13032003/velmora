// Velmora - SEO Strategy, Verified SEMrush Keywords & 3 Full Blog Posts
const seoKeywordsData = [
  { keyword: "graphic t shirts india", volume: "390", kd: "17%", intent: "Commercial", priority: "Quick win", page: "T-Shirts" },
  { keyword: "graphic t shirts", volume: "1,300", kd: "18%", intent: "Commercial", priority: "Quick win", page: "T-Shirts" },
  { keyword: "women's graphic t shirts", volume: "2,400", kd: "23%", intent: "Commercial", priority: "Medium", page: "T-Shirts" },
  { keyword: "oversized white t shirt", volume: "12,100", kd: "16%", intent: "Commercial", priority: "Quick win", page: "T-Shirts" },
  { keyword: "oversized t shirt for women", volume: "4,400", kd: "17%", intent: "Info / Comm", priority: "Quick win", page: "T-Shirts" },
  { keyword: "oversized t shirt women", volume: "33,100", kd: "22%", intent: "Commercial", priority: "Medium", page: "T-Shirts" },
  { keyword: "oversized hoodie men", volume: "6,600", kd: "18%", intent: "Commercial", priority: "Quick win", page: "Hoodies" },
  { keyword: "oversized hoodie women", volume: "5,400", kd: "20%", intent: "Commercial", priority: "Quick win", page: "Hoodies" },
  { keyword: "oversized black hoodie mens", volume: "590", kd: "15%", intent: "Commercial", priority: "Quick win", page: "Hoodies" },
  { keyword: "printed zipper hoodies", volume: "390", kd: "15%", intent: "Commercial", priority: "Quick win", page: "Hoodies" },
  { keyword: "streetwear hoodies", volume: "880", kd: "23%", intent: "Commercial", priority: "Medium", page: "Hoodies" },
  { keyword: "sweatshirt for girls", volume: "49,500", kd: "22%", intent: "Commercial", priority: "Medium", page: "Hoodies" },
  { keyword: "couple sweatshirts", volume: "14,800", kd: "24%", intent: "Commercial", priority: "Medium", page: "Hoodies" },
  { keyword: "canvas tote bag", volume: "9,900", kd: "14%", intent: "Commercial", priority: "Quick win", page: "Bags" },
  { keyword: "office tote bag", volume: "9,900", kd: "17%", intent: "Informational", priority: "Quick win", page: "Bags" },
  { keyword: "tote bag for office", volume: "9,900", kd: "20%", intent: "Informational", priority: "Quick win", page: "Bags" },
  { keyword: "aesthetic phone cases", volume: "5,400", kd: "11%", intent: "Commercial", priority: "Quick win", page: "Accessories" },
  { keyword: "silicone phone case", volume: "8,100", kd: "17%", intent: "Commercial", priority: "Quick win", page: "Accessories" },
  { keyword: "daily planner diary", volume: "3,600", kd: "14%", intent: "Info / Transactional", priority: "Quick win", page: "Stationery" },
  { keyword: "daily planner 2026", volume: "720", kd: "5%", intent: "Informational", priority: "Quick win", page: "Stationery" }
];

const blogArticles = [
  {
    id: "blog-1",
    title: "Oversized White Tee, Hoodie, or Sweatshirt: How to Pick Your Streetwear Staple",
    slug: "how-to-pick-your-streetwear-staple",
    author: "Swati Verma",
    date: "September 18, 2026",
    readTime: "5 min read",
    category: "Style Guide",
    coverImage: "https://static.wixstatic.com/media/290a69_260e0b6dfbca4970ae4a618ae26061e0~mv2.png",
    excerpt: "The oversized fit has become the backbone of modern casualwear, but 'oversized' isn't one-size-fits-all. Choosing between a tee, a hoodie, and a sweatshirt comes down to proportion, drape, and utility.",
    tags: ["oversized white t shirt", "oversized hoodie men", "streetwear hoodies"],
    content: `
      <p class="lead">If you've spent any time scrolling streetwear pages lately, you've noticed the same silhouette showing up everywhere: relaxed, roomy, and effortlessly worn. The oversized fit has become the backbone of modern casualwear—but "oversized" isn't one-size-fits-all. Choosing between a tee, a hoodie, and a sweatshirt comes down to how you want to wear it, not just how it looks on a hanger.</p>
      
      <h3>1. The Oversized White Tee</h3>
      <p>The <strong>oversized white tee</strong> is the most versatile of the three. It works as a base layer under a jacket, a standalone piece with joggers, or tucked-and-belted for a dressed-up take on casual. White specifically photographs well and pairs with literally everything in your closet, which is exactly why it's the piece most people reach for first when building a streetwear wardrobe.</p>
      <p>Look for a heavier cotton weight (220–260 GSM)—anything too thin will cling and lose the structured drape that makes oversized fits look intentional rather than accidental.</p>

      <h3>2. The Oversized Hoodie</h3>
      <p>The <strong>oversized hoodie</strong> is built for layering season and lazy-Sunday errands in equal measure. Men's and women's cuts differ mainly in shoulder drop and sleeve length, so it's worth trying both before assuming you know your size.</p>
      <p>A hoodie in black does the heavy lifting for a moody, minimal wardrobe, but don't sleep on a printed or graphic version if you want the piece to double as a bold statement rather than just a backdrop.</p>

      <h3>3. The Oversized Sweatshirt</h3>
      <p>The <strong>oversized sweatshirt</strong> sits in between: less structured than a hoodie (no hood bulk, cleaner circular neckline), but with more rich texture than a standard tee. It's the go-to pick if you want the relaxed silhouette without looking like you just stepped out of the gym. Crewneck sweatshirts also layer seamlessly under overcoats and denim jackets.</p>

      <div class="callout-box">
        <strong>Quick Way to Decide:</strong> If you're building one foundational piece, start with the tee. If you live somewhere with cool evenings, the hoodie earns its keep fastest. If you want something that reads as "put together" with zero effort, the sweatshirt splits the difference.
      </div>
    `
  },
  {
    id: "blog-2",
    title: "5 Ways to Style a Canvas Tote Bag for Work and Everyday Carry",
    slug: "5-ways-to-style-a-canvas-tote-bag",
    author: "Swati Verma",
    date: "September 15, 2026",
    readTime: "4 min read",
    category: "Accessories Guide",
    coverImage: "https://static.wixstatic.com/media/290a69_0cdf7197ff22418db00d000875bc3c8e~mv2.jpeg",
    excerpt: "The canvas tote has quietly become the most useful bag in most people's rotation—sturdy enough for daily carry, structured enough for the office, and casual enough for weekends.",
    tags: ["canvas tote bag", "office tote bag", "tote bag for office"],
    content: `
      <p class="lead">The canvas tote has quietly become the most essential bag in everyday rotation: sturdy enough for daily carry, structured enough for modern work desks, and casual enough that it never looks out of place on Saturday morning coffee runs. Here's how to get the most mileage out of one.</p>

      <h3>A. As Your Everyday Work Bag</h3>
      <p>A <strong>canvas tote bag</strong> with a flat reinforced base can easily replace an uncomfortable briefcase. Slide a 13-15 inch padded laptop sleeve inside, keep a small utility pouch for cables and cards, and you have an office bag that looks effortless without sacrificing function.</p>

      <h3>B. Layered Under a Coat in Colder Months</h3>
      <p>Totes with shorter or medium handles sit snugly against the ribs, making them effortless to tuck under a trench or denim jacket. This prevents annoying shoulder strap slip during transit.</p>

      <h3>C. As a Grab-and-Go for Errands</h3>
      <p>This was the tote's original calling and it remains unmatched. Foldable, machine-washable cotton canvas means you can keep one ready by your entryway for grocery stops, bookstore hauls, or studio visits.</p>

      <h3>D. Paired with an Oversized Fit for Proportion Contrast</h3>
      <p>A structured canvas tote actually balances out relaxed silhouettes—think an oversized hoodie or boxy tee contrasted against crisp geometric tote lines. It anchors the entire aesthetic from feeling sloppy.</p>

      <h3>E. As a Canvas for Personality</h3>
      <p>Plain bags can blend into the background, which is why graphic and custom typography totes have exploded. One bag carries your essentials while subtly expressing your humor, playlist taste, or visual identity.</p>

      <div class="callout-box">
        <strong>The Golden Trio:</strong> The best totes share three things: a flat, structured base (so it doesn't slouch when half-full), handles long enough to slip over shoulders easily, and 12–14oz canvas thick enough to survive wash after wash.
      </div>
    `
  },
  {
    id: "blog-3",
    title: "Aesthetic Desk Setup: Pairing Your Daily Planner with the Right Accessories",
    slug: "aesthetic-desk-setup-pairing-daily-planner",
    author: "Swati Verma",
    date: "September 10, 2026",
    readTime: "4 min read",
    category: "Workspace Aesthetics",
    coverImage: "https://static.wixstatic.com/media/290a69_24343d49d17040f0956a215883481a19~mv2.png",
    excerpt: "A desk setup that actually makes you want to sit down and plan your day is less about expensive gear and more about a few intentional pieces that work visually and functionally.",
    tags: ["daily planner diary", "daily planner 2026", "aesthetic phone cases"],
    content: `
      <p class="lead">A desk setup that genuinely makes you excited to sit down and organize your morning isn't about hoarding expensive stationery—it's about curating three or four intentional pieces that work together in harmony. Here is how to build one centered around your daily planner and phone.</p>

      <h3>1. Start with the Planner Itself</h3>
      <p>A tactile <strong>daily planner diary</strong> achieves what no smartphone app ever could: writing down by hand forces cognitive synthesis rather than endless cognitive backlog. Look for planners with structured hourly blocks or flexible daily priority quadrants. When the paper weight is thick and smooth, handwriting feels like a meditative ritual rather than a chore.</p>

      <h3>2. Build the Desk Around It, Not the Other Way Around</h3>
      <p>A planner buried beneath clutter will never be opened. The "aesthetic desk" movement isn't merely vanity—a clean, harmonious surface creates mental clarity, reducing the friction required to commit to high-focus deep work.</p>

      <h3>3. Don't Ignore Your Phone Case</h3>
      <p>Your smartphone is on the desk alongside your notebook all day long. Choosing an <strong>aesthetic phone case</strong> that complements your desk palette—whether warm oatmeal, matte onyx, or soft blush—ties the whole workspace aesthetic into a cohesive, considered studio environment.</p>

      <div class="callout-box">
        <strong>The Rule of Four:</strong> Limit desk clutter to four staples: your daily planner, your phone in a matching aesthetic case, a weighted gel pen you genuinely enjoy holding, and a shallow tray for keys or AirPods.
      </div>
    `
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { seoKeywordsData, blogArticles };
}
