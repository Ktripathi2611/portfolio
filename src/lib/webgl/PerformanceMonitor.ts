/**
 * PerformanceMonitor - Device capability detection and quality settings
 */

export type QualityLevel = 'ultra' | 'high' | 'medium' | 'low' | 'minimal';

interface DeviceCapabilities {
    gpu: string;
    isMobile: boolean;
    isLowPower: boolean;
    maxTextureSize: number;
    supportsWebGL2: boolean;
    pixelRatio: number;
    memory: number | null;
}

interface QualitySettings {
    particleCount: number;
    shadowQuality: 'high' | 'medium' | 'low' | 'none';
    postProcessing: boolean;
    antiAliasing: boolean;
    textureQuality: number;
    targetFPS: number;
}

const qualityPresets: Record<QualityLevel, QualitySettings> = {
    ultra: {
        particleCount: 5000,
        shadowQuality: 'high',
        postProcessing: true,
        antiAliasing: true,
        textureQuality: 1,
        targetFPS: 60,
    },
    high: {
        particleCount: 3000,
        shadowQuality: 'medium',
        postProcessing: true,
        antiAliasing: true,
        textureQuality: 0.75,
        targetFPS: 60,
    },
    medium: {
        particleCount: 1500,
        shadowQuality: 'low',
        postProcessing: false,
        antiAliasing: true,
        textureQuality: 0.5,
        targetFPS: 30,
    },
    low: {
        particleCount: 500,
        shadowQuality: 'none',
        postProcessing: false,
        antiAliasing: false,
        textureQuality: 0.25,
        targetFPS: 30,
    },
    minimal: {
        particleCount: 100,
        shadowQuality: 'none',
        postProcessing: false,
        antiAliasing: false,
        textureQuality: 0.25,
        targetFPS: 24,
    },
};

class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private capabilities: DeviceCapabilities | null = null;
    private currentQuality: QualityLevel = 'high';
    private fpsHistory: number[] = [];
    private lastFrameTime: number = 0;

    private constructor() { }

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    /**
     * Initialize and detect device capabilities
     */
    initialize(): DeviceCapabilities {
        if (this.capabilities) return this.capabilities;

        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

        let gpu = 'Unknown';
        let maxTextureSize = 4096;

        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
            maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }

        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        // Detect low-power mode (battery saver, etc.)
        const isLowPower = isMobile ||
            (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
            ((navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8) < 4;

        this.capabilities = {
            gpu,
            isMobile,
            isLowPower,
            maxTextureSize,
            supportsWebGL2: !!canvas.getContext('webgl2'),
            pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
            memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory || null,
        };

        // Auto-select quality based on capabilities
        this.autoSelectQuality();

        return this.capabilities;
    }

    /**
     * Auto-select quality based on device capabilities
     */
    private autoSelectQuality(): void {
        if (!this.capabilities) return;

        const { isMobile, isLowPower, memory } = this.capabilities;

        if (isMobile && isLowPower) {
            this.currentQuality = 'minimal';
        } else if (isMobile) {
            this.currentQuality = 'low';
        } else if (isLowPower || (memory !== null && memory < 4)) {
            this.currentQuality = 'medium';
        } else if (memory !== null && memory >= 8) {
            this.currentQuality = 'ultra';
        } else {
            this.currentQuality = 'high';
        }
    }

    /**
     * Track FPS and adjust quality dynamically
     */
    trackFrame(timestamp: number): void {
        if (this.lastFrameTime) {
            const fps = 1000 / (timestamp - this.lastFrameTime);
            this.fpsHistory.push(fps);

            // Keep last 60 frames
            if (this.fpsHistory.length > 60) {
                this.fpsHistory.shift();
            }

            // Auto-downgrade if FPS drops consistently
            if (this.fpsHistory.length >= 30) {
                const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

                if (avgFPS < 20 && this.currentQuality !== 'minimal') {
                    this.downgradeQuality();
                }
            }
        }
        this.lastFrameTime = timestamp;
    }

    /**
     * Downgrade quality level
     */
    private downgradeQuality(): void {
        const levels: QualityLevel[] = ['ultra', 'high', 'medium', 'low', 'minimal'];
        const currentIndex = levels.indexOf(this.currentQuality);
        if (currentIndex < levels.length - 1) {
            this.currentQuality = levels[currentIndex + 1];
            this.fpsHistory = []; // Reset history
            console.log(`Quality downgraded to: ${this.currentQuality}`);
        }
    }

    /**
     * Get current quality settings
     */
    getQualitySettings(): QualitySettings {
        return qualityPresets[this.currentQuality];
    }

    /**
     * Get current quality level
     */
    getQualityLevel(): QualityLevel {
        return this.currentQuality;
    }

    /**
     * Set quality level manually
     */
    setQualityLevel(level: QualityLevel): void {
        this.currentQuality = level;
        this.fpsHistory = [];
    }

    /**
     * Get device capabilities
     */
    getCapabilities(): DeviceCapabilities | null {
        return this.capabilities;
    }

    /**
     * Check if WebGL effects should be enabled
     */
    shouldEnableEffects(): boolean {
        return this.currentQuality !== 'minimal';
    }

    /**
     * Check if immersive mode should be enabled
     */
    shouldEnableImmersive(): boolean {
        if (!this.capabilities) return false;
        return !this.capabilities.isMobile && !this.capabilities.isLowPower;
    }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
export default PerformanceMonitor;
