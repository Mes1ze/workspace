module.exports = function(status = 500, content = null, tokens = null) {

    let result = null

    switch (status) {
        case 200:
            result = {
                status: {
                    text: 'success',
                    number: 200
                }, 
                content: content,
                tokens: tokens
            }
            break;

        case 400:
            result = {
                status: {
                    text: 'error',
                    number: 400
                }, 
                content: {
                    message: content
                },
                tokens: tokens
            }
            break;

        case 401:
            result = {
                status: {
                    text: 'error',
                    number: 401
                }, 
                content: {
                    message: 'Пользователь не авторизован'
                },
                tokens: tokens
            }
            break;

        case 403:
            result = {
                status: {
                    text: 'error',
                    number: 403
                }, 
                content: {
                    message: content
                },
                tokens: tokens
            }
            break;

        case 404:
            result = {
                status: {
                    text: 'error',
                    number: 404
                }, 
                content: content ? { message: content } : null,
                tokens: tokens
            }
            break;
        default:
            result = {
                status: {
                    text: 'error',
                    number: 500
                }, 
                content: {
                    message: 'Внутренняя ошибка сервера'
                },
                tokens: tokens
            }
            break;
    }

    return result
}