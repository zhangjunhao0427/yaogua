// Hexagrams 1–16. The classical text is rendered from the received Zhouyi;
// the plain-language notes follow the Chinese ones written for this app.
import type { HexagramText } from '../../../data/zhouyi/types';

export const EN_PART_1: readonly HexagramText[] = [
  // 1 乾为天
  {
    theme: 'Tireless strength',
    summary:
      'Six unbroken lines: heaven in ceaseless motion. The matter is at its most creative and most in need of discipline — the power is yours, but overplay it and it breaks.',
    judgment: [
      'Supreme success. It is favourable to hold to what is right.',
      'Creation brings success, and holding to what is right keeps it. Strength that never tires: this has the makings of a great beginning.',
    ],
    lines: [
      [
        'Nine at the beginning',
        'The dragon lies hidden. Do not act.',
        'The dragon is still under deep water. The time has not come; build your strength rather than rushing to use it.',
      ],
      [
        'Nine in the second place',
        'The dragon appears in the field. It is favourable to see the great man.',
        'The dragon shows itself in the open. Your ability is beginning to show; this is the time to see someone who can lift you.',
      ],
      [
        'Nine in the third place',
        'All day long the superior man is creative; at nightfall his mind is still beset with care. Danger. No blame.',
        'Diligent through the day, still watchful at night. The position carries danger, but in the end there is no fault.',
      ],
      [
        'Nine in the fourth place',
        'Wavering flight over the depths. No blame.',
        'Leap upward or fall back to the deep — judge the moment and there will be no mistake either way.',
      ],
      [
        'Nine in the fifth place',
        'The dragon flies in the heavens. It is favourable to see the great man.',
        'The dragon is aloft, in the place where it can do the most. Join with those of worth and do something large.',
      ],
      [
        'Nine at the top',
        'The dragon flown too high has cause for regret.',
        'Flown too high, the peak cannot be held, and regret follows. Know when to draw back.',
      ],
    ],
    extra: [
      'Using Nine',
      'A flight of dragons without heads. Good fortune.',
      'None of the dragons pushes to lead. Strength that does not force itself forward: good fortune.',
    ],
  },
  // 2 坤为地
  {
    theme: 'Yielding support',
    summary:
      'Six broken lines: the earth that carries everything. This hexagram is not about initiating but about completing — following the right lead and catching what is handed to you matters more than going first.',
    judgment: [
      'Supreme success. It is favourable to hold to what is right, as a mare does. The superior man has somewhere to go. Going first, he loses the way; following, he finds a master. Favourable. In the south-west he finds friends; in the north-east he loses them. Quiet constancy brings good fortune.',
      'Great success. Be as yielding and as enduring as a mare, and holding to what is right pays. Go ahead of others and you lose your way; follow, and you find something to rely on. Friends lie to the south-west, and are lost to the north-east. Rest in what is right: good fortune.',
    ],
    lines: [
      [
        'Six at the beginning',
        'When there is hoarfrost underfoot, solid ice is not far off.',
        'Frost underfoot means the season of hard ice is coming. Read the small sign and prepare early.',
      ],
      [
        'Six in the second place',
        'Straight, square, great. Without purpose, yet nothing remains unfurthered.',
        'Upright, square-dealing, broad. Follow your own nature without contrivance and nothing will go amiss.',
      ],
      [
        'Six in the third place',
        'Hidden lines. One is able to remain persevering. If by chance you follow the king’s business, claim no finish — yet there is an end.',
        'Keep your brilliance within and you can hold to what is right. Assisting another’s work, take no credit, and it will still come out well.',
      ],
      [
        'Six in the fourth place',
        'A tied-up sack. No blame, no praise.',
        'Tie the mouth of the sack: guard your words and your steps. No fault, and no applause either.',
      ],
      [
        'Six in the fifth place',
        'A yellow lower garment brings supreme good fortune.',
        'Yellow at the waist: holding a high place modestly and in the middle way. Great good fortune.',
      ],
      [
        'Six at the top',
        'Dragons fight in the meadow. Their blood is black and yellow.',
        'Yin at its extreme contends with yang and both are wounded. Yielding carried too far also ends in conflict.',
      ],
    ],
    extra: [
      'Using Six',
      'Lasting perseverance furthers.',
      'The way of yielding is worth most when it is kept to over the long run.',
    ],
  },
  // 3 水雷屯
  {
    theme: 'Hard beginnings',
    summary:
      'Thunder and cloud together; shoots breaking through soil. The disorder of any true beginning: resources incomplete, direction unclear — but the life is in it, and getting through establishes you.',
    judgment: [
      'Supreme success. It is favourable to hold to what is right. Do not set out anywhere. It is favourable to install helpers.',
      'All things at their birth: great success, and holding to what is right pays. Do not rush off; lay foundations and find support first.',
    ],
    lines: [
      [
        'Nine at the beginning',
        'Hesitation and hindrance. It furthers one to remain persevering. It furthers one to install helpers.',
        'Circling without advancing. Rest in what is right, lay your foundation and gather people to you.',
      ],
      [
        'Six in the second place',
        'Difficulties pile up. Horse and wagon part. He is not a robber; he wants to woo when the time comes. The maiden is chaste, she does not pledge herself. Ten years — then she pledges herself.',
        'Hard going, the horse wheeling in place. The one who comes is not a bandit but a suitor; the woman holds to herself and does not marry for ten years. The time is unripe — wait with patience.',
      ],
      [
        'Six in the third place',
        'Whoever hunts deer without a forester only loses his way in the forest. The superior man understands the signs and prefers to desist. To go on brings humiliation.',
        'Chasing deer with no guide only traps you in the woods. Seeing how it stands, better to let go; pressing on brings regret.',
      ],
      [
        'Six in the fourth place',
        'Horse and wagon part. Strive for union. To go brings good fortune. Everything acts to further.',
        'After the circling, go out and seek the alliance yourself. To go is fortunate; nothing is unfavourable.',
      ],
      [
        'Nine in the fifth place',
        'Difficulties in blessing. A little perseverance brings good fortune. Great perseverance brings misfortune.',
        'Your bounty cannot get through to others. Hold to what is right in small matters: good fortune. Force the large ones and it turns bad.',
      ],
      [
        'Six at the top',
        'Horse and wagon part. Bloody tears flow.',
        'Circling with nowhere left to go, weeping tears of blood. The impasse is complete; something has to change.',
      ],
    ],
  },
  // 4 山水蒙
  {
    theme: 'Asking to learn',
    summary:
      'A spring at the foot of a mountain, its course not yet formed. You — or the other person — are still at the stage of not understanding. What matters is asking the right person, once, and taking the answer in.',
    judgment: [
      'Success. It is not I who seek the young fool; the young fool seeks me. At the first oracle I inform him. If he asks two or three times, it is importunity, and I do not inform him. Perseverance furthers.',
      'Success. I do not go after the uninstructed; he comes to me. Tell him at the first asking; repeat it again and again and it becomes pestering, and then there is no answer. Holding to what is right pays.',
    ],
    lines: [
      [
        'Six at the beginning',
        'To make a fool develop, it furthers one to apply discipline. Fetters should be removed. To go on like that brings humiliation.',
        'At the start of teaching, set the rules so people know where the edges are. But drive it by punishment alone and it ends in regret.',
      ],
      [
        'Nine in the second place',
        'To bear with fools in kindliness brings good fortune. To take a wife brings good fortune. The son is capable of taking charge of the household.',
        'Bear with those who do not yet know: good fortune. Take them in as you would a wife: good fortune. Like a son able to carry the family.',
      ],
      [
        'Six in the third place',
        'Do not take a maiden who, on seeing a man of bronze, loses possession of herself. Nothing furthers.',
        'Someone who loses their footing the moment money appears cannot be entrusted with a life. Nothing good comes of it.',
      ],
      [
        'Six in the fourth place',
        'Entangled folly brings humiliation.',
        'Stuck in not-knowing and far from anyone who could teach: regret.',
      ],
      ['Six in the fifth place', 'Childlike folly brings good fortune.', 'Asking with a child’s open mind: good fortune.'],
      [
        'Nine at the top',
        'In punishing folly, it does not further one to commit transgressions. The only thing that furthers is to prevent transgressions.',
        'Break the ignorance firmly, but do not go so far as to wound. Use it to prevent mistakes, not to punish.',
      ],
    ],
  },
  // 5 水天需
  {
    theme: 'Waiting on time',
    summary:
      'Clouds rise in the sky; the rain has not fallen. Everything that could be done is done — only the timing is missing. Waiting here is not passivity: it is holding your credit steady instead of moving at the wrong moment.',
    judgment: [
      'Waiting. If you are sincere, you have light and success. Perseverance brings good fortune. It furthers one to cross the great water.',
      'Hold sincerity and there is light and success; hold to what is right and there is good fortune; it is favourable to cross the great river. Danger lies ahead — wait for the moment with patience.',
    ],
    lines: [
      [
        'Nine at the beginning',
        'Waiting in the meadow. It furthers one to abide in what endures. No blame.',
        'Waiting out in the fields, far from the danger. Keep to your ordinary way: no fault.',
      ],
      [
        'Nine in the second place',
        'Waiting on the sand. There is some gossip. The end brings good fortune.',
        'Waiting on the sand, nearer the danger. Some talk goes around, but it ends well.',
      ],
      [
        'Nine in the third place',
        'Waiting in the mud brings about the arrival of the enemy.',
        'Waiting in the mire, right up against the danger, invites trouble from outside.',
      ],
      [
        'Six in the fourth place',
        'Waiting in blood. Get out of the pit.',
        'Waiting in a bloody place — and still getting out of the hole in the end.',
      ],
      [
        'Nine in the fifth place',
        'Waiting at meat and drink. Perseverance brings good fortune.',
        'Waiting in comfort, with food and wine. Hold to what is right: good fortune.',
      ],
      [
        'Six at the top',
        'One falls into the pit. Three uninvited guests arrive. Honour them, and in the end there is good fortune.',
        'Fallen into the pit, and three guests come unasked. Treat them with respect and it ends well.',
      ],
    ],
  },
  // 6 天水讼
  {
    theme: 'Stopping a quarrel',
    summary:
      'Heaven moves up, water runs down; they never meet. A real conflict is already under way. Those who fight to the end often win the argument and lose the ground. Stopping halfway is the better trade.',
    judgment: [
      'Conflict. You are sincere and are being obstructed. A cautious halt halfway brings good fortune. Going through to the end brings misfortune. It furthers one to see the great man. It does not further one to cross the great water.',
      'Sincere but blocked, and wary in your heart. Stop at the right point: good fortune. Fight it out to the end: misfortune. Find someone impartial to judge it; do not take big risks now.',
    ],
    lines: [
      [
        'Six at the beginning',
        'If one does not perpetuate the affair, there is a little gossip. In the end, good fortune comes.',
        'Do not let the dispute drag on. A little talk, and then it ends well.',
      ],
      [
        'Nine in the second place',
        'One cannot engage in conflict; one returns home, giving way. The people of his town, three hundred households, remain free of guilt.',
        'The case cannot be won; withdraw and keep out of the way. Even the three hundred households of his town come to no harm.',
      ],
      [
        'Six in the third place',
        'To nourish oneself on ancient virtue induces perseverance. Danger. In the end, good fortune comes. If by chance you are in the service of a king, seek not works.',
        'Live on what you already have and are owed. Holding to what is right has its dangers, but it ends well. Assisting another, take no credit.',
      ],
      [
        'Nine in the fourth place',
        'One cannot engage in conflict. One turns back and submits to fate, changes one’s attitude, and finds peace in perseverance. Good fortune.',
        'The case cannot be won; turn back, accept how things are, change your mind, and rest in what is right. Good fortune.',
      ],
      ['Nine in the fifth place', 'To contend before him brings supreme good fortune.', 'The dispute is judged fairly. Great good fortune.'],
      [
        'Nine at the top',
        'Even if by chance a leather belt is bestowed on one, by the end of a morning it will have been snatched away three times.',
        'The sash of honour won by litigation is stripped away three times before the morning is out. What is won by fighting cannot be held.',
      ],
    ],
  },
  // 7 地水师
  {
    theme: 'Leading by rule',
    summary:
      'Water within the earth; a multitude gathered into an army. You are in a position of leading people. Discipline and a single chain of command decide it — put an experienced hand in charge and do not issue orders from several mouths.',
    judgment: [
      'The army needs perseverance and a strong man. Good fortune without blame.',
      'An army must hold to what is right, and be led by an elder of standing. Good fortune, and no fault.',
    ],
    lines: [
      [
        'Six at the beginning',
        'An army must set forth in proper order. If the order is not good, misfortune threatens.',
        'Troops go out under discipline. Where discipline is slack, win or lose, it ends badly.',
      ],
      [
        'Nine in the second place',
        'In the midst of the army. Good fortune. No blame. The king bestows a triple decoration.',
        'Commanding well from within the army: good fortune, no fault, and the king’s repeated praise.',
      ],
      [
        'Six in the third place',
        'Perchance the army carries corpses in the wagon. Misfortune.',
        'Orders come from more than one place, and the army may come back carrying its dead. Misfortune.',
      ],
      [
        'Six in the fourth place',
        'The army retreats. No blame.',
        'The army falls back and camps. No fault — withdrawing from what cannot be done is not an error.',
      ],
      [
        'Six in the fifth place',
        'There is game in the field. It furthers one to catch it. Without blame. Let the eldest lead the army. The younger transports corpses; then perseverance brings misfortune.',
        'Game is raiding the fields, so it is right to go after it: no fault. Let the elder command. Split the command with the inexperienced and the wagons come back with the dead — even holding to what is right ends badly.',
      ],
      [
        'Six at the top',
        'The great prince issues commands, founds states, vests families with fiefs. Inferior people should not be employed.',
        'After the fighting the ruler rewards and invests: states founded, houses established. But do not put small people in power.',
      ],
    ],
  },
  // 8 水地比
  {
    theme: 'Drawing together',
    summary:
      'Water over the earth, soaking into it. Time to look for allies and to get close to people you can rely on. This hexagram has a clock in it — come late and the place beside them is taken.',
    judgment: [
      'Holding together brings good fortune. Inquire of the oracle once again whether you possess sublimity, constancy and perseverance; then there is no blame. Those who are uncertain gradually join. Whoever comes too late meets with misfortune.',
      'Good fortune. Weigh it again and again; with lasting and upright character there is no fault. The unsettled come over one by one, and whoever drags their feet meets misfortune.',
    ],
    lines: [
      [
        'Six at the beginning',
        'Hold to him in truth and loyalty; this is without blame. Truth, like a full earthen bowl: thus in the end good fortune comes from without.',
        'Join with sincerity: no fault. Sincerity as full as a brimming jar brings an unlooked-for good in the end. Good fortune.',
      ],
      ['Six in the second place', 'Hold to him inwardly. Perseverance brings good fortune.', 'Join from the heart. Hold to what is right: good fortune.'],
      ['Six in the third place', 'You hold together with the wrong people.', 'The one you are drawing close to is not the right person.'],
      ['Six in the fourth place', 'Hold to him outwardly also. Perseverance brings good fortune.', 'Join outwardly with someone worthy. Hold to what is right: good fortune.'],
      [
        'Nine in the fifth place',
        'Manifestation of holding together. In the hunt the king uses beaters on three sides only and foregoes game that runs off in front. The citizens need no warning. Good fortune.',
        'Drawing people together in the open. The king hunts with three sides beaten and lets the game ahead escape; the townspeople need no warning and come and go freely. Good fortune.',
      ],
      ['Six at the top', 'He finds no head for holding together. Misfortune.', 'Wanting to join but having missed the beginning, with nothing to hold to. Misfortune.'],
    ],
  },
  // 9 风天小畜
  {
    theme: 'Storing up, waiting',
    summary:
      'Wind moving across the sky; cloud gathering with no rain yet. Your strength is still small and can only be built a little at a time. What is available now is assembling the conditions, not forcing the matter.',
    judgment: [
      'The taming power of the small has success. Dense clouds, no rain from our western region.',
      'Success. Heavy cloud and still no rain, rising from the western fields. What you have stored up is not enough yet; the time is not ripe.',
    ],
    lines: [
      ['Nine at the beginning', 'Return to the way. How could there be blame in this? Good fortune.', 'Back onto your own proper road — where is the fault in that? Good fortune.'],
      ['Nine in the second place', 'He allows himself to be drawn into returning. Good fortune.', 'Led back to the right road alongside companions. Good fortune.'],
      [
        'Nine in the third place',
        'The spokes burst out of the wagon wheels. Man and wife roll their eyes.',
        'The cart comes off its wheel; husband and wife turn against each other. Relations sour and progress stops.',
      ],
      ['Six in the fourth place', 'If you are sincere, blood vanishes and fear gives way. No blame.', 'Hold sincerity: the worry clears, the fright passes, and there is no fault.'],
      ['Nine in the fifth place', 'If you are sincere and loyally attached, you are rich in your neighbour.', 'Sincerity binds you closely; you share your plenty with those around you.'],
      [
        'Nine at the top',
        'The rain comes, there is rest. This is due to the lasting effect of character. Perseverance brings the woman into danger. The moon is nearly full. If the superior man persists, misfortune comes.',
        'The rain has fallen and the store is full; character carries it. But holding on now has its danger. The moon is nearly round: to set out at this point brings misfortune. At the full, know when to stop.',
      ],
    ],
  },
  // 10 天泽履
  {
    theme: 'Treading on a tail',
    summary:
      'Heaven above, the lake below; each in its place. You are walking behind a tiger: dangerous, but not hopeless. Keep your measure and your manners and you pass safely.',
    judgment: [
      'Treading upon the tail of the tiger. It does not bite the man. Success.',
      'You walk behind the tiger and it does not bite: success. Care and courtesy turn danger aside.',
    ],
    lines: [
      ['Nine at the beginning', 'Simple conduct. Progress without blame.', 'Act in your plain, unadorned character; going forward brings no fault.'],
      ['Nine in the second place', 'Treading a smooth, level course. The perseverance of a dark man brings good fortune.', 'Walking a level road; for the quiet-minded, holding to what is right brings good fortune.'],
      [
        'Six in the third place',
        'A one-eyed man is able to see, a lame man is able to tread. He treads on the tail of the tiger. The tiger bites the man. Misfortune. Thus does a warrior act on behalf of his great prince.',
        'The half-blind think they see, the lame think they can walk; the tiger’s tail is trodden and the tiger bites. Misfortune — like a soldier presuming to rule, reaching past what he can do.',
      ],
      ['Nine in the fourth place', 'He treads on the tail of the tiger. Caution and circumspection lead ultimately to good fortune.', 'The tiger’s tail is trodden; wariness and fear carry it through to good fortune.'],
      ['Nine in the fifth place', 'Resolute conduct. Perseverance with awareness of danger.', 'Acting with stubborn decisiveness: even in the right, there is danger here.'],
      ['Nine at the top', 'Look to your conduct and weigh the favourable signs. When everything is fulfilled, supreme good fortune comes.', 'Look back over the road you walked and weigh what it brought. Bring it full circle: great good fortune.'],
    ],
  },
  // 11 地天泰
  {
    theme: 'Peace and flow',
    summary:
      'Heaven’s breath descends and earth’s rises; above and below meet. A good season: communication runs, people are of one mind. Push what you want done now — the easy stretch does not last.',
    judgment: [
      'Peace. The small departs, the great approaches. Good fortune. Success.',
      'The small goes, the great comes: good fortune and success. Heaven and earth are in contact, and high and low understand each other.',
    ],
    lines: [
      ['Nine at the beginning', 'When ribbon grass is pulled up, the sod comes with it. Each according to his kind. Undertakings bring good fortune.', 'Pull up the grass and the tangled roots come too. Go forward with your own kind: good fortune.'],
      [
        'Nine in the second place',
        'Bearing with the uncultured in gentleness, fording the river with resolution, not neglecting what is distant, not regarding one’s companions: thus one may manage to walk in the middle.',
        'Make room for the rough, keep the nerve to wade the river, do not forget those far off, form no private faction — and you keep to the middle way.',
      ],
      [
        'Nine in the third place',
        'No plain not followed by a slope. No going not followed by a return. He who remains persevering in danger is without blame. Do not complain about this truth; enjoy the good fortune you still possess.',
        'No ground stays level, nothing goes out without coming back. Hold to what is right in hardship and there is no fault. Do not fret over sincerity; the food on your table is a blessing of its own.',
      ],
      ['Six in the fourth place', 'He flutters down, not boasting of his wealth, together with his neighbour, guileless and sincere.', 'Coming down lightly to meet others; without wealth he is still close to his neighbours, and the trust needs no asking for.'],
      ['Six in the fifth place', 'The sovereign I gives his daughter in marriage. This brings blessing and supreme good fortune.', 'King Yi marries off his younger sister and blessing follows: great good fortune. The high can bend to meet the low.'],
      [
        'Six at the top',
        'The wall falls back into the moat. Use no army now. Make your commands known within your own town. Perseverance brings humiliation.',
        'The wall collapses back into its ditch: peace turns to standstill. Do not use troops; issue your orders at home only. Even holding to what is right brings regret.',
      ],
    ],
  },
  // 12 天地否
  {
    theme: 'Blocked, awaiting the turn',
    summary:
      'Heaven and earth each go their own way and never meet. A period in which you cannot get through to each other. Pushing hard only locks it tighter: hold your line, gather strength, let the situation loosen on its own.',
    judgment: [
      'Standstill. Evil people do not further the perseverance of the superior man. The great departs; the small approaches.',
      'Heaven and earth out of contact, high and low cut off — nobody wanted this. It is no time for the superior man to insist; the great goes and the small comes.',
    ],
    lines: [
      ['Six at the beginning', 'When ribbon grass is pulled up, the sod comes with it. Each according to his kind. Perseverance brings good fortune and success.', 'Pull up the grass and the roots come with it. Hold to what is right alongside your own kind: good fortune and success.'],
      ['Six in the second place', 'They bear and endure; this means good fortune for inferior people. The standstill serves to help the great man to attain success.', 'Carried along and falling in with those above: fortunate for small people. The superior man rests in the blockage and comes through in the end.'],
      ['Six in the third place', 'They bear shame.', 'Shame carried inside. The place is not his, and he knows it.'],
      ['Nine in the fourth place', 'He who acts at the command of the highest remains without blame. Those of like mind partake of the blessing.', 'Acting under a mandate: no fault, and those with him share in the good.'],
      [
        'Nine in the fifth place',
        'Standstill is giving way. Good fortune for the great man. “What if it should fail, what if it should fail?” In this way he ties it to a cluster of mulberry shoots.',
        'The blockage lets go: good fortune for the great man. Keep saying “it could still collapse” and you are as firmly tied as to a deep-rooted mulberry.',
      ],
      ['Nine at the top', 'The standstill comes to an end. First standstill, then good fortune.', 'The blockage is overturned: hardship first, gladness after.'],
    ],
  },
  // 13 天火同人
  {
    theme: 'Common cause',
    summary:
      'Heaven and fire both move upward. This is about finding people who are going your way. Shared purpose counts for more than matching conditions — and make the connection out in the open, not inside a small circle.',
    judgment: [
      'Fellowship with men in the open. Success. It furthers one to cross the great water. The perseverance of the superior man furthers.',
      'Fellowship out in the open country: success. It is favourable to cross the great river, and favourable for the superior man to hold to what is right. Keep your heart wide and gather fellow travellers.',
    ],
    lines: [
      ['Nine at the beginning', 'Fellowship with men at the gate. No blame.', 'Fellowship begun at your own gate, out in the open. No fault.'],
      ['Six in the second place', 'Fellowship with men in the clan. Humiliation.', 'Keeping only to your own kin: the circle is too small, and there is regret in it.'],
      [
        'Nine in the third place',
        'He hides weapons in the thicket; he climbs the high hill in front of it. For three years he does not rise up.',
        'Troops hidden in the brush, climbing the hill to spy out the ground, and in three years he never dares move. Hostility in the heart gets nothing done.',
      ],
      ['Nine in the fourth place', 'He climbs up on his wall; he cannot attack. Good fortune.', 'Up on the wall and yet not attacking. Knowing where to stop and turning back: good fortune.'],
      ['Nine in the fifth place', 'Men bound in fellowship first weep and lament, but afterward they laugh. After great struggles they succeed in meeting.', 'Fellowship that first weeps and then laughs; after the great battle they meet at last.'],
      ['Nine at the top', 'Fellowship with men in the meadow. No remorse.', 'Fellowship out at the edge of town. It does not reach far, but there is nothing to regret.'],
    ],
  },
  // 14 火天大有
  {
    theme: 'Plenty in hand',
    summary:
      'Fire high in the sky, lighting everything. Harvest and resources are abundant. The test in this hexagram is not the getting but whether you can hold it and keep from showing it off.',
    judgment: ['Supreme success.', 'Great success. The harvest is full and what you hold is much.'],
    lines: [
      ['Nine at the beginning', 'No relationship with what is harmful; there is no blame in this. If one remains conscious of difficulty, one remains without blame.', 'Keep clear of what harms and there is no fault to begin with; keep the hardship in mind and no fault follows.'],
      ['Nine in the second place', 'A big wagon for loading. One may undertake something. No blame.', 'A great wagon, well loaded; there is somewhere to go and no fault in going. The capacity to carry weight is there.'],
      ['Nine in the third place', 'A prince offers it to the Son of Heaven. A petty man cannot do this.', 'A lord presents tribute to the king; a small person could not do it.'],
      ['Nine in the fourth place', 'He makes a difference between himself and his neighbour. No blame.', 'He does not flaunt how much he has. No fault.'],
      ['Six in the fifth place', 'He whose truth is accessible, yet dignified, has good fortune.', 'Meeting people with sincerity and still carrying authority: good fortune.'],
      ['Nine at the top', 'He is blessed by heaven. Good fortune. Nothing that does not further.', 'Heaven itself protects him: good fortune, and nothing that does not help.'],
    ],
  },
  // 15 地山谦
  {
    theme: 'Modesty holds',
    summary:
      'A mountain hidden inside the earth: high, and not on display. Strength that is not paraded. The only hexagram of the sixty-four whose six lines are all good — modesty here is not retreat but the steadiest kind of advance.',
    judgment: ['Modesty creates success. The superior man carries things through.', 'Success; the superior man who keeps his modesty carries it through to a good end.'],
    lines: [
      ['Six at the beginning', 'A superior man modest about his modesty may cross the great water. Good fortune.', 'Modest and modest again: such a person can cross the great river. Good fortune.'],
      ['Six in the second place', 'Modesty that comes to expression. Perseverance brings good fortune.', 'Modesty known beyond your own walls. Hold to what is right: good fortune.'],
      ['Nine in the third place', 'A superior man of modesty and merit carries things to conclusion. Good fortune.', 'Real merit held modestly, carried through to the end. Good fortune.'],
      ['Six in the fourth place', 'Nothing that would not further. Modesty in movement.', 'Nothing that does not help. Let the modesty show in what you do.'],
      ['Six in the fifth place', 'No boasting of wealth before one’s neighbour. It is favourable to attack with force. Nothing that would not further.', 'Without wealth he still has his neighbours’ backing; moving against those who will not fall in is favourable, and nothing goes against him.'],
      ['Six at the top', 'Modesty that comes to expression. It is favourable to set armies marching to chastise one’s own city and country.', 'Modesty carrying far. The right use of force now is to put your own house in order.'],
    ],
  },
  // 16 雷地豫
  {
    theme: 'Going with the mood',
    summary:
      'Thunder comes out of the earth and everything stirs. People are willing, the mood is good, and large things can be started. But ease breeds slackness — do not let the real work slip while it is pleasant.',
    judgment: ['It furthers one to install helpers and to set armies marching.', 'Favourable for appointing helpers and for setting out. Hearts are willing; move with the current.'],
    lines: [
      ['Six at the beginning', 'Enthusiasm that expresses itself brings misfortune.', 'Carried away with yourself, making a show of the good time: misfortune.'],
      ['Six in the second place', 'Firm as a rock. Not a whole day. Perseverance brings good fortune.', 'As firm as stone, seeing before the day is out where to stop. Hold to what is right: good fortune.'],
      ['Six in the third place', 'Enthusiasm that looks upward creates remorse. Hesitation brings remorse.', 'Looking up and flattering your way into comfort brings regret; and waking up late brings regret too.'],
      ['Nine in the fourth place', 'The source of enthusiasm. He achieves great things. Doubt not. You gather friends around you as a hair clasp gathers the hair.', 'The good mood comes from him, and much is gained by it. Do not hesitate: friends gather as hair gathers in a clasp.'],
      ['Six in the fifth place', 'Persistently ill, and still does not die.', 'Ill for a long time, and still not finished.'],
      ['Six at the top', 'Deluded enthusiasm. But if after completion one changes, there is no blame.', 'Sunk in pleasure; but if you change once the thing is done, there is no fault.'],
    ],
  },
];
