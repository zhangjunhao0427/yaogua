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
- `TRIGRAM`、`KING_WEN` 表改动前后必须跑测试
- 经文改动后跑 `npm run verify:text`，与维基文库逐条比对；已核对的取字差异写在脚本的 ACCEPTED 白名单里

## 产品规则

- 流程：立问 → 静心（3 秒，可跳过）→ 摇卦 ×6 → 成卦 → 解读 → 存卦 → 七日回访
- 问题确认后锁定；卦不可重：每掷一爻立即落盘，刷新或退出都无法重摇
- 解读分四层展开：卦象 → 变占 → 经文 → 反思；判定要求几条就展示几条（k=3 必须两条卦辞）
- 摇卦时长见 `CastPage` 的 `TIMING`：抛出 0.2s → 翻落 0.66s（错开 72ms）→ 揭晓 0.36s（间隔 120ms）
- 触发方式：长按蓄力松手、摇手机、轻点；全程 prefers-reduced-motion 降级
- 变爻铜色强调，老阳标 ○，老阴标 ×

## 结构

```
src/
  core/      纯逻辑：random / coin / hexagram / rules / types
  data/      经文与文案：zhouyi（64 卦全文）/ hexagrams（卦名）/ guide（分类、反思、断辞）
  platform/  storage / haptics / motion / notify / share，Web 实现 ↔ Capacitor 实现
  store/     records：卦记与摇卦进度的存取
  ui/        pages 七个页面、components、shareCard（Canvas 分享卡片）
scripts/     verify-zhouyi.mjs 经文校验
```

## 待办（按优先级）

1. Capacitor 打包与两个商店上架；接入时替换 `src/platform/*` 五个实现，其中通知在 Web 端是空实现（七日回访目前靠打开应用时检查）
2. 针对问题的解读层：把问题、本卦、之卦、变爻位、判定结论、爻辞原文一起送模型。作为可选升级，不是默认路径
3. 分享卡片在 iOS 上走 Capacitor Share 的文件分享；Web 端已做「保存图片」兜底

## 命令

- `npm run dev`：开发服务器（项目在桌面，预览工具读不了桌面，用 Bash 起）
- `npm test`：单元测试
- `npm run verify:text`：经文与维基文库比对
- `npm run lint` / `npm run build`
