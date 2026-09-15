// 数据存储管理 - 使用 localStorage

const Storage = {
    // 保存账号信息
    saveAccount(data) {
        localStorage.setItem('boringGame_account', JSON.stringify(data));
    },

    // 获取账号信息
    getAccount() {
        const data = localStorage.getItem('boringGame_account');
        return data ? JSON.parse(data) : null;
    },

    // 删除账号信息（忘记密码时）
    deleteAccount() {
        localStorage.removeItem('boringGame_account');
        localStorage.removeItem('boringGame_progress');
    },

    // 保存游戏进度
    saveProgress(data) {
        localStorage.setItem('boringGame_progress', JSON.stringify(data));
    },

    // 获取游戏进度
    getProgress() {
        const data = localStorage.getItem('boringGame_progress');
        return data ? JSON.parse(data) : {
            currentLevel: 1,
            unlockedLevels: [1],
            loginCount: 0
        };
    },

    // 增加登录次数
    incrementLoginCount() {
        const progress = this.getProgress();
        progress.loginCount = (progress.loginCount || 0) + 1;
        this.saveProgress(progress);
        return progress.loginCount;
    },

    // 解锁关卡
    unlockLevel(levelNumber) {
        const progress = this.getProgress();
        if (!progress.unlockedLevels.includes(levelNumber)) {
            progress.unlockedLevels.push(levelNumber);
            progress.unlockedLevels.sort((a, b) => a - b);
            this.saveProgress(progress);
        }
    },

    // 保存公告内容
    saveAnnouncement(content, answers) {
        localStorage.setItem('boringGame_announcement', content);
        localStorage.setItem('boringGame_answers', JSON.stringify(answers));
    },

    // 获取公告内容
    getAnnouncement() {
        return localStorage.getItem('boringGame_announcement');
    },

    // 获取公告答案
    getAnswers() {
        const data = localStorage.getItem('boringGame_answers');
        return data ? JSON.parse(data) : [];
    }
};

