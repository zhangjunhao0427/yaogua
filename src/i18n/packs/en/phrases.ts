// English UI strings. Keys are the Chinese originals.
// 爻题用 Wilhelm 一系的说法（Nine at the beginning），英语读者最认这一套。
import type { Phrases } from '../../types';

export const phrases: Phrases = {
  // 反思提问
  '读到的这句话里，哪个词最先触动你？它让你想到了问题里的哪个具体处境？':
    'Which word in this passage strikes you first? What situation in your question does it bring to mind?',
  '从「{base}」到「{changed}」，变化的方向是什么？你愿意往那边走吗？':
    'From {base} to {changed} — which way is this heading? Are you willing to go that way?',
  '「{base}」六爻不变，眼下的局面会持续一阵。在不变之中，你能先做好的一件事是什么？':
    'No line is changing in {base}; this situation will hold for a while. Within it, what is the one thing you can do well first?',
  '先把答案放一放。七天后回来看，你希望那时的自己做了什么？':
    'Set your answer aside. Coming back in seven days, what do you hope you will have done?',

  // 通用
  '共 {n} 卦': '{n} readings',
  '…': '…',
  '，': ', ',
  '。': '.',
  '、': ', ',
  '之': '→',
  ' 之 ': ' → ',
  '{from} 之 {to}': '{from} → {to}',
  '「{q}」': '“{q}”',
  '一二三四': '1234',
  '返回': 'Back',
  '回首页': 'Home',
  '关闭': 'Close',
  '跳过': 'Skip',
  '完成': 'Done',
  '管理': 'Edit',
  '删除': 'Delete',
  '确定？': 'Sure?',
  '删除这一卦': 'Delete this reading',
  '确定删除？': 'Delete for good?',
  '删除中…': 'Deleting…',

  // 备份
  '这个文件不是摇卦的备份，打不开。': 'This file is not a Yaogua backup — it cannot be opened.',
  '这个文件不是摇卦的备份。': 'This file is not a Yaogua backup.',
  '这份备份来自更新的版本，请先把应用更新到最新。':
    'This backup comes from a newer version. Please update the app first.',
  '正在打包…': 'Packing…',
  '摇卦备份': 'Yaogua backup',
  '{n} 条卦记': '{n} readings',
  '已导出，记得存到自己找得到的地方。': 'Exported. Keep it somewhere you will find it again.',
  '已下载 {name}': 'Downloaded {name}',
  '导出没成功，稍后再试。': 'The export did not go through. Try again later.',
  '正在读取…': 'Reading…',
  '这个文件读不了。': 'This file cannot be read.',
  '备份与恢复': 'Backup & restore',
  '本机现状': 'On this device',
  '统计中…': 'Counting…',
  '最近一卦：{date}': 'Latest reading: {date}',
  '卦记只存在这台设备上，不上传任何服务器。换手机、重装应用或清理存储，都会让它们消失——所以请定期导出一份留着。':
    'Your readings live on this device only and are never uploaded. Changing phones, reinstalling the app or clearing storage will wipe them — so export a copy from time to time.',
  '导出备份文件': 'Export a backup file',
  '从备份恢复': 'Restore from a backup',
  '恢复是怎么合并的': 'How restoring merges',
  '恢复不会覆盖本机已有的卦记：同一条卦记（按它的编号认）以本机的为准，备份里多出来的才会加进来。所以在新手机上恢复、或者补回误删的那几卦，都不会把你后来新摇的卦弄丢。':
    'Restoring never overwrites what is already here: where the same reading exists on both sides (matched by its id), the copy on this device wins, and only the extra ones are added. So restoring onto a new phone, or bringing back a few you deleted by mistake, will not cost you the readings you have cast since.',
  '备份文件是纯文本的 JSON，你可以自己打开看，里面就是你的问题、卦象和回访记录。':
    'The backup is plain JSON. You can open it yourself: your questions, the hexagrams and your follow-up notes.',
  '回卦记': 'Back to readings',
  '加入 {n} 条': '{n} added',
  '本机已有 {n} 条': '{n} already here',
  '{n} 条读不出来': '{n} unreadable',
  '{list}。': '{list}.',
  '备份': 'Backup',

  // 提醒
  '七日回访': 'Seven-day follow-up',
  '「{question}」这一卦，应验了吗？': 'Your reading on “{question}” — did it hold true?',

  // 免责与错误
  '卦是用来照见自己的，不替代医疗、法律或财务上的专业判断。身体不适请就医。':
    'A reading is a mirror, not medical, legal or financial advice. If something is wrong with your body, see a doctor.',
  '起卦说明': 'How it works',
  '这一页没能显示出来': 'This page could not be shown',
  '是程序出了岔子，不是你的卦记丢了。': 'Something went wrong in the app — your readings are not lost.',
  '所有卦记都还在这台设备上，回首页就能继续。': 'They are all still on this device. Go home and carry on.',
  '出错详情': 'Error details',

  // 卦记
  '待回访': 'Follow-up due',
  '铜钱': 'Coins',
  '梅花': 'Plum Blossom',
  '卦记': 'Readings',
  '还没有卦记。': 'No readings yet.',
  '起一卦': 'Cast one',
  '共 {n} 卦，只保存在这台设备上。': '{n} readings, kept on this device only.',
  '删掉的卦记找不回来，连同它的七日回访提醒一起撤销。':
    'A deleted reading cannot be recovered, and its seven-day reminder is cancelled with it.',

  // 农历
  '{stem}{branch}年{leap}{monthName}月{dayName} {hourName}时':
    'Lunar year {stem}-{branch} · month {leap}{month}, day {day} · hour of {hourName}',
  '闰': 'leap ',

  // 铜钱与爻
  '老阴': 'Old yin',
  '阴': 'Yin',
  '变 ×': 'changing ×',
  '少阳': 'Young yang',
  '阳': 'Yang',
  '不变': 'stable',
  '少阴': 'Young yin',
  '老阳': 'Old yang',
  '变 ○': 'changing ○',
  '（变）': ' (changing)',

  // 起卦说明
  '无': 'none',
  '本卦卦辞': 'The Judgement of the primary hexagram',
  '一爻': 'one',
  '本卦这一变爻的爻辞': 'The line statement of that changing line',
  '二爻': 'two',
  '本卦两变爻的爻辞，以上面一爻为主': 'Both line statements; the upper line leads',
  '三爻': 'three',
  '本卦与之卦的卦辞并看，以本卦为主': 'Both Judgements; the primary hexagram leads',
  '四爻': 'four',
  '之卦两个不变爻的爻辞，以下面一爻为主':
    'The two unchanging lines of the resulting hexagram; the lower line leads',
  '五爻': 'five',
  '之卦唯一不变爻的爻辞': 'The one unchanging line of the resulting hexagram',
  '六爻': 'six',
  '乾卦读「用九」，坤卦读「用六」，其余读之卦卦辞':
    'Qian reads “Using Nine”, Kun reads “Using Six”; otherwise the Judgement of the resulting hexagram',
  '铜钱法': 'The coin method',
  '背面计 3，字面计 2': 'the blank side counts 3, the inscribed side counts 2',
  '和': 'Sum',
  '名称': 'Name',
  '阴阳': 'Yin/yang',
  '变否': 'Changes',
  '概率': 'Odds',
  '掷六次成一卦。第一次为初爻，在最下；第六次为上爻，在最上。卦自下而上生长。':
    'Six throws make a hexagram. The first is the bottom line, the sixth the top. A hexagram grows upward.',
  '五个角度': 'Five perspectives',
  '同一次摇卦，可以从几个角度去看同一件事：': 'One casting lets you look at the same matter from several sides:',
  '卦': 'Hexagram',
  '代表什么': 'What it stands for',
  '解读页只以本卦和之卦断吉凶，互卦、错卦、综卦是补充的视角，不改变判定。':
    'The reading judges by the primary and resulting hexagrams only. The nuclear, opposite and inverted hexagrams are extra angles; they do not change the verdict.',
  '该读哪一句': 'Which passage to read',
  '依朱熹《易学启蒙》的变占之法，按变爻个数决定：':
    'By Zhu Xi’s rules in the Introduction to the Study of the Yi, the number of changing lines decides:',
  '变爻': 'Changing lines',
  '读什么': 'What to read',
  '梅花易数': 'Plum Blossom',
  '只有一个动爻': 'only one moving line',
  '算什么': 'What',
  '怎么算': 'How',
  '上卦': 'Upper trigram',
  '（农历年支数 + 月 + 日）÷ 8 取余，余 0 作 8':
    '(lunar branch number + month + day) mod 8; a remainder of 0 counts as 8',
  '下卦': 'Lower trigram',
  '上面的和再加时辰数，÷ 8 取余': 'that same sum plus the double-hour number, mod 8',
  '动爻': 'Moving line',
  '同一个和 ÷ 6 取余，余 0 作 6': 'the same sum mod 6; a remainder of 0 counts as 6',
  '卦数用先天八卦：乾一、兑二、离三、震四、巽五、坎六、艮七、坤八。年支数子一、丑二，依次到亥十二；时辰同理，二十三点到一点为子时。':
    'Trigram numbers follow the Earlier Heaven order: Qian 1, Dui 2, Li 3, Zhen 4, Xun 5, Kan 6, Gen 7, Kun 8. Year branches run Zi 1, Chou 2, through Hai 12; double-hours likewise, with 23:00–01:00 as the hour of Zi.',
  '体与用': 'Host and guest',
  '本卦': 'Primary',
  '互卦': 'Nuclear',
  '变卦': 'Resulting',
  '时间起卦没有随机': 'casting by time involves no randomness',
  '农历的换算用的是系统自带的中国历数据，闰月按本月数计算。':
    'Lunar dates come from the system’s Chinese calendar data; a leap month counts as that month’s number.',
  '为什么卦不可重': 'Why a question is asked once',
  '《蒙》卦卦辞说：': 'The Judgement of hexagram 4, Youthful Folly, says:',
  '初筮告，再三渎，渎则不告。':
    'The first oracle answers. Ask twice, three times, and it is pestering; pestered, it does not answer.',
  '第一次问，才会得到回答；反复追问，是亵渎。能无限重摇的卦，结果就不值得认真对待。所以摇铜钱时每掷出一爻就立刻记下，刷新页面、退出重进，都无法重来。':
    'The first asking is the one that answers; asking over and over is irreverence. A reading you can re-roll forever is not worth taking seriously. So each line is written down the moment it falls: reloading the page or leaving the app will not give you another throw.',
  '随机从哪里来': 'Where the randomness comes from',
  '每一枚铜钱的正反，都由系统的密码学随机数（crypto.getRandomValues）决定，并剔除了取模带来的偏差，不使用普通的伪随机函数。长按蓄力的时长只影响动画，不影响结果。':
    'Every coin is decided by the system’s cryptographic randomness (crypto.getRandomValues), with modulo bias rejected; no ordinary pseudo-random function is used. How long you hold the coins only affects the animation, never the result.',
  '经文': 'The text',
  '卦辞、爻辞据《周易》通行本，属公有领域，并与维基文库逐条校对。白话解释为本应用原创，只帮你读懂字面，不替你下结论。':
    'The Judgements and line statements follow the received text of the Zhouyi, which is in the public domain, checked line by line against Wikisource. The plain-language readings are written for this app; they help you read the words, not decide for you.',
  '免责声明': 'Disclaimer',
  '这里给出的是《周易》的经文和预先写好的白话解释，':
    'What you get here is the text of the Zhouyi and plain-language notes written in advance — ',
  '仅供参考与自省': 'for reflection only',
  '，不是针对你具体处境的专业判断，也不构成医疗、法律、财务、投资或心理方面的建议。':
    '. It is not a professional assessment of your situation and is not medical, legal, financial, investment or psychological advice.',
  '身体不适请及时就医，法律与财务上的决定请咨询有资质的人。不要依据卦象做出危及自身或他人安全、健康、财产的决定。应用不预测未来，也不保证任何结果。':
    'If you are unwell, see a doctor. For legal and financial decisions, consult someone qualified. Do not use a hexagram to decide anything that puts your own or another person’s safety, health or property at risk. This app does not predict the future and guarantees no outcome.',
  '隐私': 'Privacy',
  '不需要注册，不问出生时间，也不收集任何个人信息。你的问题和卦记只保存在这台设备上，不上传任何服务器——所以也请定期在「卦记 → 备份」里导出一份留着。':
    'No account, no birth time, no personal data collected. Your questions and readings stay on this device and are never uploaded — which is why you should export a copy now and then under Readings → Backup.',
  '完整的隐私政策': 'Full privacy policy',
  '。有问题或发现错字，欢迎来信': '. Questions, or found a typo? Write to',

  // 立问
  '先选一个方向，解读会按它来写': 'Pick a direction first — the reading is written for it',
  '先写下你想问的事': 'Write down what you want to ask',
  '立问': 'Your question',
  '你想问什么？': 'What do you want to ask?',
  '问「我该如何」，而不是「会不会」。卦更擅长回答怎么做，而不是替你预言结果。':
    'Ask “how should I”, not “will it”. A hexagram is better at how to act than at foretelling what happens.',
  '这件事属于哪一类？': 'What kind of matter is this?',
  '必选，解读会按它来写': 'required — the reading follows it',
  '问题分类': 'Question category',
  '问题': 'Question',
  '这像一道是非题。试着改成「我该如何……」，读卦时会更有收获。':
    'That reads like a yes/no question. Try “how should I…” — you will get more out of the reading.',
  '确认问题': 'Confirm the question',
  '解读按你选的方向来写。这句话只存给你自己看，七日回访时用来对照。':
    'The reading follows the direction you picked. Your question is saved for you alone, to compare against at the seven-day follow-up.',
  '确认后问题锁定，这一卦不能再改。': 'Once confirmed, the question is locked for this reading.',

  // 静心与摇卦
  '吸气': 'Breathe in',
  '呼气': 'Breathe out',
  '放下手边的事，把心思放回这个问题上。': 'Put down what you were doing and bring your mind back to the question.',
  '摇卦': 'Yaogua',
  '已得 {n} 爻': '{n} lines cast',
  '六爻已成': 'All six lines are cast',
  '掷铜钱，第 {n} 爻': 'Throw the coins — line {n}',
  '长按铜钱蓄力，松手掷出；轻点也可以。': 'Hold the coins to gather, let go to throw. A tap works too.',
  '也可以摇动手机。': 'You can also shake the phone.',
  '摇一摇未获授权，点此重试': 'Shake was not permitted — tap to try again',
  '开启摇一摇': 'Enable shake',
  '卦不可重：每掷一爻即刻记下，无法重摇。':
    'One question, one casting: each line is written down as it falls and cannot be thrown again.',
  '成卦中…': 'Forming the hexagram…',
  '看解读': 'Read it',
  '字': 'inscribed',
  '背': 'blank',

  // 首页
  '三枚铜钱，六次掷出。': 'Three coins, six throws.',
  '卦不可重。': 'Asked once.',
  '继续摇卦 · 已得 {n} 爻': 'Continue · {n} lines cast',
  '摇铜钱起卦': 'Cast with coins',
  '铜钱法六爻可变，梅花按时间或数起卦、只动一爻。':
    'The coin method may change any of the six lines; Plum Blossom casts from the time or from numbers and moves one line only.',
  '{n} 卦已满七日，回来看看应验了没有': '{n} readings have reached seven days — see whether they held true',
  '最近卦记': 'Recent readings',
  '全部卦记': 'All readings',

  // 梅花起卦
  '两个数都要填，取 1 到 99999 之间的整数': 'Both numbers are needed — whole numbers from 1 to 99999',
  '梅花易数不摇铜钱，按时间或你心里想到的数起卦，只有一个动爻，断的是体用生克。':
    'Plum Blossom uses no coins. It casts from the time, or from numbers you have in mind, moves a single line, and judges by how host and guest generate or overcome each other.',
  '怎么起卦？': 'How to cast?',
  '起卦方式': 'Casting method',
  '按此刻的时间': 'From the time now',
  '我报两个数': 'I will give two numbers',
  '此刻是': 'It is now',
  '。年月日定上卦，加上时辰定下卦与动爻。':
    '. Year, month and day give the upper trigram; adding the double-hour gives the lower trigram and the moving line.',
  '同一个时辰之内起卦，得到的是同一卦——时间起卦本来就没有随机。':
    'Cast twice within the same double-hour and you get the same hexagram — casting by time is not random by design.',
  '第一个数': 'First number',
  '第一个数，定上卦': 'First number, for the upper trigram',
  '第二个数': 'Second number',
  '第二个数，定下卦': 'Second number, for the lower trigram',
  '第一个数除以八定上卦，第二个数除以八定下卦，两数之和除以六定动爻。心里先想好再填。':
    'The first number mod 8 gives the upper trigram, the second mod 8 the lower, and their sum mod 6 the moving line. Settle on them in your mind before typing.',
  '起卦': 'Cast',
  '解读按你选的方向来写。这句话只存给你自己看。':
    'The reading follows the direction you picked. Your question is saved for you alone.',

  // 梅花解读
  '找不到这一卦。': 'This reading cannot be found.',
  '时间起卦': 'cast from time',
  '数字起卦': 'cast from numbers',
  '取数 {a} 与 {b}': 'Numbers {a} and {b}',
  '上卦 {un} {upper}、下卦 {ln} {lower}，动爻 {moving}':
    'Upper {un} {upper}, lower {ln} {lower}, moving line {moving}',
  '体用生克': 'Host and guest',
  '体 {body}（{bodyElement}）· 用 {use}（{useElement}）':
    'Host {body} ({bodyElement}) · Guest {use} ({useElement})',
  '动爻在上卦，所以{use}为用、{body}为体。':
    'The moving line is in the upper trigram, so {use} is the guest and {body} the host.',
  '动爻在下卦，所以{use}为用、{body}为体。':
    'The moving line is in the lower trigram, so {use} is the guest and {body} the host.',
  '体是你自己，用是所问的那件事。': 'The host is you; the guest is the matter you asked about.',
  '三卦': 'Three hexagrams',
  '两卦之象': 'The two trigrams',
  '体：你自己': 'Host: you',
  '用：所问之事': 'Guest: the matter',
  '动爻爻辞': 'The moving line',
  '梅花以体用为主、爻辞为辅。两者不一致时，先看体用。':
    'Plum Blossom judges by host and guest first and the line statement second. Where they disagree, trust host and guest.',
  '{name}为{image}': '{name} — {image}',
  '人': 'People',
  '身': 'Body',
  '物': 'Things',

  // 回访
  '回访 · {date}': 'Follow-up · {date}',
  '回访': 'Follow-up',
  '{date}起回来记下：这一卦应验了吗？': 'From {date}, come back and note whether this reading held true.',
  '七日已过': 'Seven days have passed',
  '这一卦，应验了吗？': 'Did this reading hold true?',
  '应验情况': 'Outcome',
  '后来发生了什么？（可不填）': 'What happened since? (optional)',
  '回访记录': 'Follow-up note',
  '记下': 'Save',
  '应验': 'Held true',
  '部分应验': 'Partly',
  '未应验': 'Did not',

  // 解读
  '解读': 'Reading',
  '变爻：{list}　○ 老阳　× 老阴': 'Changing: {list}　○ old yang　× old yin',
  '六爻皆不变，没有之卦': 'No line changes, so there is no resulting hexagram',
  '依朱熹《易学启蒙》变占之法，按变爻个数决定读哪几句。':
    'Which passages to read is decided by the number of changing lines, following Zhu Xi.',
  '为主': 'leads',
  '卦不替你决定，只提供一个重新看这件事的角度。':
    'A hexagram does not decide for you; it offers another way of seeing the matter.',
  '下一层：{layer}': 'Next: {layer}',
  '　这一卦与本卦相同。': ' This one is the same as the primary hexagram.',
  '　这一卦与错卦相同：阴阳全翻与上下颠倒，在这一卦上得到的是同一个结果，八个卦有此性质。':
    ' This one is the same as the opposite hexagram: inverting and reversing give the same result here, as they do for eight of the hexagrams.',
  '互卦 · 错卦 · 综卦：再换三个角度看': 'Nuclear · opposite · inverted: three more angles',
  '字词释义': 'Terms',
  '卦象': 'The hexagram',
  '变占': 'The rule',
  '反思': 'Reflection',
  '本卦的卦辞与爻辞不是全读，先按变爻个数定下该读哪几句。':
    'Not every line is read. The number of changing lines decides which passages apply.',
  '接着给出该读的经文原文与白话。': 'Then comes the text itself, with a plain-language note.',
  '最后是几个把这一卦落到你那件事上的问题。': 'Last, a few questions that bring the hexagram back to your matter.',

  // 分享
  '卡片生成失败，稍后再试': 'The card could not be made. Try again later.',
  '生成中…': 'Making…',
  '生成分享卡片': 'Make a share card',
  '分享卡片': 'Share card',
  '分享卡片预览': 'Share card preview',
  '长按图片可保存': 'Press and hold the image to save it',
  '下载图片': 'Download image',
  '铜钱法起卦 · 卦不可重': 'Cast with coins · asked once',

  // 分类
  '事业': 'Work',
  '例如：面对新的工作机会，我该如何抉择？': 'e.g. A new job has come up — how should I choose?',
  '这件事里，哪一部分是你真正能掌控的？把经文提示的姿态放到那一部分，会是什么样子？':
    'Which part of this is actually yours to control? What would the attitude in the text look like applied to that part?',
  '关系': 'Relationships',
  '例如：和他闹僵了，我该如何相处？': 'e.g. Things have soured between us — how should I handle it?',
  '对方此刻可能处在什么位置？经文里的姿态，说的是你，还是这段关系本身？':
    'Where might the other person be standing right now? Is the text describing you, or the relationship itself?',
  '抉择': 'Decisions',
  '例如：两个都舍不得，我该如何取舍？': 'e.g. I cannot give up either one — how should I choose?',
  '把两个选项都按这句话去做一遍，哪一个做起来更自然？':
    'Run both options through this passage. Which one sits more naturally with it?',
  '近况': 'How things are',
  '例如：最近心里很乱，我该如何调整？': 'e.g. My head has been a mess — how should I settle it?',
  '这段时间，你最想「止」住的是什么？最想再「进」一步的又是什么？':
    'What do you most want to stop right now? And what do you most want to push one step further?',
  '健康': 'Health',
  '例如：这个毛病反复发作，我该如何对待？': 'e.g. This keeps flaring up — how should I deal with it?',
  '身体给过你哪些信号？经文说的那个姿态，落到作息和就医上会是什么？':
    'What signals has your body been giving? What would the text’s attitude mean for your routine and for seeing a doctor?',
  '卦能帮你理清态度，不能替代诊断。身体上的具体症状，请先去看医生。':
    'A reading can help you sort out your attitude; it is no substitute for a diagnosis. For actual symptoms, see a doctor first.',
  '钱财': 'Money',
  '例如：这笔钱要不要投，我该如何判断？': 'e.g. Should this money go in — how do I judge it?',
  '最坏的情况你能不能承受？经文提示的是进、是守，还是先退？':
    'Could you carry the worst case? Does the text point to advancing, holding, or stepping back first?',
  '卦不预测涨跌，也不是投资建议。真要下注，先算清楚最坏的情况你能不能承受。':
    'A hexagram does not predict markets and is not investment advice. Before you commit, work out whether you could carry the worst case.',
  '学业': 'Study',
  '例如：这门课怎么都学不进去，我该如何调整？': 'e.g. This subject will not go in — how should I change tack?',
  '是方法的问题，还是状态的问题？经文指向的是加力，还是换路？':
    'Is it the method or your state? Does the text point to pushing harder, or to another route?',
  '家庭': 'Family',
  '例如：父母的事我该如何处理？': 'e.g. How should I handle this with my parents?',
  '在这个家里你担着什么角色？经文说的进退，放到这个角色上合适吗？':
    'What role do you carry in this family? Does the advance or retreat in the text suit that role?',
  '其他': 'Other',
  '例如：这件事我该如何面对？': 'e.g. How should I face this?',
  '这件事最像上面哪一类？经文的姿态搬过去，还站得住吗？':
    'Which of the categories above is this closest to? Does the text’s attitude still hold when you move it over?',

  // 五个角度
  '当下处境': 'where you stand now',
  '六次摇卦直接得到的卦，是你此刻实际所处的局面，也是这一卦的起点。':
    'The hexagram the six throws gave you. It is the situation you are actually in, and the starting point of the reading.',
  '之卦': 'Resulting',
  '事情的走向': 'where it is heading',
  '把变爻的阴阳翻转得到的卦，顺着眼下这样走下去会变成的样子。没有变爻就没有之卦，说明局面一时不会动。':
    'Flip the changing lines and you get this hexagram: what the situation turns into if it keeps going this way. With no changing lines there is no resulting hexagram — the situation will not move for now.',
  '中间过程': 'what happens in between',
  '取本卦的二、三、四爻作下卦，三、四、五爻作上卦。它藏在本卦里，代表从现在走到结果之间真正起作用的那一段，也常指外面看不见的内情。':
    'Lines two to four form its lower trigram, lines three to five its upper. Hidden inside the primary hexagram, it is the stretch that really does the work between now and the outcome — often the part outsiders cannot see.',
  '错卦': 'Opposite',
  '事情的反面': 'the other side of it',
  '六爻阴阳全部相反的卦。它是你没看到的那一面，也可以看作立场与你相对的一方所处的位置。':
    'Every line flipped. It is the side you are not seeing, and it can also stand for where someone on the opposite side of this stands.',
  '综卦': 'Inverted',
  '换位来看': 'seen from their side',
  '把整个卦上下颠倒过来，是同一件事在对方眼里的样子。乾、坤、坎、离、颐、大过、中孚、小过这八个卦颠倒后还是自己，遇到它们，双方看到的是同一幅局面。':
    'Turn the whole hexagram upside down: the same matter as the other party sees it. Eight hexagrams — Qian, Kun, Kan, Li, Yi, Da Guo, Zhong Fu and Xiao Guo — come back as themselves; when you meet one, both sides are looking at the same picture.',

  // 体用生克
  '用生体': 'Guest feeds host',
  '大吉': 'very favourable',
  '外面的力量在滋养你：有人帮、有资源进来，事情顺着你走。该接的就接住，不必客气。':
    'Forces outside you are feeding you: help arrives, resources come in, things run your way. Take what is offered; no need to be shy about it.',
  '体用比和': 'Host and guest alike',
  '吉': 'favourable',
  '你和这件事同气相求，彼此合得来。阻力小，照着本来的打算推进就是。':
    'You and this matter are of one kind and get along. Little resistance — carry on with the plan you already had.',
  '体克用': 'Host overcomes guest',
  '小吉': 'mildly favourable',
  '局面在你手里，你压得住它。能成，但要费些力气，而且赢得不轻松。':
    'The situation is in your hands and you can hold it down. It can be done, but it will take effort and the win will not come easy.',
  '体生用': 'Host feeds guest',
  '耗': 'draining',
  '你在往外付出：出钱、出力、出心神。事情未必坏，但消耗的是你自己，量力而行。':
    'You are the one giving out — money, effort, attention. The matter is not necessarily bad, but what it spends is you. Pace yourself.',
  '用克体': 'Guest overcomes host',
  '凶': 'unfavourable',
  '外力压过你：对方强、时势不利、身体吃不消。这一卦不主张硬进，退守或求援为上。':
    'Outside forces are stronger than you: the other side is strong, the timing is against you, or your body cannot take it. This reading does not favour forcing ahead — hold back or ask for help.',
  '事情的起头与当下': 'how it began and where it stands',
  '现在的局面，以及体用生克定下的基本吉凶。':
    'The present situation, and the basic verdict set by host and guest.',
  '中间的过程': 'the middle of it',
  '事情进行当中会遇到的情形，也常指当事人看不见的内情。':
    'What comes up while the matter runs its course — often what the people in it cannot see.',
  '最后的结果': 'how it ends up',
  '动爻一变，事情落到的结局。与本卦合看，才知道是往好里走还是往坏里走。':
    'Where the matter lands once the moving line changes. Read it against the primary hexagram to see whether things improve or worsen.',

  // 五行
  '金': 'Metal',
  '火': 'Fire',
  '木': 'Wood',
  '水': 'Water',
  '土': 'Earth',

  // 字词释义
  '大为亨通': 'greatly successful',
  '通达顺畅': 'passing through without obstruction',
  '利于守持正道': 'it is favourable to hold to what is right',
  '守持正道；也有占问之义': 'holding to what is right; also “to divine”',
  '诚信': 'sincerity, being trusted',
  '吉祥，结果顺遂': 'auspicious; the outcome goes well',
  '凶险，结果不利': 'inauspicious; the outcome goes badly',
  '悔恨消失': 'the regret disappears',
  '懊悔，做了之后会后悔': 'regret; you will be sorry afterwards',
  '憾惜，有小困难、小遗憾': 'a small difficulty or a small regret',
  '危险，须警惕': 'danger; stay alert',
  '没有过失，不会招致责难': 'no blame; nothing will be held against you',
  '适合渡过大河，喻可以冒险做大事': 'favourable to cross the great river — worth risking something large',
  '适合去见德高位尊、能给予帮助的人': 'favourable to see someone of standing who can help you',
  '有所前往，指采取行动': 'somewhere to go — that is, to act',
  '前进、出行，也指征伐': 'to advance or set out; also to march on a campaign',

  // 爻题
  '初九': 'Nine at the beginning',
  '初六': 'Six at the beginning',
  '九二': 'Nine in the second place',
  '六二': 'Six in the second place',
  '九三': 'Nine in the third place',
  '六三': 'Six in the third place',
  '九四': 'Nine in the fourth place',
  '六四': 'Six in the fourth place',
  '九五': 'Nine in the fifth place',
  '六五': 'Six in the fifth place',
  '上九': 'Nine at the top',
  '上六': 'Six at the top',
};
