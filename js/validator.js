// 输入验证逻辑

const Validator = {
    // 验证账号名：10-100个中文字，不得有重复字
    validateUsername(username) {
        // 检查是否为空
        if (!username || username.trim() === '') {
            return { valid: false, message: '账号名不能为空' };
        }

        // 检查是否全是中文
        const chineseRegex = /^[\u4e00-\u9fa5]+$/;
        if (!chineseRegex.test(username)) {
            return { valid: false, message: '账号名必须全部是中文字符' };
        }

        // 检查长度
        const length = username.length;
        if (length < 10) {
            return { valid: false, message: `账号名不得少于10个字，当前${length}个字` };
        }
        if (length > 100) {
            return { valid: false, message: `账号名不得超过100个字，当前${length}个字` };
        }

        // 检查是否有重复字
        const chars = username.split('');
        const uniqueChars = [...new Set(chars)];
        if (chars.length !== uniqueChars.length) {
            // 找出重复的字
            const charCount = {};
            const duplicates = [];
            for (let char of chars) {
                charCount[char] = (charCount[char] || 0) + 1;
                if (charCount[char] === 2) {
                    duplicates.push(char);
                }
            }
            return { 
                valid: false, 
                message: `账号名不得有重复字，重复的字：${duplicates.join('、')}` 
            };
        }

        return { valid: true, message: '账号名符合要求！' };
    },

    // 验证密码：正好10个字符，必须含有大写字母、小写字母、数字、特殊字符
    validatePassword(password) {
        // 检查是否为空
        if (!password) {
            return { valid: false, message: '密码不能为空' };
        }

        // 检查长度是否正好10个字符
        if (password.length !== 10) {
            return { 
                valid: false, 
                message: `密码必须正好10个字符，当前${password.length}个字符` 
            };
        }

        // 检查是否包含大写字母
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: '密码必须包含至少一个大写字母' };
        }

        // 检查是否包含小写字母
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: '密码必须包含至少一个小写字母' };
        }

        // 检查是否包含数字
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: '密码必须包含至少一个数字' };
        }

        // 检查是否包含特殊字符
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            return { valid: false, message: '密码必须包含至少一个特殊字符（如 !@#$%^&* 等）' };
        }

        return { valid: true, message: '密码符合要求！' };
    },

    // 比较两个密码是否相同
    comparePasswords(password1, password2) {
        return password1 === password2;
    }
};

