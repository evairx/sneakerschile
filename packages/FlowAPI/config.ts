interface ApiConfig {
    production: string;
    sandbox: string;
}

const config: ApiConfig = {
    production: 'https://www.flow.cl/api',
    sandbox: 'https://sandbox.flow.cl/api'
};

export default config;