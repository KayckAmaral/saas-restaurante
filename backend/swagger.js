import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'SaaS Restaurante API',
        description: 'API REST - Sistema de Gestão do Restaurante J.P. Moreira Silva'
    },
    host: 'localhost:5000',
    securityDefinitions: {
        jwt: {
            type: 'apiKey',
            in: 'cookie',
            name: 'token'
        }
    }
};

const outputFile = './swagger.json';
const routes = [
    './routes/autenticacaoRouter.js',
    './routes/pessoaFisicaRouter.js',
    './routes/pessoaJuridicaRouter.js',
    './routes/marcaRouter.js'
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
