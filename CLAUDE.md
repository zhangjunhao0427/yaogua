# 摇卦

易经铜钱法起卦应用，目标同时上线网页与 iOS/Android（Capacitor 打包）。用户只懂中文，交流与代码注释一律用中文。

## 硬约束（违反任何一条，要么 Capacitor 包不了，要么产品失信）

- Vite + React + TypeScript，纯静态：无后端、无 SSR、无 API routes，不用 Next.js
- 路由只用 HashRouter（ESLint 已禁 BrowserRouter）；`vite.config.ts` 保持 `base: './'`
- 持久化只经 `src/platform/storage.ts`；震动、摇一摇、通知、分享只经 `src/platform/*`。接口一律异步，接 Capacitor 时只换实现，业务代码不动
- 随机数只经 `src/core/random.ts`（crypto.getRandomValues + 取模偏差剔除），已禁用 Math.random
- `src/core/` 为纯逻辑，不得依赖 DOM、platform、ui、data
- 不收集出生时间等任何敏感信息

## 领域逻辑（来自交接文档，已校验，不要重新推导）

- 铜钱背 3 字 2，三枚相加：6 老阴、7 少阳、8 少阴、9 老阳，6 与 9 为变爻。界面不出现蓍草
- 爻序由下至上：下标 0 为初爻，5 为上爻，渲染时自下而上堆叠
- 查表键为「上卦 + 下卦」：地天泰 = 上坤下乾
- 变占七则见 `src/core/rules.ts`；k=4、k=5 读之卦的**不变爻**
- 互卦取二三四爻为下卦、三四五爻为上卦；错卦六爻全翻；综卦整卦倒置（`aspectsOf`）。三者只作补充视角，不参与吉凶判定
- `TRIGRAM`、`KING_WEN` 表改动前后必须跑测试
- 经文改动后跑 `npm run verify:text`，与维基文库逐条比对；已核对的取字差异写在脚本的 ACCEPTED 白名单里

## 产品规则

- 流程：立问 → 静心（3 秒，可跳过）→ 摇卦 ×6 → 成卦 → 解读 → 存卦 → 七日回访
- 立问时分类必选（事业／关系／抉择／近况），解读与分享卡片都按这个方向给落点
- 问题确认后锁定；卦不可重：每掷一爻立即落盘，刷新或退出都无法重摇
- 解读分四层展开：卦象 → 变占 → 经文 → 反思；判定要求几条就展示几条（k=3 必须两条卦辞）
- 摇卦时长见 `CastPage` 的 `TIMING`：抛出 0.2s → 翻落 0.66s（错开 72ms）→ 揭晓 0.36s（间隔 120ms）
- 触发方式：长按蓄力松手、摇手机、轻点；全程 prefers-reduced-motion 降级
- 变爻铜色强调，老阳标 ○，老阴标 ×

## 结构

```
src/
  core/      纯逻辑：random / coin / hexagram / rules / types
  data/      经文与文案：zhouyi（64 卦全文，angles 子目录是四个分类各自的落点，
             与经文一一对应，共 450×4 条）/ hexagrams（卦名）/ guide（分类、反思、断辞）
  platform/  storage / haptics / motion / notify / share / app，每个文件同时导出
             webXxx 与 nativeXxx，由 runtime.ts 的 pick() 按平台选；业务代码只认接口
  store/     records：卦记与摇卦进度的存取
  ui/        pages 七个页面、components、shareCard（Canvas 分享卡片）
scripts/     verify-zhouyi.mjs 经文校验
resources/   icon.png 1024² 与 splash.png 2732²，由 scripts 生成，@capacitor/assets 派生各尺寸
```

## 打包上架

- `capacitor.config.ts`：appId 为 `com.zhangjunhao0427.yaogua`，**上架后不可更改**；webDir 指向 `dist`
- 网页资源随包发布，从 file:// 加载，不连任何服务器
- iOS 的编译、签名、上传只能在 macOS 上做；Windows 只能改代码、填资料、提交审核
- 最终要在 Windows 上发版，所以签名走 App Store Connect API 密钥 + 云端 macOS 构建，
  不要把证书绑在某台本地机器上
- 中国大陆区需要 ICP 备案号才能勾选；可先上架其他地区，备案后再补

## 待办（按优先级）

1. 生成 iOS／Android 原生工程（`npx cap add ios`，需 Xcode 与 CocoaPods），模拟器验证，
   再配证书与云端构建工作流。平台适配层已接好 Capacitor，业务代码无需再改
2. 可选升级：接模型按用户原话实时生成解读（现在的分类落点是预写的静态方案，已覆盖 450×4 条）。送模型时必须带爻辞原文，否则模型是在编
3. 分享卡片在 iOS 上走 Capacitor Share 的文件分享；Web 端已做「保存图片」兜底

## 命令

- `npm run dev`：开发服务器（项目在桌面，预览工具读不了桌面，用 Bash 起）
- `npm test`：单元测试
- `npm run verify:text`：经文与维基文库比对
- `npm run lint` / `npm run build`
