"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (!options.email.includes('@')) {
        return [{
                field: 'email',
                message: 'invalid email'
            }];
    }
    if (options.username.length <= 2) {
        return [{
                field: 'username',
                message: 'length must be greater than two.'
            }];
    }
    if (options.username.includes('@')) {
        return [{
                field: 'username',
                message: 'cannot include an @'
            }];
    }
    if (options.password.length <= 3) {
        return [{
                field: 'password',
                message: 'length must be greater than three.'
            }];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map