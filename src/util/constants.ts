export const ENV = {
    API_KEY: import.meta.env.VITE_API_KEY || "",
    API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT || "",
    EMAIL_BASEURL: import.meta.env.VITE_EMAIL_BASEURL || "",
}

export const POST_REQ_TYPES = {
    AUTH: "AUTH",
    RECORD: "RECORD",
    REGISTER: "REGISTER"
}

export const GET_REQ_TYPES = {
    CONFIG_KEYS: 'CONFIG-KEYS',
    RECENT_CHECKINS: 'RECENT-CHECKINS',
    MEMBER_DETAILS: 'MEMBER-DETAILS',
}

export const CONFIG_TYPES = {
    CITY: 'city',
    Email: "email"
}