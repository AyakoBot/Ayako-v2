import importCache from '../importCache/BaseClient/UtilModules/requestHandler/voice.js';

interface Voice {
 getVoiceRegions: typeof importCache.getVoiceRegions.file.default;
}

/**
 * Helper module for handling voice-related requests.
 * @property {Function} getVoiceRegions
 * - Retrieves an array of available voice regions.
 */
const voice: Voice = {
 getVoiceRegions: importCache.getVoiceRegions.file.default,
};

export default voice;
