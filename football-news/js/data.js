/* KoraPulse — site content.
   Everything the site shows comes from this file: menus, articles, scores, the table,
   comments, authors and uploaded images. The admin dashboard (admin/) edits it and
   exports a new copy of this file with "Settings → Publish & Backup → Download data.js".
   Add an article by copying one object in `articles` and changing its fields.
   `image` is optional: put a photo URL there (e.g. "images/derby.jpg") and it replaces
   the generated illustration. The articles below are sample content for the demo. */
window.KP = {
  site: {
    name: "KoraPulse",
    tagline: "Football news from Morocco, Africa and the world",
    email: "contact@korapulse.com",
    social: {
      instagram: "#", x: "#", facebook: "#", youtube: "#", tiktok: "#", linkedin: "#"
    }
  },

  // Main menu. `subs` become the dropdown items (they filter the category by tag).
  categories: [
    { slug: "news", name: "News", subs: [] },
    { slug: "botola", name: "Botola Pro", subs: ["Results", "Clubs", "Previews"] },
    { slug: "atlas-lions", name: "Atlas Lions", subs: ["Senior team", "U23", "Interviews"] },
    { slug: "africa", name: "Africa", subs: ["AFCON", "CAF Champions League"] },
    { slug: "europe", name: "Europe", subs: ["Champions League", "Premier League", "LaLiga"] },
    { slug: "transfers", name: "Transfers", subs: [] },
    { slug: "women", name: "Women", subs: [] },
    { slug: "world-cup-2030", name: "World Cup 2030", subs: [] },
    { slug: "opinion", name: "Opinion", subs: [] }
  ],

  topLinks: [
    { label: "Botola Pro", href: "category.html?c=botola" },
    { label: "Atlas Lions", href: "category.html?c=atlas-lions" },
    { label: "Champions League", href: "category.html?c=europe&t=Champions%20League" },
    { label: "World Cup 2030", href: "category.html?c=world-cup-2030" }
  ],

  // Live score ticker (status: "FT", "LIVE 67'", or a kick-off time).
  scores: [
    { comp: "Botola", home: "Rabat Stars", away: "Union Marrakech", hs: 2, as: 1, status: "FT" },
    { comp: "Botola", home: "Fès Sporting", away: "Olympique Souss", hs: 1, as: 1, status: "LIVE 67'" },
    { comp: "Botola", home: "Étoile de Tanger", away: "Racing Anfa", hs: null, as: null, status: "20:00" },
    { comp: "CAF CL", home: "Racing Anfa", away: "Nile Athletic", hs: 3, as: 0, status: "FT" },
    { comp: "Botola", home: "Agadir Sporting", away: "Meknès Olympic", hs: 0, as: 2, status: "FT" },
    { comp: "Women", home: "Casablanca Ladies", away: "Rabat Stars W", hs: 2, as: 2, status: "FT" },
    { comp: "Botola", home: "Oujda Athletic", away: "Safi Mariners", hs: null, as: null, status: "Sun 17:00" }
  ],

  standings: {
    title: "Botola Pro table",
    rows: [
      { club: "Racing Anfa", p: 10, w: 7, d: 2, l: 1, gd: 12, pts: 23 },
      { club: "Rabat Stars", p: 10, w: 7, d: 1, l: 2, gd: 9, pts: 22 },
      { club: "Fès Sporting", p: 10, w: 6, d: 2, l: 2, gd: 7, pts: 20 },
      { club: "Étoile de Tanger", p: 10, w: 5, d: 3, l: 2, gd: 4, pts: 18 },
      { club: "Meknès Olympic", p: 10, w: 4, d: 4, l: 2, gd: 3, pts: 16 },
      { club: "Olympique Souss", p: 10, w: 4, d: 3, l: 3, gd: 1, pts: 15 },
      { club: "Union Marrakech", p: 10, w: 3, d: 3, l: 4, gd: -2, pts: 12 },
      { club: "Agadir Sporting", p: 10, w: 2, d: 3, l: 5, gd: -6, pts: 9 }
    ]
  },

  // Authors shown as bylines. Roles: Administrator, Editor, Author, Contributor.
  users: [
    { id: "u1", name: "Nadia Berrada", role: "Editor", bio: "Editor-in-chief. Covers the national teams." },
    { id: "u2", name: "Omar Lahlou", role: "Author", bio: "Botola Pro correspondent." },
    { id: "u3", name: "Salma Kettani", role: "Author", bio: "Features and women's football." },
    { id: "u4", name: "Youssef Amrani", role: "Author", bio: "African football." },
    { id: "u5", name: "Mehdi Chraibi", role: "Author", bio: "Transfers and the business of football." },
    { id: "u6", name: "Karim Benjelloun", role: "Contributor", bio: "Columnist." },
    { id: "u7", name: "Leila Fassi", role: "Author", bio: "European football." }
  ],

  // Reader comments. status: "approved", "pending", "spam" or "trash".
  comments: [
    { id: "c1", post: "atlas-lions-november-squad", name: "Anas", text: "Great to see Botola players getting a chance. Benali deserves it.", date: "2026-11-14T10:12:00", status: "approved" },
    { id: "c2", post: "atlas-lions-november-squad", name: "Fatima Z.", text: "Which of the newcomers will start the first match?", date: "2026-11-14T11:40:00", status: "approved" },
    { id: "c3", post: "atlas-lions-november-squad", name: "Rachid", text: "The left-back was excellent in the U-23 camp.", date: "2026-11-14T13:05:00", status: "pending" },
    { id: "c4", post: "botola-title-race-tightens", name: "Hamid", text: "Fès deserved the point, they pressed for the whole second half.", date: "2026-11-14T09:30:00", status: "approved" },
    { id: "c5", post: "opinion-var", name: "Sara", text: "Announcing decisions on the speakers would change everything.", date: "2026-11-13T19:22:00", status: "approved" },
    { id: "c6", post: "opinion-var", name: "Youness", text: "I disagree, the waiting is part of the drama now.", date: "2026-11-13T20:01:00", status: "approved" },
    { id: "c7", post: "women-league-record-crowd", name: "Imane", text: "I was there! The atmosphere was unbelievable.", date: "2026-11-13T22:15:00", status: "approved" },
    { id: "c8", post: "women-league-record-crowd", name: "Khalid", text: "More double-headers please.", date: "2026-11-14T08:45:00", status: "pending" },
    { id: "c9", post: "winter-window-moroccan-targets", name: "Best Odds 4U", text: "Win big with our betting tips, click here!!!", date: "2026-11-14T07:02:00", status: "spam" },
    { id: "c10", post: "caf-champions-league-groups", name: "Mourad", text: "Long trips but a winnable group. Top two is realistic.", date: "2026-11-13T16:10:00", status: "approved" }
  ],

  // Images uploaded in the admin (stored inside this file).
  media: [],

  articles: [
    {
      id: "atlas-lions-november-squad",
      cat: "atlas-lions", tags: ["Senior team"], featured: true, motif: "stadium",
      title: "Atlas Lions Call Up Five Uncapped Players for November Double-Header",
      author: "Nadia Berrada", date: "2026-11-14",
      excerpt: "The national team's latest squad leans on Botola form and a new wave of European-based youngsters, with five names set for a first taste of senior football.",
      body: [
        "The Atlas Lions technical staff named a 26-man squad on Friday for the November international window, and the headline is a clear one: five players have earned a first senior call-up after strong starts to the season.",
        "Three of the newcomers play in the Botola Pro, a deliberate signal that domestic form is being watched closely. Rabat Stars midfielder Ilyas Benali, 21, has started every league game this season and leads the division for passes into the final third.",
        "The other two arrive from Europe: a left-back who came through a Dutch academy and a 19-year-old striker who chose Morocco over two other eligible nations in the summer. Both took part in the U-23 camp in October.",
        "The squad gathers in Salé on Monday before two matches in eight days. Staff said minutes would be shared across the group, with the second fixture used to test the newcomers in a competitive setting."
      ]
    },
    {
      id: "botola-title-race-tightens",
      cat: "botola", tags: ["Results"], motif: "pitch",
      title: "Botola Pro Title Race Tightens as Leaders Drop Points in Fès",
      author: "Omar Lahlou", date: "2026-11-14",
      excerpt: "Racing Anfa saw their lead cut to a single point after a stubborn Fès Sporting side held on for a draw in front of a sold-out crowd.",
      body: [
        "Racing Anfa's lead at the top of the Botola Pro is down to a single point after a 1-1 draw away to Fès Sporting, a result that keeps three clubs within three points of first place after ten rounds.",
        "The visitors went ahead before the break through a well-worked set piece, but Fès pushed high after half-time and levelled with twenty minutes left, a low finish that crept in at the near post.",
        "Rabat Stars took advantage with a 2-1 home win over Union Marrakech, coming from behind for the second time in three matches. Their coach praised the bench, which provided both goals.",
        "Next weekend's fixture list pits the top two against each other's nearest rivals, and the northern trip to Tanger looks like the toughest test of the round."
      ]
    },
    {
      id: "rabat-stars-academy",
      cat: "botola", tags: ["Clubs"], motif: "pitch",
      title: "Inside Rabat Stars' Academy, the Factory Behind Botola's Youngest Starters",
      author: "Salma Kettani", date: "2026-11-13",
      excerpt: "Four of the league's ten youngest regular starters came through the same academy. We spent a week with the coaches who built it.",
      body: [
        "The first thing you notice at the Rabat Stars training centre is how quiet it is. Sessions run on a strict timetable, and coaches speak to players in short, specific sentences rather than shouting from the touchline.",
        "Academy director Hicham Alaoui says the approach is borrowed from education rather than football. Every player has a written plan for the season, reviewed every six weeks with the player and a parent.",
        "The results are now visible in the first team. Four of the ten youngest players to start regularly in the Botola Pro this season came through these pitches, and two of them have been called up by the national U-23 side.",
        "The club is now expanding its scouting to smaller towns in the region, with free trial days held every school holiday."
      ]
    },
    {
      id: "caf-champions-league-groups",
      cat: "africa", tags: ["CAF Champions League"], motif: "trophy",
      title: "CAF Champions League Draw: Moroccan Clubs Learn Group-Stage Opponents",
      author: "Youssef Amrani", date: "2026-11-13",
      excerpt: "Two Moroccan sides will face long trips and familiar rivals as the continent's top club competition moves into the group phase.",
      body: [
        "The group-stage draw for the CAF Champions League has handed Moroccan clubs a mix of familiar opponents and long journeys, with the first round of matches due later this month.",
        "Racing Anfa, fresh from a 3-0 win in the second leg of their qualifying tie, were drawn alongside opponents from Egypt, Tanzania and Angola. Their sporting director called it 'a group that rewards squad depth'.",
        "The second Moroccan side face a group that includes the reigning runners-up, along with clubs from Tunisia and Côte d'Ivoire. Travel and climate are expected to be key factors.",
        "The top two from each group advance to the quarter-finals, which are scheduled for the spring."
      ]
    },
    {
      id: "afcon-qualifiers-recap",
      cat: "africa", tags: ["AFCON"], motif: "ball",
      title: "AFCON Qualifiers: Five Things We Learned From the Latest Round",
      author: "Youssef Amrani", date: "2026-11-12",
      excerpt: "Surprise results, breakout goalkeepers and a lot of late drama: our takeaways from the latest round of continental qualifiers.",
      body: [
        "The latest round of AFCON qualifiers produced the usual mix of comfortable wins for the favourites and tense evenings for those on the bubble. Here is what stood out.",
        "First, the gap is closing. Several sides ranked outside the continent's top twenty took points from established teams, and the margins in most groups are now down to one or two results.",
        "Second, goalkeepers decided more matches than strikers. Three of the round's man-of-the-match awards went to keepers, two of them playing their club football in North Africa.",
        "Third, late goals are everywhere: almost a third of all goals in this round arrived after the 80th minute, a sign of how much fitness and bench depth now matter in qualifying."
      ]
    },
    {
      id: "winter-window-moroccan-targets",
      cat: "transfers", tags: [], motif: "net",
      title: "Winter Window: Three Botola Stars Attracting European Scouts",
      author: "Mehdi Chraibi", date: "2026-11-14",
      excerpt: "Scouts from Belgium, France and Portugal have been regular visitors at Botola grounds this autumn. These are the names on their lists.",
      body: [
        "With the January window seven weeks away, the press boxes at Botola Pro grounds have been busier than usual. Clubs from Belgium, France and Portugal have all sent scouts this autumn.",
        "Top of most lists is Fès Sporting's central defender, whose reading of the game and passing range have stood out in a side that has conceded only eight goals.",
        "Rabat Stars' Ilyas Benali, freshly called up by the national team, is the second name. His club is understood to prefer keeping him until the summer.",
        "The third is a pacey Agadir Sporting winger who is already in advanced talks over a loan with an option to buy."
      ]
    },
    {
      id: "loan-move-agadir",
      cat: "transfers", tags: [], motif: "net",
      title: "Agadir Sporting Winger Close to Loan Move to Belgium",
      author: "Mehdi Chraibi", date: "2026-11-11",
      excerpt: "The 22-year-old has scored four times this season and would join a top-half side in the Belgian Pro League on an 18-month deal.",
      body: [
        "Agadir Sporting are close to agreeing an 18-month loan for their 22-year-old winger, with a Belgian Pro League side set to hold an option to make the move permanent.",
        "The player has four goals and three assists in ten league matches, and his club have accepted that a move abroad could come sooner than planned.",
        "Agadir would receive a loan fee and a significant share of any future sale. The deal is expected to be completed when the window opens in January."
      ]
    },
    {
      id: "women-league-record-crowd",
      cat: "women", tags: [], motif: "stadium",
      title: "Record Crowd Watches Women's League Derby in Casablanca",
      author: "Salma Kettani", date: "2026-11-13",
      excerpt: "More than 11,000 fans turned out for a 2-2 thriller, the biggest attendance for a women's club match in the country's history.",
      body: [
        "More than 11,000 spectators watched Casablanca Ladies and Rabat Stars draw 2-2 on Wednesday night, the largest crowd ever recorded for a women's club match in Morocco.",
        "Free entry for under-16s and a double-header with a men's youth fixture helped fill the stands, and organisers say they will repeat the format for the return game.",
        "On the pitch, the hosts twice came from behind, with their 17-year-old forward scoring the equaliser in stoppage time to send the home end into celebration.",
        "League officials said attendances are up by more than half on last season, driven by school partnerships and live streaming of every match."
      ]
    },
    {
      id: "lionesses-u20",
      cat: "women", tags: [], motif: "trophy",
      title: "U-20 Lionesses Book Their Place at the Continental Finals",
      author: "Nadia Berrada", date: "2026-11-10",
      excerpt: "A composed 2-0 win on aggregate sends Morocco's U-20 women to next year's finals, the third straight qualification for the age group.",
      body: [
        "Morocco's U-20 women's team have qualified for next year's continental finals after a 2-0 aggregate win, the third consecutive qualification for the age group.",
        "The second leg finished goalless, but the side never looked troubled, limiting their hosts to two shots on target across ninety minutes.",
        "The coaching staff now have six months to prepare, with a training camp and friendlies planned for the spring."
      ]
    },
    {
      id: "wc2030-grassroots",
      cat: "world-cup-2030", tags: [], motif: "stadium",
      title: "What Hosting the 2030 World Cup Could Mean for Grassroots Football",
      author: "Omar Lahlou", date: "2026-11-12",
      excerpt: "The stadiums get the headlines. The real legacy could be decided on school pitches and neighbourhood fields.",
      body: [
        "Most of the conversation about 2030 focuses on stadiums, airports and train lines. But coaches working with children say the tournament's real legacy will be measured on much smaller pitches.",
        "Previous hosts show both sides of the story. Some built lasting youth programmes around the event; others saw interest spike and fade within a couple of years.",
        "Grassroots coaches we spoke to point to three needs: more qualified coaches, safe all-weather pitches within walking distance of schools, and competitions that keep teenagers playing.",
        "With four years to go, there is still time to make sure the tournament leaves more than concrete behind."
      ]
    },
    {
      id: "wc2030-fan-zones",
      cat: "world-cup-2030", tags: [], motif: "ball",
      title: "Host Cities Begin Planning Fan Zones and Transport for 2030",
      author: "Mehdi Chraibi", date: "2026-11-09",
      excerpt: "Local planners are already mapping fan-zone sites and match-day transport, drawing lessons from recent tournaments.",
      body: [
        "Planning teams in several host cities have started mapping possible fan-zone sites and match-day transport routes, four years before a ball is kicked.",
        "Officials say recent tournaments showed that fan zones work best close to existing public transport and away from residential streets.",
        "Consultations with residents and local businesses are expected over the next year."
      ]
    },
    {
      id: "opinion-var",
      cat: "opinion", tags: [], motif: "pitch",
      title: "VAR Has Made the League Fairer. It Has Also Made It Slower.",
      author: "Karim Benjelloun", date: "2026-11-13",
      excerpt: "Fewer clear errors is a win. Four-minute reviews in a half-empty stadium are not. There is a better balance to find.",
      body: [
        "Nobody wants to go back to the days of obvious offsides going unpunished. On that count, video review has done its job: the number of clear and obvious errors has fallen sharply.",
        "But football is also an experience, and the experience in the stands has suffered. Long reviews with no explanation leave fans guessing, and celebrations now come with a nervous pause.",
        "Two changes would help: announcing decisions over the stadium speakers, as some competitions already do, and setting a firm target time for every review.",
        "Accuracy matters. So does the reason people buy a ticket in the first place."
      ]
    },
    {
      id: "opinion-coaches",
      cat: "opinion", tags: [], motif: "net",
      title: "Moroccan Coaches Deserve More Chances at the Top",
      author: "Karim Benjelloun", date: "2026-11-11",
      excerpt: "Our clubs keep hiring from abroad while homegrown coaches build reputations in youth football and the lower leagues.",
      body: [
        "Look at the dugouts of the top division and you will find plenty of experience from abroad. Look one level down and you will find a generation of Moroccan coaches doing remarkable work with small budgets.",
        "Many hold the highest coaching licences and have years of youth football behind them. What they lack is a first chance at a big club.",
        "Clubs do not need to choose one or the other. Pairing a foreign head coach with a Moroccan assistant who is being prepared for the top job would be a start."
      ]
    },
    {
      id: "opinion-tickets",
      cat: "opinion", tags: [], motif: "stadium",
      title: "Full Stadiums Start With Fair Ticket Prices",
      author: "Leila Fassi", date: "2026-11-10",
      excerpt: "The record women's derby crowd was not an accident. Cheap tickets and smart scheduling filled the stands.",
      body: [
        "This week's record crowd for a women's derby should be studied by every club in the country. Free entry for children and a double-header did more than any advertising campaign.",
        "Empty seats cost clubs more than lost ticket sales. They make the broadcast look worse, the atmosphere flatter and the sponsors less interested.",
        "A family ticket priced for the families who live near the stadium would be a good place to start."
      ]
    },
    {
      id: "europe-heritage-players",
      cat: "europe", tags: ["Champions League"], motif: "trophy",
      title: "Moroccan-Heritage Players Leave Their Mark on Champions League Week",
      author: "Leila Fassi", date: "2026-11-13",
      excerpt: "From starting full-backs to late substitutes, Moroccan-heritage players were involved across the latest round of European matches.",
      body: [
        "This week's round of Champions League matches featured Moroccan-heritage players in almost every corner of the competition, from established starters to teenagers making their debut.",
        "Several are already part of the national team set-up, while others remain eligible for more than one country and will be watched closely by federation scouts.",
        "The trend is not new, but the numbers are growing, a result of academies across Europe producing more players from diaspora communities."
      ]
    },
    {
      id: "europe-fixture-pileup",
      cat: "europe", tags: ["Premier League"], motif: "ball",
      title: "Festive Fixture Pile-Up: How Clubs Are Managing Squad Fatigue",
      author: "Omar Lahlou", date: "2026-11-11",
      excerpt: "Rotation, GPS data and recovery pods: the methods clubs are using to survive the busiest weeks of the season.",
      body: [
        "December is the busiest month of the English season, with some clubs playing every three days. Sports scientists say the key is planning weeks in advance.",
        "Most clubs now track every player's load with GPS vests and decide on rotation days before the match, rather than reacting to visible tiredness.",
        "Recovery has changed too: sleep coaching, nutrition plans and cold-water therapy are standard at the top level."
      ]
    },
    {
      id: "laliga-north-africa-scouting",
      cat: "europe", tags: ["LaLiga"], motif: "pitch",
      title: "Why Spanish Clubs Keep Scouting North Africa",
      author: "Youssef Amrani", date: "2026-11-09",
      excerpt: "Short flights, shared football culture and good value make the region a natural hunting ground for clubs across the Strait.",
      body: [
        "Spanish clubs have long looked south for talent, and the number of scouting trips to North Africa has grown in recent seasons.",
        "Short travel times, a similar style of play and fees that are modest by European standards all make the region attractive.",
        "For players, Spain offers a familiar climate and a large Moroccan community, which helps them settle quickly."
      ]
    },
    {
      id: "referee-academy",
      cat: "news", tags: [], motif: "pitch",
      title: "New Referee Academy Opens in Rabat to Train the Next Generation of Officials",
      author: "Nadia Berrada", date: "2026-11-12",
      excerpt: "Forty trainees, including twelve women, make up the first intake of a two-year programme combining fitness, law and video training.",
      body: [
        "A new referee academy has opened in Rabat with forty trainees in its first intake, twelve of them women.",
        "The two-year programme covers the laws of the game, physical preparation and video review, with trainees officiating youth matches from their first month.",
        "Organisers hope the academy will raise standards across all divisions and produce officials for international tournaments."
      ]
    },
    {
      id: "u23-friendly",
      cat: "atlas-lions", tags: ["U23"], motif: "ball",
      title: "U-23 Side Confirm Friendly Ahead of Olympic Qualifying Campaign",
      author: "Mehdi Chraibi", date: "2026-11-10",
      excerpt: "The youngsters will face a European opponent next month in the first of three planned preparation matches.",
      body: [
        "Morocco's U-23 team will play a friendly against a European opponent next month, the first of three preparation matches before Olympic qualifying.",
        "The coaching staff plan to use the game to test players who have broken into first teams at their clubs this season.",
        "A squad is expected to be named in two weeks."
      ]
    },
    {
      id: "neighbourhood-pitches",
      cat: "news", tags: [], motif: "net",
      title: "Neighbourhood Pitches Programme Reaches Its 100th Site",
      author: "Leila Fassi", date: "2026-11-09",
      excerpt: "Small-sided artificial pitches are now open in a hundred neighbourhoods, with free coaching sessions on weekends.",
      body: [
        "A programme building small-sided artificial pitches in urban neighbourhoods has opened its 100th site.",
        "Each pitch hosts free coaching sessions on weekends, run by volunteers who have completed a short training course.",
        "The organisers say the next phase will focus on towns and rural areas with no floodlit pitches at all."
      ]
    },
    {
      id: "matchday-11-preview",
      cat: "botola", tags: ["Previews"], motif: "stadium",
      title: "Matchday 11 Preview: Tanger Host the Leaders in a Northern Showdown",
      author: "Omar Lahlou", date: "2026-11-14",
      excerpt: "Étoile de Tanger have not lost at home since March. Racing Anfa have not lost anywhere since September. Something has to give.",
      body: [
        "The pick of this weekend's Botola Pro fixtures takes the league leaders north to face an Étoile de Tanger side unbeaten at home since March.",
        "Racing Anfa will be without their suspended captain, and their coach has hinted at a more cautious set-up than usual.",
        "Elsewhere, Rabat Stars travel to Meknès, while Fès Sporting host Oujda Athletic on Sunday evening."
      ]
    },
    {
      id: "goalkeeper-interview",
      cat: "atlas-lions", tags: ["Interviews"], motif: "net",
      title: "“The Shirt Weighs More Than Any Trophy”: Meet the Atlas Lions' Third Goalkeeper",
      author: "Salma Kettani", date: "2026-11-11",
      excerpt: "He has not played a minute for the national team yet. He still calls every camp the best week of his year.",
      body: [
        "Third-choice goalkeepers rarely give interviews. Hamza El Idrissi, 24, says that is exactly why he wanted to talk.",
        "“People think you are just there to make up the numbers,” he says. “But in training you face the best strikers in the country every day. You learn more in a week than in a month at your club.”",
        "He spends camps studying the two goalkeepers ahead of him, filling notebooks with details on positioning and distribution.",
        "Asked about his goal, he does not hesitate: “One cap. After that, we will see.”"
      ]
    }
  ]
};
