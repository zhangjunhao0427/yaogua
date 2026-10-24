// 本文件由 scripts/generate-widget-data.mjs 生成，请勿手改。
// 来源：src/data/zhouyi（经文据《周易》通行本，白话为本项目原创）

import Foundation

struct Passage {
    let name: String
    let theme: String
    /// 六爻阴阳，初爻在前，1 为阳
    let bits: String
    let original: String
    let plain: String
}

enum Scripture {
    static let judgments: [Passage] = [
    Passage(name: "乾", theme: "刚健自强", bits: "111111", original: "元亨，利贞。", plain: "开创而亨通，利于守持正道。刚健不息，事情有大好的开端。"),
    Passage(name: "坤", theme: "柔顺承载", bits: "000000", original: "元亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。", plain: "大为亨通，像母马那样柔顺而持久地守正就有利。君子有所前往，抢先会迷失，跟随在后能得到依靠。往西南能得到朋友，往东北会失去朋友。安于守正则吉。"),
    Passage(name: "屯", theme: "初生艰难", bits: "100010", original: "元亨，利贞。勿用有攸往，利建侯。", plain: "万物初生，大为亨通，利于守正。不要急着前往，宜先建立根基、寻找助力。"),
    Passage(name: "蒙", theme: "启蒙求教", bits: "010001", original: "亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。", plain: "亨通。不是我去求蒙昧的孩子，而是孩子来求教于我。初次问卜就告诉他，一再重复是亵渎，亵渎就不再回答。利于守正。"),
    Passage(name: "需", theme: "守时等待", bits: "111010", original: "有孚，光亨，贞吉。利涉大川。", plain: "心怀诚信，光明亨通，守正则吉，利于渡过大河。险在前方，要耐心等待时机。"),
    Passage(name: "讼", theme: "争讼慎止", bits: "010111", original: "有孚，窒惕，中吉，终凶。利见大人，不利涉大川。", plain: "虽有诚信却受阻，心中警惕，适可而止则吉，争到底则凶。宜找公正的人裁断，不宜冒大险。"),
    Passage(name: "师", theme: "统众用律", bits: "010000", original: "贞，丈人吉，无咎。", plain: "用兵须守正，由德高望重的长者统领则吉，没有过失。"),
    Passage(name: "比", theme: "亲比相辅", bits: "000010", original: "吉。原筮，元永贞，无咎。不宁方来，后夫凶。", plain: "吉。再三审度，有长久守正的德行，没有过失。不安的人纷纷来归，迟迟不来的人会有凶险。"),
    Passage(name: "小畜", theme: "蓄养待时", bits: "111011", original: "亨。密云不雨，自我西郊。", plain: "亨通。浓云密布却不下雨，云从西郊升起。积蓄还不够，时机尚未成熟。"),
    Passage(name: "履", theme: "如履虎尾", bits: "110111", original: "履虎尾，不咥人，亨。", plain: "跟在老虎尾巴后面走，老虎却不咬人，亨通。谨慎守礼，可以化险为夷。"),
    Passage(name: "泰", theme: "通泰和顺", bits: "111000", original: "小往大来，吉亨。", plain: "小的离去，大的到来，吉而亨通。天地交感，上下相通。"),
    Passage(name: "否", theme: "闭塞待转", bits: "000111", original: "否之匪人，不利君子贞，大往小来。", plain: "天地不交、上下不通，并非人所愿。此时不利于君子坚持己见，大的失去，小的到来。"),
    Passage(name: "同人", theme: "与人和同", bits: "101111", original: "同人于野，亨。利涉大川，利君子贞。", plain: "在旷野中与人和同，亨通。利于渡过大河，利于君子守正。心胸开阔，广结同道。"),
    Passage(name: "大有", theme: "丰盛大有", bits: "111101", original: "元亨。", plain: "大为亨通。收获丰盛，拥有众多。"),
    Passage(name: "谦", theme: "谦而有终", bits: "001000", original: "亨，君子有终。", plain: "亨通，君子能保持谦逊，终有好结果。"),
    Passage(name: "豫", theme: "顺时和乐", bits: "000100", original: "利建侯行师。", plain: "利于建立诸侯、出兵行动。人心和乐，顺势而动。"),
    Passage(name: "随", theme: "随时变通", bits: "100110", original: "元亨利贞，无咎。", plain: "大为亨通，利于守正，没有过失。顺应时势，择善而从。"),
    Passage(name: "蛊", theme: "整治积弊", bits: "011001", original: "元亨，利涉大川。先甲三日，后甲三日。", plain: "大为亨通，利于渡过大河。在甲日前三天谋划，甲日后三天检视，慎始慎终。"),
    Passage(name: "临", theme: "亲临督导", bits: "110000", original: "元亨利贞。至于八月有凶。", plain: "大为亨通，利于守正。到了八月会有凶险，盛时要想到衰时。"),
    Passage(name: "观", theme: "观察省视", bits: "000011", original: "盥而不荐，有孚颙若。", plain: "祭祀时洗手之后尚未献祭，那份诚敬庄严，令人仰望。"),
    Passage(name: "噬嗑", theme: "咬合除阻", bits: "100101", original: "亨。利用狱。", plain: "亨通。利于运用刑狱。有东西梗在中间，咬断它才能合拢。"),
    Passage(name: "贲", theme: "文饰有度", bits: "101001", original: "亨。小利有攸往。", plain: "亨通。稍有利于有所前往。修饰可以增色，但不可喧宾夺主。"),
    Passage(name: "剥", theme: "剥落顺止", bits: "000001", original: "不利有攸往。", plain: "不利于有所前往。阴盛阳衰，宜顺势而止。"),
    Passage(name: "复", theme: "一阳来复", bits: "100000", original: "亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。", plain: "亨通。出入都没有疾患，朋友来也无过失。沿着规律往复，七天后回归，利于有所前往。"),
    Passage(name: "无妄", theme: "不妄而诚", bits: "100111", original: "元亨利贞。其匪正有眚，不利有攸往。", plain: "大为亨通，利于守正。若不守正就会有灾祸，不宜有所前往。"),
    Passage(name: "大畜", theme: "大蓄厚积", bits: "111001", original: "利贞。不家食吉，利涉大川。", plain: "利于守正。不在家里吃闲饭，出外做事吉，利于渡过大河。"),
    Passage(name: "颐", theme: "颐养正道", bits: "100001", original: "贞吉。观颐，自求口实。", plain: "守正则吉。观察人如何颐养，看他自己求取什么来养活自己。"),
    Passage(name: "大过", theme: "大过非常", bits: "011110", original: "栋桡，利有攸往，亨。", plain: "栋梁被压弯，利于有所前往，亨通。非常时期须有非常作为。"),
    Passage(name: "坎", theme: "重险习坎", bits: "010010", original: "习坎，有孚，维心亨，行有尚。", plain: "重重险阻之中，心怀诚信，内心亨通，行动会受到崇尚。"),
    Passage(name: "离", theme: "附丽光明", bits: "101101", original: "利贞，亨。畜牝牛，吉。", plain: "利于守正，亨通。畜养母牛般柔顺的品性，吉。"),
    Passage(name: "咸", theme: "感应相通", bits: "001110", original: "亨，利贞，取女吉。", plain: "亨通，利于守正，娶妻吉。以真诚感应彼此。"),
    Passage(name: "恒", theme: "恒久守常", bits: "011100", original: "亨，无咎，利贞，利有攸往。", plain: "亨通，没有过失，利于守正，利于有所前往。"),
    Passage(name: "遁", theme: "适时退避", bits: "001111", original: "亨，小利贞。", plain: "亨通，小事利于守正。时势不利，退避才能保全。"),
    Passage(name: "大壮", theme: "壮而守正", bits: "111100", original: "利贞。", plain: "利于守正。力量强盛之时，更要守正而行。"),
    Passage(name: "晋", theme: "晋升光明", bits: "000101", original: "康侯用锡马蕃庶，昼日三接。", plain: "康侯受赐众多车马，一天之内三次被接见。上进得宠，如日出地上。"),
    Passage(name: "明夷", theme: "晦而守明", bits: "101000", original: "利艰贞。", plain: "在艰难中守正有利。光明受损的时候，要韬光养晦。"),
    Passage(name: "家人", theme: "齐家有道", bits: "101011", original: "利女贞。", plain: "利于家中主内的人守正。家道正，则万事正。"),
    Passage(name: "睽", theme: "异中求同", bits: "110101", original: "小事吉。", plain: "小事吉。彼此乖离之时，不宜图谋大事。"),
    Passage(name: "蹇", theme: "知难而止", bits: "001010", original: "利西南，不利东北。利见大人，贞吉。", plain: "往西南有利，往东北不利。宜见德高者，守正则吉。"),
    Passage(name: "解", theme: "解难舒缓", bits: "010100", original: "利西南。无所往，其来复吉。有攸往，夙吉。", plain: "往西南有利。没有要去的地方，就回来恢复常态则吉；有要去的地方，趁早则吉。"),
    Passage(name: "损", theme: "减损有益", bits: "110001", original: "有孚，元吉，无咎，可贞，利有攸往。曷之用？二簋可用享。", plain: "心怀诚信，大吉，没有过失，可以守正，利于有所前往。用什么来祭祀？两簋简单的食物就可以。"),
    Passage(name: "益", theme: "增益进取", bits: "100011", original: "利有攸往，利涉大川。", plain: "利于有所前往，利于渡过大河。"),
    Passage(name: "夬", theme: "果决去邪", bits: "111110", original: "扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往。", plain: "在朝堂上公开宣布小人的罪状，诚心呼号，仍有危险。先告诫自己的封邑，不宜动武，利于有所前往。"),
    Passage(name: "姤", theme: "不期而遇", bits: "011111", original: "女壮，勿用取女。", plain: "来者势头过强，不宜娶为妻。一阴初生而渐盛，遇合要谨慎。"),
    Passage(name: "萃", theme: "聚众同心", bits: "000110", original: "亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。", plain: "亨通。君王来到宗庙祭祀，宜见德高者，亨通，利于守正。用大牲畜祭祀则吉，利于有所前往。"),
    Passage(name: "升", theme: "积小上升", bits: "011000", original: "元亨，用见大人，勿恤，南征吉。", plain: "大为亨通，宜见德高者，不必忧虑，向南前进吉。"),
    Passage(name: "困", theme: "困而守志", bits: "010110", original: "亨，贞，大人吉，无咎。有言不信。", plain: "亨通，守正，德高者吉，没有过失。此时说话别人不信。"),
    Passage(name: "井", theme: "养人不穷", bits: "011010", original: "改邑不改井，无丧无得，往来井井。汔至，亦未繘井，羸其瓶，凶。", plain: "城邑可以迁移，井却搬不走。井水不减也不增，来来往往的人都从中取水。快到井口时，汲水的绳子没拉出，打破了水瓶，凶。"),
    Passage(name: "革", theme: "顺时变革", bits: "101110", original: "巳日乃孚，元亨利贞，悔亡。", plain: "到了时机成熟之日才能取信于人，大为亨通，利于守正，悔恨消失。"),
    Passage(name: "鼎", theme: "鼎新立业", bits: "011101", original: "元吉，亨。", plain: "大吉，亨通。去旧取新，稳重成器。"),
    Passage(name: "震", theme: "震惊修省", bits: "100100", original: "亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。", plain: "亨通。雷声震来令人恐惧，事后却能谈笑自如。雷震惊动百里，主祭的人却不失手中的勺子和香酒。临危不乱。"),
    Passage(name: "艮", theme: "当止则止", bits: "001001", original: "艮其背，不获其身；行其庭，不见其人，无咎。", plain: "止于背后看不见的地方，不被自身欲望牵动；走在庭院里，也看不见他人。心中安止，没有过失。"),
    Passage(name: "渐", theme: "循序渐进", bits: "001011", original: "女归吉，利贞。", plain: "女子出嫁循礼渐进则吉，利于守正。"),
    Passage(name: "归妹", theme: "守分知终", bits: "110100", original: "征凶，无攸利。", plain: "少女出嫁不循正道，冒进则凶，无所利。"),
    Passage(name: "丰", theme: "盛大持中", bits: "101100", original: "亨，王假之，勿忧，宜日中。", plain: "亨通，君王达到盛大之境，不必忧虑，宜像正午的太阳一样普照。"),
    Passage(name: "旅", theme: "羁旅慎行", bits: "001101", original: "小亨，旅贞吉。", plain: "小有亨通，在外羁旅守正则吉。"),
    Passage(name: "巽", theme: "顺入申命", bits: "011011", original: "小亨，利有攸往，利见大人。", plain: "小有亨通，利于有所前往，宜见德高者。"),
    Passage(name: "兑", theme: "和悦相交", bits: "110110", original: "亨，利贞。", plain: "亨通，利于守正。以真诚带来喜悦。"),
    Passage(name: "涣", theme: "化散为聚", bits: "010011", original: "亨。王假有庙，利涉大川，利贞。", plain: "亨通。君王来到宗庙凝聚人心，利于渡过大河，利于守正。"),
    Passage(name: "节", theme: "节制有度", bits: "110010", original: "亨。苦节不可贞。", plain: "亨通。过分苛刻的节制不可长久守持。"),
    Passage(name: "中孚", theme: "诚信感物", bits: "110011", original: "豚鱼吉，利涉大川，利贞。", plain: "诚信感及猪和鱼，吉。利于渡过大河，利于守正。"),
    Passage(name: "小过", theme: "小有过越", bits: "001100", original: "亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上，宜下，大吉。", plain: "亨通，利于守正。可以做小事，不可做大事。飞鸟留下鸣声，不宜向上飞，宜向下栖，大吉。"),
    Passage(name: "既济", theme: "成而思危", bits: "101010", original: "亨小，利贞。初吉终乱。", plain: "小事亨通，利于守正。开始吉利，最终会乱。"),
    Passage(name: "未济", theme: "未成有望", bits: "010101", original: "亨。小狐汔济，濡其尾，无攸利。", plain: "亨通。小狐狸快渡过河时，沾湿了尾巴，无所利。")
    ]

    /// 按日期取当天那一卦，同一天永远是同一条
    static func ofDay(_ date: Date) -> Passage {
        let day = Int(floor(date.timeIntervalSince1970 / 86_400))
        let count = judgments.count
        return judgments[((day % count) + count) % count]
    }
}
