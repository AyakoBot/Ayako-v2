import getVoiceRegions from './voice/getVoiceRegions.js';

interface Voice {
 getVoiceRegions: typeof getVoiceRegions;
}

/**
 * Helper module for handling voice-related requests.
 * @property {Function} getVoiceRegions
 * - Retrieves an array of available voice regions.
 */
const voice: Voice = {
 getVoiceRegions,
};

export default voice;
