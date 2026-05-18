# 轻词 (QingCi) - K12背单词App

一个使用 React Native + Expo 构建的跨平台背单词应用，支持四个学段。

## 技术栈

- **React Native** + **Expo** (SDK 54)
- **expo-router** - 文件路由系统
- **expo-speech** - 本地TTS发音
- **@react-native-async-storage/async-storage** - 本地数据持久化
- **TypeScript**

## 项目结构

```
qingci-app/
├── app/                    # Expo Router 页面
│   ├── _layout.tsx        # 根布局
│   ├── index.tsx          # 首页（学段选择）
│   ├── login.tsx          # 登录页
│   ├── preschool/         # 学前模块
│   │   ├── _layout.tsx
│   │   ├── index.tsx     # 学前首页（零文字）
│   │   └── learn.tsx     # 学前学习页（全语音）
│   ├── primary/           # 小学模块
│   │   ├── _layout.tsx
│   │   ├── index.tsx     # 小学首页
│   │   └── learn.tsx     # 小学学习页
│   ├── middle/            # 初中模块
│   │   ├── _layout.tsx
│   │   ├── index.tsx     # 初中首页
│   │   └── learn.tsx     # 初中学习页
│   └── high/              # 高中模块
│       ├── _layout.tsx
│       ├── index.tsx     # 高中首页
│       └── learn.tsx     # 高中学习页
├── src/
│   ├── components/        # 组件
│   │   ├── FoxMascot.tsx # 狐狸吉祥物
│   │   └── BottomNav.tsx # 底部导航
│   ├── data/              # 单词数据
│   │   ├── preschoolWords.ts
│   │   └── primaryWords.ts
│   ├── hooks/             # 自定义Hook
│   │   ├── useDeviceType.ts
│   │   └── useOrientation.ts
│   ├── theme/             # 主题配置
│   │   └── colors.ts
│   ├── types/             # TypeScript类型
│   │   └── index.ts
│   └── utils/             # 工具函数
│       ├── speech.ts      # TTS发音
│       └── storage.ts     # 本地存储
├── app.json               # Expo配置
├── package.json
└── tsconfig.json
```

## 四学段设计

| 学段 | 品牌名 | Slogan | UI特点 |
|------|--------|--------|--------|
| 学前 | 🦊 小狐狸学单词 | 点点玩玩，就会了 | 粉色系、零文字、全语音 |
| 小学 | 🦊 小狐狸·轻词 | 聪明如狐，轻松记词 | 青绿色系、成就系统 |
| 初中 | 轻词 | 我的节奏，我的词 | 蓝色系、任务驱动 |
| 高中 | 轻词 QingCi | 一词不落，一秒不废 | 深色系、高考倒计时 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 运行在Android上
npm run android

# 运行在iOS上
npm run ios
```

## 功能特性

### 学前模式
- 零文字界面，纯emoji图标交互
- 全程语音引导
- 点击图片自动播放发音
- 延迟2秒自动开始

### 小学模式
- 单词+音标+释义+记忆技巧
- 例句展示
- 成就徽章系统
- 今日任务进度

### 初中模式
- 蓝色系专业UI
- 同步学习/专项突破双模式
- 考点分析
- 学习统计

### 高中模式
- 深色主题
- 高考倒计时
- 高频词汇速记
- 写作应用指导

## TTS发音配置

- **学前**：rate=0.6, pitch=1.2（慢速高音，适合幼儿）
- **小学**：rate=0.85, pitch=1.0（中速，适合初学者）
- **初高中**：rate=1.0, pitch=1.0（正常速度）
