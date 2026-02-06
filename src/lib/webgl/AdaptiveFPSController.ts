/**
 * AdaptiveFPSController - Intelligent frame rate management and quality scaling
 * Detects device refresh rate, monitors performance, and adjusts quality dynamically
 */

export type PerformanceTier = 'high' | 'medium' | 'low';

interface FPSStats {
    current: number;
    average: number;
    min: number;
    max: number;
    stability: number; // 0-1, higher is more stable
}

interface DeviceCapabilities {
    refreshRate: number;
    supportsHighRefresh: boolean;
    isMobile: boolean;
    isLowPower: boolean;
    batteryLevel: number | null;
    reducedMotion: boolean;
}

interface QualitySettings {
    targetFPS: number;
    maxFPS: number;
    particleCount: number;
    globeSegments: number;
    shadowQuality: 'high' | 'medium' | 'low' | 'none';
    glowIntensity: number;
    enableParallax: boolean;
    enableArcLines: boolean;
    shaderPrecision: 'highp' | 'mediump' | 'lowp';
}

const QUALITY_PRESETS: Record<PerformanceTier, QualitySettings> = {
    high: {
        targetFPS: 120,
        maxFPS: 120,
        particleCount: 200,
        globeSegments: 64,
        shadowQuality: 'high',
        glowIntensity: 1,
        enableParallax: true,
        enableArcLines: true,
        shaderPrecision: 'highp',
    },
    medium: {
        targetFPS: 60,
        maxFPS: 60,
        particleCount: 100,
        globeSegments: 32,
        shadowQuality: 'medium',
        glowIntensity: 0.7,
        enableParallax: true,
        enableArcLines: false,
        shaderPrecision: 'mediump',
    },
    low: {
        targetFPS: 30,
        maxFPS: 60,
        particleCount: 30,
        globeSegments: 16,
        shadowQuality: 'none',
        glowIntensity: 0.4,
        enableParallax: false,
        enableArcLines: false,
        shaderPrecision: 'lowp',
    },
};

class AdaptiveFPSController {
    private static instance: AdaptiveFPSController | null = null;
    private static isSSR = typeof window === 'undefined';

    private frameTimestamps: number[] = [];
    private fpsHistory: number[] = [];
    private currentTier: PerformanceTier = 'medium';
    private targetRefreshRate: number = 60;
    private isTabVisible: boolean = true;
    private isInViewport: boolean = true;
    private lastTierChange: number = 0;
    private tierChangeDebounce: number = 3000; // 3 seconds
    private initialized: boolean = false;

    private capabilities: DeviceCapabilities = {
        refreshRate: 60,
        supportsHighRefresh: false,
        isMobile: false,
        isLowPower: false,
        batteryLevel: null,
        reducedMotion: false,
    };

    private listeners: Map<string, (tier: PerformanceTier, settings: QualitySettings) => void> = new Map();

    private constructor() {
        // Don't initialize during SSR
        if (AdaptiveFPSController.isSSR) return;
        this.initialize();
    }

    private initialize(): void {
        if (this.initialized) return;
        this.initialized = true;
        this.detectCapabilities();
        this.setupVisibilityListeners();
        this.startMonitoring();
    }

    static getInstance(): AdaptiveFPSController {
        if (!AdaptiveFPSController.instance) {
            AdaptiveFPSController.instance = new AdaptiveFPSController();
        }
        // Ensure initialized on client side
        if (!AdaptiveFPSController.isSSR && !AdaptiveFPSController.instance.initialized) {
            AdaptiveFPSController.instance.initialize();
        }
        return AdaptiveFPSController.instance;
    }

    /**
     * Detect device capabilities
     */
    private detectCapabilities(): void {
        if (typeof window === 'undefined') return;

        // Detect mobile
        this.capabilities.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        // Detect reduced motion preference
        this.capabilities.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Detect low power mode (battery API)
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                this.capabilities.batteryLevel = battery.level;
                this.capabilities.isLowPower = battery.level < 0.2 || !battery.charging;

                battery.addEventListener('levelchange', () => {
                    this.capabilities.batteryLevel = battery.level;
                    this.capabilities.isLowPower = battery.level < 0.2 || !battery.charging;
                    this.reevaluateTier();
                });
            });
        }

        // Start refresh rate detection
        this.detectRefreshRate();
    }

    /**
     * Detect actual device refresh rate by measuring frame timing
     */
    private detectRefreshRate(): void {
        const samples: number[] = [];
        let lastTime = performance.now();
        let sampleCount = 0;
        const maxSamples = 60;

        const measure = (currentTime: number) => {
            const delta = currentTime - lastTime;
            if (delta > 0 && delta < 100) { // Filter out outliers
                samples.push(delta);
                sampleCount++;
            }
            lastTime = currentTime;

            if (sampleCount < maxSamples) {
                requestAnimationFrame(measure);
            } else {
                // Calculate average frame time
                const avgFrameTime = samples.reduce((a, b) => a + b, 0) / samples.length;
                const detectedFPS = Math.round(1000 / avgFrameTime);

                // Determine refresh rate bracket
                if (detectedFPS > 100) {
                    this.capabilities.refreshRate = 120;
                    this.capabilities.supportsHighRefresh = true;
                } else if (detectedFPS > 80) {
                    this.capabilities.refreshRate = 90;
                    this.capabilities.supportsHighRefresh = true;
                } else {
                    this.capabilities.refreshRate = 60;
                    this.capabilities.supportsHighRefresh = false;
                }

                this.targetRefreshRate = this.capabilities.refreshRate;
                this.selectInitialTier();
            }
        };

        requestAnimationFrame(measure);
    }

    /**
     * Select initial performance tier based on capabilities
     */
    private selectInitialTier(): void {
        if (this.capabilities.reducedMotion || this.capabilities.isLowPower) {
            this.currentTier = 'low';
        } else if (this.capabilities.isMobile) {
            this.currentTier = 'medium';
        } else if (this.capabilities.supportsHighRefresh) {
            this.currentTier = 'high';
        } else {
            this.currentTier = 'medium';
        }

        this.notifyListeners();
    }

    /**
     * Setup visibility listeners for tab/viewport changes
     */
    private setupVisibilityListeners(): void {
        if (typeof window === 'undefined') return;

        // Tab visibility
        document.addEventListener('visibilitychange', () => {
            this.isTabVisible = !document.hidden;
        });

        // Viewport intersection (pause when scrolled out of view)
        // This will be handled by individual components using IntersectionObserver
    }

    /**
     * Start performance monitoring
     */
    private startMonitoring(): void {
        let lastTime = performance.now();

        const monitor = (currentTime: number) => {
            if (!this.isTabVisible) {
                lastTime = currentTime;
                requestAnimationFrame(monitor);
                return;
            }

            const delta = currentTime - lastTime;
            lastTime = currentTime;

            // Record frame timing
            this.frameTimestamps.push(currentTime);
            if (this.frameTimestamps.length > 120) {
                this.frameTimestamps.shift();
            }

            // Calculate FPS every 30 frames
            if (this.frameTimestamps.length >= 30 && this.frameTimestamps.length % 30 === 0) {
                const fps = this.calculateFPS();
                this.fpsHistory.push(fps.current);

                if (this.fpsHistory.length > 10) {
                    this.fpsHistory.shift();
                }

                this.evaluatePerformance(fps);
            }

            requestAnimationFrame(monitor);
        };

        requestAnimationFrame(monitor);
    }

    /**
     * Calculate FPS statistics
     */
    private calculateFPS(): FPSStats {
        if (this.frameTimestamps.length < 2) {
            return { current: 60, average: 60, min: 60, max: 60, stability: 1 };
        }

        const recentFrames = this.frameTimestamps.slice(-30);
        const fpsSamples: number[] = [];

        for (let i = 1; i < recentFrames.length; i++) {
            const delta = recentFrames[i] - recentFrames[i - 1];
            if (delta > 0) {
                fpsSamples.push(1000 / delta);
            }
        }

        const current = fpsSamples[fpsSamples.length - 1] || 60;
        const average = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
        const min = Math.min(...fpsSamples);
        const max = Math.max(...fpsSamples);

        // Stability: lower variance = higher stability
        const variance = fpsSamples.reduce((sum, fps) => sum + Math.pow(fps - average, 2), 0) / fpsSamples.length;
        const stability = Math.max(0, 1 - variance / 1000);

        return { current, average, min, max, stability };
    }

    /**
     * Evaluate performance and adjust tier if needed
     */
    private evaluatePerformance(fps: FPSStats): void {
        const now = performance.now();
        if (now - this.lastTierChange < this.tierChangeDebounce) {
            return; // Debounce tier changes
        }

        const settings = QUALITY_PRESETS[this.currentTier];
        const threshold = settings.targetFPS * 0.8; // 80% of target

        // Downgrade if consistently below threshold
        if (fps.average < threshold && fps.stability < 0.7) {
            if (this.currentTier === 'high') {
                this.currentTier = 'medium';
                this.notifyListeners();
                this.lastTierChange = now;
            } else if (this.currentTier === 'medium') {
                this.currentTier = 'low';
                this.notifyListeners();
                this.lastTierChange = now;
            }
        }

        // Upgrade if consistently exceeding target with high stability
        else if (fps.average > settings.targetFPS * 1.2 && fps.stability > 0.9) {
            if (this.currentTier === 'low' && !this.capabilities.isLowPower) {
                this.currentTier = 'medium';
                this.notifyListeners();
                this.lastTierChange = now;
            } else if (this.currentTier === 'medium' && this.capabilities.supportsHighRefresh) {
                this.currentTier = 'high';
                this.notifyListeners();
                this.lastTierChange = now;
            }
        }
    }

    /**
     * Force re-evaluation of tier
     */
    private reevaluateTier(): void {
        this.selectInitialTier();
    }

    /**
     * Subscribe to quality changes
     */
    subscribe(id: string, callback: (tier: PerformanceTier, settings: QualitySettings) => void): void {
        this.listeners.set(id, callback);
        // Immediately notify with current settings
        callback(this.currentTier, this.getQualitySettings());
    }

    /**
     * Unsubscribe from quality changes
     */
    unsubscribe(id: string): void {
        this.listeners.delete(id);
    }

    /**
     * Notify all listeners of quality change
     */
    private notifyListeners(): void {
        const settings = this.getQualitySettings();
        this.listeners.forEach((callback) => {
            callback(this.currentTier, settings);
        });
    }

    /**
     * Get current quality settings
     */
    getQualitySettings(): QualitySettings {
        return { ...QUALITY_PRESETS[this.currentTier] };
    }

    /**
     * Get current performance tier
     */
    getCurrentTier(): PerformanceTier {
        return this.currentTier;
    }

    /**
     * Get device capabilities
     */
    getCapabilities(): DeviceCapabilities {
        return { ...this.capabilities };
    }

    /**
     * Get current FPS stats
     */
    getCurrentFPS(): FPSStats {
        return this.calculateFPS();
    }

    /**
     * Check if rendering should be paused
     */
    shouldRender(): boolean {
        return this.isTabVisible && this.isInViewport;
    }

    /**
     * Set viewport visibility (called by components with IntersectionObserver)
     */
    setViewportVisibility(visible: boolean): void {
        this.isInViewport = visible;
    }
}

export const adaptiveFPS = AdaptiveFPSController.getInstance();
export default AdaptiveFPSController;
