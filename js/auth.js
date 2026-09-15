// 注册和登录逻辑

// 注册流程的状态
let registerState = {
    phone: '',
    address: '',
    username: '',
    usernameConfirmed: false,
    password: '',
    passwordConfirmed: false,
    password1Confirmed: false,
    password2Confirmed: false
};

// 验证账号名
function validateUsername() {
    const username = document.getElementById('register-username').value;
    const hint = document.getElementById('username-hint');
    
    const result = Validator.validateUsername(username);
    hint.textContent = result.message;
    hint.style.color = result.valid ? '#00aa00' : '#ff0000';
    
    if (result.valid) {
        registerState.username = username;
        registerState.usernameConfirmed = true;
        document.getElementById('register-username').disabled = true;
    }
}

// 切换密码可见性（小眼睛按钮）
function togglePasswordVisibility() {
    alert('不给看');
}

// 验证密码
function validatePassword() {
    const password = document.getElementById('register-password').value;
    const hint = document.getElementById('password-hint');

    const result = Validator.validatePassword(password);
    hint.textContent = result.message;
    hint.style.color = result.valid ? '#00aa00' : '#ff0000';

    if (result.valid) {
        registerState.password = password;
        registerState.passwordConfirmed = true;
        // 不要禁用输入框，允许用户修改
        // document.getElementById('register-password').disabled = true;

        // 显示第一次确认密码的输入框
        document.getElementById('confirm-password-1-group').style.display = 'block';
    }
}

// 第一次确认密码
function confirmPassword1() {
    const password1 = document.getElementById('confirm-password-1').value;
    const hint = document.getElementById('confirm1-hint');
    
    if (password1 === '') {
        hint.textContent = '请输入密码';
        hint.style.color = '#ff0000';
        return;
    }
    
    if (password1 !== registerState.password) {
        hint.textContent = '密码不一致，请重新输入';
        hint.style.color = '#ff0000';
        document.getElementById('confirm-password-1').value = '';
        return;
    }
    
    // 第一次显示"你确定和原来密码一样？"的提示
    if (!registerState.password1Confirmed) {
        hint.textContent = '感觉不对啊，重新输一遍试试';
        hint.style.color = '#ff6600';
        registerState.password1Confirmed = true;
        return;
    }
    
    // 第二次点击才通过
    hint.textContent = '确认成功！';
    hint.style.color = '#00aa00';
    document.getElementById('confirm-password-1').disabled = true;
    
    // 显示第二次确认密码的输入框
    document.getElementById('confirm-password-2-group').style.display = 'block';
}

// 第二次确认密码
function confirmPassword2() {
    const password2 = document.getElementById('confirm-password-2').value;
    const hint = document.getElementById('confirm2-hint');
    
    if (password2 === '') {
        hint.textContent = '请输入密码';
        hint.style.color = '#ff0000';
        return;
    }
    
    if (password2 !== registerState.password) {
        hint.textContent = '密码不一致，请重新输入';
        hint.style.color = '#ff0000';
        document.getElementById('confirm-password-2').value = '';
        return;
    }
    
    // 第一次显示"你确定和原来密码一样？"的提示
    if (!registerState.password2Confirmed) {
        hint.textContent = '感觉不对啊，重新输一遍试试';
        hint.style.color = '#ff6600';
        registerState.password2Confirmed = true;
        return;
    }
    
    // 第二次点击才通过
    hint.textContent = '确认成功！所有信息填写完毕';
    hint.style.color = '#00aa00';
    document.getElementById('confirm-password-2').disabled = true;
    
    // 显示注册完成按钮
    document.getElementById('register-submit-btn').style.display = 'block';
}

// 完成注册
function completeRegistration() {
    registerState.phone = document.getElementById('register-phone').value;
    registerState.address = document.getElementById('register-address').value;
    
    if (!registerState.phone || !registerState.address) {
        alert('请填写手机号码和家庭地址');
        return;
    }
    
    // 保存账号信息
    Storage.saveAccount({
        phone: registerState.phone,
        address: registerState.address,
        username: registerState.username,
        password: registerState.password,
        createdAt: new Date().toISOString()
    });
    
    // 生成公告内容
    generateAnnouncement();
    
    alert('账号注册成功！请登录');
    switchScreen('login-screen');
    
    // 重置注册状态
    resetRegisterForm();
}

// 重置注册表单
function resetRegisterForm() {
    registerState = {
        phone: '',
        address: '',
        username: '',
        usernameConfirmed: false,
        password: '',
        passwordConfirmed: false,
        password1Confirmed: false,
        password2Confirmed: false
    };
    
    document.getElementById('register-phone').value = '';
    document.getElementById('register-address').value = '';
    document.getElementById('register-username').value = '';
    document.getElementById('register-username').disabled = false;
    document.getElementById('register-password').value = '';
    document.getElementById('register-password').disabled = false;
    document.getElementById('confirm-password-1').value = '';
    document.getElementById('confirm-password-1').disabled = false;
    document.getElementById('confirm-password-2').value = '';
    document.getElementById('confirm-password-2').disabled = false;

    document.getElementById('username-hint').textContent = '';
    document.getElementById('password-hint').textContent = '';
    document.getElementById('confirm1-hint').textContent = '';
    document.getElementById('confirm2-hint').textContent = '';

    document.getElementById('confirm-password-1-group').style.display = 'none';
    document.getElementById('confirm-password-2-group').style.display = 'none';
    document.getElementById('register-submit-btn').style.display = 'none';
}

// 生成公告内容
function generateAnnouncement() {
    const announcement = `作者很无聊，就读于华中科技大学，爱玩王者荣耀，爱吃牛肉面
    
    抖音名是灰灰，不爱学习从不内卷，感谢你这个神入来玩我制作的无聊小游戏，这个游戏不会有
    
    广告给你们看，对你们好吧，所以请认真对待游戏中的每一个关卡，即使作者不会认真制作这个游戏

    好的，开始享受这坨精妙绝伦游戏吧`;

    const answers = {
        question1: '王者荣耀，牛肉面',
        question2: '广告，灰灰'
    };

    Storage.saveAnnouncement(announcement, [answers.question1, answers.question2]);
}

// 显示公告
function showAnnouncement() {
    const announcement = Storage.getAnnouncement();
    if (!announcement) {
        generateAnnouncement();
    }

    document.getElementById('announcement-text').textContent = Storage.getAnnouncement();
    document.getElementById('announcement-modal').classList.add('active');
}

// 关闭公告
function closeAnnouncement() {
    document.getElementById('announcement-modal').classList.remove('active');
}

// 登录
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // 检查"记住账号和密码"选项
    if (rememberMe) {
        alert('作者不想帮你们记住');
        document.getElementById('remember-me').checked = false;
        return;
    }

    const account = Storage.getAccount();

    if (!account) {
        alert('账号不存在，请先注册');
        return;
    }

    if (username !== account.username || password !== account.password) {
        alert('账号或密码错误，请重新输入');
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        return;
    }

    // 登录成功，增加登录次数
    Storage.incrementLoginCount();

    // 进入考核界面
    switchScreen('exam-screen');
    setupExam();
}

// 忘记密码
function forgotPassword() {
    alert('作者没有做这个功能，你重新注册一个账号吧');

    // 删除账号和进度
    Storage.deleteAccount();

    // 回到注册界面
    switchScreen('register-screen');
}

// 退出登录
function logout() {
    // 清空登录表单
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';

    switchScreen('login-screen');
}

// 设置考核题目
function setupExam() {
    const answers = Storage.getAnswers();

    // 随机选择一道题目（0或1）
    const selectedQuestion = Math.floor(Math.random() * 2);

    // 保存当前选择的题目和答案到全局变量
    window.currentExamQuestion = selectedQuestion;
    window.currentExamAnswer = answers[selectedQuestion];

    if (selectedQuestion === 0) {
        // 显示第一题
        document.getElementById('question-1-label').textContent = '问题：这个游戏的作者喜欢玩什么？喜欢吃什么（4+3个字，逗号隔开）';
    } else {
        // 显示第二题
        document.getElementById('question-1-label').textContent = '问题：这个游戏没有什么？作者抖音名是什么（2+2个字，逗号隔开）';
    }

    // 隐藏第二个问题
    document.getElementById('question-2-group').style.display = 'none';

    document.getElementById('answer-1').value = '';
    document.getElementById('exam-hint').textContent = '';
}

// 提交考核答案
function submitExam() {
    const answer1 = document.getElementById('answer-1').value.trim();

    if (answer1 !== window.currentExamAnswer) {
        document.getElementById('exam-hint').textContent = '答案错误！请点击退出登录回到登录界面查看公告';
        document.getElementById('exam-hint').style.color = '#ff0000';
        return;
    }

    document.getElementById('exam-hint').textContent = '考核通过！正在进入游戏...';
    document.getElementById('exam-hint').style.color = '#00aa00';

    setTimeout(() => {
        switchScreen('game-screen');
        initGameScreen();
    }, 1000);
}

