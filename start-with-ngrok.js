const fs = require('fs-extra');
const path = require('path');
const ngrok = require('ngrok');
const { exec } = require('child_process');

// Ruta al archivo de configuración global
const GLOBALS_PATH = path.join(__dirname, 'src/config/globals.js');

// Ruta al archivo de configuración de ngrok
const NGROK_CONFIG_PATH = 'C:/Users/juanm/AppData/Local/ngrok/ngrok.yml';

// Función para eliminar el token antiguo directamente del archivo de configuración
const clearOldAuthToken = () => {
    try {
        console.log('\nEliminando token antiguo de ngrok...');

        if (fs.existsSync(NGROK_CONFIG_PATH)) {
            const config = fs.readFileSync(NGROK_CONFIG_PATH, 'utf8');

            const updatedConfig = config.replace(/authtoken:\s*.+/, 'authtoken:'); // Elimina la línea del token

            fs.writeFileSync(NGROK_CONFIG_PATH, updatedConfig, 'utf8');

            console.log('\nToken eliminado correctamente.');
        } else {
            console.log('\nArchivo de configuración de ngrok no encontrado.');
        }
    } catch (error) {
        console.error('\nError al eliminar el token antiguo:', error.message);
    }
};

// Función para actualizar el archivo globals.js
const updateGlobals = async (backendUrl) => {
    try {
        const globalsContent = await fs.readFile(GLOBALS_PATH, 'utf8');

        const updatedContent = globalsContent.replace(
            /API_URL:\s*'.*?'/,
            `API_URL: '${backendUrl}'`
        );

        await fs.writeFile(GLOBALS_PATH, updatedContent, 'utf8');

        console.log(`\nAPI_URL actualizado en ${GLOBALS_PATH}`);

    } catch (error) {
        console.error(`\nError al actualizar globals.js: ${error}`);
    }
};

// Función para iniciar el servidor frontend
const startFrontend = () => {
    return new Promise((resolve, reject) => {
        const frontendProcess = exec('npm start', { cwd: __dirname });

        frontendProcess.stdout.on('data', (data) => {
            console.log(data.toString());

            // Detecta que el servidor está listo
            if (data.includes('Compiled successfully')) {
                resolve();
            }
        });

        frontendProcess.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        frontendProcess.on('close', (code) => {
            if (code !== 0) {
                reject(`\nEl servidor frontend se cerró con código ${code}`);
            }
        });
    });
};

// Función principal
(async () => {
    try {
        console.log('\nConfigurando autenticación de ngrok...');
        clearOldAuthToken(); // Elimina el token antiguo
        await ngrok.authtoken({ authtoken:
            '2p0oCKkme7PpilnVLAFyFUhRjXs_33FWMU1Xh8Jxu4MDLZswV'
        }); // Agregando el token nuevo

        console.log('\nIniciando ngrok para el backend...');
        const backendUrl = await ngrok.connect({
            addr: 5000, // Puerto del backend
            proto: 'http',
        });
        console.log(`\nBackend URL: ${backendUrl}`);

        console.log('\nActualizando archivo globals.js...');
        await updateGlobals(backendUrl);

        console.log('\nIniciando servidor frontend...');
        await startFrontend();

        console.log('\nIniciando ngrok para el frontend...');
        const frontendUrl = await ngrok.connect({
            addr: 3000, // Puerto del frontend
            proto: 'http',
        });
        console.log(`\nFrontend URL: ${frontendUrl}`);

    } catch (error) {
        console.error('\nError en el script:', error);
    }
})();