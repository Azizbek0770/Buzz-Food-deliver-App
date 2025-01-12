export const handleApiError = (error) => {
    if (error.response) {
        // Server xatosi
        const { status, data } = error.response;
        
        switch (status) {
            case 400:
                return {
                    type: 'VALIDATION_ERROR',
                    message: data.message || 'Noto\'g\'ri so\'rov yuborildi',
                    errors: data.errors || {}
                };
            
            case 401:
                return {
                    type: 'AUTH_ERROR',
                    message: 'Avtorizatsiyadan o\'tilmagan'
                };
            
            case 403:
                return {
                    type: 'PERMISSION_ERROR',
                    message: 'Ruxsat berilmagan'
                };
            
            case 404:
                return {
                    type: 'NOT_FOUND',
                    message: 'Ma\'lumot topilmadi'
                };
            
            case 422:
                return {
                    type: 'VALIDATION_ERROR',
                    message: 'Validatsiya xatosi',
                    errors: data.errors || {}
                };
            
            case 429:
                return {
                    type: 'RATE_LIMIT_ERROR',
                    message: 'So\'rovlar soni limitdan oshib ketdi'
                };
            
            case 500:
                return {
                    type: 'SERVER_ERROR',
                    message: 'Serverda xatolik yuz berdi'
                };
            
            default:
                return {
                    type: 'UNKNOWN_ERROR',
                    message: 'Noma\'lum xatolik yuz berdi'
                };
        }
    }
    
    if (error.request) {
        // So'rov yuborildi lekin javob kelmadi
        return {
            type: 'NETWORK_ERROR',
            message: 'Serverga ulanib bo\'lmadi'
        };
    }
    
    // So'rov yuborishdan oldingi xatolik
    return {
        type: 'APP_ERROR',
        message: error.message || 'Dasturda xatolik yuz berdi'
    };
};

export const logError = (error, context = {}) => {
    // Bu yerda xatoliklarni monitoring tizimiga yuborish mumkin
    // Masalan: Sentry, LogRocket va boshqalar
    console.error('Error occurred:', {
        error,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href
    });
};

export const showErrorNotification = (error) => {
    // Bu yerda xatolik haqida foydalanuvchiga xabar berish
    // Masalan: toast yoki notification ko'rsatish
    const message = error.message || 'Xatolik yuz berdi';
    
    // Toast notification ko'rsatish
    if (window.toast) {
        window.toast.error(message);
    } else {
        alert(message);
    }
};

export const handleFormErrors = (errors) => {
    // Forma validatsiya xatolarini ko'rsatish
    const formattedErrors = {};
    
    for (const [field, messages] of Object.entries(errors)) {
        formattedErrors[field] = Array.isArray(messages) 
            ? messages[0] 
            : messages;
    }
    
    return formattedErrors;
}; 