---
name: english-pronunciation-audio
description: 给英语单词和例句生成读音音频。用户说某个词不会读、要听发音、读一下单词、生成读音，或要求朗读英语词条时使用。产物为本地 m4a 音频，通过 present_files 交付给用户直接播放。
---

# 英语读音音频

## 用途

把一个或多个英语词条读出来给用户听。用户可能直接说词（seventh grader、math），也可能用「单词 4」「短语 2」这样的序号指代；序号按 `英语/vocabulary bank.md` 里的表名加序号定位，两张表各自编号。

## 生成方式

用 macOS 内置语音离线合成，默认美式女声 Samantha、语速 150：

```bash
say -v Samantha -r 150 -o /tmp/读音.aiff "seventh grader. [[slnc 600]] seventh grader. [[slnc 1200]] I went to teach seventh graders math in the New York City public schools."
afconvert -f m4af -d aac /tmp/读音.aiff <输出路径>.m4a
```

- `[[slnc N]]` 是停顿，单位毫秒：词与词之间 600，词与整句之间 1200
- 转成 m4a 再交付，体积约为 aiff 的十分之一，转完删掉临时 aiff
- 只有用户明确要求「更像真人」时才改用豆包 TTS（text_to_audio_plus），并说明它的单词发音准确度不如本机语音

## 读法规范

- 每个词读两遍，中间停顿 600ms；两遍同一语速，不额外变速
- 词后接它在学习笔记原文里的那句例句，整句读一遍；没有原句时读词库例句
- 一条音频覆盖 1 到 6 个词，控制在 15 到 30 秒；超过 6 个词拆成多条，不做一个几分钟的长文件
- 顺序与词库序号一致，不按字母重排

## 文件与交付

- 存放目录：`英语/读音/`，该目录已在 `.gitignore` 中忽略，音频不入库
- 命名：`读音-YYYY-MM-DD-<读到的词>.m4a`，词用连字符小写，如 `读音-2026-11-28-seventh-grader-math.m4a`；同一天多次生成加 `-2`、`-3`
- 用 present_files 推送音频文件，回复里列出读了哪些词及对应音标
- 不在回复里粘贴音频二进制或大段朗读文本

## 不做

- 不用中文语音读英语词，不做机械拼接
- 不生成整本词库的长音频
- 不把音标当朗读内容送进 TTS（音标给人看，不是合成输入）
- 不删除、不修改词库里的词条
