// 关卡系统 - 包含所有关卡的具体实现

// ========== 第一关：点击100次 ==========
function startLevel1(container) {
    let clickCount = 0;
    const targetClicks = 100;

    container.innerHTML = `
        <h2>第 1 关 - 点就行</h2>
        <div id="level1-game" style="position: relative; height: 400px; border: 2px solid #000; margin: 20px 0; cursor: pointer; user-select: none;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none;">
                <p style="font-size: 64px; font-weight: bold; margin-bottom: 20px;">${clickCount}</p>
                <p style="font-size: 24px; font-weight: bold;">/ ${targetClicks}</p>
            </div>
        </div>
    `;

    const gameArea = document.getElementById('level1-game');
    const logoutBtn = createMovingLogoutButton(gameArea);

    gameArea.addEventListener('click', function(e) {
        if (e.target.classList.contains('moving-logout-btn')) {
            return; // 点到退出登录按钮会被按钮自己的事件处理
        }

        clickCount++;
        updateLevel1Display(clickCount, targetClicks);

        // 每次点击后移动退出按钮
        moveLogoutButton(logoutBtn, gameArea);

        if (clickCount >= targetClicks) {
            isInLevel = false;
            setTimeout(() => {
                alert('恭喜通过第 1 关！');
                completeLevel(1);
            }, 100);
        }
    });
}

function updateLevel1Display(count, target) {
    const gameArea = document.getElementById('level1-game');
    const display = gameArea.querySelector('div > p:first-child');
    if (display) {
        display.textContent = count;
    }
}

function createMovingLogoutButton(container) {
    const btn = document.createElement('button');
    btn.textContent = '退出登录';
    btn.className = 'moving-logout-btn';
    btn.style.cssText = `
        position: absolute;
        padding: 32px 64px;
        font-size: 24px;
        border: 2px solid #000;
        background-color: #fff;
        cursor: pointer;
        z-index: 10;
        font-weight: bold;
    `;

    // 随机初始位置
    moveLogoutButton(btn, container);

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        logout();
    });

    // 移除悬停移动的逻辑

    container.appendChild(btn);
    return btn;
}

function moveLogoutButton(btn, container) {
    // 让按钮中心可以到达边界位置
    // 按钮尺寸约为 128px宽 x 64px高 (padding 32px 64px)
    const btnWidth = btn.offsetWidth;
    const btnHeight = btn.offsetHeight;

    // 允许按钮中心到达容器边界（按钮可能部分超出）
    const minX = -btnWidth / 2;
    const minY = -btnHeight / 2;
    const maxX = container.clientWidth - btnWidth / 2;
    const maxY = container.clientHeight - btnHeight / 2;

    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
}

// ========== 第二关：点击20次但别太快 ==========
function startLevel2(container) {
    let clickCount = 0;
    let lastClickTime = null;
    const targetClicks = 20;
    const minInterval = 1500; // 最少间隔1.5秒

    container.innerHTML = `
        <h2>第 2 关 - 别急就行</h2>
        <div id="level2-game" style="padding: 60px; text-align: center; border: 2px solid #000; margin: 20px 0; cursor: pointer; user-select: none;">
            <p style="font-size: 64px; font-weight: bold; margin-bottom: 20px;">${clickCount}</p>
            <p style="font-size: 24px; font-weight: bold;">/ ${targetClicks}</p>
            <p style="font-size: 18px; color: #666; margin-top: 30px; font-weight: bold;">点击这里</p>
        </div>
    `;

    const gameArea = document.getElementById('level2-game');

    gameArea.addEventListener('click', function() {
        const now = Date.now();

        if (lastClickTime !== null) {
            const interval = now - lastClickTime;

            // 改为：间隔小于1秒才失败，不提示具体时间
            if (interval < minInterval) {
                alert('你点得太快了！');
                isInLevel = false;
                logout();
                return;
            }
        }

        lastClickTime = now;
        clickCount++;

        gameArea.querySelector('p:first-child').textContent = clickCount;

        if (clickCount >= targetClicks) {
            isInLevel = false;
            setTimeout(() => {
                alert('恭喜通过第 2 关！');
                completeLevel(2);
            }, 100);
        }
    });
}

// ========== 第三关：长按5秒 ==========
function startLevel3(container) {
    let pressStartTime = null;
    let pressTimer = null;
    let failCount = 0;
    const maxFails = 5;

    container.innerHTML = `
        <h2>第 3 关 - 长按就行</h2>
        <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 72px; font-weight: bold; margin: 40px 0;" id="level3-timer">0.00</p>
            <p style="font-size: 20px; color: #000; font-weight: bold;">长按屏幕空白区域5秒左右即可通关</p>
            <p style="font-size: 18px; color: #ff0000; margin-top: 15px; font-weight: bold;" id="level3-hint">
                剩余机会：${maxFails - failCount} 次
            </p>
        </div>
        <div id="level3-game" style="position: relative; height: 300px; border: 2px solid #000; margin: 20px 0; user-select: none;">
        </div>
    `;

    const gameArea = document.getElementById('level3-game');
    const timerDisplay = document.getElementById('level3-timer');

    function startPress(e) {
        if (e.target.classList.contains('fail-logout-btn')) {
            return;
        }

        pressStartTime = Date.now();
        pressTimer = setInterval(() => {
            const elapsed = (Date.now() - pressStartTime) / 1000;
            timerDisplay.textContent = elapsed.toFixed(2);
        }, 10);
    }

    function endPress() {
        if (pressStartTime === null) return;

        clearInterval(pressTimer);
        const elapsed = (Date.now() - pressStartTime) / 1000;
        const finalTime = elapsed.toFixed(2);
        timerDisplay.textContent = finalTime;

        // 放宽到 4.98-5.02 秒之间都可以通过
        const time = parseFloat(finalTime);
        if (time >= 4.98 && time <= 5.02) {
            isInLevel = false;
            setTimeout(() => {
                alert('恭喜通过第 3 关！');
                completeLevel(3);
            }, 100);
        } else {
            failCount++;

            if (failCount >= maxFails) {
                // 第五次失败，填满最后1/5的屏幕
                addFailArea(gameArea, failCount);
                document.getElementById('level3-hint').textContent = '没有机会了，点哪里都会退出登录';
                // 不直接退出，让玩家体验绝望
            } else {
                document.getElementById('level3-hint').textContent = `剩余机会：${maxFails - failCount} 次`;
                addFailArea(gameArea, failCount);
                pressStartTime = null;
                setTimeout(() => {
                    timerDisplay.textContent = '0.00';
                }, 1000);
            }
        }
    }

    gameArea.addEventListener('mousedown', startPress);
    gameArea.addEventListener('mouseup', endPress);
    gameArea.addEventListener('mouseleave', function() {
        if (pressStartTime !== null) {
            endPress();
        }
    });
}

function addFailArea(container, failCount) {
    const btn = document.createElement('button');
    btn.textContent = '退出登录';
    btn.className = 'fail-logout-btn';
    btn.style.cssText = `
        position: absolute;
        width: 100%;
        height: ${(100 / 5)}%;
        top: ${(failCount - 1) * 20}%;
        left: 0;
        border: none;
        background-color: #ffcccc;
        font-size: 14px;
        cursor: pointer;
        border-bottom: 1px solid #000;
    `;
    
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        isInLevel = false;
        logout();
    });
    
    container.appendChild(btn);
}

// ========== 第四关：点我游戏 ==========
function startLevel4(container) {
    let gameTime = 10;
    let gameActive = true;
    let bubbleInterval;
    
    container.innerHTML = `
        <h2>第 4 关 - 戳泡泡就行</h2>
        <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 36px; font-weight: bold;">剩余时间：<span id="level4-timer" style="color: #ff0000;">${gameTime}</span> 秒</p>
        </div>
        <div id="level4-game" style="position: relative; height: 400px; border: 2px solid #000; margin: 20px 0; background-color: #f9f9f9;">
        </div>
    `;
    
    const gameArea = document.getElementById('level4-game');
    const timerDisplay = document.getElementById('level4-timer');
    
    // 倒计时
    const countdown = setInterval(() => {
        gameTime--;
        timerDisplay.textContent = gameTime;
        
        if (gameTime <= 0) {
            clearInterval(countdown);
            clearInterval(bubbleInterval);
            if (gameActive) {
                isInLevel = false;
                alert('恭喜通过第 4 关！');
                completeLevel(4);
            }
        }
    }, 1000);
    
    // 每0.5秒生成一个气泡
    bubbleInterval = setInterval(() => {
        if (gameActive && gameTime > 0) {
            createBubble(gameArea);
        }
    }, 500);
    
    function createBubble(container) {
        const bubble = document.createElement('div');
        const shouldClick = Math.random() > 0.3; // 70%是"点我"，30%是"别点我"
        
        const size = 80;
        const maxX = container.clientWidth - size;
        const maxY = container.clientHeight - size;
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        
        bubble.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 2px solid #000;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            text-align: center;
            line-height: 1.2;
        `;
        
        if (shouldClick) {
            bubble.textContent = '点我';
            bubble.dataset.shouldClick = 'true';
        } else {
            bubble.innerHTML = '<span style="font-size: 8px;">别</span>点我';
            bubble.dataset.shouldClick = 'false';
        }
        
        bubble.addEventListener('click', function() {
            const should = this.dataset.shouldClick === 'true';
            if (should) {
                // 正确点击
                this.remove();
            } else {
                // 点错了
                gameActive = false;
                clearInterval(countdown);
                clearInterval(bubbleInterval);
                alert('你点错了！不该点"别点我"！');
                isInLevel = false;
                logout();
            }
        });
        
        container.appendChild(bubble);
        
        // 1秒后自动消失
        setTimeout(() => {
            if (bubble.parentNode && gameActive) {
                const should = bubble.dataset.shouldClick === 'true';
                if (should) {
                    // 该点的没点，失败
                    gameActive = false;
                    clearInterval(countdown);
                    clearInterval(bubbleInterval);
                    alert('你漏掉了应该点的气泡！');
                    isInLevel = false;
                    logout();
                } else {
                    // 不该点的没点，正确
                    bubble.remove();
                }
            }
        }, 1000);
    }
}

// ========== 第五关：作者奖励 ==========
function startLevel5(container) {
    container.innerHTML = `
        <h2>第 5 关 - 奖励你就行</h2>
        <div style="text-align: center; margin: 80px 0;">
            <p style="font-size: 64px; margin-bottom: 40px;">🎁</p>
            <p style="font-size: 32px; font-weight: bold; margin-bottom: 30px;">恭喜你！</p>
            <p style="font-size: 24px; line-height: 2; color: #000;">
                其实作者脑子不够了懒得想<br><br>
                所以<span style="color: #ffd700; font-weight: bold; font-size: 28px;">直接送你过关</span>了<br><br>
                别客气，继续下一关吧！😊
            </p>
        </div>
    `;

    // 2秒后自动通关
    setTimeout(() => {
        isInLevel = false;
        showAlert('本关已通过！还不快跪谢我');
        setTimeout(() => {
            completeLevel(5);
        }, 500);
    }, 2000);
}

// ========== 第六关：元素周期表 ==========
function startLevel6(container) {
    // 完整的元素周期表数据（118个元素）
    const elements = [
        // 第1周期
        {symbol: 'H', name: '氢', number: 1, row: 0, col: 0},
        {symbol: 'He', name: '氦', number: 2, row: 0, col: 17},
        // 第2周期
        {symbol: 'Li', name: '锂', number: 3, row: 1, col: 0},
        {symbol: 'Be', name: '铍', number: 4, row: 1, col: 1},
        {symbol: 'B', name: '硼', number: 5, row: 1, col: 12},
        {symbol: 'C', name: '碳', number: 6, row: 1, col: 13},
        {symbol: 'N', name: '氮', number: 7, row: 1, col: 14},
        {symbol: 'O', name: '氧', number: 8, row: 1, col: 15},
        {symbol: 'F', name: '氟', number: 9, row: 1, col: 16},
        {symbol: 'Ne', name: '氖', number: 10, row: 1, col: 17},
        // 第3周期
        {symbol: 'Na', name: '钠', number: 11, row: 2, col: 0},
        {symbol: 'Mg', name: '镁', number: 12, row: 2, col: 1},
        {symbol: 'Al', name: '铝', number: 13, row: 2, col: 12},
        {symbol: 'Si', name: '硅', number: 14, row: 2, col: 13},
        {symbol: 'P', name: '磷', number: 15, row: 2, col: 14},
        {symbol: 'S', name: '硫', number: 16, row: 2, col: 15},
        {symbol: 'Cl', name: '氯', number: 17, row: 2, col: 16},
        {symbol: 'Ar', name: '氩', number: 18, row: 2, col: 17},
        // 第4周期
        {symbol: 'K', name: '钾', number: 19, row: 3, col: 0},
        {symbol: 'Ca', name: '钙', number: 20, row: 3, col: 1},
        {symbol: 'Sc', name: '钪', number: 21, row: 3, col: 2},
        {symbol: 'Ti', name: '钛', number: 22, row: 3, col: 3},
        {symbol: 'V', name: '钒', number: 23, row: 3, col: 4},
        {symbol: 'Cr', name: '铬', number: 24, row: 3, col: 5},
        {symbol: 'Mn', name: '锰', number: 25, row: 3, col: 6},
        {symbol: 'Fe', name: '铁', number: 26, row: 3, col: 7},
        {symbol: 'Co', name: '钴', number: 27, row: 3, col: 8},
        {symbol: 'Ni', name: '镍', number: 28, row: 3, col: 9},
        {symbol: 'Cu', name: '铜', number: 29, row: 3, col: 10},
        {symbol: 'Zn', name: '锌', number: 30, row: 3, col: 11},
        {symbol: 'Ga', name: '镓', number: 31, row: 3, col: 12},
        {symbol: 'Ge', name: '锗', number: 32, row: 3, col: 13},
        {symbol: 'As', name: '砷', number: 33, row: 3, col: 14},
        {symbol: 'Se', name: '硒', number: 34, row: 3, col: 15},
        {symbol: 'Br', name: '溴', number: 35, row: 3, col: 16},
        {symbol: 'Kr', name: '氪', number: 36, row: 3, col: 17},
        // 第5周期
        {symbol: 'Rb', name: '铷', number: 37, row: 4, col: 0},
        {symbol: 'Sr', name: '锶', number: 38, row: 4, col: 1},
        {symbol: 'Y', name: '钇', number: 39, row: 4, col: 2},
        {symbol: 'Zr', name: '锆', number: 40, row: 4, col: 3},
        {symbol: 'Nb', name: '铌', number: 41, row: 4, col: 4},
        {symbol: 'Mo', name: '钼', number: 42, row: 4, col: 5},
        {symbol: 'Tc', name: '锝', number: 43, row: 4, col: 6},
        {symbol: 'Ru', name: '钌', number: 44, row: 4, col: 7},
        {symbol: 'Rh', name: '铑', number: 45, row: 4, col: 8},
        {symbol: 'Pd', name: '钯', number: 46, row: 4, col: 9},
        {symbol: 'Ag', name: '银', number: 47, row: 4, col: 10},
        {symbol: 'Cd', name: '镉', number: 48, row: 4, col: 11},
        {symbol: 'In', name: '铟', number: 49, row: 4, col: 12},
        {symbol: 'Sn', name: '锡', number: 50, row: 4, col: 13},
        {symbol: 'Sb', name: '锑', number: 51, row: 4, col: 14},
        {symbol: 'Te', name: '碲', number: 52, row: 4, col: 15},
        {symbol: 'I', name: '碘', number: 53, row: 4, col: 16},
        {symbol: 'Xe', name: '氙', number: 54, row: 4, col: 17},
        // 第6周期
        {symbol: 'Cs', name: '铯', number: 55, row: 5, col: 0},
        {symbol: 'Ba', name: '钡', number: 56, row: 5, col: 1},
        {symbol: 'La', name: '镧', number: 57, row: 5, col: 2},
        {symbol: 'Hf', name: '铪', number: 72, row: 5, col: 3},
        {symbol: 'Ta', name: '钽', number: 73, row: 5, col: 4},
        {symbol: 'W', name: '钨', number: 74, row: 5, col: 5},
        {symbol: 'Re', name: '铼', number: 75, row: 5, col: 6},
        {symbol: 'Os', name: '锇', number: 76, row: 5, col: 7},
        {symbol: 'Ir', name: '铱', number: 77, row: 5, col: 8},
        {symbol: 'Pt', name: '铂', number: 78, row: 5, col: 9},
        {symbol: 'Au', name: '金', number: 79, row: 5, col: 10},
        {symbol: 'Hg', name: '汞', number: 80, row: 5, col: 11},
        {symbol: 'Tl', name: '铊', number: 81, row: 5, col: 12},
        {symbol: 'Pb', name: '铅', number: 82, row: 5, col: 13},
        {symbol: 'Bi', name: '铋', number: 83, row: 5, col: 14},
        {symbol: 'Po', name: '钋', number: 84, row: 5, col: 15},
        {symbol: 'At', name: '砹', number: 85, row: 5, col: 16},
        {symbol: 'Rn', name: '氡', number: 86, row: 5, col: 17},
        // 第7周期
        {symbol: 'Fr', name: '钫', number: 87, row: 6, col: 0},
        {symbol: 'Ra', name: '镭', number: 88, row: 6, col: 1},
        {symbol: 'Ac', name: '锕', number: 89, row: 6, col: 2},
        {symbol: 'Rf', name: '𬬻', number: 104, row: 6, col: 3},
        {symbol: 'Db', name: '𬭊', number: 105, row: 6, col: 4},
        {symbol: 'Sg', name: '𬭳', number: 106, row: 6, col: 5},
        {symbol: 'Bh', name: '𬭛', number: 107, row: 6, col: 6},
        {symbol: 'Hs', name: '𬭶', number: 108, row: 6, col: 7},
        {symbol: 'Mt', name: '鿏', number: 109, row: 6, col: 8},
        {symbol: 'Ds', name: '𫟼', number: 110, row: 6, col: 9},
        {symbol: 'Rg', name: '𬬭', number: 111, row: 6, col: 10},
        {symbol: 'Cn', name: '鿔', number: 112, row: 6, col: 11},
        {symbol: 'Nh', name: '鿭', number: 113, row: 6, col: 12},
        {symbol: 'Fl', name: '𫓧', number: 114, row: 6, col: 13},
        {symbol: 'Mc', name: '镆', number: 115, row: 6, col: 14},
        {symbol: 'Lv', name: '𫟷', number: 116, row: 6, col: 15},
        {symbol: 'Ts', name: '鿬', number: 117, row: 6, col: 16},
        {symbol: 'Og', name: '鿫', number: 118, row: 6, col: 17},
        // 镧系元素（第8行）
        {symbol: 'Ce', name: '铈', number: 58, row: 8, col: 3},
        {symbol: 'Pr', name: '镨', number: 59, row: 8, col: 4},
        {symbol: 'Nd', name: '钕', number: 60, row: 8, col: 5},
        {symbol: 'Pm', name: '钷', number: 61, row: 8, col: 6},
        {symbol: 'Sm', name: '钐', number: 62, row: 8, col: 7},
        {symbol: 'Eu', name: '铕', number: 63, row: 8, col: 8},
        {symbol: 'Gd', name: '钆', number: 64, row: 8, col: 9},
        {symbol: 'Tb', name: '铽', number: 65, row: 8, col: 10},
        {symbol: 'Dy', name: '镝', number: 66, row: 8, col: 11},
        {symbol: 'Ho', name: '钬', number: 67, row: 8, col: 12},
        {symbol: 'Er', name: '铒', number: 68, row: 8, col: 13},
        {symbol: 'Tm', name: '铥', number: 69, row: 8, col: 14},
        {symbol: 'Yb', name: '镱', number: 70, row: 8, col: 15},
        {symbol: 'Lu', name: '镏', number: 71, row: 8, col: 16},
        // 锕系元素（第9行）
        {symbol: 'Th', name: '钍', number: 90, row: 9, col: 3},
        {symbol: 'Pa', name: '镤', number: 91, row: 9, col: 4},
        {symbol: 'U', name: '铀', number: 92, row: 9, col: 5},
        {symbol: 'Np', name: '镎', number: 93, row: 9, col: 6},
        {symbol: 'Pu', name: '钚', number: 94, row: 9, col: 7},
        {symbol: 'Am', name: '镅', number: 95, row: 9, col: 8},
        {symbol: 'Cm', name: '锔', number: 96, row: 9, col: 9},
        {symbol: 'Bk', name: '锫', number: 97, row: 9, col: 10},
        {symbol: 'Cf', name: '锎', number: 98, row: 9, col: 11},
        {symbol: 'Es', name: '锿', number: 99, row: 9, col: 12},
        {symbol: 'Fm', name: '镄', number: 100, row: 9, col: 13},
        {symbol: 'Md', name: '钔', number: 101, row: 9, col: 14},
        {symbol: 'No', name: '锘', number: 102, row: 9, col: 15},
        {symbol: 'Lr', name: '铹', number: 103, row: 9, col: 16}
    ];

    const targetElements = ['Ra', 'Pa', 'Sb']; // 镭、镤、锑
    let selectedElements = [];

    container.innerHTML = `
        <h2>第 6 关 - 找字就行</h2>
        <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 20px; font-weight: bold;">依次点击啥来着？</p>
            <p style="font-size: 18px; color: #ff0000; margin-top: 10px; font-weight: bold;">已选择：<span id="level6-selected"></span></p>
        </div>
        <div id="level6-table" style="display: grid; grid-template-columns: repeat(18, 45px); grid-gap: 2px; margin: 20px auto; justify-content: center; font-size: 11px;">
        </div>
    `;

    const table = document.getElementById('level6-table');

    // 创建一个18x10的网格（7个主周期 + 2个系元素 + 1个空行）
    for (let i = 0; i < 10 * 18; i++) {
        const cell = document.createElement('div');
        cell.style.cssText = `
            width: 45px;
            height: 45px;
            border: 1px solid #ddd;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            background-color: #f9f9f9;
        `;
        table.appendChild(cell);
    }

    // 填充元素
    elements.forEach(elem => {
        const index = elem.row * 18 + elem.col;
        const cell = table.children[index];
        cell.innerHTML = `
            <div style="font-weight: bold; font-size: 11px;">${elem.symbol}</div>
            <div style="font-size: 8px; color: #666;">${elem.number}</div>
            <div style="font-size: 9px; color: #666;">${elem.name}</div>
        `;
        cell.style.backgroundColor = '#fff';
        cell.style.border = '2px solid #000';
        cell.style.cursor = 'pointer';
        cell.dataset.symbol = elem.symbol;

        cell.addEventListener('click', function() {
            const symbol = this.dataset.symbol;

            if (selectedElements.length < targetElements.length) {
                const expectedSymbol = targetElements[selectedElements.length];

                if (symbol === expectedSymbol) {
                    // 正确选择
                    selectedElements.push(symbol);
                    this.style.backgroundColor = '#ccffcc';
                    document.getElementById('level6-selected').textContent = selectedElements.join(', ');

                    if (selectedElements.length === targetElements.length) {
                        isInLevel = false;
                        setTimeout(() => {
                            alert('恭喜通过第 6 关！');
                            completeLevel(6);
                        }, 500);
                    }
                } else {
                    // 选错了
                    alert(`选错了！应该选择 ${targetElements[selectedElements.length]}`);
                    isInLevel = false;
                    logout();
                }
            }
        });
    });
}

// ========== 第七关：打字游戏 ==========
function startLevel7(container) {
    const targetText = 'tianqingseDENGyanyuerwozaiDENGni';
    let currentIndex = 0;
    let timeLeft = 15;
    let gameActive = true;

    container.innerHTML = `
        <h2>第 7 关 - 打字就行</h2>
        <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 32px; font-weight: bold;">剩余时间：<span id="level7-timer" style="color: #ff0000;">${timeLeft}</span> 秒</p>
        </div>
        <div style="margin: 20px 0; padding: 20px; border: 2px solid #000;">
            <p style="font-size: 16px; color: #000; margin-bottom: 10px; font-weight: bold;">请依次输入以下字符（区分大小写）：</p>
            <p style="font-size: 18px; font-family: monospace; word-break: break-all; margin-bottom: 20px; font-weight: bold;">
                ${targetText}
            </p>
            <div style="font-size: 18px; font-family: monospace; min-height: 35px; padding: 10px; background-color: #f9f9f9; border: 2px solid #000;">
                <span id="level7-input"></span><span id="level7-cursor" style="border-right: 2px solid #000; animation: blink 1s infinite;">​</span>
            </div>
            <p style="font-size: 16px; color: #ff0000; margin-top: 15px; font-weight: bold;">请直接使用键盘输入，不能删除</p>
        </div>
    `;

    const inputDisplay = document.getElementById('level7-input');
    const timerDisplay = document.getElementById('level7-timer');

    // 倒计时
    const countdown = setInterval(() => {
        if (!gameActive) {
            clearInterval(countdown);
            return;
        }

        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            if (gameActive) {
                alert('时间到！');
                isInLevel = false;
                logout();
            }
        }
    }, 1000);

    // 监听键盘输入
    function handleKeyPress(e) {
        if (!gameActive) return;

        const char = e.key;

        // 忽略特殊键
        if (char.length > 1) return;

        e.preventDefault();

        const expectedChar = targetText[currentIndex];

        if (char === expectedChar) {
            currentIndex++;
            inputDisplay.textContent += char;

            if (currentIndex === targetText.length) {
                gameActive = false;
                clearInterval(countdown);
                isInLevel = false;
                setTimeout(() => {
                    alert('恭喜通过第 7 关！');
                    completeLevel(7);
                }, 100);
            }
        } else {
            gameActive = false;
            clearInterval(countdown);
            alert('你打错了！');
            isInLevel = false;
            logout();
        }
    }

    document.addEventListener('keypress', handleKeyPress);

    // 清理事件监听
    setTimeout(() => {
        if (!gameActive) {
            document.removeEventListener('keypress', handleKeyPress);
        }
    }, 20000);
}

// ========== 第八关：注意力训练（点击1-50） ==========
function startLevel8(container) {
    let currentTarget = 1;
    const maxTarget = 50;

    container.innerHTML = `
        <h2>第 8 关 - 找数字就行</h2>
        <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold;">请依次点击：<span id="level8-target" style="font-weight: bold; font-size: 32px; color: #ff0000;">1</span></p>
        </div>
        <canvas id="level8-canvas" width="600" height="600" style="display: block; margin: 20px auto; border: 2px solid #000;"></canvas>
    `;

    const canvas = document.getElementById('level8-canvas');
    const ctx = canvas.getContext('2d');
    const targetDisplay = document.getElementById('level8-target');

    // 创建注意力训练图
    createAttentionGrid(canvas, ctx);

    function createAttentionGrid(canvas, ctx) {
        const centerX = 300;
        const centerY = 300;
        const maxRadius = 280;

        // 生成1-50的随机数字数组
        const numbers = [];
        for (let i = 1; i <= maxTarget; i++) {
            numbers.push(i);
        }
        numbers.sort(() => Math.random() - 0.5);

        // 定义50个区域 - 使用多层同心圆分割
        // 5层，每层10个扇形
        const regions = [];
        const layers = 5; // 5层
        const sectorsPerLayer = 10; // 每层10个扇形
        const angleStep = (Math.PI * 2) / sectorsPerLayer;

        let numberIndex = 0;

        // 找到30、31、32的索引并从数组中移除
        const idx30 = numbers.indexOf(30);
        const idx31 = numbers.indexOf(31);
        const idx32 = numbers.indexOf(32);
        numbers.splice(idx30, 1);
        numbers.splice(numbers.indexOf(31), 1);
        numbers.splice(numbers.indexOf(32), 1);

        for (let layer = 0; layer < layers; layer++) {
            const innerRadius = (maxRadius / layers) * layer;
            const outerRadius = (maxRadius / layers) * (layer + 1);

            for (let sector = 0; sector < sectorsPerLayer; sector++) {
                // 外圈（第4层）的前三个扇形（0、1、2）固定为30、31、32
                let currentNumber;
                if (layer === 4 && sector === 0) {
                    currentNumber = 30;
                } else if (layer === 4 && sector === 1) {
                    currentNumber = 31;
                } else if (layer === 4 && sector === 2) {
                    currentNumber = 32;
                } else {
                    currentNumber = numbers[numberIndex++];
                }

                // 添加随机扭曲
                const startAngle = sector * angleStep + (Math.random() - 0.5) * 0.15;
                const endAngle = (sector + 1) * angleStep + (Math.random() - 0.5) * 0.15;
                const adjustedInnerRadius = innerRadius + (Math.random() - 0.5) * 10;
                const adjustedOuterRadius = outerRadius + (Math.random() - 0.5) * 10;

                regions.push({
                    number: currentNumber,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    innerRadius: Math.max(0, adjustedInnerRadius),
                    outerRadius: adjustedOuterRadius,
                    layer: layer,
                    sector: sector
                });
            }
        }

        // 绘制所有区域
        regions.forEach((region) => {
            // 绘制扇形区域
            ctx.beginPath();

            if (region.innerRadius === 0) {
                // 中心区域（圆形）
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, region.outerRadius, region.startAngle, region.endAngle);
                ctx.lineTo(centerX, centerY);
            } else {
                // 扇环
                ctx.arc(centerX, centerY, region.outerRadius, region.startAngle, region.endAngle);
                ctx.arc(centerX, centerY, region.innerRadius, region.endAngle, region.startAngle, true);
            }
            ctx.closePath();

            // 填充颜色
            ctx.fillStyle = '#f9f9f9';
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // 计算数字位置（在扇形中间）
            const midAngle = (region.startAngle + region.endAngle) / 2;
            const midRadius = region.innerRadius === 0
                ? region.outerRadius / 2
                : (region.innerRadius + region.outerRadius) / 2;
            const textX = centerX + midRadius * Math.cos(midAngle);
            const textY = centerY + midRadius * Math.sin(midAngle);

            // 绘制数字
            ctx.fillStyle = '#000';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(region.number, textX, textY);
        });

        // 点击事件
        canvas.addEventListener('click', function(e) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 转换为相对于圆心的坐标
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += Math.PI * 2;

            // 查找点击的区域
            for (let region of regions) {
                let startAngle = region.startAngle;
                let endAngle = region.endAngle;

                // 归一化角度
                while (startAngle < 0) startAngle += Math.PI * 2;
                while (endAngle < 0) endAngle += Math.PI * 2;
                while (startAngle >= Math.PI * 2) startAngle -= Math.PI * 2;
                while (endAngle >= Math.PI * 2) endAngle -= Math.PI * 2;

                let inAngleRange = false;
                if (startAngle <= endAngle) {
                    inAngleRange = (angle >= startAngle && angle <= endAngle);
                } else {
                    inAngleRange = (angle >= startAngle || angle <= endAngle);
                }

                const inRadiusRange = distance >= region.innerRadius && distance <= region.outerRadius;

                if (inAngleRange && inRadiusRange) {
                    if (region.number === currentTarget) {
                        // 正确点击，不改变颜色，只更新目标数字
                        currentTarget++;
                        targetDisplay.textContent = currentTarget;

                        // 如果点击了30，立即交换31和32的位置
                        if (region.number === 30) {
                            const region31 = regions.find(r => r.number === 31);
                            const region32 = regions.find(r => r.number === 32);

                            if (region31 && region32) {
                                // 交换数字
                                region31.number = 32;
                                region32.number = 31;

                                // 重新绘制整个画布
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                redrawAllRegions();
                            }
                        }

                        if (currentTarget > maxTarget) {
                            isInLevel = false;
                            setTimeout(() => {
                                alert('恭喜通过第 8 关！');
                                completeLevel(8);
                            }, 100);
                        }
                    } else {
                        alert('你点错了！');
                        isInLevel = false;
                        logout();
                    }
                    break;
                }
            }
        });

        // 重新绘制所有区域的函数
        function redrawAllRegions() {
            regions.forEach((region) => {
                // 绘制扇形区域
                ctx.beginPath();

                if (region.innerRadius === 0) {
                    // 中心区域（圆形）
                    ctx.moveTo(centerX, centerY);
                    ctx.arc(centerX, centerY, region.outerRadius, region.startAngle, region.endAngle);
                    ctx.lineTo(centerX, centerY);
                } else {
                    // 扇环
                    ctx.arc(centerX, centerY, region.outerRadius, region.startAngle, region.endAngle);
                    ctx.arc(centerX, centerY, region.innerRadius, region.endAngle, region.startAngle, true);
                }
                ctx.closePath();

                // 填充颜色
                ctx.fillStyle = '#f9f9f9';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // 计算数字位置（在扇形中间）
                const midAngle = (region.startAngle + region.endAngle) / 2;
                const midRadius = region.innerRadius === 0
                    ? region.outerRadius / 2
                    : (region.innerRadius + region.outerRadius) / 2;
                const textX = centerX + midRadius * Math.cos(midAngle);
                const textY = centerY + midRadius * Math.sin(midAngle);

                // 绘制数字
                ctx.fillStyle = '#000';
                ctx.font = 'bold 18px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(region.number, textX, textY);
            });
        }
    }
}

// ========== 第九关：歌词连线 ==========
function startLevel9(container) {
    const lyrics = [
        { id: 1, text: '像雨水', answer: [5] },
        { id: 2, text: '不留情', answer: [4] },
        { id: 3, text: '爱一天', answer: [1, 2] }, // 必须同时连接1和2
        { id: 4, text: '进不来', answer: [3] }
    ];

    const songs = [
        { id: 1, text: '晴天' },
        { id: 2, text: '江南' },
        { id: 3, text: '花海' },
        { id: 4, text: '爱错' },
        { id: 5, text: '七里香' }
    ];

    let connections = {}; // { lyricId: [songId1, songId2, ...] }
    let selectedLyric = null;

    container.innerHTML = `
        <h2>第 9 关 - 哼下歌就行</h2>
        <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 20px; font-weight: bold;">将左侧歌词与右侧歌曲名连线</p>
            <p style="font-size: 18px; color: #ff0000; margin-top: 10px; font-weight: bold;">先点击歌词，再点击对应的歌曲名</p>
        </div>
        <div style="position: relative;">
            <svg id="level9-lines" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
            </svg>
            <div style="display: flex; justify-content: space-around; margin: 40px 20px; position: relative; z-index: 2;">
                <div id="level9-lyrics" style="flex: 1;">
                    <h3 style="text-align: center; margin-bottom: 20px;">歌词</h3>
                    ${lyrics.map(l => `
                        <div class="lyric-item" data-id="${l.id}" style="padding: 15px; margin: 10px; border: 2px solid #000; cursor: pointer; background-color: #fff;">
                            ${l.id}、${l.text}
                        </div>
                    `).join('')}
                    <div class="lyric-item fake-item" style="padding: 15px; margin: 10px; border: 2px solid #000; cursor: pointer; background-color: #fff;">
                        5、别点我
                    </div>
                </div>
                <div id="level9-songs" style="flex: 1;">
                    <h3 style="text-align: center; margin-bottom: 20px;">歌曲名</h3>
                    ${songs.map(s => `
                        <div class="song-item" data-id="${s.id}" style="padding: 15px; margin: 10px; border: 2px solid #000; cursor: pointer; background-color: #fff;">
                            ${s.id}、${s.text}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 18px; color: #000; font-weight: bold;" id="level9-status">请开始连线</p>
            <button class="btn-primary" style="margin-top: 20px; width: auto; padding: 12px 40px;" onclick="checkLevel9Connections()">
                确认答案
            </button>
        </div>
    `;

    // 歌词点击
    document.querySelectorAll('.lyric-item').forEach(item => {
        item.addEventListener('click', function() {
            // 点到"别点我"直接退出登录
            if (this.classList.contains('fake-item')) {
                alert('让你别点我你还点！');
                isInLevel = false;
                logout();
                return;
            }

            document.querySelectorAll('.lyric-item').forEach(i => {
                i.style.backgroundColor = '#fff';
            });
            this.style.backgroundColor = '#ffeecc';
            selectedLyric = parseInt(this.dataset.id);
            document.getElementById('level9-status').textContent = `已选择歌词：${this.textContent}，请点击对应的歌曲`;
        });
    });

    // 歌曲点击
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', function() {
            if (selectedLyric === null) {
                alert('请先选择一个歌词');
                return;
            }

            const songId = parseInt(this.dataset.id);

            // 初始化该歌词的连接数组
            if (!connections[selectedLyric]) {
                connections[selectedLyric] = [];
            }

            // 检查是否已经连接过这首歌
            if (connections[selectedLyric].includes(songId)) {
                alert('已经连接过这首歌了！');
                return;
            }

            // 添加连接
            connections[selectedLyric].push(songId);

            // 更新状态文字
            const connectedSongs = connections[selectedLyric].map(id =>
                songs.find(s => s.id === id).text
            ).join('、');
            document.getElementById('level9-status').textContent = `已连接：歌词${selectedLyric} → ${connectedSongs}`;

            // 标记已连接的歌词
            document.querySelector(`.lyric-item[data-id="${selectedLyric}"]`).style.backgroundColor = '#ccffcc';

            // 绘制连线
            drawLine(selectedLyric, songId);

            selectedLyric = null;
        });
    });

    // 绘制连线函数
    function drawLine(lyricId, songId) {
        const lyricElement = document.querySelector(`.lyric-item[data-id="${lyricId}"]`);
        const songElement = document.querySelector(`.song-item[data-id="${songId}"]`);
        const svg = document.getElementById('level9-lines');

        if (!lyricElement || !songElement || !svg) return;

        // 获取元素位置
        const lyricRect = lyricElement.getBoundingClientRect();
        const songRect = songElement.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();

        // 计算连线起点和终点（相对于SVG）
        const x1 = lyricRect.right - svgRect.left;
        const y1 = lyricRect.top + lyricRect.height / 2 - svgRect.top;
        const x2 = songRect.left - svgRect.left;
        const y2 = songRect.top + songRect.height / 2 - svgRect.top;

        // 创建线条
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#000');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('data-lyric', lyricId);
        line.setAttribute('data-song', songId);

        // 检查是否已经存在相同的连线（lyric-song组合）
        const existingLine = svg.querySelector(`line[data-lyric="${lyricId}"][data-song="${songId}"]`);
        if (existingLine) {
            return; // 已经存在，不重复添加
        }

        svg.appendChild(line);
    }

    // 保存验证函数到全局
    window.checkLevel9Connections = function() {
        // 检查是否所有歌词都连接了
        for (let lyric of lyrics) {
            if (!connections[lyric.id] || connections[lyric.id].length === 0) {
                alert('请完成所有连线');
                return;
            }
        }

        // 验证答案
        let correct = true;
        for (let lyric of lyrics) {
            const userAnswers = connections[lyric.id] || [];
            const correctAnswers = lyric.answer;

            // 检查用户连接的数量和内容是否完全匹配
            if (userAnswers.length !== correctAnswers.length) {
                correct = false;
                break;
            }

            // 检查每个答案是否都在正确答案中
            for (let ans of userAnswers) {
                if (!correctAnswers.includes(ans)) {
                    correct = false;
                    break;
                }
            }

            if (!correct) break;
        }

        if (correct) {
            isInLevel = false;
            alert('恭喜通过第 9 关！');
            completeLevel(9);
        } else {
            alert('答案错误！');
            isInLevel = false;
            logout();
        }
    };
}

// ========== 第十关：贪吃蛇咬自己 ==========
function startLevel10(container) {
    const gridSize = 20;
    const cellSize = 20;
    let snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    let direction = {x: 1, y: 0};
    let nextDirection = {x: 1, y: 0};
    let food = null;
    let biteCount = 0;
    const targetBites = 5;
    let gameLoop = null;
    let gameActive = true;

    container.innerHTML = `
        <h2>第 10 关 - 自杀就行</h2>
        <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold;">让贪吃蛇咬到自己：<span id="level10-count" style="font-weight: bold; color: #ff0000; font-size: 32px;">${biteCount}</span> / ${targetBites}</p>
            <p style="font-size: 18px; color: #000; font-weight: bold; margin-top: 10px;">使用方向键控制，吃果实变长，咬到自己计数</p>
        </div>
        <div style="display: flex; justify-content: center;">
            <canvas id="level10-canvas" width="${gridSize * cellSize}" height="${gridSize * cellSize}"
                    style="border: 2px solid #000; background-color: #f9f9f9;"></canvas>
        </div>
    `;

    const canvas = document.getElementById('level10-canvas');
    const ctx = canvas.getContext('2d');
    const countDisplay = document.getElementById('level10-count');

    // 生成食物
    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

        food = newFood;
    }

    generateFood();

    // 绘制游戏
    function draw() {
        // 清空画布
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制蛇
        ctx.fillStyle = '#000';
        snake.forEach((segment, index) => {
            ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 1, cellSize - 1);
        });

        // 绘制食物
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 1, cellSize - 1);
    }

    // 游戏更新
    function update() {
        if (!gameActive) return;

        direction = nextDirection;

        // 计算新头部位置
        const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

        // 检查撞墙
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            gameActive = false;
            clearInterval(gameLoop);
            alert('让你咬死自己不是撞死自己你盐津虾吗');
            isInLevel = false;
            logout();
            return;
        }

        // 检查咬到自己
        const biteSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);

        if (biteSelf) {
            // 找到咬到的位置，删除后面的部分，再多删除两个块
            const biteIndex = snake.findIndex(segment => segment.x === head.x && segment.y === head.y);
            // 咬到的位置往前再减2个块（如果有的话）
            const cutIndex = Math.max(0, biteIndex - 2);
            snake = snake.slice(0, cutIndex);
            biteCount++;
            countDisplay.textContent = biteCount;

            if (biteCount >= targetBites) {
                gameActive = false;
                clearInterval(gameLoop);
                isInLevel = false;
                setTimeout(() => {
                    alert('恭喜通过第 10 关！');
                    completeLevel(10);
                }, 500);
                return;
            }

            // 添加新头部
            snake.unshift(head);
        } else {
            // 添加新头部
            snake.unshift(head);

            // 检查是否吃到食物
            if (head.x === food.x && head.y === food.y) {
                generateFood();
            } else {
                // 没吃到食物，移除尾部
                snake.pop();
            }
        }

        draw();
    }

    // 键盘控制
    function handleKeyDown(e) {
        if (!gameActive) return;

        switch(e.key) {
            case 'ArrowUp':
                if (direction.y === 0) nextDirection = {x: 0, y: -1};
                e.preventDefault();
                break;
            case 'ArrowDown':
                if (direction.y === 0) nextDirection = {x: 0, y: 1};
                e.preventDefault();
                break;
            case 'ArrowLeft':
                if (direction.x === 0) nextDirection = {x: -1, y: 0};
                e.preventDefault();
                break;
            case 'ArrowRight':
                if (direction.x === 0) nextDirection = {x: 1, y: 0};
                e.preventDefault();
                break;
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    // 初始绘制
    draw();

    // 开始游戏循环
    gameLoop = setInterval(update, 150);
}

