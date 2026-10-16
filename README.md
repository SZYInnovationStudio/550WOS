<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./logo_550w.svg" />
    <img src="./logo_550w_black.svg" alt="550WOS" width="420" />
  </picture>
</p>

<h1 align="center">550WOS</h1>

<p align="center">运行在浏览器中的桌面操作系统模拟器</p>

<p align="center">
  <a href="https://550w.szyd.fun">在线预览</a> ·
  <a href="changelog.md">更新日志</a> ·
  <a href="https://github.com/SZYInnovationStudio/550WOS">源代码仓库</a>
</p>

---

## 项目简介

550WOS 是一个完全运行在浏览器中的桌面操作系统模拟器。它提供开机自检、登录、桌面、任务栏、开始菜单与搜索、窗口管理与多任务、通知中心与控制中心、内置应用以及内置浏览器等完整交互，目标是在网页上还原一套可以真正操作的桌面环境。

项目采用完全静态的实现方式：**没有构建步骤，源码即产物**，用任意静态服务器托管即可运行。

### 项目来源

本项目基于开源项目 **win12 网页版**（<https://github.com/win12-online/win12>）改编，并在其基础上按 UEG 联合政府与 550W（MOSS）的世界观设定进行了品牌化、文案、界面与配色的重构。

- 技术支持：SZY 创新工作室（<https://github.com/SZYInnovationStudio>）
- 维护：ShiZhongyan（<https://github.com/ShiZhongyanGH>）

## 在线预览

- 主站：<https://550w.szyd.fun>
- 源代码仓库：<https://github.com/SZYInnovationStudio/550WOS>

## 功能概览

- 启动流程：开机自检与引导动画、开机设置（UEG SETUP）、登录界面、重启与关机过渡页、蓝屏页
- 桌面环境：桌面图标、任务栏、开始菜单与全局搜索、窗口打开/最小化/最大化/关闭、多任务视图、小组件
- 系统面板：通知中心、控制中心（网络、蓝牙、音量、亮度等）
- 内置应用：资源管理器、UEG Edge 浏览器、设置、UEG Store、安全中心、任务管理器、终端、记事本、计算器、代码编辑器、Python 编辑器、白板、相机、图片查看器、媒体播放器、PDF 阅读器、文字处理、扫雷、MOSS 助手等
- 网页应用：支持以窗口形式内嵌外部站点（如哔哩哔哩等）
- 内置浏览器：内置起始页、书签、地址栏解析与标签页管理
- 多语言：简体中文、繁体中文、英文
- 渐进式 Web 应用：支持 Service Worker 离线缓存

## 技术特性

- **无构建、运行时零依赖**：页面通过 `<script defer>` 按固定顺序加载，模块之间以全局对象通信，不需要打包或编译。
- **应用注册表模型**：所有应用在统一注册表中登记，并遵循 `init` / `load` / `loaded` / `remove` 生命周期；窗口模板集中在 `data/window-templates.js` 中定义。
- **多语言机制**：语言包为标准 `.properties` 文件，运行时通过 `data/languages.js` 与 `scripts/i18n-boot.js` 加载并按需回退。
- **统一视觉体系**：整体为灰阶配色、固定深色外观，样式令牌集中在 `styles/tokens.css`。
- **渐进式 Web 应用**：`sw.js` 负责静态资源缓存；在本机环境（`localhost`、IP 地址）以及地址栏带 `?develop` 时不会注册，便于调试。
- **可选桌面端桥接**：`tauri/` 目录提供 Tauri 环境下的原生能力封装（如电池信息），在浏览器环境自动降级，不影响网页运行。

## 目录结构

```text
550WOS/
├─ index.html              入口页，自动跳转到开机页
├─ boot.html               开机自检页（引导动画与自检信息）
├─ bios.html               开机设置界面（UEG SETUP）
├─ desktop.html            桌面外壳（任务栏、开始菜单、通知中心等）
├─ desktop.css             桌面外壳样式
├─ desktop.js              桌面外壳逻辑（窗口、开始菜单、控制中心、Service Worker 注册等）
├─ mainpage.html           内置浏览器起始页
├─ bluescreen.html         蓝屏页
├─ reload.html             重启过渡页
├─ shutdown.html           关机页
├─ 404.html                404 页面
├─ base.css                基础样式
├─ bootstrap-icons.css     图标字体样式
├─ styles/tokens.css       设计令牌（圆角等公共取值）
├─ logo_550w.svg           项目标识与开机标识
├─ 550WOSBACKGROUND.jpg    桌面壁纸
├─ favicon.ico / favicon.png
├─ sw.js                   Service Worker 缓存脚本
├─ wrangler.jsonc          静态部署配置（Cloudflare Workers）
├─ changelog.md            更新日志
├─ LICENSE / LICENSE-CC    许可证
├─ apps/                   内置应用的样式与图标（另见 apps/NOTICE.md）
├─ data/                   静态数据表（窗口模板、右键菜单、应用注册表、文案等）
├─ module/                 核心模块（窗口、标签页、应用调度、小组件等）
├─ scripts/                功能脚本（引导与 BIOS 内核、终端、新闻、农历、启动流程等）
├─ lang/lang/              多语言文案（简体中文 / 繁体中文 / 英文）
├─ icon/                   系统图标
├─ img/                    页面配图
├─ fonts/                  字体文件
├─ media/                  音效等媒体资源
├─ games/                  内置小游戏
├─ pwa/                    PWA 清单与图标
├─ tauri/                  桌面端（Tauri）桥接脚本
└─ tools/regress/          行为回归采集与测试工具（仅开发使用）
```

## 本地运行

项目无需安装依赖，也无需构建。

### 方式一：任意静态服务器

用任意静态服务器托管项目根目录，然后浏览 `http://localhost:<端口>/`，入口页会自动跳转到开机页。

### 方式二：编辑器插件

在 Visual Studio Code 中安装 Live Server 插件，右键 `index.html` 选择 Open with Live Server。

### 注意事项

- 必须通过 HTTP 访问。直接以 `file://` 打开会受同源策略与资源加载限制影响，无法正常运行。
- 调试时建议在地址后追加 `?develop`，可跳过 Service Worker 注册，避免缓存干扰。
- 若曾经访问过正式站点，建议在浏览器开发者工具中注销 Service Worker 并清除站点数据后再调试。

## 本地测试

回归测试工具位于 `tools/regress`，基于 puppeteer，仅用于开发，不参与运行时。

```bash
cd tools/regress
npm install

# 单元测试
npm test

# 采集当前工作树的行为快照，保存为 baseline
npm run capture

# 采集并保存为命名基线
node run.mjs --save <名称>

# 与指定基线对比
node run.mjs --against <名称>
```

说明：

- 运行环境为 Node.js 18 及以上。
- `npm install` 会下载 Chrome for Testing（体积较大）。若本机已安装 Chrome 或 Edge，可通过环境变量 `CHROME_BIN` 指定其可执行文件路径，工具会优先使用它。
- 单元测试覆盖地址栏解析、多语言回退与语言包格式、登录桥接、外壳生命周期、Service Worker 缓存等模块。
- 回归快照保存在 `tools/regress/snapshots/`，用于对比界面与行为是否发生非预期变更。

## 许可证

- 代码：Eclipse Public License 2.0，详见 [LICENSE](LICENSE)。
- 非代码内容（文档、图片及其它素材）：Creative Commons Attribution-ShareAlike 4.0 International，详见 [LICENSE-CC](LICENSE-CC)。

在遵守上述许可证的前提下，您可以自由使用、修改与再分发本项目。使用时请保留来源信息（作者、项目链接等），并按许可证要求开源。

第三方素材的商标与授权说明见 `apps/NOTICE.md`、`img/NOTICE.md`、`icon/NOTICE.md`。

## 免责声明

本项目为开源技术实践作品，仅供学习与技术研究使用。项目中的世界观设定（UEG、550W、MOSS 等）取自公开的虚构设定，本项目与之不存在任何隶属、授权或合作关系；项目中涉及的第三方商标与素材归各自权利人所有。

## 更新日志

版本变更记录见 [changelog.md](changelog.md)。
