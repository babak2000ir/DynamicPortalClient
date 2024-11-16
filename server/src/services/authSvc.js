import validator from 'validator';

export const login = async (ctx) => {
    const { email, password } = ctx.request.body;

    // Sanitize input
    const sanitizedEmail = validator.trim(validator.escape(email));
    const sanitizedPassword = validator.trim(validator.escape(password));

    // Validate input
    if (!validator.isEmail(sanitizedEmail)) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid email format.' };
        return;
    }

    if (validator.isEmpty(sanitizedPassword)) {
        ctx.status = 400;
        ctx.body = { error: 'Password cannot be empty.' };
        return;
    }

    console.log(`Login user: ${sanitizedEmail}`);
    await routeHandler('LoginUser', {
        "pUserEmail": sanitizedEmail,
        "pPassword": sanitizedPassword,
    }, ctx, 'post');
}

export const loadUser = async (ctx) => {
    console.log(`Login Token: ${ctx.request.body.token}`);
    await routeHandler('LoadUser', {
        "pToken": ctx.request.body.token,
    }, ctx, 'post');
}

export const setPassword = async (ctx) => {
    const { userId, password } = ctx.request.body;

    // Sanitize input
    const sanitizedUserId = validator.trim(validator.escape(userId));
    const sanitizedPassword = validator.trim(validator.escape(password));

    // Validate input
    if (validator.isEmpty(sanitizedUserId)) {
        ctx.status = 400;
        ctx.body = { error: 'User ID cannot be empty.' };
        return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    if (!passwordRegex.test(sanitizedPassword)) {
        ctx.status = 400;
        ctx.body = { error: 'Password must be at least 7 characters long, include at least one uppercase letter, one number, and one special character.' };
        return;
    }

    console.log('set password');
    await routeHandler('SetPassword', {
        "pUserId": sanitizedUserId,
        "pPassword": sanitizedPassword,
    }, ctx, 'post');
}