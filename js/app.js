// 主应用逻辑和界面切换

// 自定义alert函数（替换原生alert）
function showAlert(message, title = '提示') {
    document.getElementById('custom-alert-title').textContent = title;
    document.getElementById('custom-alert-message').textContent = message;
    document.getElementById('custom-alert-modal').classList.add('active');
}

function closeCustomAlert() {
    document.getElementById('custom-alert-modal').classList.remove('active');
}

// 重写全局alert函数
window.alert = showAlert;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// 初始化应用
function initApp() {
    // 检查是否有账号
    const account = Storage.getAccount();
    
    if (!account) {
        // 没有账号，显示注册界面
        switchScreen('register-screen');
    } else {
        // 有账号，显示登录界面
        switchScreen('login-screen');
    }
    
    // 监听页面可见性变化（切出游戏检测）
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// 切换屏幕
function switchScreen(screenId) {
    // 隐藏所有屏幕
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // 显示指定屏幕
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// 处理页面可见性变化（切出游戏）
let isInLevel = false; // 标记是否在关卡中

function handleVisibilityChange() {
    if (document.hidden && isInLevel) {
        // 用户切出了游戏，且正在关卡中
        alert('检测到你切出了游戏，视为退出登录');
        isInLevel = false;
        logout();
    }
}

// 初始化游戏主界面
function initGameScreen() {
    const progress = Storage.getProgress();
    const levelList = document.getElementById('level-list');
    levelList.innerHTML = '';

    // 生成关卡列表（1-10关，你说暂时只有10关）
    const totalLevels = 10;

    for (let i = 1; i <= totalLevels; i++) {
        const levelItem = document.createElement('div');
        levelItem.className = 'level-item';
        levelItem.textContent = i;

        // 正式模式：只有解锁的关卡才能进入
        if (progress.unlockedLevels.includes(i)) {
            // 已解锁的关卡
            levelItem.addEventListener('click', () => {
                enterLevel(i);
            });
        } else {
            // 未解锁的关卡
            levelItem.classList.add('locked');
        }

        levelList.appendChild(levelItem);
    }
}

// 进入关卡
function enterLevel(levelNumber) {
    // 显示关卡规则说明
    showLevelRules(levelNumber);
}

// 显示关卡规则
function showLevelRules(levelNumber) {
    const levelContent = document.getElementById('level-content');
    
    // 这里根据关卡号显示不同的规则
    // 由于你说关卡内容另写，这里先做一个框架
    const rules = getLevelRules(levelNumber);
    
    levelContent.innerHTML = `
        <h2>第 ${levelNumber} 关</h2>
        <div style="padding: 20px; border: 2px solid #000; margin: 20px 0;">
            <h3>游戏规则</h3>
            <p style="line-height: 1.8;">${rules}</p>
        </div>
        <p id="start-hint" style="color: #666; margin: 20px 0;">
            请仔细阅读，等会给你玩
        </p>
        <button id="start-level-btn" class="btn-primary" style="display:none;" onclick="startLevel(${levelNumber})">
            开始游戏
        </button>
    `;
    
    switchScreen('level-screen');
    
    // 5秒后显示开始按钮
    setTimeout(() => {
        document.getElementById('start-hint').textContent = '你可以开始游戏了';
        document.getElementById('start-level-btn').style.display = 'block';
    }, 5000);
}

// 获取关卡规则
function getLevelRules(levelNumber) {
    const rules = {
        1: '点100下屏幕就能通关。',
        2: '这一关只要你点二十下，但是别点太快。',
        3: '长按屏幕5秒即可通关。',
        4: '把该点的气泡点了就行',
        5: '系统错误，点右上方退出登录试试？',
        6: '请在元素周期表中依次找到镭、镤和锑，点击即可。',
        7: '请在15秒内依次按下"tianqingseDENGyanyuerwozaiDENGni"。',
        8: '依次点击屏幕中的1-50。',
        9: '将歌词与对应的歌曲连起来。先点击歌词，再点击对应的歌曲名，最后点击确认。',
        10: '让贪吃蛇咬死自己5次。使用方向键控制。'
    };

    return rules[levelNumber] || '关卡规则待补充...';
}

// 开始关卡
function startLevel(levelNumber) {
    isInLevel = true; // 标记进入关卡

    const levelContent = document.getElementById('level-content');

    // 根据关卡号加载不同的关卡内容
    if (levelNumber === 1) {
        startLevel1(levelContent);
    } else if (levelNumber === 2) {
        startLevel2(levelContent);
    } else if (levelNumber === 3) {
        startLevel3(levelContent);
    } else if (levelNumber === 4) {
        startLevel4(levelContent);
    } else if (levelNumber === 5) {
        startLevel5(levelContent);
    } else if (levelNumber === 6) {
        startLevel6(levelContent);
    } else if (levelNumber === 7) {
        startLevel7(levelContent);
    } else if (levelNumber === 8) {
        startLevel8(levelContent);
    } else if (levelNumber === 9) {
        startLevel9(levelContent);
    } else if (levelNumber === 10) {
        startLevel10(levelContent);
    }
}

// 返回游戏主界面
function backToGameScreen() {
    switchScreen('game-screen');
    initGameScreen();
}

// 完成关卡
function completeLevel(levelNumber) {
    isInLevel = false; // 退出关卡状态

    alert(`恭喜通过第 ${levelNumber} 关！`);

    // 解锁下一关
    if (levelNumber < 10) {
        Storage.unlockLevel(levelNumber + 1);
    }

    // 返回游戏主界面
    switchScreen('game-screen');
    initGameScreen();
}

// 显示失败选项（陷阱）- 这个函数可能不需要了，因为每个关卡都有自己的失败逻辑
function showFailOptions() {
    alert('看广告重新开始？这是一个没有广告的小游戏，你还是退出登录吧');
}

