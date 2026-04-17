// --- Types pour les erreurs API

// --- Base ---
export class ApiError extends Error {
    constructor(
        public status: number,
        public payload: unknown,
        message?: string
    ) {
        super(message ?? `API Error ${status}`);
        this.name = "ApiError";
    }
}

// --- Erreurs spécifiques (1 seul argument : payload) ---
export class BadRequestError extends ApiError {
    constructor(payload: unknown, message?: string) {
        super(400, payload, message);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(payload: unknown, message?: string) {
        super(401, payload, message);
    }
}

export class ForbiddenError extends ApiError {
    constructor(payload: unknown, message?: string) {
        super(403, payload, message);
    }
}

export class NotFoundError extends ApiError {
    constructor(payload: unknown, message?: string) {
        super(404, payload, message);
    }
}

export class ValidationError extends ApiError {
    constructor(payload: unknown, message?: string) {
        super(422, payload, message);
    }
}

export class InternalServerError extends ApiError {
    constructor(payload: unknown, message?: string) {
        super(500, payload, message);
    }
}

export class ServiceUnavailableError extends ApiError {
    constructor(payload: unknown, message?: string) {
        super(503, payload, message);
    }
}

// --- Map des codes → classes d'erreur ---
const ERROR_CLASSES: Record<string, new (payload: unknown) => ApiError> = {
    "400": BadRequestError,
    "401": UnauthorizedError,
    "403": ForbiddenError,
    "404": NotFoundError,
    "422": ValidationError,
    "500": InternalServerError,
    "503": ServiceUnavailableError,
};

export function getErrorClass(status: string): new (payload: unknown) => ApiError {
    return ERROR_CLASSES[status] || InternalServerError;
}