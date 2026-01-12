import * as Sentry from '@sentry/node';

export function initializeSentry() {
    // Só inicializar Sentry em produção ou staging
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
        console.log('Sentry not initialized (not in production/staging)');
        return;
    }

    if (!process.env.SENTRY_DSN) {
        console.warn('SENTRY_DSN not configured. Sentry will not be initialized.');
        return;
    }

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',

        // Release tracking
        release: process.env.npm_package_version || '1.0.0',

        // Performance Monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

        integrations: [
            // Enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
        ],

        // Filtrar informações sensíveis
        beforeSend(event, hint) {
            // Remover dados sensíveis
            if (event.request) {
                delete event.request.cookies;
                if (event.request.headers) {
                    delete event.request.headers.authorization;
                    delete event.request.headers.cookie;
                }
            }

            // Não enviar erros de validação (AppError 4xx)
            const error = hint.originalException;
            if (error && typeof error === 'object' && 'statusCode' in error) {
                const statusCode = (error as any).statusCode;
                if (statusCode && statusCode >= 400 && statusCode < 500) {
                    return null; // Não enviar para Sentry
                }
            }

            return event;
        },

        // Ignorar certos erros
        ignoreErrors: [
            // Erros de validação
            'ValidationError',
            // Erros de autenticação
            'UnauthorizedError',
            'JsonWebTokenError',
            'TokenExpiredError',
        ],
    });

    console.log('✅ Sentry initialized');
}

export { Sentry };
