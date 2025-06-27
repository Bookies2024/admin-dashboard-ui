export const ENV = {
    API_KEY: import.meta.env.VITE_API_KEY || "",
    API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT || "",
    EMAIL_BASEURL: import.meta.env.VITE_EMAIL_BASEURL || "",
    EMAILS_API_ENDPOINT: import.meta.env.VITE_EMAILS_API_ENDPOINT || "",
}

export const POST_REQ_TYPES = {
    AUTH: "AUTH",
    RECORD: "RECORD",
    REGISTER: "REGISTER",
    CONFIG: "CONFIG",
}

export const GET_REQ_TYPES = {
    CONFIG_KEYS: 'CONFIG-KEYS',
    RECENT_CHECKINS: 'RECENT-CHECKINS',
    MEMBER_DETAILS: 'MEMBER-DETAILS',
    STATS: 'STATS',
    MEMBERS: 'MEMBERS',
    SESSIONS: 'SESSIONS'
}

export const CONFIG_TYPES = {
    CITY: 'city',
    Email: "email"
}

export const CONFIG_HEADERS = {
    TYPE: 'Type',
    KEY: 'Key',
    Value: 'Value',
    FOOTER_IMAGE: 'Footer Image',
    QR_PREFIX: 'QR Prefix'
}