# A股五日异动雷达

公开静态网站：<https://vernonking.github.io/a-share-five-day-radar/>

页面按最近五个交易日收益展示基础化工大市值、基础化工小市值、石油石化和北交所股票，并提供日线、周线、均线及关联品种趋势。

## 数据更新

网页从公开数据仓库 [`VernonKing/a-share-five-day-radar-data`](https://github.com/VernonKing/a-share-five-day-radar-data) 实时读取 `latest.json`。行情采集在工作日盘后由该数据仓库的 GitHub Actions 独立执行，无人访问时仍会更新，也不依赖用户电脑或 Codex 运行。

本仓库只负责静态网页和 GitHub Pages 发布。行情数据更新不需要重新部署网页。

## 发布

推送到 `main` 后，`.github/workflows/pages.yml` 会自动部署 GitHub Pages；也可以在 Actions 页面手动运行 **Publish GitHub Pages**。

如实时数据源不可用，页面会显示打包时的本地快照，并明确标注为回退数据。

页面仅用于趋势观察，不构成投资建议。
